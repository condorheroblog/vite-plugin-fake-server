import { FAKE_FILE_EXTENSIONS } from "../src";
import { describe, test } from "vitest";

describe("constant", () => {
	test(`EXTENSIONS`, ({ expect }) => {
		expect(FAKE_FILE_EXTENSIONS).toMatchInlineSnapshot(`
			[
			  "ts",
			  "js",
			  "mjs",
			]
		`);
	});
});
