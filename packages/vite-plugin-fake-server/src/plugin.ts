import { getResponse } from "./getResponse.mjs";
import type { FakeRoute } from "./node";
import { fakerSchemaServer, isFunction, loggerOutput, FAKE_FILE_EXTENSIONS } from "./node";
import { resolvePluginOptions } from "./resolvePluginOptions";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { VitePluginFakerOptions } from "./types";
import { getRequestData, insertScriptInHead, traverseHtml, nodeIsElement } from "./utils";
import chokidar from "chokidar";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname, relative } from "node:path";
import { URL } from "node:url";
import { pathToRegexp, match } from "path-to-regexp";
import type { Plugin, ResolvedConfig, Connect } from "vite";

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
					${getResponse.toString()}
					const responseResult = await getResponse({
						URL,
						req,
						fakeModuleList,
						pathToRegexp,
						match,
						basename: ${opts.basename.length ? opts.basename : '""'},
						defaultTimeout: ${opts.timeout},
					});
					if (responseResult) {
						const { response, statusCode, url, query, params, headers, hash } = responseResult ?? {};
						if (response && typeof response === "function") {
							const fakeResponse = response({ url, query, params, headers, hash });
							callback({
								status: statusCode,
								text: JSON.stringify(fakeResponse),
								headers: {
									"Content-Type": "application/json",
								},
							});
						}
						console.log("%c request invoke", "color: blue", req.url);
					} else {
						console.log("%c TODO: ", "color: yellow", "add next():https://github.com/jpillora/xhook/issues/169");
					}
				});`,
			);
		},
	};
};

export async function getFakeData(options: ResolvePluginOptionsType) {
	return await fakerSchemaServer(options);
}

export async function requestMiddleware(options: ResolvePluginOptionsType) {
	const { logger, basename, timeout: defaultTimeout } = options;
	const middleware: Connect.NextHandleFunction = async (req, res, next) => {
		const responseResult = await getResponse({
			URL,
			req,
			fakeModuleList: fakeData,
			pathToRegexp,
			match,
			basename,
			defaultTimeout,
		});
		if (responseResult) {
			const { rawResponse, response, statusCode, url, query, params, headers, hash } = responseResult ?? {};
			if (isFunction(rawResponse)) {
				rawResponse(req, res);
			} else if (isFunction(response)) {
				const body = await getRequestData(req);
				res.setHeader("Content-Type", "application/json");
				res.statusCode = statusCode;
				const fakeResponse = response({ url, body, query, params, headers, hash }, req, res);
				res.end(JSON.stringify(fakeResponse));
			}

			logger && loggerOutput("request invoke", req.url!);
		} else {
			next();
		}
	};

	return middleware;
}
