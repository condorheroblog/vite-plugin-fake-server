import type { ResolveOptionsType } from "./resolveOptions";
import fg from "fast-glob";
import { existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

export function getFakeFilePath(options: ResolveOptionsType, cwd = process.cwd()) {
	const { include, exclude, extensions } = options;
	if (!Array.isArray(include) || include.length === 0) {
		return [];
	}

	const fastGlobOptions = {
		cwd,
		ignore: exclude.map((filepath) => join(cwd, filepath)),
	};

	const fakeFilePath = include.reduce<string[]>((acc, filePath) => {
		const absFilePath = join(cwd, filePath);
		if (existsSync(absFilePath)) {
			// file
			const fileExtname = extname(absFilePath).slice(1);
			const fileStatus = statSync(absFilePath);
			if (!fileStatus.isDirectory() && fileExtname) {
				if (extensions.includes(fileExtname)) {
					const fakeFiles = fg.sync(absFilePath, fastGlobOptions);
					return [...acc, ...fakeFiles];
				}
				return acc;
			}

			// folder
			const dir = join(absFilePath, "/");
			const fakeFolderFiles = fg.sync(
				extensions.map((ext) => `${dir}**/*.${ext}`),
				fastGlobOptions,
			);

			return [...acc, ...fakeFolderFiles];
		}
		return acc;
	}, []);

	return fakeFilePath;
}
