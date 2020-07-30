# `index.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test internal/js-parser/index.test.ts --update-snapshots` to update.

## `esprima > es2015-yield > yield-generator-parameter-object-pattern`

### `ast`

```javascript
JSRoot {
	comments: Array []
	corrupt: false
	diagnostics: Array []
	directives: Array []
	filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
	hasHoistedVars: false
	interpreter: undefined
	mtime: undefined
	sourceType: "script"
	syntax: Array []
	loc: Object {
		filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
		end: Object {
			column: 0
			index: 26
			line: 2
		}
		start: Object {
			column: 0
			index: 0
			line: 1
		}
	}
	body: Array [
		JSFunctionDeclaration {
			id: JSBindingIdentifier {
				name: "g"
				loc: Object {
					filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
					identifierName: "g"
					end: Object {
						column: 11
						index: 11
						line: 1
					}
					start: Object {
						column: 10
						index: 10
						line: 1
					}
				}
			}
			loc: Object {
				filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
				end: Object {
					column: 25
					index: 25
					line: 1
				}
				start: Object {
					column: 0
					index: 0
					line: 1
				}
			}
			body: JSBlockStatement {
				body: Array []
				directives: Array []
				loc: Object {
					filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
					end: Object {
						column: 25
						index: 25
						line: 1
					}
					start: Object {
						column: 23
						index: 23
						line: 1
					}
				}
			}
			head: JSFunctionHead {
				async: false
				generator: true
				hasHoistedVars: false
				rest: undefined
				returnType: undefined
				thisType: undefined
				typeParameters: undefined
				loc: Object {
					filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
					end: Object {
						column: 23
						index: 23
						line: 1
					}
					start: Object {
						column: 11
						index: 11
						line: 1
					}
				}
				params: Array [
					JSBindingObjectPattern {
						rest: undefined
						loc: Object {
							filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
							end: Object {
								column: 22
								index: 22
								line: 1
							}
							start: Object {
								column: 12
								index: 12
								line: 1
							}
						}
						meta: JSPatternMeta {
							optional: undefined
							typeAnnotation: undefined
							loc: Object {
								filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
								end: Object {
									column: 22
									index: 22
									line: 1
								}
								start: Object {
									column: 12
									index: 12
									line: 1
								}
							}
						}
						properties: Array [
							JSBindingObjectPatternProperty {
								key: JSStaticPropertyKey {
									value: JSIdentifier {
										name: "yield"
										loc: Object {
											filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
											identifierName: "yield"
											end: Object {
												column: 18
												index: 18
												line: 1
											}
											start: Object {
												column: 13
												index: 13
												line: 1
											}
										}
									}
									loc: Object {
										filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
										end: Object {
											column: 18
											index: 18
											line: 1
										}
										start: Object {
											column: 13
											index: 13
											line: 1
										}
									}
								}
								value: JSBindingIdentifier {
									name: "y"
									loc: Object {
										filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
										identifierName: "y"
										end: Object {
											column: 21
											index: 21
											line: 1
										}
										start: Object {
											column: 20
											index: 20
											line: 1
										}
									}
								}
								loc: Object {
									filename: "esprima/es2015-yield/yield-generator-parameter-object-pattern/input.js"
									end: Object {
										column: 21
										index: 21
										line: 1
									}
									start: Object {
										column: 13
										index: 13
										line: 1
									}
								}
							}
						]
					}
				]
			}
		}
	]
}
```

### `diagnostics`

```
✔ No known problems!

```