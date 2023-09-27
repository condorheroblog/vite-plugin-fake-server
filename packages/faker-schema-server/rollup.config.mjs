// rollup.config.mjs
import { readFileSync } from "node:fs";
import esbuild from "rollup-plugin-esbuild";
import { dts } from "rollup-plugin-dts";
import json from "@rollup/plugin-json";

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
		plugins: [json(), esbuild()],
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
		plugins: [json(), dts()],
		output: [{ file: "./dist/index.d.cts" }, { file: "./dist/index.d.mts" }],
	},
];

export default rollupConfig;
