import type { FakerSchemaServerOptions } from "./node";
import type { OutgoingHttpHeaders } from "node:http";

export type { FakeRoute, IncomingMessage, ServerResponse, HttpMethodType } from "./node";

export interface ServerBuildOptions {
	/**
	 * @description Server port
	 * @default 8888
	 */
	port?: number;
	/**
	 * Directory relative from `root` where build output will be placed. If the
	 * directory exists, it will be removed before the build.
	 * @default "fakeServer"
	 */
	outDir?: string;
}

export interface VitePluginFakeServerOptions extends Omit<FakerSchemaServerOptions, "include"> {
	/**
	 * @description Set the folder where the fake `ts`, `js`, `mjs` files is stored.
	 * @default fake
	 */
	include?: string;

	/**
	 * @description Exclude files in the `include` directory.
	 * @default []
	 */
	exclude?: string[];

	/**
	 * @description Set up the service simulator in the production environment.
	 * @default false
	 */
	enableProd?: boolean;

	/**
	 * @description Set up the service simulator in the development environment.
	 * @default true
	 */
	enableDev?: boolean;

	/**
	 * @description Set whether to listen to `include` files.
	 * @default true
	 */
	watch?: boolean;

	/**
	 * @description Set the fake files extensions.
	 * @default ["ts", "js", "mjs"]
	 */
	extensions?: string[];

	/**
	 * @description Set default response delay time.
	 * @default undefined
	 */
	timeout?: number;

	/**
	 * @description Set the root address of the request URL.
	 * @default ""
	 */
	basename?: string;

	/**
	 * @description Set default headers for responses.
	 * @default {}
	 */
	headers?: OutgoingHttpHeaders;

	/**
	 * @description Set whether to export a independently deployable fake service(only valid in build mode).
	 * @default false
	 */
	build?: boolean | ServerBuildOptions;
}
