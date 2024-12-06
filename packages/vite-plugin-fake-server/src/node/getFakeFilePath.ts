import type { ResolveOptionsType } from "./resolveOptions";

import process from "node:process";
import { globSync } from "tinyglobby";

import { getWatchPaths } from "./getWatchPaths";

/**
 * 生成 fake 文件路径列表。
 */
export function getFakeFilePath(options: ResolveOptionsType, root = process.cwd()) {
	const { include, exclude, extensions, infixName } = options;
	if (!Array.isArray(include) || include.length === 0) {
		return [];
	}

	const watchDir = getWatchPaths({ infixName, extensions, include });
	return globSync(watchDir, {
		ignore: exclude,
		cwd: root,
	});
}
