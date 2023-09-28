// import type { VitePluginFakerOptions } from "./types";
import type { Plugin, ResolvedConfig } from "vite";

// export const vitePluginFaker = (opts: VitePluginFakerOptions): Plugin => {
// 	let config: ResolvedConfig;

// 	return {
// 		name: "vite:faker",
// 		configResolved(resolvedConfig) {
// 			config = resolvedConfig;
// 		},
// 		configureServer({ middlewares }) {
// 			// serve: plugin only invoked by dev server
// 			if (config.command !== "serve") {
// 				return;
// 			}
// 			// getMockData(opts);

// 			// middlewares.use(requestMiddleware);
// 		},
// 	};
// };

export const vitePluginFaker = (): Plugin => {
	let config: ResolvedConfig;

	return {
		name: "vite:faker",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		configureServer() {
			// serve: plugin only invoked by dev server
			if (config.command !== "serve") {
				return;
			}
		},
	};
};
