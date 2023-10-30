import { resolvePluginOptions } from "../src";
import { describe, test } from "vitest";

describe(resolvePluginOptions.name, () => {
	test(`${resolvePluginOptions.name} error`, ({ expect }) => {
		expect(() => resolvePluginOptions()).toThrowErrorMatchingInlineSnapshot('"fake folder does not exist"');
	});

	test(`${resolvePluginOptions.name} options`, ({ expect }) => {
		const cwd = process.cwd();
		const include = cwd.includes("packages") ? "src" : "packages/vite-plugin-fake-server/src";
		const options = resolvePluginOptions({ include: include });
		options.include = "";
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
			  "headers": {},
			  "include": "",
			  "infixName": "fake",
			  "timeout": undefined,
			  "watch": true,
			}
		`);
	});
});
