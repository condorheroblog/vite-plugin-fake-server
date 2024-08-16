import { describe, it } from "vitest";

import { FAKE_FILE_EXTENSIONS, INFIX_NAME, resolveOptions } from "../src";

describe(resolveOptions.name, () => {
	it(`${resolveOptions.name} default options`, ({ expect }) => {
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

	it(`${resolveOptions.name} options - infixName is true`, ({ expect }) => {
		const options = resolveOptions({ infixName: true });
		expect(options.infixName).toBe(INFIX_NAME);
	});

	it(`${resolveOptions.name} options - infixName is false`, ({ expect }) => {
		const options = resolveOptions({ infixName: false });
		expect(options.infixName).toBeFalsy();
	});

	it(`${resolveOptions.name} options - infixName is string`, ({ expect }) => {
		const options1 = resolveOptions({ infixName: "" });
		const options2 = resolveOptions({ infixName: "xxxx" });
		expect(options1.infixName).toBeFalsy();
		expect(options2.infixName).toBe("xxxx");
	});
});
