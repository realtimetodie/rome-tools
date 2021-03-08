/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
	AbsoluteFilePath,
	AbsoluteFilePathMap,
	RelativePath,
	createFilePath,
} from "@internal/path";
import {TestServerRunnerOptions} from "../../server/testing/types";
import TestWorkerFile from "./TestWorkerFile";
import {descriptions} from "@internal/diagnostics";
import {parseSnapshot, snapshotParser} from "./SnapshotParser";
import {ErrorFrame} from "@internal/errors";
import {OneIndexed, ZeroIndexed} from "@internal/numbers";
import {prettyFormatToString} from "@internal/pretty-format";
import {PathLocker} from "../../../async/lockers";
import {naturalCompare} from "@internal/string-utils";
import {ExtendedMap} from "@internal/collections";

function cleanHeading(key: string): string {
	if (key[0] === "`") {
		key = key.slice(1);
	}

	if (key[key.length - 1] === "`") {
		key = key.slice(0, -1);
	}

	return key.trim();
}

export type SnapshotEntry = {
	testName: string;
	entryName: string;
	language: undefined | string;
	value: string;
	used: boolean;
};

export type Snapshot = {
	raw: string;
	entries: Map<string, SnapshotEntry>;
};

export const SNAPSHOT_EXT = ".test.md";

function buildEntriesKey(testName: string, entryName: string): string {
	return `${testName}#${entryName}`;
}

export type InlineSnapshotUpdate = {
	line: OneIndexed;
	column: ZeroIndexed;
	snapshot: boolean | number | string | null;
};

export default class SnapshotManager {
	constructor(runner: TestWorkerFile, testPath: AbsoluteFilePath) {
		this.defaultSnapshotPath = testPath.getParent().append(
			`${testPath.getExtensionlessBasename()}${SNAPSHOT_EXT}`,
		);
		this.runner = runner;
		this.options = runner.globalOptions;
		this.snapshots = new AbsoluteFilePathMap();
		this.fileLocker = new PathLocker();
	}

	public snapshots: AbsoluteFilePathMap<Snapshot>;
	private defaultSnapshotPath: AbsoluteFilePath;
	private fileLocker: PathLocker;
	private runner: TestWorkerFile;
	private options: TestServerRunnerOptions;

	public formatValue(value: unknown): string {
		if (typeof value === "string") {
			return value;
		} else {
			// We do not pass `accurate: true` here like in TestAPI as we are more liberal and it's better to have
			// something nicer to display here
			return prettyFormatToString(value);
		}
	}

	public static buildSnapshot(
		{entries, absolute, relative}: {
			absolute: AbsoluteFilePath;
			relative: RelativePath;
			entries: Iterable<SnapshotEntry>;
		},
	): string {
		// Build the snapshot
		let lines: string[] = [];

		function pushNewline() {
			if (lines[lines.length - 1] !== "") {
				lines.push("");
			}
		}

		lines.push(`# \`${absolute.getBasename()}\``);
		pushNewline();
		lines.push(
			`**DO NOT MODIFY**. This file has been autogenerated. Run \`rome test ${relative.join()} --update-snapshots\` to update.`,
		);
		pushNewline();

		const testNameToEntries: ExtendedMap<string, Map<string, SnapshotEntry>> = new ExtendedMap(
			"testNameToEntries",
			() => new Map(),
		);
		for (const entry of entries) {
			if (!entry.used) {
				continue;
			}
			let entriesByTestName = testNameToEntries.assert(entry.testName);
			entriesByTestName.set(entry.entryName, entry);
		}

		// Get test names and sort them so they are in a predictable
		const testNames = Array.from(testNameToEntries.keys()).sort();

		for (const testName of testNames) {
			const entries = testNameToEntries.get(testName)!;

			lines.push(`## \`${testName}\``);
			pushNewline();
			const entryNames = Array.from(entries.keys()).sort(naturalCompare);

			for (const snapshotName of entryNames) {
				const entry = entries.get(snapshotName)!;

				const {value} = entry;
				const language = entry.language === undefined ? "" : entry.language;

				// If the test only has one snapshot then omit the heading
				const skipHeading = snapshotName === "0" && entryNames.length === 1;
				if (!skipHeading) {
					lines.push(`### \`${snapshotName}\``);
				}

				pushNewline();
				lines.push("```" + language);
				// TODO escape triple backquotes
				lines.push(value);
				lines.push("```");
				pushNewline();
			}
		}
		return lines.join("\n");
	}

	public normalizeSnapshotPath(filename: undefined | string): AbsoluteFilePath {
		if (filename === undefined) {
			return this.defaultSnapshotPath;
		}

		const path = this.runner.path.getParent().resolve(createFilePath(filename));
		const ext = path.getExtensions();
		if (ext.endsWith(SNAPSHOT_EXT)) {
			return path;
		} else {
			return path.addExtension(SNAPSHOT_EXT);
		}
	}

	public async init() {
		await this.loadSnapshot(this.defaultSnapshotPath);
	}

	public getRawSnapshot(path: AbsoluteFilePath): string {
		return this.snapshots.assert(path).raw;
	}

	private async loadSnapshot(
		path: AbsoluteFilePath,
	): Promise<undefined | Snapshot> {
		if (await path.notExists()) {
			return;
		}

		return this.fileLocker.wrapLock(
			async () => {
				const loadedSnapshot = this.snapshots.get(path);
				if (loadedSnapshot !== undefined) {
					return loadedSnapshot;
				}

				const content = await path.readFileText();
				const parser = snapshotParser.create({
					path,
					input: content,
				});
				const nodes = parseSnapshot(parser);

				const snapshot: Snapshot = {
					raw: parser.input,
					entries: new Map(),
				};
				this.snapshots.set(path, snapshot);
				this.runner.emitSnapshotDiscovery(path);

				while (nodes.length > 0) {
					const node = nodes.shift()!;

					if (node.type === "Heading" && node.level === 1) {
						// Title
						continue;
					}

					if (node.type === "Heading" && node.level === 2) {
						const testName = cleanHeading(node.text);

						while (nodes.length > 0) {
							const node = nodes[0];

							if (node.type === "Heading" && node.level === 3) {
								nodes.shift();

								const entryName = cleanHeading(node.text);

								const codeBlock = nodes.shift();
								if (codeBlock === undefined || codeBlock.type !== "CodeBlock") {
									throw parser.unexpected({
										description: descriptions.SNAPSHOTS.EXPECTED_CODE_BLOCK_AFTER_HEADING,
										loc: node.loc,
									});
								}

								snapshot.entries.set(
									buildEntriesKey(testName, entryName),
									{
										testName,
										entryName,
										language: codeBlock.language,
										value: codeBlock.text,
										used: false,
									},
								);

								continue;
							}

							if (node.type === "CodeBlock") {
								nodes.shift();

								snapshot.entries.set(
									buildEntriesKey(testName, "0"),
									{
										testName,
										entryName: "0",
										language: node.language,
										value: node.text,
										used: false,
									},
								);
							}

							break;
						}
					}
				}
				return snapshot;
			},
			path,
		);
	}

	public testInlineSnapshot(
		callFrame: ErrorFrame,
		received: unknown,
		expected?: InlineSnapshotUpdate["snapshot"],
	):
		| {
				status: "MATCH" | "UPDATE";
			}
		| {
				status: "NO_MATCH";
				receivedFormat: string;
				expectedFormat: string;
			} {
		let receivedFormat = this.formatValue(received);
		let expectedFormat = this.formatValue(expected);

		// Matches, no need to do anything
		if (receivedFormat === expectedFormat) {
			return {status: "MATCH"};
		}

		const shouldSave = this.options.updateSnapshots || expected === undefined;
		if (shouldSave) {
			const {lineNumber, columnNumber} = callFrame;
			if (lineNumber === undefined || columnNumber === undefined) {
				throw new Error("Call frame has no line or column");
			}

			if (!this.options.freezeSnapshots) {
				let snapshot: InlineSnapshotUpdate["snapshot"] = receivedFormat;
				if (
					typeof received === "string" ||
					typeof received === "number" ||
					typeof received === "boolean" ||
					received === null
				) {
					snapshot = received;
				}

				this.runner.emitInlineSnapshotUpdate({
					line: lineNumber,
					column: columnNumber,
					snapshot,
				});
			}

			return {status: "UPDATE"};
		}

		return {status: "NO_MATCH", receivedFormat, expectedFormat};
	}

	public async get(
		testName: string,
		entryName: string,
		optionalFilename: undefined | string,
	): Promise<undefined | string> {
		const snapshotPath = this.normalizeSnapshotPath(optionalFilename);
		let snapshot = this.snapshots.get(snapshotPath);

		if (snapshot === undefined) {
			snapshot = await this.loadSnapshot(snapshotPath);
		}

		if (snapshot === undefined) {
			return undefined;
		}

		// If we're force updating, pretend that there was no entry
		if (this.options.updateSnapshots) {
			return undefined;
		}

		const entry = snapshot.entries.get(buildEntriesKey(testName, entryName));
		if (entry === undefined) {
			return undefined;
		} else {
			if (!entry.used) {
				entry.used = true;
				this.runner.emitSnapshotEntry(snapshotPath, entry);
			}
			return entry.value;
		}
	}

	public set(
		{
			testName,
			entryName,
			value,
			language,
			optionalFilename,
		}: {
			testName: string;
			entryName: string;
			value: string;
			language: undefined | string;
			optionalFilename: undefined | string;
		},
	) {
		const snapshotPath = this.normalizeSnapshotPath(optionalFilename);
		let snapshot = this.snapshots.get(snapshotPath);
		if (snapshot === undefined) {
			snapshot = {
				raw: "",
				entries: new Map(),
			};
			this.snapshots.set(snapshotPath, snapshot);
		}

		const entry: SnapshotEntry = {
			testName,
			entryName,
			language,
			value,
			used: true,
		};
		this.runner.emitSnapshotEntry(snapshotPath, entry);

		snapshot.entries.set(buildEntriesKey(testName, entryName), entry);
	}
}