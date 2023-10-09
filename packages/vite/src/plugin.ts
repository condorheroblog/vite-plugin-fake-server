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

		async transform(sourceCode, id) {
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
				const globPatterns = FAKE_FILE_EXTENSIONS.map((ext) =>
					join(relative(dirname(id), config.root), include, `/**/*.${ext}`),
				);

				const template = `
				const modules = import.meta.glob(${JSON.stringify(globPatterns, null, 2)}, { eager: true });
				console.log(modules);
				`;

				console.log(template + "\n" + sourceCode);
				// const routeModuleList = Object.keys(modules).reduce((list, key) => {
				// 	console.log(modules[key])
				// 	const mod = modules[key].default ?? {};
				// 	const modList = Array.isArray(mod) ? [...mod] : [mod];
				// 	return [...list, ...modList];
				// }, []);
				return {
					code: template + "\n" + sourceCode,
				};
			}

			return {
				code: sourceCode,
			};
		},

		async transformIndexHtml(htmlString) {
			if (config.command === "serve") {
				return htmlString;
			}

			const opts = resolvePluginOptions(options);
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
				`const fakeData = ${JSON.stringify(
					fakeData,
					(_, value) => {
						if (typeof value === "function") {
							return value.toString(); // 将函数转换为字符串
						}
						return value;
					},
					2,
				)};
				__XHOOK__.before(function(request, callback) {
					console.log(new URL(request.url, "http://localhost:4173/"));
					callback({
							status: 200,
							text: '{ \"hello\": \"Hello\" }',
							headers: {
								Foo: 'Bar'
							}
						});
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
