export type { FakeRoute, IncomingMessage, ServerResponse, HttpMethodType } from "./node";

import type { FakerSchemaServerOptions } from "./node";

export interface VitePluginFakerOptions extends Omit<FakerSchemaServerOptions, "include"> {
	include?: string;
	exclude?: string[];
	enableProd?: boolean;
	enableDev?: boolean;
	watch?: boolean;
	logger?: boolean;
}
