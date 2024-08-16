import { describe, it } from "vitest";

import { FAKE_FILE_EXTENSIONS, INFIX_NAME } from "../src";

describe("constant", () => {
	it("eXTENSIONS", ({ expect }) => {
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

	it("iNFIX_NAME", ({ expect }) => {
		expect(INFIX_NAME).toMatchInlineSnapshot("\"fake\"");
	});
});
