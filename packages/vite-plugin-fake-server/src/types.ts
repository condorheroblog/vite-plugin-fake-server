import type { FakerSchemaServerOptions } from "./node";

export type { FakeRoute, IncomingMessage, ServerResponse, HttpMethodType } from "./node";

export interface VitePluginFakerOptions extends Omit<FakerSchemaServerOptions, "include"> {
	/**
	 * @description Set the folder where the mock/fake `ts`, `js`, `cjs`, `mjs` files is stored.
	 * @default mock
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
	 * @description Set Whether to display the request log on the console.
	 * @default true
	 */
	logger?: boolean;

	/**
	 * @description Set the delay time for the request.
	 * @default undefined
	 */
	timeout?: number;

	/**
	 * @description Set the root address of the request URL.
	 * @default ""
	 */
	basename?: string;
}
