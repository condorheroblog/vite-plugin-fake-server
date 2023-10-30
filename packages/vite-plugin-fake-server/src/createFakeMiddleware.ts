import { FakeFileLoader } from "./FakeFileLoader";
import { getResponse, tryToJSON } from "./getResponse.mjs";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { Logger } from "./utils";
import { getRequestData, isFunction } from "./utils";
import { URL } from "node:url";
import { pathToRegexp, match } from "path-to-regexp";
import colors from "picocolors";
import type { Connect } from "vite";

export interface CreateFakeMiddlewareOptions extends ResolvePluginOptionsType {
	loggerOutput: Logger;
	root: string;
}

export async function createFakeMiddleware({ loggerOutput, root, ...options }: CreateFakeMiddlewareOptions) {
	const fakeLoader = new FakeFileLoader({ ...options, loggerOutput, root });

	await fakeLoader.start();
	const { basename, timeout: defaultTimeout, headers: globalResponseHeaders } = options;
	const middleware: Connect.NextHandleFunction = async (req, res, next) => {
		const responseResult = await getResponse({
			URL,
			req,
			fakeModuleList: fakeLoader.fakeData,
			pathToRegexp,
			match,
			basename,
			defaultTimeout,
			globalResponseHeaders,
		});
		if (responseResult) {
			const { rawResponse, response, statusCode, statusText, url, query, params, responseHeaders, hash } =
				responseResult ?? {};
			if (isFunction(rawResponse)) {
				await Promise.resolve(rawResponse(req, res));
			} else if (isFunction(response)) {
				const body = await getRequestData(req);

				for (const key of responseHeaders.keys()) {
					res.setHeader(key, responseHeaders.get(key)!);
				}

				if (!res.getHeader("Content-Type")) {
					res.setHeader("Content-Type", "application/json");
				}

				res.statusCode = statusCode;
				if (statusText) {
					res.statusMessage = statusText;
				}
				const fakeResponse = await Promise.resolve(
					response({ url, body: tryToJSON(body), rawBody: body, query, params, headers: req.headers, hash }, req, res),
				);
				if (typeof fakeResponse === "string") {
					// XML
					res.end(fakeResponse);
				} else {
					res.end(JSON.stringify(fakeResponse, null, 2));
				}
			}

			loggerOutput.info(colors.green(`request invoke ` + colors.cyan(req.url)), {
				timestamp: true,
				clear: true,
			});
		} else {
			next();
		}
	};

	return middleware;
}
