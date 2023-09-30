import { URL } from "node:url";
import { join } from "node:path";
import querystring from "node:querystring";
import type { Plugin, ResolvedConfig, Connect } from "vite";
import type { FakeRoute } from "faker-schema-server";
import { pathToRegexp, match } from "path-to-regexp";
import { fakerSchemaServer, isFunction, loggerOutput } from "faker-schema-server";
import chokidar from "chokidar";

import type { VitePluginFakerOptions } from "./types";
import { resolvePluginOptions } from "./resolvePluginOptions";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import { getRequestData, sleep } from "./utils";

let fakeData: FakeRoute[] = [];
export const vitePluginFaker = (options: VitePluginFakerOptions = {}): Plugin => {
	let config: ResolvedConfig;

	return {
		name: "vite-plugin-faker",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async configureServer({ middlewares }) {
			// serve: plugin only invoked by dev server
			if (config.command !== "serve") {
				return;
			}
			const opts = resolvePluginOptions(options);
			fakeData = await getFakeData(opts);
			const middleware = await requestMiddleware(opts);
			middlewares.use(middleware);

			if (opts.include && opts.include.length && opts.watch) {
				const watchDir = join(process.cwd(), opts.include[0]);
				const watcher = chokidar.watch(watchDir, {
					ignoreInitial: true,
				});

				watcher.on("change", async (file) => {
					console.log(opts.logger);
					opts.logger && loggerOutput(`fake file change`, file);
					fakeData = await getFakeData(opts);
				});
			}
		},
	};
};

export async function getFakeData(options: ResolvePluginOptionsType) {
	return await fakerSchemaServer(options);
}

export async function requestMiddleware(options: ResolvePluginOptionsType) {
	const { logger } = options;
	const middleware: Connect.NextHandleFunction = async (req, res, next) => {
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

				logger && loggerOutput("request invoke", req.url!);
				return;
			}
		}

		next();
	};

	return middleware;
}
