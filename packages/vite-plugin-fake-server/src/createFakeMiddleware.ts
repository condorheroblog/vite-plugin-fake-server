import type { Server } from "node:http";
import type { Http2SecureServer } from "node:http2";
import { URL } from "node:url";

import { match } from "path-to-regexp";
import colors from "picocolors";
import type { Connect } from "vite";

import { FakeFileLoader } from "./FakeFileLoader";
import { getResponse, tryToJSON } from "./getResponse.mjs";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { Logger } from "./utils";
import { getRequestData, isFunction } from "./utils";

export interface CreateFakeMiddlewareOptions extends ResolvePluginOptionsType {
	loggerOutput: Logger
	root: string
}

export async function createFakeMiddleware(
	{ loggerOutput, root, ...options }: CreateFakeMiddlewareOptions,
	httpServer: Server | Http2SecureServer | null,
) {
	const fakeLoader = new FakeFileLoader({ ...options, loggerOutput, root });

	await fakeLoader.start();
	if (httpServer) {
		httpServer.on("close", () => {
			fakeLoader.close();
		});
	}
	const { basename, timeout: defaultTimeout, headers: globalResponseHeaders, logger } = options;
	const middleware: Connect.NextHandleFunction = async (req, res, next) => {
		const responseResult = await getResponse({
			URL,
			req,
			fakeModuleList: fakeLoader.fakeData,
			match,
			basename,
			defaultTimeout,
			globalResponseHeaders,
		});
		if (responseResult) {
			const { rawResponse, response, statusCode, statusText, url, query, params, responseHeaders }
				= responseResult ?? {};
			if (isFunction(rawResponse)) {
				await Promise.resolve(rawResponse(req, res));
			}
			else {
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

				if (isFunction(response)) {
					const fakeResponse = await Promise.resolve(
						response({ url, body: tryToJSON(body), rawBody: body, query, params, headers: req.headers }, req, res),
					);
					if (typeof fakeResponse === "string") {
						// XML
						res.end(fakeResponse);
					}
					else {
						res.end(JSON.stringify(fakeResponse, null, 2));
					}
				}
				else {
					res.end();
				}
			}

			if (logger) {
				loggerOutput.info(colors.green(`request invoke ${colors.cyan(`${req.method} ${req.url}`)}`), {
					timestamp: true,
					clear: true,
				});
			}
		}
		else {
			next();
		}
	};

	return middleware;
}
