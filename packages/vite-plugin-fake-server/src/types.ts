import type { OutgoingHttpHeaders } from "node:http";

import type { FakerSchemaServerOptions } from "./node";

export type { FakeRoute, HttpMethodType, IncomingMessage, ServerResponse } from "./node";

export interface ServerBuildOptions {
	/**
	 * @description Server port
	 * @default 8888
	 */
	port?: number
	/**
	 * Directory relative from `root` where build output will be placed. If the
	 * directory exists, it will be removed before the build.
	 * @default "fakeServer"
	 */
	outDir?: string
}

export interface VitePluginFakeServerOptions extends FakerSchemaServerOptions {

	/**
	 * @description Set up the service simulator in the production environment.
	 * @default false
	 */
	enableProd?: boolean

	/**
	 * @description Set up the service simulator in the development environment.
	 * @default true
	 */
	enableDev?: boolean

	/**
	 * @description Set whether to listen to `include` files.
	 * @default true
	 */
	watch?: boolean

	/**
	 * @description Set whether to display the request log on the console.
	 * @default true
	 */
	logger?: boolean

	/**
	 * @description Set default response delay time.
	 * @default undefined
	 */
	timeout?: number

	/**
	 * @description Set the root address of the request URL.
	 * @default ""
	 */
	basename?: string

	/**
	 * @description Set default headers for responses.
	 * @default {}
	 */
	headers?: OutgoingHttpHeaders

	/**
	 * @description The plugin is running in HTTP/2(default HTTP/1).
	 * The status text in HTTP/2 is always an empty string.
	 * By default, automatically follow Vite's {@link https://vitejs.dev/config/server-options.html#server-https} configuration.
	 */
	http2?: boolean

	/**
	 * @description Set whether to export a independently deployable fake service(only valid in build mode).
	 * @default false
	 */
	build?: boolean | ServerBuildOptions
}
