// rollup.config.mjs
import { readFileSync } from "node:fs";

import json from "@rollup/plugin-json";
import { dts } from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { nodeExternals } from "rollup-plugin-node-externals";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
const external = [...Object.keys(pkg.devDependencies)];

const banner = `/**
 * Name: ${pkg.name}
 * Version: ${pkg.version}
 * Author: ${pkg.author}
 * Homepage: ${pkg.homepage}
 * License ${pkg.license} © 2023-Present
 */\n`;

/**
 * @type {import('rollup').RollupOptions}
 */
const rollupConfig = [
	{
		input: "./src/index.ts",
		external,
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
		],
	},
	{
		input: "./src/index.ts",
		external,
		plugins: [json(), dts(), nodeExternals()],
		output: [{ file: "./dist/index.d.cts" }, { file: "./dist/index.d.mts" }],
	},

	{
		input: "./src/client/index.ts",
		external,
		plugins: [json(), esbuild(), nodeExternals()],
		output: [
			{
				file: "./dist/client.cjs",
				format: "cjs",
				banner,
			},
			{
				file: "./dist/client.mjs",
				format: "esm",
				banner,
			},
		],
	},

	{
		input: "./src/client/index.ts",
		external,
		plugins: [json(), dts(), nodeExternals()],
		output: [{ file: "./dist/client.d.cts" }, { file: "./dist/client.d.mts" }],
	},
];

export default rollupConfig;
