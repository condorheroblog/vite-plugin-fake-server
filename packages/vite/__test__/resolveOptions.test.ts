import { describe, test } from "vitest";
import { resolveOptions } from "../src";

describe(resolveOptions.name, () => {
	test(`${resolveOptions.name} options`, ({ expect }) => {
		const options = resolveOptions();
		expect(options).toMatchInlineSnapshot(`
			{
			  "basename": "",
			  "enable": true,
			  "exclude": [],
			  "include": "mock",
			  "logger": true,
			  "watch": true,
			}
		`);
	});
});
