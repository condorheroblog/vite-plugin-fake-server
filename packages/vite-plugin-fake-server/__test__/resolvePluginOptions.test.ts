import { resolvePluginOptions } from "../src";
import { describe, test } from "vitest";

describe(resolvePluginOptions.name, () => {
	test(`${resolvePluginOptions.name} options`, ({ expect }) => {
		const options = resolvePluginOptions();
		expect(options).toMatchInlineSnapshot(`
			{
			  "basename": "",
			  "build": false,
			  "enableDev": true,
			  "enableProd": false,
			  "exclude": [],
			  "extensions": [
			    "ts",
			    "js",
			    "mjs",
			  ],
			  "include": "mock",
			  "logger": true,
			  "timeout": undefined,
			  "watch": true,
			}
		`);
	});
});
