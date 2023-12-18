import js from "@eslint/js";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";
import parserTypeScript from "@typescript-eslint/parser";
import configPrettier from "eslint-config-prettier";
import { defineFlatConfig } from "eslint-define-config";
import * as pluginImport from "eslint-plugin-import";
import pluginNodeImport from "eslint-plugin-node-import";
import pluginPrettier from "eslint-plugin-prettier";

export default defineFlatConfig([
	{
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
	},
	{
		...js.configs.recommended,
		plugins: {
			prettier: pluginPrettier,
		},
		rules: {
			...configPrettier.rules,
			...pluginPrettier.configs.recommended.rules,
		},
	},
	{
		plugins: {
			import: pluginImport,
		},
		rules: {
			// https://github.com/import-js/eslint-plugin-import/issues/2556
			// ...pluginImport.configs.recommended.rules,
			"import/first": "error",
			"import/no-duplicates": "error",
			"import/no-mutable-exports": "error",
			"import/no-named-default": "error",
			"import/no-self-import": "error",
			"import/no-webpack-loader-syntax": "error",
			"import/order": ["error", { "newlines-between": "always" }],
			"import/newline-after-import": "error",
		},
	},
	{
		plugins: {
			"node-import": pluginNodeImport,
		},
		rules: {
			"node-import/prefer-node-protocol": 2,
		},
	},
	{
		files: ["**/*.?([cm])ts", "**/*.?([cm])tsx"],
		languageOptions: {
			parser: parserTypeScript,
		},
		plugins: {
			"@typescript-eslint": pluginTypeScript,
		},
		rules: {
			...pluginTypeScript.configs.strict.rules,
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-non-null-assertion": "off",
		},
	},
	{
		ignores: [
			"*.min.*",
			"*.d.ts",
			"CHANGELOG.md",
			"dist",
			"build",
			"LICENSE*",
			"output",
			"out",
			"coverage",
			"public",
			"temp",
			"package-lock.json",
			"pnpm-lock.yaml",
			"yarn.lock",
			"__snapshots__",
			"*.css",
			"*.png",
			"*.ico",
			"*.toml",
			"*.patch",
			"*.txt",
			"*.crt",
			"*.key",
			"Dockerfile",
			"!.github",
			"!.vscode",
		],
	},
]);
