// rollup.config.mjs
import { readFileSync } from "node:fs";
import esbuild from "rollup-plugin-esbuild";
import { dts } from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import { nodeExternals } from "rollup-plugin-node-externals";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const banner = `/**
 * ${pkg.name} ${pkg.version}
 * Author ${pkg.author}
 * License ${pkg.license}
 * ©️ 2023
 * Homepage ${pkg.homepage}
 */\n`;

/**
 * @type {import('rollup').RollupOptions}
 */
const rollupConfig = [
	{
		input: "./src/index.ts",
		plugins: [json(), esbuild(), nodeExternals()],
		output: [
			{
				file: "./dist/index.cjs",
				format: "cjs",
				banner,
			},
			{
				file: "./dist/index.mjs",
				format: "esm",
				banner,
			},
			{
				file: "./dist/browser/index.cjs",
				format: "cjs",
				banner,
			},
			{
				file: "./dist/browser/index.mjs",
				format: "esm",
				banner,
			},
		],
	},

	{
		input: "./src/index.ts",
		plugins: [json(), dts(), nodeExternals()],
		output: [{ file: "./dist/index.d.cts" }, { file: "./dist/index.d.mts" }],
	},

	{
		input: "./src/browser/index.ts",
		plugins: [json(), esbuild(), nodeExternals()],
		output: [
			{
				file: "./dist/browser.cjs",
				format: "cjs",
				banner,
			},
			{
				file: "./dist/browser.mjs",
				format: "esm",
				banner,
			},
		],
	},

	{
		input: "./src/browser/index.ts",
		plugins: [json(), dts(), nodeExternals()],
		output: [{ file: "./dist/browser.d.cts" }, { file: "./dist/browser.d.mts" }],
	},
];

export default rollupConfig;
