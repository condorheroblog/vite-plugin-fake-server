import { resolvePluginOptions, INFIX_NAME, FAKE_FILE_EXTENSIONS } from "../src";
import { describe, test } from "vitest";

describe(resolvePluginOptions.name, () => {
	const cwd = process.cwd();
	// jump fs.existsSync
	const include = cwd.includes("packages") ? "src" : "packages/vite-plugin-fake-server/src";
	const jumpOptions = { include };

	test(`${resolvePluginOptions.name} error`, ({ expect }) => {
		expect(() => resolvePluginOptions()).toThrowErrorMatchingInlineSnapshot('"fake folder does not exist"');
	});

	test(`${resolvePluginOptions.name} default options`, ({ expect }) => {
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
			  "include": "",
			  "infixName": "fake",
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
	});

	test(`${resolvePluginOptions.name} options - basename`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions, basename: "xxxx" });
		expect(options.basename).toBe("xxxx");
	});

	test(`${resolvePluginOptions.name} options - build`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.build).toBeFalsy();
		const options1 = resolvePluginOptions({ ...jumpOptions, build: true });
		expect(options1.build).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, build: false });
		expect(options2.build).toBeFalsy();
	});

	test(`${resolvePluginOptions.name} options - enableDev`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.enableDev).toBeTruthy();
		const options1 = resolvePluginOptions({ ...jumpOptions, enableDev: true });
		expect(options1.enableDev).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, enableDev: false });
		expect(options2.enableDev).toBeFalsy();
	});

	test(`${resolvePluginOptions.name} options - enableProd`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.enableProd).toBeFalsy();
		const options1 = resolvePluginOptions({ ...jumpOptions, enableProd: true });
		expect(options1.enableProd).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, enableProd: false });
		expect(options2.enableProd).toBeFalsy();
	});

	test(`${resolvePluginOptions.name} options - exclude`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.exclude).toEqual([]);
		const options1 = resolvePluginOptions({ ...jumpOptions, exclude: ["a.ts"] });
		expect(options1.exclude).toEqual(["a.ts"]);
	});

	test(`${resolvePluginOptions.name} options - extensions`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.extensions).toEqual(FAKE_FILE_EXTENSIONS);
		const options1 = resolvePluginOptions({ ...jumpOptions, extensions: ["ts"] });
		expect(options1.extensions).toEqual(["ts"]);
	});

	test(`${resolvePluginOptions.name} options - headers`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.headers).toEqual({});
		const options1 = resolvePluginOptions({ ...jumpOptions, headers: { x: "x" } });
		expect(options1.headers).toEqual({ x: "x" });
	});

	test(`${resolvePluginOptions.name} options - infixName`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.infixName).toBe(INFIX_NAME);
		const options1 = resolvePluginOptions({ ...jumpOptions, infixName: "x" });
		expect(options1.infixName).toBe("x");
	});

	test(`${resolvePluginOptions.name} options - timeout`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.timeout).toBeUndefined();
		const options1 = resolvePluginOptions({ ...jumpOptions, timeout: 1 });
		expect(options1.timeout).toBe(1);
	});

	test(`${resolvePluginOptions.name} options - watch`, ({ expect }) => {
		const options = resolvePluginOptions({ ...jumpOptions });
		expect(options.watch).toBeTruthy();
		const options1 = resolvePluginOptions({ ...jumpOptions, watch: true });
		expect(options1.watch).toBeTruthy();
		const options2 = resolvePluginOptions({ ...jumpOptions, watch: false });
		expect(options2.watch).toBeFalsy();
	});
});
