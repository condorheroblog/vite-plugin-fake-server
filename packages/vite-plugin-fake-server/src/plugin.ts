import process from "node:process";
import { isAbsolute, join, relative } from "node:path";
import { STATUS_CODES } from "node:http";

import type { HtmlTagDescriptor, Plugin, ResolvedConfig, WatchOptions } from "vite";

import pkg from "../package.json";

import { generateFakeServer } from "./build";
import { createFakeMiddleware } from "./createFakeMiddleware";
import { getResponse, sleep, tryToJSON } from "./getResponse.mjs";
import { getFakeFilePath } from "./node";
import { resolvePluginOptions } from "./resolvePluginOptions";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { VitePluginFakeServerOptions } from "./types";
import { buildPackage, convertPathToPosix, createLogger } from "./utils";
import { xhook } from "./xhook/index.mjs";

export async function vitePluginFakeServer(options: VitePluginFakeServerOptions = {}): Promise<Plugin> {
	let config: ResolvedConfig;
	let isDevServer = false;
	let opts: ResolvePluginOptionsType;

	return {
		name: "vite-plugin-fake-server",

		config: (unresolvedConfig) => {
			// https://vitejs.dev/config/shared-options.html#root
			const currentWorkingDirectory = process.cwd();
			const root = unresolvedConfig.root ?? currentWorkingDirectory;
			const absoluteRoot = isAbsolute(root) ? root : join(currentWorkingDirectory, root);
			opts = resolvePluginOptions({ ...options, http2: options.http2 ?? !!unresolvedConfig.server }, absoluteRoot);
			return {
				server: {
					watch: {
						ignored: resolveIgnored(absoluteRoot, opts.include, unresolvedConfig?.server?.watch),
					},
				},
			};
		},

		configResolved(resolvedConfig) {
			config = resolvedConfig;
			if (resolvedConfig.command === "serve") {
				isDevServer = true;
			}
		},

		async configureServer({ middlewares, httpServer }) {
			if (isDevServer && opts.enableDev) {
				// Define logger
				const loggerOutput = createLogger(config.logLevel, {
					allowClearScreen: config.clearScreen,
					customLogger: config.customLogger,
				});

				const middleware = await createFakeMiddleware({ ...opts, loggerOutput, root: config.root }, httpServer);
				middlewares.use(middleware);
			}
		},

		transformIndexHtml: {
			order: "pre",
			handler: async (htmlString) => {
				if (isDevServer || !opts.enableProd) {
					return htmlString;
				}

				const scriptTagOptions: Omit<HtmlTagDescriptor, "children"> = {
					tag: "script",
					attrs: { type: "module" },
					injectTo: "head",
				};
				const scriptTagList: HtmlTagDescriptor[] = [];

				// warning message in production environment
				if (opts.logger) {
					scriptTagList.push({
						...scriptTagOptions,
						children: [
							"console.warn(\"[",
							pkg.name,
							"]:",
							"The plugin is applied in the production environment, check in https://github.com/condorheroblog/vite-plugin-fake-server#enableprod",
							"\");",
						].join(""),
					});
				}

				// Initialize a global variable for the vite-plugin-fake-server
				scriptTagList.push({
					...scriptTagOptions,
					children: [
						"window.__VITE__PLUGIN__FAKE__SERVER__",
						"=",
						JSON.stringify({ meta: pkg, vitePluginFakeServerOptions: opts }, null, 2),
						";",
					].join(""),
				});

				const fakeFilePath = getFakeFilePath(
					{
						include: opts.include.length ? [opts.include] : [],
						exclude: opts.exclude,
						extensions: opts.extensions,
						infixName: opts.infixName,
					},
					config.root,
				);

				// import.meta.glob must use posix style paths
				const relativeFakeFilePath = fakeFilePath.map(filePath =>
					convertPathToPosix(`/${relative(config.root, filePath)}`),
				);

				// import.meta.glob imports the CommonJS module, which has the default object by default
				const fakeTemplate = `
					const modules = import.meta.glob(${JSON.stringify(relativeFakeFilePath, null, 2)}, { eager: true });
					const fakeModuleList = Object.keys(modules).reduce((list, key) => {
						const module = modules[key] ?? {};
						if (module.default) {
							for (const moduleKey of Object.keys(module)) {
								const mod = modules[key][moduleKey] ?? [];
								const modList = Array.isArray(mod) ? [...mod] : [mod];
								return [...list, ...modList];
							}
						} else {
							return list;
						}
					}, []);
					window.__VITE__PLUGIN__FAKE__SERVER__.fakeModuleList = fakeModuleList;
				`;

				// import.meta.glob
				scriptTagList.push({
					...scriptTagOptions,
					children: fakeTemplate,
				});

				// add xhook
				scriptTagList.push({
					...scriptTagOptions,
					children: `${xhook.toString()};window.__VITE__PLUGIN__FAKE__SERVER__.xhook=xhook();`,
				});

				// add path-to-regexp
				const pathToRegexpContent = await buildPackage("path-to-regexp");
				scriptTagList.push({
					...scriptTagOptions,
					children: `${pathToRegexpContent}`,
				});

				scriptTagList.push({
					...scriptTagOptions,
					children: `const fakeModuleList = window.__VITE__PLUGIN__FAKE__SERVER__.fakeModuleList;
					const { match } = window.__VITE__PLUGIN__FAKE__SERVER__.pathToRegexp;
					window.__VITE__PLUGIN__FAKE__SERVER__.xhook.before(async function(req, callback) {
						${sleep.toString()}
						${tryToJSON.toString()}
						${getResponse.toString()}
						const STATUS_CODES = ${JSON.stringify(STATUS_CODES, null, 2)};

						function headersToObject(headers) {
							const headersObject = {};
							for (const [name, value] of headers.entries()) {
								headersObject[name] = value;
							}
							return headersObject;
						}

						const responseResult = await getResponse({
							URL,
							req,
							fakeModuleList,
							match,
							basename: ${JSON.stringify(opts.basename)},
							defaultTimeout: ${JSON.stringify(opts.timeout)},
							globalResponseHeaders: ${JSON.stringify(opts.headers, null, 2)}
						});
						if (responseResult) {
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
							const responseIsFunction = typeof response === "function";
							const requestHeaders = {};
							for (const key in req.headers) {
								requestHeaders[key.toLowerCase()] = req.headers[key];
							}
							const fakeResponse = !responseIsFunction || await Promise.resolve(
								response({ url, body: tryToJSON(req.body), rawBody: req.body, query, params, headers: requestHeaders })
							);
							if(req.isFetch) {
								if (typeof fakeResponse === "string") {
									if (!responseHeaders.get("Content-Type")) {
										responseHeaders.set("Content-Type", "text/plain");
									}
									callback(new Response(
										responseIsFunction ? fakeResponse : null,
										{
											statusText,
											status: statusCode,
											headers: headersToObject(responseHeaders),
										}
									));
								} else {
									if (!responseHeaders.get("Content-Type")) {
										responseHeaders.set("Content-Type", "application/json");
									}
									callback(new Response(
										responseIsFunction ? JSON.stringify(fakeResponse, null, 2) : null,
										{
											statusText,
											status: statusCode,
											headers: headersToObject(responseHeaders),
										}
									));
								}
							} else {
								const dataResponse = responseIsFunction ? { data: fakeResponse } : {};
								if(!req.type || req.type.toLowerCase() === "text") {
									if (!responseHeaders.get("Content-Type")) {
										responseHeaders.set("Content-Type", "text/plain");
									}
									callback({
										statusText,
										status: statusCode,
										text: fakeResponse,
										...dataResponse,
										headers: headersToObject(responseHeaders),
									});
								} else if (req.type.toLowerCase() === "json") {
									if (!responseHeaders.get("Content-Type")) {
										responseHeaders.set("Content-Type", "application/json");
									}
									callback({
										statusText,
										status: statusCode,
										...dataResponse,
										headers: headersToObject(responseHeaders),
									});
								} else if (req.type.toLowerCase() === "document") {
									if (!responseHeaders.get("Content-Type")) {
										responseHeaders.set("Content-Type", "application/xml");
									}
									const parser = new DOMParser();
									const xmlDoc = parser.parseFromString(fakeResponse,"application/xml");
									callback({
										statusText,
										status: statusCode,
										xml: xmlDoc,
										data: xmlDoc,
										headers: headersToObject(responseHeaders),
									});
								} else {
									// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
									// "arraybuffer" | "blob"
									callback({
										statusText,
										status: statusCode,
										...dataResponse,
										headers: headersToObject(responseHeaders),
									});
								}
							}
							if (${JSON.stringify(opts.logger)}){
								const requestMethod = req.method ? req.method.toUpperCase() : "GET";
								console.log("%c request invoke" + " %c" + requestMethod + " " + req.url, "color: green", "color: blue");
							}
						} else {
							// next external URL
							callback();
						}
					});`,
				});

				return scriptTagList;
			},
		},

		async closeBundle() {
			/**
			 * Build a independently deployable fake service
			 */
			if (!isDevServer && opts.build) {
				await generateFakeServer(opts, config);
			}
		},
	};
}

export function resolveIgnored(rootDir: string, include: string, watchOptions?: WatchOptions | null) {
	const { ignored = [] } = watchOptions ?? {};
	return [convertPathToPosix(join(rootDir, include, "**")), ...(Array.isArray(ignored) ? ignored : [ignored])];
}
