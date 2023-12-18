import { describe, test } from "vitest";

import { resolveOptions, INFIX_NAME, FAKE_FILE_EXTENSIONS } from "../src";

describe(resolveOptions.name, () => {
	test(`${resolveOptions.name} default options`, ({ expect }) => {
		const options = resolveOptions();
		expect(options).toMatchInlineSnapshot(`
			{
			  "exclude": [],
			  "extensions": [
			    "ts",
			    "js",
			    "mjs",
			    "cjs",
			    "cts",
			    "mts",
			  ],
			  "include": [
			    "fake",
			  ],
			  "infixName": "fake",
			}
		`);
		expect(options.infixName).toBe(INFIX_NAME);
		expect(options.include).toEqual([INFIX_NAME]);
		expect(options.extensions).toEqual(FAKE_FILE_EXTENSIONS);
		expect(options.exclude).toEqual([]);
	});

	test(`${resolveOptions.name} options - infixName is true`, ({ expect }) => {
		const options = resolveOptions({ infixName: true });
		expect(options.infixName).toBe(INFIX_NAME);
	});

	test(`${resolveOptions.name} options - infixName is false`, ({ expect }) => {
		const options = resolveOptions({ infixName: false });
		expect(options.infixName).toBeFalsy();
	});

	test(`${resolveOptions.name} options - infixName is string`, ({ expect }) => {
		const options1 = resolveOptions({ infixName: "" });
		const options2 = resolveOptions({ infixName: "xxxx" });
		expect(options1.infixName).toBeFalsy();
		expect(options2.infixName).toBe("xxxx");
	});
});
