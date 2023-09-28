import url from "node:url";
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
		name: "vite:faker",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async configureServer({ middlewares }) {
			// serve: plugin only invoked by dev server
			if (config.command !== "serve") {
				return;
			}
			fakeData = await getFakeData(opts);
			middlewares.use(requestMiddleware);
		},
	};
};

export async function getFakeData(options: VitePluginFakerOptions) {
	const opts = resolvePluginOptions(options);
	return await fakerSchemaServer(opts);
}
export const requestMiddleware: Connect.NextHandleFunction = async (req, res, next) => {
	if (req.url) {
		const queryParams = url.parse(req.url, true);
		const reqUrl = queryParams.pathname;

		const matchRequest = fakeData.find((item) => {
			if (!reqUrl || !item || !item.url) {
				return false;
			}
			if (item.method && item.method.toUpperCase() !== req.method) {
				return false;
			}
			return pathToRegexp(item.url).test(reqUrl);
		});

		if (matchRequest) {
			const isGet = req.method && req.method.toUpperCase() === "GET";
			const { response, rawResponse, timeout, statusCode, url } = matchRequest;

			if (timeout) {
				await sleep(timeout);
			}

			const urlMatch = match(url, { decode: decodeURIComponent });

			let query = queryParams.query;

			if (reqUrl) {
				// TODO
				if ((isGet && JSON.stringify(query) === "{}") || !isGet) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					const params = urlMatch(reqUrl).params;
					if (JSON.stringify(params) !== "{}") {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						query = urlMatch(reqUrl).params || {};
					} else {
						query = queryParams.query || {};
					}
				}
			}

			if (rawResponse && isFunction(rawResponse)) {
				rawResponse(req, res);
			}
			if (response && isFunction(response)) {
				const body = await getRequestData(req);
				res.setHeader("Content-Type", "application/json");
				res.statusCode = statusCode ?? 200;
				const fakeResponse = response({ url: req.url, body, query, headers: req.headers }, req, res);
				res.end(JSON.stringify(fakeResponse));
			}

			// logger && loggerOutput("request invoke", req.url!);
			return;
		}
	}

	// console.log(fakeData);
	next();
};
