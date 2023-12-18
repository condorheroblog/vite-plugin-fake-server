import { describe, test } from "vitest";

import { FAKE_FILE_EXTENSIONS, INFIX_NAME } from "../src";

describe("constant", () => {
	test(`EXTENSIONS`, ({ expect }) => {
		expect(FAKE_FILE_EXTENSIONS).toMatchInlineSnapshot(`
			[
			  "ts",
			  "js",
			  "mjs",
			  "cjs",
			  "cts",
			  "mts",
			]
		`);
	});

	test(`INFIX_NAME`, ({ expect }) => {
		expect(INFIX_NAME).toMatchInlineSnapshot('"fake"');
	});
});
