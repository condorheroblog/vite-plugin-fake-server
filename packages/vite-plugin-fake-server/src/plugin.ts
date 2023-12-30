import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname, relative, isAbsolute } from "node:path";

import type { Plugin, ResolvedConfig, HtmlTagDescriptor, WatchOptions } from "vite";

import pkg from "../package.json";

import { generateFakeServer } from "./build";
import { createFakeMiddleware } from "./createFakeMiddleware";
import { getResponse, sleep, tryToJSON } from "./getResponse.mjs";
import { getFakeFilePath } from "./node";
import { resolvePluginOptions } from "./resolvePluginOptions";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { VitePluginFakeServerOptions } from "./types";
import { createLogger, convertPathToPosix } from "./utils";

const require = createRequire(import.meta.url);

export const vitePluginFakeServer = async (options: VitePluginFakeServerOptions = {}): Promise<Plugin> => {
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
			opts = resolvePluginOptions(options, absoluteRoot);
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
							`console.warn("[`,
							pkg.name,
							"]:",
							"The plugin is applied in the production environment, check in https://github.com/condorheroblog/vite-plugin-fake-server#enableprod",
							`");`,
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
				const relativeFakeFilePath = fakeFilePath.map((filePath) =>
					convertPathToPosix("/" + relative(config.root, filePath)),
				);

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
							const modList = Array.isArray(module) ? [...module] : [module];
							return [...list, ...modList];
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
				const xhookPath = join(dirname(require.resolve("xhook")), "../dist/xhook.js");
				const xhookContent = readFileSync(xhookPath, "utf-8");
				scriptTagList.push({
					...scriptTagOptions,
					children: `${xhookContent}\n;window.__VITE__PLUGIN__FAKE__SERVER__.xhook=xhook;`,
				});

				// add path-to-regexp
				const pathToRegexpPath = join(dirname(require.resolve("path-to-regexp")), "../dist.es2015/index.js");
				const pathToRegexpContent = readFileSync(pathToRegexpPath, "utf-8");
				scriptTagList.push({
					...scriptTagOptions,
					children: `${pathToRegexpContent}\n;window.__VITE__PLUGIN__FAKE__SERVER__.pathToRegexp={pathToRegexp, match};`,
				});

				scriptTagList.push({
					...scriptTagOptions,
					children: `const fakeModuleList = window.__VITE__PLUGIN__FAKE__SERVER__.fakeModuleList;
					const { pathToRegexp, match } = window.__VITE__PLUGIN__FAKE__SERVER__.pathToRegexp;
					window.__VITE__PLUGIN__FAKE__SERVER__.xhook.before(async function(req, callback) {
						${sleep.toString()}
						${tryToJSON.toString()}
						${getResponse.toString()}

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
							pathToRegexp,
							match,
							basename: ${JSON.stringify(opts.basename)},
							defaultTimeout: ${JSON.stringify(opts.timeout)},
							globalResponseHeaders: ${JSON.stringify(opts.headers, null, 2)}
						});
						if (responseResult) {
							const { response, statusCode, statusText, url, query, params, responseHeaders } = responseResult ?? {};
							if (response && typeof response === "function") {
								const fakeResponse = await Promise.resolve(
									response({ url, body: tryToJSON(req.body), rawBody: req.body, query, params, headers: req.headers })
								);
								if(req.isFetch){
									if (typeof fakeResponse === "string") {
										if (!responseHeaders.get("Content-Type")) {
											responseHeaders.set("Content-Type", "text/plain");
										}
										callback(new Response(
											fakeResponse,
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
											JSON.stringify(fakeResponse, null, 2),
											{
												statusText,
												status: statusCode,
												headers: headersToObject(responseHeaders),
											}
										));
									}
								} else {
									if(!req.type || req.type.toLowerCase() === "text") {
										if (!responseHeaders.get("Content-Type")) {
											responseHeaders.set("Content-Type", "text/plain");
										}
										callback({
											statusText,
											status: statusCode,
											text: fakeResponse,
											data: fakeResponse,
											headers: headersToObject(responseHeaders),
										});
									} else if (req.type.toLowerCase() === "json") {
										if (!responseHeaders.get("Content-Type")) {
											responseHeaders.set("Content-Type", "application/json");
										}
										callback({
											statusText,
											status: statusCode,
											data: fakeResponse,
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
											data: fakeResponse,
											headers: headersToObject(responseHeaders),
										});
									}
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
};

export function resolveIgnored(rootDir: string, include: string, watchOptions?: WatchOptions | null) {
	const { ignored = [] } = watchOptions ?? {};
	return [convertPathToPosix(join(rootDir, include, "**")), ...(Array.isArray(ignored) ? ignored : [ignored])];
}
