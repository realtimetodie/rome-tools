# `index.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romefrontend/js-parser/index.test.ts --update-snapshots` to update.

## `es2017 > async-functions > await-inside-class-methods`

### `ast`

```javascript
JSRoot {
	comments: Array []
	corrupt: false
	diagnostics: Array []
	directives: Array []
	filename: "input.js"
	hasHoistedVars: false
	interpreter: undefined
	mtime: undefined
	sourceType: "script"
	syntax: Array []
	loc: Object {
		filename: "input.js"
		end: Object {
			column: 0
			index: 41
			line: 4
		}
		start: Object {
			column: 0
			index: 0
			line: 1
		}
	}
	body: Array [
		JSExpressionStatement {
			loc: Object {
				filename: "input.js"
				end: Object {
					column: 1
					index: 40
					line: 3
				}
				start: Object {
					column: 0
					index: 0
					line: 1
				}
			}
			expression: JSArrowFunctionExpression {
				loc: Object {
					filename: "input.js"
					end: Object {
						column: 1
						index: 40
						line: 3
					}
					start: Object {
						column: 0
						index: 0
						line: 1
					}
				}
				head: JSFunctionHead {
					async: false
					hasHoistedVars: false
					params: Array []
					rest: undefined
					returnType: undefined
					thisType: undefined
					loc: Object {
						filename: "input.js"
						end: Object {
							column: 5
							index: 5
							line: 1
						}
						start: Object {
							column: 0
							index: 0
							line: 1
						}
					}
				}
				body: JSClassExpression {
					id: undefined
					loc: Object {
						filename: "input.js"
						end: Object {
							column: 1
							index: 40
							line: 3
						}
						start: Object {
							column: 6
							index: 6
							line: 1
						}
					}
					meta: JSClassHead {
						implements: undefined
						superClass: undefined
						superTypeParameters: undefined
						typeParameters: undefined
						loc: Object {
							filename: "input.js"
							end: Object {
								column: 1
								index: 40
								line: 3
							}
							start: Object {
								column: 6
								index: 6
								line: 1
							}
						}
						body: Array [
							JSClassMethod {
								kind: "method"
								key: JSStaticPropertyKey {
									value: JSIdentifier {
										name: "m"
										loc: Object {
											filename: "input.js"
											identifierName: "m"
											end: Object {
												column: 9
												index: 23
												line: 2
											}
											start: Object {
												column: 8
												index: 22
												line: 2
											}
										}
									}
									loc: Object {
										filename: "input.js"
										end: Object {
											column: 9
											index: 23
											line: 2
										}
										start: Object {
											column: 8
											index: 22
											line: 2
										}
									}
								}
								loc: Object {
									filename: "input.js"
									end: Object {
										column: 24
										index: 38
										line: 2
									}
									start: Object {
										column: 2
										index: 16
										line: 2
									}
								}
								head: JSFunctionHead {
									async: true
									generator: false
									hasHoistedVars: false
									params: Array []
									rest: undefined
									returnType: undefined
									thisType: undefined
									typeParameters: undefined
									loc: Object {
										filename: "input.js"
										end: Object {
											column: 11
											index: 25
											line: 2
										}
										start: Object {
											column: 9
											index: 23
											line: 2
										}
									}
								}
								meta: JSClassPropertyMeta {
									abstract: false
									accessibility: undefined
									optional: false
									readonly: false
									static: false
									typeAnnotation: undefined
									start: Object {
										column: 2
										index: 16
										line: 2
									}
									loc: Object {
										filename: "input.js"
										end: Object {
											column: 9
											index: 23
											line: 2
										}
										start: Object {
											column: 2
											index: 16
											line: 2
										}
									}
								}
								body: JSBlockStatement {
									directives: Array []
									loc: Object {
										filename: "input.js"
										end: Object {
											column: 24
											index: 38
											line: 2
										}
										start: Object {
											column: 12
											index: 26
											line: 2
										}
									}
									body: Array [
										JSExpressionStatement {
											loc: Object {
												filename: "input.js"
												end: Object {
													column: 22
													index: 36
													line: 2
												}
												start: Object {
													column: 14
													index: 28
													line: 2
												}
											}
											expression: JSAwaitExpression {
												loc: Object {
													filename: "input.js"
													end: Object {
														column: 22
														index: 36
														line: 2
													}
													start: Object {
														column: 14
														index: 28
														line: 2
													}
												}
												argument: JSNumericLiteral {
													value: 42
													format: undefined
													loc: Object {
														filename: "input.js"
														end: Object {
															column: 22
															index: 36
															line: 2
														}
														start: Object {
															column: 20
															index: 34
															line: 2
														}
													}
												}
											}
										}
									]
								}
							}
						]
					}
				}
			}
		}
	]
}
```

### `diagnostics`

```
✔ No known problems!

```