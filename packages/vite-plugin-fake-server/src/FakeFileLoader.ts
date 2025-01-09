import type { DependenciesType } from "bundle-import";
import type { FSWatcher } from "chokidar";
import type { FakeRoute } from "./node";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { Logger } from "./utils";

import EventEmitter from "node:events";

import { bundleImport } from "bundle-import";
import chokidar from "chokidar";
import colors from "picocolors";
import { glob } from "tinyglobby";
import { normalizePath } from "vite";

import { getFakeFilePath, getWatchPaths, parallelLoader } from "./node";

export interface FakeFileLoaderOptions extends ResolvePluginOptionsType {
	loggerOutput: Logger
	root: string
}

export class FakeFileLoader extends EventEmitter {
	#moduleCache = new Map<string, FakeRoute[]>();
	#fakeFileDeps = new Map<string, Set<string>>();
	#fakeData: FakeRoute[] = [];
	watcher!: FSWatcher;
	watcherDeps!: FSWatcher;

	constructor(public options: FakeFileLoaderOptions) {
		super();
		this.options = options;
	}

	get fakeData() {
		return this.#fakeData;
	}

	async start() {
		// on must be emit before
		this.watchFakeFileDeps();
		await this.watchFakeFile();

		// console.time("loader");
		const { include, exclude, extensions, infixName, root } = this.options;
		// Note: return relative path but no `./` @example `fake/index.js`
		const fakeFilePathArr = getFakeFilePath({ exclude, include, extensions, infixName }, root);

		/**
		 * 5.402s => 1.309s in packages/react-sample by fast-glob
		 * now 297.896ms in packages/react-sample by tinyglobby
		 */

		const fakeFilePathFunc = fakeFilePathArr.map(relativeFilePath => () => this.loadFakeData(relativeFilePath));
		// TODO: Try to Web Worker
		await parallelLoader(fakeFilePathFunc, 10);
		this.updateFakeData();
		// console.timeEnd("loader");
	}

	private async watchFakeFile() {
		const { include, watch, root, exclude, loggerOutput, extensions, infixName, logger } = this.options;
		if (include && include.length && watch) {
			const watchDir = getWatchPaths({ extensions, infixName, include });
			const filePaths = await glob(watchDir, {
				cwd: root,
			});
			const watcher = chokidar.watch(filePaths, {
				cwd: root,
				ignoreInitial: true,
				ignored: exclude,
			});
			this.watcher = watcher;

			const handleFileEvent = async (eventType: "add" | "change" | "unlink", relativeFilePath: string, logger: boolean) => {
				// 将 Windows 路径格式转换为 Unix 路径格式
				const unixPath = normalizePath(relativeFilePath);

				if (logger) {
					loggerOutput.info(colors.green(`fake file ${eventType} ${colors.dim(unixPath)}`), {
						timestamp: true,
						clear: true,
					});
				}

				// 根据事件类型调用不同的处理逻辑
				if (eventType === "unlink") {
					this.#moduleCache.delete(normalizePath(unixPath));
				}
				else {
					await this.loadFakeData(unixPath);
				}
				this.updateFakeData();
			};

			watcher.on("add", async (relativeFilePath) => {
				await handleFileEvent("add", relativeFilePath, logger);
			});

			watcher.on("change", async (relativeFilePath) => {
				await handleFileEvent("change", relativeFilePath, logger);
			});

			watcher.on("unlink", async (relativeFilePath) => {
				await handleFileEvent("unlink", relativeFilePath, logger);
			});
		}
	}

	private watchFakeFileDeps() {
		const { include, watch, root } = this.options;
		if (include && include.length && watch) {
			// watcher empty files
			const watcherDeps = chokidar.watch([], {
				cwd: root,
				ignoreInitial: true,
			});
			this.watcherDeps = watcherDeps;

			watcherDeps.on("change", (relativeFilePath) => {
				const unixPath = normalizePath(relativeFilePath);
				if (this.#fakeFileDeps.has(unixPath)) {
					const fakeFiles = this.#fakeFileDeps.get(unixPath);
					if (fakeFiles) {
						fakeFiles.forEach(async (filePath) => {
							await this.loadFakeData(filePath);
							this.updateFakeData();
						});
					}
				}
			});

			watcherDeps.on("unlink", async (relativeFilePath) => {
				const unixPath = normalizePath(relativeFilePath);
				if (this.#fakeFileDeps.has(unixPath)) {
					this.#fakeFileDeps.delete(unixPath);
				}
			});

			const oldDeps: string[] = [];

			this.on("update:deps", () => {
				const deps = [];
				for (const [dep] of this.#fakeFileDeps.entries()) {
					deps.push(dep);
				}
				const exactDeps = deps.filter(dep => !oldDeps.includes(dep));

				if (exactDeps.length > 0) {
					watcherDeps.add(exactDeps);
				}
			});
		}
	}

	private async loadFakeData(filepath: string) {
		const fakeCodeData = [];
		let fakeFileDependencies = {};
		try {
			const { mod, dependencies } = await bundleImport({ filepath, cwd: this.options.root });
			fakeFileDependencies = dependencies;
			const resolvedModule = mod.default || mod;
			if (Array.isArray(resolvedModule)) {
				fakeCodeData.push(...resolvedModule);
			}
			else {
				fakeCodeData.push(resolvedModule);
			}
		}
		catch (error) {
			this.options.loggerOutput.error(colors.red(`failed to load module from ${filepath}`), {
				error: error as Error,
				timestamp: true,
			});
		}

		this.#moduleCache.set(filepath, fakeCodeData);
		this.updateFakeFileDeps(filepath, fakeFileDependencies);
		return fakeCodeData;
	}

	private updateFakeFileDeps(filepath: string, deps: DependenciesType) {
		Object.keys(deps).forEach((mPath) => {
			const imports = deps[mPath].imports.map(_ => _.path);
			imports.forEach((dep) => {
				if (!this.#fakeFileDeps.has(dep)) {
					this.#fakeFileDeps.set(dep, new Set());
				}
				const cur = this.#fakeFileDeps.get(dep)!;
				cur.add(filepath);
			});
		});
		this.emit("update:deps");
	}

	private updateFakeData() {
		let fakeData: FakeRoute[] = [];
		for (const value of this.#moduleCache.values()) {
			fakeData = [...fakeData, ...value];
		}
		this.#fakeData = fakeData;
	}

	close() {
		this.watcher?.close();
		this.watcherDeps?.close();
	}
}
