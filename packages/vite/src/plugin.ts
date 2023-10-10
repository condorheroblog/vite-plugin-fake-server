import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { join, dirname, relative } from "node:path";
import type { Plugin, ResolvedConfig, Connect } from "vite";
import type { FakeRoute } from "faker-schema-server";
import { pathToRegexp, match } from "path-to-regexp";
import { fakerSchemaServer, isFunction, loggerOutput, FAKE_FILE_EXTENSIONS } from "faker-schema-server";
import chokidar from "chokidar";
import { createRequire } from "node:module";

import type { VitePluginFakerOptions } from "./types";
import { resolvePluginOptions } from "./resolvePluginOptions";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import { getRequestData, insertScriptInHead, sleep, traverseHtml, nodeIsElement } from "./utils";

const require = createRequire(import.meta.url);

let fakeData: FakeRoute[] = [];
export const vitePluginFaker = async (options: VitePluginFakerOptions = {}): Promise<Plugin> => {
	// transform
	let isIndexHTML = true;
	let mainPath = "";

	let config: ResolvedConfig;
	let isDevServer = false;

	return {
		name: "vite-plugin-fake-server",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
			if (resolvedConfig.command === "serve") {
				isDevServer = true;
			}
		},
		async configureServer({ middlewares }) {
			const opts = resolvePluginOptions(options);
			if (!isDevServer || !opts.enableDev) {
				return;
			}

			fakeData = await getFakeData(opts);
			const middleware = await requestMiddleware(opts);
			middlewares.use(middleware);

			if (opts.include && opts.include.length && opts.watch) {
				const watchDir = join(process.cwd(), opts.include[0]);
				const watcher = chokidar.watch(watchDir, {
					ignoreInitial: true,
				});

				watcher.on("change", async (file) => {
					opts.logger && loggerOutput(`fake file change`, file);
					fakeData = await getFakeData(opts);
				});
			}
		},

		async transform(sourceCode, id) {
			const opts = resolvePluginOptions(options);
			if (isDevServer || !opts.enableProd) {
				return {
					code: sourceCode,
				};
			}
			if (isIndexHTML) {
				// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/indexHtml.ts#L222
				await traverseHtml(sourceCode, id, (node) => {
					if (!nodeIsElement(node)) {
						return;
					}
					// script tags
					if (node.nodeName === "script") {
						let isModule = false;
						let scriptSrcPath = "";
						for (const p of node.attrs) {
							if (p.name === "src" && p.value) {
								scriptSrcPath = p.value;
							} else if (p.name === "type" && p.value && p.value === "module") {
								isModule = true;
							}
						}
						if (isModule && scriptSrcPath.length > 0) {
							mainPath = scriptSrcPath;
						}
					}
				});
				isIndexHTML = false;
			}

			if (mainPath.length > 0 && id.endsWith(mainPath)) {
				const opts = resolvePluginOptions(options);
				const include = opts.include[0];
				const relativePath = relative(dirname(id), config.root);
				const globPatterns = FAKE_FILE_EXTENSIONS.map((ext) => join(relativePath, include, `/**/*.${ext}`));
				const ignoreFiles = opts.exclude.map((file) => "!" + join(relativePath, file));

				const fakeTemplate = `
				const modules = import.meta.glob(${JSON.stringify([...globPatterns, ...ignoreFiles], null, 2)}, { eager: true });
				const fakeModuleList = Object.keys(modules).reduce((list, key) => {
					const module = modules[key] ?? {};
					for (const moduleKey of Object.keys(module)) {
						const mod = modules[key][moduleKey] ?? [];
						const modList = Array.isArray(mod) ? [...mod] : [mod];
						return [...list, ...modList];
					}
				}, []);
				window.fakeModuleList = fakeModuleList;
				`;

				return {
					code: fakeTemplate + "\n" + sourceCode,
				};
			}

			return {
				code: sourceCode,
			};
		},

		async transformIndexHtml(htmlString) {
			const opts = resolvePluginOptions(options);
			if (isDevServer || !opts.enableProd) {
				return htmlString;
			}

			fakeData = await getFakeData(opts);

			let newHtml = htmlString;

			// add xhook
			const xhookPath = join(dirname(require.resolve("xhook")), "../dist/xhook.js");
			const xhookContent = readFileSync(xhookPath, "utf-8");
			newHtml = insertScriptInHead(newHtml, `${xhookContent}\n;window.__XHOOK__=xhook;\n`);

			const pathToRegexpPath = join(dirname(require.resolve("path-to-regexp")), "../dist.es2015/index.js");
			const pathToRegexpContent = readFileSync(pathToRegexpPath, "utf-8");
			newHtml = insertScriptInHead(
				newHtml,
				`${pathToRegexpContent}\n;window.__PATH_TO_REGEXP__={pathToRegexp, match};\n`,
			);

			return insertScriptInHead(
				newHtml,
				`const fakeModuleList = window.fakeModuleList;
				export function sleep(time) {
					return new Promise((resolve) => {
						const timer = setTimeout(() => {
							resolve(timer);
							clearTimeout(timer);
						}, time);
					});
				}
				const { pathToRegexp, match } = window.__PATH_TO_REGEXP__;
				__XHOOK__.before(async function(req, callback) {
					if (req.url) {
						const instanceURL = new URL(req.url, "http://localhost:5173/");

						// https://nodejs.org/api/url.html#urlpathname
						// Invalid URL characters included in the value assigned to the pathname property are percent-encoded
						const pathname = instanceURL.pathname;

						const matchRequest = fakeModuleList.find((item) => {
							if (!pathname || !item || !item.url) {
								return false;
							}
							const method = item.method ?? "GET";
							const reqMethod = req.method ?? "GET";
							if (method.toUpperCase() !== reqMethod.toUpperCase()) {
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

							const searchParams = instanceURL.searchParams;
							const query = {};
							for (const [key, value] of searchParams.entries()) {
								if (query.hasOwnProperty(key)) {
									const queryValue = query[key];
									if (Array.isArray(queryValue)) {
										queryValue.push(value);
									} else {
										query[key] = [queryValue, value];
									}
								} else {
									query[key] = value;
								}
							}

							let params = {};

							if (pathname) {
								const matchParams = urlMatch(pathname);
								if (matchParams) {
									params = matchParams.params;
								}
							}
							if (response && typeof response === "function") {
								const fakeResponse = response(
									{ url: req.url, query, params, headers: req.headers, hash: instanceURL.hash },
								);
								callback({
									status: statusCode ?? 200,
									text: JSON.stringify(fakeResponse),
									headers: {
										"Content-Type": "application/json"
									}
								});
							}
							console.log("%c request invoke", "color: blue", req.url);
							return;
						}
					}
					console.log("%c TODO: ", "color: yellow", "add next():https://github.com/jpillora/xhook/issues/169");
					__XHOOK__.disable();
				});`,
			);
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
				const reqMethod = req.method ?? "GET";
				if (method.toUpperCase() !== reqMethod.toUpperCase()) {
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

				const searchParams = instanceURL.searchParams;
				const query: Record<string, string | string[]> = {};
				for (const [key, value] of searchParams.entries()) {
					if (query.hasOwnProperty(key)) {
						const queryValue = query[key];
						if (Array.isArray(queryValue)) {
							queryValue.push(value);
						} else {
							query[key] = [queryValue, value];
						}
					} else {
						query[key] = value;
					}
				}

				let params: Record<string, string> = {};

				if (pathname) {
					const matchParams = urlMatch(pathname);
					if (matchParams) {
						params = matchParams.params as Record<string, string>;
					}
				}

				if (rawResponse && isFunction(rawResponse)) {
					rawResponse(req, res);
				} else if (response && isFunction(response)) {
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
