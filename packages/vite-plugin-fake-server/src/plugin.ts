import type { HtmlTagDescriptor, Plugin, ResolvedConfig, WatchOptions } from "vite";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { VitePluginFakeServerOptions } from "./types";

import { isAbsolute, join } from "node:path";
import process from "node:process";
import { normalizePath } from "vite";

import pkg from "../package.json";
import { generateFakeServer } from "./build";
import { createFakeMiddleware } from "./createFakeMiddleware";
import { createHookTemplate } from "./createHookTemplate";
import { getFakeFilePath } from "./node";
import { resolvePluginOptions } from "./resolvePluginOptions";
import { buildPackage, createLogger } from "./utils";
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
						include: opts.include,
						exclude: opts.exclude,
						extensions: opts.extensions,
						infixName: opts.infixName,
					},
					config.root,
				);

				// import.meta.glob must use posix style paths
				const relativeFakeFilePath = fakeFilePath.map(filePath => `/${filePath}`);

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
					const pathToRegexp = window.__VITE__PLUGIN__FAKE__SERVER__.pathToRegexp;
					const match = pathToRegexp.match ?? pathToRegexp.default.match;
					// sync
					window.__VITE__PLUGIN__FAKE__SERVER__.xhook.before(${createHookTemplate(false, opts)});
					// async
					window.__VITE__PLUGIN__FAKE__SERVER__.xhook.before(${createHookTemplate(true, opts)});`,
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

export function resolveIgnored(rootDir: string, include: string[], watchOptions?: WatchOptions | null) {
	const { ignored = [] } = watchOptions ?? {};
	return [
		...include.map(includePath => normalizePath(join(rootDir, includePath, "**"))),
		...(Array.isArray(ignored) ? ignored : [ignored]),
	];
}
