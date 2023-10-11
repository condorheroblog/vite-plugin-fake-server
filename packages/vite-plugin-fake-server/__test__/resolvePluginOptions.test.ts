import { describe, test } from "vitest";
import { resolvePluginOptions } from "../src";

describe(resolvePluginOptions.name, () => {
	test(`${resolvePluginOptions.name} options`, ({ expect }) => {
		const options = resolvePluginOptions();
		expect(options).toMatchInlineSnapshot(`
			{
			  "basename": "",
			  "enableDev": true,
			  "enableProd": false,
			  "exclude": [],
			  "include": [
			    "mock",
			  ],
			  "logger": true,
			  "watch": true,
			}
		`);
	});
});
