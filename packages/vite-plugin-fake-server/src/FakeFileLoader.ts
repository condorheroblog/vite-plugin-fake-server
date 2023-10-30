import { getFakeFilePath, getFakeModule, parallelLoader } from "./node";
import type { FakeRoute } from "./node";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { Logger } from "./utils";
import EventEmitter from "node:events";

export interface FakeFileLoaderOptions extends ResolvePluginOptionsType {
	loggerOutput: Logger;
	root: string;
}

export class FakeFileLoader extends EventEmitter {
	// public moduleCache: Map<string, unknown> = new WeakMap();

	#fakeData: FakeRoute[] = [];

	constructor(public options: FakeFileLoaderOptions) {
		super();
		this.options = options;
	}

	get fakeData() {
		return this.#fakeData;
	}

	async start() {
		// console.time("loader");
		const { include, exclude, extensions, infixName, root } = this.options;
		const fakeFilePathArr = getFakeFilePath({ exclude, include: [include], extensions, infixName }, root);

		// 5.402s => 1.309s
		// this.updateFakeData(await getFakeModule(fakeFilePathArr, this.options.loggerOutput));

		const fakeFilePathFunc = fakeFilePathArr.map((file) => () => this.loadFakeData(file));
		// TODO: Try to Web Worker
		const fakeData = await parallelLoader(fakeFilePathFunc, 10);
		this.updateFakeData(fakeData);
		// console.timeEnd("loader");
	}

	private async loadFakeData(filepath: string) {
		return (await getFakeModule([filepath], this.options.loggerOutput))[0];
	}

	private updateFakeData(fakeData: FakeRoute[]) {
		this.#fakeData = fakeData;
	}
}
