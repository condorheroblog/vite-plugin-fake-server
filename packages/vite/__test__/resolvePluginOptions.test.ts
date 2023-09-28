import { describe, test } from "vitest";
import { resolvePluginOptions } from "../src";

describe(resolvePluginOptions.name, () => {
	test(`${resolvePluginOptions.name} options`, ({ expect }) => {
		const options = resolvePluginOptions();
		expect(options).toMatchInlineSnapshot(`
			{
			  "basename": "",
			  "enable": true,
			  "exclude": [],
			  "include": [
			    "mock",
			  ],
			}
		`);
	});
});
