# Vite-plugin-fake-server

[![NPM version](https://img.shields.io/npm/v/vite-plugin-fake-server)](https://www.npmjs.com/package/vite-plugin-fake-server)
[![Downloads](https://img.shields.io/npm/dw/vite-plugin-fake-server)](https://www.npmjs.com/package/vite-plugin-fake-server)
[![License](https://img.shields.io/npm/l/vite-plugin-fake-server)](https://github.com/condorheroblog/vite-plugin-fake-server/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/condorheroblog/vite-plugin-fake-server)](https://github.com/condorheroblog/vite-plugin-fake-server/blob/main/packages/vite-plugin-fake-server)

A fake server plugin for Vite.

## Features

- No reliance on fake library —— you can use [@faker-js/faker](https://github.com/faker-js/faker) or [mockjs](https://github.com/nuysoft/Mock) and so on.
- Support `ts`, `js`, `cjs`, `mjs` files.
- Support development and production environments.
- Friendly type prompt —— defineFakeRoute.
- Intercept XHR and Fetch request - [XHook](https://github.com/jpillora/xhook).

## Install

```bash
npm install --save-dev vite-plugin-fake-server
```

## Usage

Configure plugins in the configuration file of [Vite](https://vitejs.dev/config/), such as `vite.config.ts`:

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginFaker } from "vite-plugin-fake-server";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// here
		vitePluginFaker(),
	],
});
```

By default, it is only valid in the development environment (`enableDev = true`), and monitors in real time (`watch = true`) all `ts`, `js`, `cjs`, `mjs` files in the mock folder under the current project. When the browser has For the real requested link, the terminal will automatically print the requested URL (`logger = true`).

## Examples

## API

### vitePluginFaker(options?)

#### options

##### include

Type: `string`\
Default: `"mock"`

Set the folder where the mock/fake `ts`, `js`, `cjs`, `mjs` files is stored.

##### exclude

Type: `string[]`\
Default: `[]`

Exclude files in the `include` directory.

1. development: https://github.com/mrmlnc/fast-glob#ignore
2. production: https://vitejs.dev/guide/features.html#negative-patterns

##### watch

Type: `boolean`\
Default: `true`

Set whether to listen to `include` files.

##### logger

Type: `boolean`\
Default: `true`

Set whether to display the request log on the console.

##### timeout

Type: `number`\
Default: `undefined`

Set the delay time for the request.

##### basename

Type: `string`\
Default: `""`

Set the root address of the request URL.

##### enableDev

Type: `boolean`\
Default: `true`

Set up the service simulator in the development environment.

Powered by [Connect](https://github.com/senchalabs/connect) technology.

##### enableProd

Type: `boolean`\
Default: `false`

Set up the service simulator in the production environment.

Powered by [XHook](https://github.com/jpillora/xhook) technology.

> ⚠️ The node module cannot be used in the mock file, otherwise the production environment will fail.

##### build

Type: `boolean | ServerBuildOptions`\
Default: `false`

Set whether to export a independently deployable fake service(only valid in [build](https://vitejs.dev/guide/cli.html#build) mode).

```ts
interface ServerBuildOptions {
	/**
	 * @description Server port
	 * @default 8888
	 */
	port?: number;
	/**
	 * Directory relative from `root` where build output will be placed. If the
	 * directory exists, it will be removed before the build.
	 * @default "mockServer"
	 */
	outDir?: string;
}
```

## Inspire

- [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)

## License

[MIT](https://github.com/condorheroblog/vite-plugin-fake-server/blob/main/LICENSE) License © 2023-Present [Condor Hero](https://github.com/condorheroblog)
