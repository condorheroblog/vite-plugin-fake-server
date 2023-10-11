import { resolvePluginOptions } from "../src";
import { describe, test } from "vitest";

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
			  "timeout": undefined,
			  "watch": true,
			}
		`);
	});
});