import type { ResolvePluginOptionsType } from "./resolvePluginOptions";

import { STATUS_CODES } from "node:http";
import { createSimulateResponse, sleep, syncSleep, tryToJSON } from "./shared";

export function createHookTemplate(isSync = false, opts: Partial<ResolvePluginOptionsType> = {}) {
	const commonInit = `
		${tryToJSON.toString()}
		const STATUS_CODES = ${JSON.stringify(STATUS_CODES, null, 2)};

		function headersToObject(headers) {
			const headersObject = {};
			for (const [name, value] of headers.entries()) {
				headersObject[name] = value;
			}
			return headersObject;
		}
	`;
	const getConfig = `{
		match,
		basename: ${JSON.stringify(opts.basename)},
		defaultTimeout: ${JSON.stringify(opts.timeout)},
		globalResponseHeaders: ${JSON.stringify(opts.headers, null, 2)}
	}`;

	const handleAsyncResponseTemplate = `
		const responseIsFunction = typeof response === "function";
		const fakeResponse = responseIsFunction
			? await Promise.resolve(
				response({
					url,
					body: tryToJSON(req.body),
					rawBody: req.body,
					query,
					params,
					headers: requestHeaders,
				}),
			)
			: response;
	`;
	const handleSyncResponseTemplate = `
		const responseIsFunction = typeof response === "function";
		const fakeResponse = responseIsFunction
			? response({
				url,
				body: tryToJSON(req.body),
				rawBody: req.body,
				query,
				params,
				headers: requestHeaders,
			})
			: response;
	`;

	const processTemplate = `
		let apiResponse = "";
		const {
			response,
			statusCode,
			statusText: responseStatusText = STATUS_CODES[statusCode],
			url,
			query,
			params,
			responseHeaders,
		} = responseResult ?? {};
		const statusText = ${JSON.stringify(opts.http2)} ? "" : responseStatusText;
		const requestHeaders = {};
		for (const key in req.headers) {
			requestHeaders[key.toLowerCase()] = req.headers[key];
		}
		${isSync ? handleAsyncResponseTemplate : handleSyncResponseTemplate}
		if(req.isFetch) {
			if (typeof fakeResponse === "string") {
				if (!responseHeaders.get("Content-Type")) {
					responseHeaders.set("Content-Type", "text/plain");
				}
				apiResponse = new Response(
					fakeResponse,
					{
						statusText,
						status: statusCode,
						headers: headersToObject(responseHeaders),
					}
				);
			} else {
				if (!responseHeaders.get("Content-Type")) {
					responseHeaders.set("Content-Type", "application/json");
				}
				apiResponse = new Response(
					JSON.stringify(fakeResponse, null, 2),
					{
						statusText,
						status: statusCode,
						headers: headersToObject(responseHeaders),
					}
				);
			}
		} else {
			const dataResponse = { data: fakeResponse };
			if(!req.type || req.type.toLowerCase() === "text") {
				if (!responseHeaders.get("Content-Type")) {
					responseHeaders.set("Content-Type", "text/plain");
				}
				apiResponse = {
					statusText,
					status: statusCode,
					text: fakeResponse,
					...dataResponse,
					headers: headersToObject(responseHeaders),
				};
			} else if (req.type.toLowerCase() === "json") {
				if (!responseHeaders.get("Content-Type")) {
					responseHeaders.set("Content-Type", "application/json");
				}
				apiResponse = {
					statusText,
					status: statusCode,
					...dataResponse,
					headers: headersToObject(responseHeaders),
				};
			} else if (req.type.toLowerCase() === "document") {
				if (!responseHeaders.get("Content-Type")) {
					responseHeaders.set("Content-Type", "application/xml");
				}
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(fakeResponse,"application/xml");
				apiResponse = {
					statusText,
					status: statusCode,
					xml: xmlDoc,
					data: xmlDoc,
					headers: headersToObject(responseHeaders),
				};
			} else {
				// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
				// "arraybuffer" | "blob"
				apiResponse = {
					statusText,
					status: statusCode,
					...dataResponse,
					headers: headersToObject(responseHeaders),
				};
			}
		}
		if (${JSON.stringify(opts.logger)}){
			const requestMethod = req.method ? req.method.toUpperCase() : "GET";
			console.log("%c request invoke" + " %c" + requestMethod + " " + req.url, "color: green", "color: blue");
		}
	`;
	const templateAsync = `async function(req, callback) {
		${commonInit}
		${sleep.toString()}
		${createSimulateResponse.toString()};
		const simulateServerResponse = createSimulateResponse(sleep);

		const responseResult = await simulateServerResponse(req, fakeModuleList, ${getConfig});
		if (responseResult) {
			${processTemplate}
			callback(apiResponse);
		} else {
			// next external URL
			callback();
		}
	}`;

	const templateSync = `function(req) {
		${commonInit}
		${syncSleep.toString()}

		${createSimulateResponse.toString()};
		const simulateServerResponseSync = createSimulateResponse(syncSleep);

		const responseResult = simulateServerResponseSync(req, fakeModuleList, ${getConfig});
		if (responseResult) {
			${processTemplate}
			return apiResponse;
		} else {
			// next, will fetch external link
			return;
		}
	}`;
	return isSync ? templateAsync : templateSync;
}
