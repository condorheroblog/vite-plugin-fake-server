# Vite-plugin-fake-server

[![NPM version](https://img.shields.io/npm/v/vite-plugin-fake-server)](https://www.npmjs.com/package/vite-plugin-fake-server)
[![Downloads](https://img.shields.io/npm/dw/vite-plugin-fake-server)](https://www.npmjs.com/package/vite-plugin-fake-server)
[![License](https://img.shields.io/npm/l/vite-plugin-fake-server)](https://github.com/condorheroblog/vite-plugin-fake-server/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/condorheroblog/vite-plugin-fake-server)](https://github.com/condorheroblog/vite-plugin-fake-server/blob/main/packages/vite-plugin-fake-server)

A fake server plugin for Vite. [Live Demo](https://condorheroblog.github.io/vite-plugin-fake-server/)

## Features

- Simple to use, configuration file driven.
- No reliance on fake library —— you can use [@faker-js/faker](https://github.com/faker-js/faker) or [mockjs](https://github.com/nuysoft/Mock) and so on.
- ESM first.
- Support `ts`, `js`, `mjs` files.
- Support multiple response methods —— [responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType).
- Support custom response headers.
- Support development and production environments.
- Support exporting independent deployment services —— [build option](https://github.com/condorheroblog/vite-plugin-fake-server#build).
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
import { vitePluginFakeServer } from "vite-plugin-fake-server";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// here
		vitePluginFakeServer(),
	],
});
```

By default, it is only valid in the development environment (`enableDev = true`), and monitors in real time (`watch = true`) all `ts`, `js`, `mjs` files in the mock folder under the current project. When the browser has For the real requested link, the terminal will automatically print the requested URL (`logger = true`).

## Examples

For case details, please click this link to view [packages/playground/ts-example/src](https://github.com/condorheroblog/vite-plugin-fake-server/tree/main/packages/playground/ts-example/src)

The most recommended way is to use a TypeScript file so you can use the `defineFakeRoute` function to get good code hints.

The defineFakeRoute function parameters require the user to enter the route type as follows:

```ts
export interface FakeRoute {
	url: string;
	method?: HttpMethodType;
	timeout?: number;
	statusCode?: number;
	statusText?: string;
	headers?: OutgoingHttpHeaders;
	response?: (processedRequest: ProcessedRequest, req: IncomingMessage, res: ServerResponse) => any;
	rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
}
export type FakeRouteConfig = FakeRoute[] | FakeRoute;

export function defineFakeRoute(config: FakeRouteConfig) {
	return config;
}
```

> It should be noted that this way of introduction will cause `vite build` to fail.
> `import { defineFakeRoute } from "vite-plugin-fake-server";`

### In `.ts` file

```ts
import { faker } from "@faker-js/faker";
import Mock from "mockjs";
import { defineFakeRoute } from "vite-plugin-fake-server/client";

const adminUserTemplate = {
	id: "@guid",
	username: "@first",
	email: "@email",
	avatar: '@image("200x200")',
	role: "admin",
};

const adminUserInfo = Mock.mock(adminUserTemplate);

export default defineFakeRoute([
	{
		url: "/mock/get-user-info",
		response: () => {
			return adminUserInfo;
		},
	},
	{
		url: "/fake/get-user-info",
		response: () => {
			return {
				id: faker.string.uuid(),
				avatar: faker.image.avatar(),
				birthday: faker.date.birthdate(),
				email: faker.internet.email(),
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				sex: faker.person.sexType(),
				role: "admin",
			};
		},
	},
]);
```

### In `.js` file

```javascript
/** @type {import("vite-plugin-fake-server").FakeRouteConfig} */
export default [
	{
		url: "/mock/esm",
		response: ({ query }) => {
			return { format: "ESM", query };
		},
	},
	{
		url: "/mock/response-text",
		response: (_, req) => {
			return req.headers["content-type"];
		},
	},
	{
		url: "/mock/post",
		method: "POST",
		response: ({ body }) => {
			return { ...body, timestamp: Date.now() };
		},
	},
];
```

### In `.mjs` file

```javascript
export default {
	url: "/mock/mjs",
	method: "POST",
	statusCode: 200,
	statusText: "OK",
	response: () => {
		return { format: "ESM" };
	},
};
```

## API

### vitePluginFakeServer(options?)

#### options

##### include

Type: `string`\
Default: `"mock"`

Set the folder where the mock/fake `ts`, `js`, `mjs` files is stored.

##### exclude

Type: `string[]`\
Default: `[]`

Exclude files in the `include` directory.

document: https://github.com/mrmlnc/fast-glob#ignore

##### watch

Type: `boolean`\
Default: `true`

Set whether to listen to `include` files.

##### logger

Type: `boolean`\
Default: `true`

Set whether to display the request log on the console.

##### extensions

Type: `string[]`\
Default: `["ts", "js", "mjs"]`

Set the mock files extensions.

##### timeout

Type: `number`\
Default: `undefined`

Set default response delay time.

##### basename

Type: `string`\
Default: `""`

Set the root address of the request URL.

##### headers

Type: `OutgoingHttpHeaders`\
Default: `{}`

Set default headers for responses.

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

> ⚠️ The node module cannot be used in the mock file, otherwise the production environment will fail.As an alternative to keep consistent with the development environment, you can build a standalone deployment server, see [build option](https://github.com/condorheroblog/vite-plugin-fake-server#build).

Compared with the development environment, the API interface defined in the production environment does not have a `rawResponse` function. The response function does not have the second parameter `request` and the third parameter `response`.

```ts
export interface FakeRoute {
	url: string;
	method?: HttpMethodType;
	timeout?: number;
	statusCode?: number;
	statusText?: string;
	headers?: OutgoingHttpHeaders;
	response?: (processedRequest: ProcessedRequest) => any;
}
```

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

## Principle

![vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server/assets/47056890/141278b0-8b72-4eb5-8b33-2dd68497e1c0)

## Appreciation

- [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)
- [XHook](https://github.com/jpillora/xhook)
- [connect](https://github.com/senchalabs/connect#readme)

## Contributing

1. Fork it!
2. Create your feature branch: git checkout -b my-new-feature

### Debugging

#### In development environment

```
# packages/vite-plugin-fake-server
npm run build:watch


# packages/playground/ts-example
npm run dev
```

#### In production environment

```
# packages/vite-plugin-fake-server
npm run build:watch


# packages/playground/ts-example
npm run build
npm run preview
```

3. Commit your changes: git commit -am "Add some feature"
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request :D

## License

[MIT](https://github.com/condorheroblog/vite-plugin-fake-server/blob/main/LICENSE) License © 2023-Present [Condor Hero](https://github.com/condorheroblog)
