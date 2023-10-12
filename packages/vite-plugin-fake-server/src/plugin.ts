import { generateMockServer } from "./build";
import { getResponse } from "./getResponse.mjs";
import type { FakeRoute } from "./node";
import { fakerSchemaServer, isFunction, loggerOutput, FAKE_FILE_EXTENSIONS } from "./node";
import { resolvePluginOptions } from "./resolvePluginOptions";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { VitePluginFakeServerOptions } from "./types";
import { getRequestData, traverseHtml, nodeIsElement } from "./utils";
import chokidar from "chokidar";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname, relative } from "node:path";
import { URL } from "node:url";
import { pathToRegexp, match } from "path-to-regexp";
import type { Plugin, ResolvedConfig, Connect, HtmlTagDescriptor } from "vite";

const require = createRequire(import.meta.url);

let fakeData: FakeRoute[] = [];
export const vitePluginFakeServer = async (options: VitePluginFakeServerOptions = {}): Promise<Plugin> => {
	// transform
	let isIndexHTML = true;
	let mainPath = "";

	let config: ResolvedConfig;
	let isDevServer = false;

	const opts = resolvePluginOptions(options);

	return {
		name: "vite-plugin-fake-server",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
			if (resolvedConfig.command === "serve") {
				isDevServer = true;
			}
		},
		async configureServer({ middlewares }) {
			if (!isDevServer || !opts.enableDev) {
				return;
			}

			fakeData = await getFakeData(opts);
			const middleware = await requestMiddleware(opts);
			middlewares.use(middleware);

			if (opts.include && opts.include.length && opts.watch) {
				const watchDir = join(process.cwd(), opts.include);
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
				const include = opts.include;
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
			scriptTagList.push({
				...scriptTagOptions,
				children: `console.warn("[vite-plugin-fake-server]: The plugin is applied in the production environment, check in https://github.com/condorheroblog/vite-plugin-fake-server#enableprod");\n`,
			});

			// add xhook
			const xhookPath = join(dirname(require.resolve("xhook")), "../dist/xhook.js");
			const xhookContent = readFileSync(xhookPath, "utf-8");
			scriptTagList.push({
				...scriptTagOptions,
				children: `${xhookContent}\n;window.__XHOOK__=xhook;\n`,
			});

			// add path-to-regexp
			const pathToRegexpPath = join(dirname(require.resolve("path-to-regexp")), "../dist.es2015/index.js");
			const pathToRegexpContent = readFileSync(pathToRegexpPath, "utf-8");
			scriptTagList.push({
				...scriptTagOptions,
				children: `${pathToRegexpContent}\n;window.__PATH_TO_REGEXP__={pathToRegexp, match};\n`,
			});

			scriptTagList.push({
				...scriptTagOptions,
				children: `const fakeModuleList = window.fakeModuleList;
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
									"Content-Type": headers.get("Content-Type"),
								},
							});
						}
						console.log("%c request invoke", "color: blue", req.url);
					} else {
						console.log("%c TODO: ", "color: yellow", "add next():https://github.com/jpillora/xhook/issues/169");
					}
				});`,
			});

			return scriptTagList;
		},

		async closeBundle() {
			/**
			 * Build a independently deployable mock service
			 */
			if (!isDevServer && opts.build) {
				await generateMockServer(opts);
			}
		},
	};
};

export async function getFakeData(options: ResolvePluginOptionsType) {
	return await fakerSchemaServer({ ...options, include: [options.include] });
}

export async function requestMiddleware(options: ResolvePluginOptionsType) {
	const { logger, basename, timeout: defaultTimeout } = options;
	const middleware: Connect.NextHandleFunction = async (req, res, next) => {
		const responseResult = await getResponse({
			URL,
			req,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			fakeModuleList: options?.fakeData ?? fakeData,
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

				res.setHeader("Content-Type", headers.get("Content-Type")!);
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
