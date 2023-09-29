import { URL } from "node:url";
import querystring from "node:querystring";
import type { Plugin, ResolvedConfig, Connect } from "vite";
import type { FakeRoute } from "faker-schema-server";
import { pathToRegexp, match } from "path-to-regexp";
import { fakerSchemaServer, isFunction } from "faker-schema-server";

import type { VitePluginFakerOptions } from "./types";
import { resolvePluginOptions } from "./resolvePluginOptions";
import { getRequestData, sleep } from "./utils";

let fakeData: FakeRoute[] = [];
export const vitePluginFaker = (opts: VitePluginFakerOptions = {}): Plugin => {
	let config: ResolvedConfig;

	return {
		name: "vite-plugin-faker",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async configureServer({ middlewares, watcher }) {
			// serve: plugin only invoked by dev server
			if (config.command !== "serve") {
				return;
			}
			fakeData = await getFakeData(opts);
			middlewares.use(requestMiddleware);

			// https://vitejs.dev/guide/api-javascript.html#vitedevserver
			// const _watcher = watcher(watchDir, {
			// 	ignoreInitial: true,
			// });

			watcher.on("all", async (event, file) => {
				console.log(event, file);
			});
		},
	};
};

export async function getFakeData(options: VitePluginFakerOptions) {
	const opts = resolvePluginOptions(options);
	return await fakerSchemaServer(opts);
}
export const requestMiddleware: Connect.NextHandleFunction = async (req, res, next) => {
	if (req.url) {
		const instanceURL = new URL(req.url, "http://localhost:5173/");

		// https://nodejs.org/api/url.html#urlpathname
		// Invalid URL characters included in the value assigned to the pathname property are percent-encoded
		const pathname = instanceURL.pathname;

		const matchRequest = fakeData.find((item) => {
			if (!pathname || !item || !item.url) {
				return false;
			}
			const method = item.method ?? "GET";
			if (method.toUpperCase() !== req.method) {
				return false;
			}
			return pathToRegexp(encodeURI(item.url)).test(pathname);
		});

		if (matchRequest) {
			const { response, rawResponse, timeout, statusCode, url } = matchRequest;

			if (timeout) {
				await sleep(timeout);
			}

			const urlMatch = match(url, { encode: encodeURI });

			const search = instanceURL.search;
			const query = querystring.parse(search.replace(/^\?/, "")) as Record<string, string>;

			let params: Record<string, string> = {};

			if (pathname) {
				const matchParams = urlMatch(pathname);
				if (matchParams) {
					params = matchParams.params as Record<string, string>;
				}
			}

			if (rawResponse && isFunction(rawResponse)) {
				rawResponse(req, res);
			}
			if (response && isFunction(response)) {
				const body = await getRequestData(req);
				res.setHeader("Content-Type", "application/json");
				res.statusCode = statusCode ?? 200;
				const fakeResponse = response(
					{ url: req.url, body, query, params, headers: req.headers, hash: instanceURL.hash },
					req,
					res,
				);
				res.end(JSON.stringify(fakeResponse));
			}

			// logger && loggerOutput("request invoke", req.url!);
			return;
		}
	}

	next();
};
