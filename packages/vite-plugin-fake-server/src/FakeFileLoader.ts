import { getFakeFilePath, parallelLoader, esbuildBundler, moduleFromString } from "./node";
import type { FakeRoute } from "./node";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { Logger } from "./utils";
import { convertPathToPosix } from "./utils";
import chokidar from "chokidar";
import type { Metafile } from "import-from-string";
import EventEmitter from "node:events";
import type { FSWatcher } from "node:fs";
import { join } from "node:path";
import colors from "picocolors";

export interface FakeFileLoaderOptions extends ResolvePluginOptionsType {
	loggerOutput: Logger;
	root: string;
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
		const fakeFilePathArr = getFakeFilePath({ exclude, include: [include], extensions, infixName }, root);

		// 5.402s => 1.309s
		// this.updateFakeData(await getFakeModule(fakeFilePathArr, this.options.loggerOutput));

		const fakeFilePathFunc = fakeFilePathArr.map((file) => () => this.loadFakeData(file));
		// TODO: Try to Web Worker
		await parallelLoader(fakeFilePathFunc, 10);
		this.updateFakeData();
		// console.timeEnd("loader");
	}

	private async watchFakeFile() {
		const { include, watch, root, exclude, loggerOutput, extensions, infixName } = this.options;
		if (include && include.length && watch) {
			let watchPath;
			if (infixName && infixName.length > 0) {
				watchPath = `/**/*.${infixName}.{${extensions.join(",")}}`;
			} else {
				watchPath = `/**/*.{${extensions.join(",")}}`;
			}
			const watchDir = convertPathToPosix(join(include, watchPath));
			const watcher = chokidar.watch(watchDir, {
				cwd: root,
				ignoreInitial: true,
				ignored: exclude,
			});
			this.watcher = watcher;

			watcher.on("add", async (relativeFilePath) => {
				loggerOutput.info(colors.green(`fake file add ` + colors.dim(relativeFilePath)), {
					timestamp: true,
					clear: true,
				});

				await this.loadFakeData(relativeFilePath);
				this.updateFakeData();
			});

			watcher.on("change", async (relativeFilePath) => {
				loggerOutput.info(colors.green(`fake file change ` + colors.dim(relativeFilePath)), {
					timestamp: true,
					clear: true,
				});

				await this.loadFakeData(relativeFilePath);
				this.updateFakeData();
			});

			watcher.on("unlink", async (relativeFilePath) => {
				loggerOutput.info(colors.green(`fake file unlink ` + colors.dim(relativeFilePath)), {
					timestamp: true,
					clear: true,
				});

				this.#moduleCache.delete(relativeFilePath);
				this.updateFakeData();
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
				if (this.#fakeFileDeps.has(relativeFilePath)) {
					const fakeFiles = this.#fakeFileDeps.get(relativeFilePath);
					if (fakeFiles) {
						fakeFiles.forEach(async (filePath) => {
							await this.loadFakeData(filePath);
							this.updateFakeData();
						});
					}
				}
			});

			watcherDeps.on("unlink", async (relativeFilePath) => {
				if (this.#fakeFileDeps.has(relativeFilePath)) {
					this.#fakeFileDeps.delete(relativeFilePath);
				}
			});

			const oldDeps: string[] = [];

			this.on("update:deps", () => {
				const deps = [];
				for (const [dep] of this.#fakeFileDeps.entries()) {
					deps.push(dep);
				}
				const exactDeps = deps.filter((dep) => !oldDeps.includes(dep));

				exactDeps.length > 0 && watcherDeps.add(exactDeps);
			});
		}
	}

	private async loadFakeData(filepath: string) {
		const fakeCodeData = [];
		let fakeFileDependencies = {};
		try {
			const { code, deps } = await esbuildBundler(filepath);
			fakeFileDependencies = deps;
			const mod = await moduleFromString(filepath, code);
			const resolvedModule = mod.default || mod;
			if (Array.isArray(resolvedModule)) {
				fakeCodeData.push(...resolvedModule);
			} else {
				fakeCodeData.push(resolvedModule);
			}
		} catch (error) {
			this.options.loggerOutput.error(colors.red(`failed to load module from ${filepath}`), {
				error: error as Error,
				timestamp: true,
			});
		}

		this.#moduleCache.set(filepath, fakeCodeData);
		this.updateFakeFileDeps(filepath, fakeFileDependencies);
		return fakeCodeData;
	}

	private updateFakeFileDeps(filepath: string, deps: Metafile["inputs"]) {
		Object.keys(deps).forEach((mPath) => {
			const imports = deps[mPath].imports.map((_) => _.path);
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
