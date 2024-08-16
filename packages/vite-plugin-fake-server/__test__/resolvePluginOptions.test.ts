import { describe, it } from "vitest";

import { FAKE_FILE_EXTENSIONS, INFIX_NAME, resolvePluginOptions } from "../src";

describe(resolvePluginOptions.name, () => {
	const cwd = process.cwd();
	// jump fs.existsSync
	const include = cwd.includes("packages") ? "src" : "packages/vite-plugin-fake-server/src";
	const jumpOptions = { include };

	it(`${resolvePluginOptions.name} error`, ({ expect }) => {
		expect(() => resolvePluginOptions()).toThrowErrorMatchingInlineSnapshot("[Error: fake folder does not exist]");
	});

	it(`${resolvePluginOptions.name} default options`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
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
			    "cjs",
			    "cts",
			    "mts",
			  ],
			  "headers": {},
			  "http2": undefined,
			  "include": "",
			  "infixName": "fake",
			  "logger": true,
			  "timeout": undefined,
			  "watch": true,
			}
		`);

		expect(options.basename).toBe("");
		expect(options.build).toBeFalsy();
		expect(options.enableDev).toBeTruthy();
		expect(options.enableProd).toBeFalsy();
		expect(options.exclude).toEqual([]);
		expect(options.extensions).toEqual(FAKE_FILE_EXTENSIONS);
		expect(options.headers).toEqual({});
		expect(options.infixName).toBe(INFIX_NAME);
		expect(options.timeout).toBeUndefined();
		expect(options.watch).toBeTruthy();
		expect(options.http2).toBeUndefined();
	});

	it(`${resolvePluginOptions.name} options - basename`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions, basename: "xxxx" });
		expect(options.basename).toBe("xxxx");
	});

	it(`${resolvePluginOptions.name} options - build`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.build).toBeFalsy();
		const options1 = resolvePluginOptions({ ...jumpOptions, build: true });
		expect(options1.build).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, build: false });
		expect(options2.build).toBeFalsy();
	});

	it(`${resolvePluginOptions.name} options - enableDev`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.enableDev).toBeTruthy();
		const options1 = resolvePluginOptions({ ...jumpOptions, enableDev: true });
		expect(options1.enableDev).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, enableDev: false });
		expect(options2.enableDev).toBeFalsy();
	});

	it(`${resolvePluginOptions.name} options - enableProd`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.enableProd).toBeFalsy();
		const options1 = resolvePluginOptions({ ...jumpOptions, enableProd: true });
		expect(options1.enableProd).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, enableProd: false });
		expect(options2.enableProd).toBeFalsy();
	});

	it(`${resolvePluginOptions.name} options - exclude`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.exclude).toEqual([]);
		const options1 = resolvePluginOptions({ ...jumpOptions, exclude: ["a.ts"] });
		expect(options1.exclude).toEqual(["a.ts"]);
	});

	it(`${resolvePluginOptions.name} options - extensions`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.extensions).toEqual(FAKE_FILE_EXTENSIONS);
		const options1 = resolvePluginOptions({ ...jumpOptions, extensions: ["ts"] });
		expect(options1.extensions).toEqual(["ts"]);
	});

	it(`${resolvePluginOptions.name} options - headers`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.headers).toEqual({});
		const options1 = resolvePluginOptions({ ...jumpOptions, headers: { x: "x" } });
		expect(options1.headers).toEqual({ x: "x" });
	});

	it(`${resolvePluginOptions.name} options - infixName`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.infixName).toBe(INFIX_NAME);
		const options1 = resolvePluginOptions({ ...jumpOptions, infixName: "x" });
		expect(options1.infixName).toBe("x");
	});

	it(`${resolvePluginOptions.name} options - logger`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.logger).toBeTruthy();
		const options1 = resolvePluginOptions({ ...jumpOptions, logger: true });
		expect(options1.logger).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, logger: false });
		expect(options2.logger).toBeFalsy();
	});

	it(`${resolvePluginOptions.name} options - timeout`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.timeout).toBeUndefined();
		const options1 = resolvePluginOptions({ ...jumpOptions, timeout: 1 });
		expect(options1.timeout).toBe(1);
	});

	it(`${resolvePluginOptions.name} options - watch`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.watch).toBeTruthy();
		const options1 = resolvePluginOptions({ ...jumpOptions, watch: true });
		expect(options1.watch).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, watch: false });
		expect(options2.watch).toBeFalsy();
	});

	it(`${resolvePluginOptions.name} options - http2`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.http2).toBeUndefined();
		const options1 = resolvePluginOptions({ ...jumpOptions, http2: true });
		expect(options1.http2).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, http2: false });
		expect(options2.http2).toBeFalsy();
	});
});
