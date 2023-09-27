import { join } from "node:path";
import chokidar from "chokidar";

import type { ResolveOptionsType } from "./resolveOptions";

export function createWatcher(options: ResolveOptionsType) {
	const { watch, include } = options;

	if (!watch || include.length > 1) {
		return;
	}

	const watchDir = [join(process.cwd(), include[0])];
	const watcher = chokidar.watch(watchDir, {
		ignoreInitial: true,
	});

	return watcher;
}
