import { resolvePluginOptions } from "../src";
import { join } from "node:path";
import { describe, test } from "vitest";

describe(resolvePluginOptions.name, () => {
	test(`${resolvePluginOptions.name} error`, ({ expect }) => {
		expect(() => resolvePluginOptions()).toThrowErrorMatchingInlineSnapshot('"mock does not exist"');
	});

	test(`${resolvePluginOptions.name} options`, ({ expect }) => {
		console.log();
		const cwd = process.cwd();
		const include = cwd.includes("packages") ? "src" : "packages/vite-plugin-fake-server/src";
		console.log(join(cwd, include));
		const options = resolvePluginOptions({ include: join(cwd, include) });
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
			  "logger": true,
			  "timeout": undefined,
			  "watch": true,
			}
		`);
	});
});
