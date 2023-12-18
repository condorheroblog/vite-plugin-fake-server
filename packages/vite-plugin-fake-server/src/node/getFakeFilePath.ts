import { existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

import fg from "fast-glob";

import { convertPathToPosix } from "../utils";

import type { ResolveOptionsType } from "./resolveOptions";

export function getFakeFilePath(options: ResolveOptionsType, cwd = process.cwd()) {
	const { include, exclude, extensions, infixName } = options;
	if (!Array.isArray(include) || include.length === 0) {
		return [];
	}

	const fastGlobIgnore = exclude.map((filepath) => convertPathToPosix(join(cwd, filepath)));
	const posixStyleCurrentWorkingDirectory = convertPathToPosix(cwd);

	const fastGlobOptions = {
		posixStyleCurrentWorkingDirectory,
		ignore: fastGlobIgnore,
	};

	const fakeFilePath = include.reduce<string[]>((acc, filePath) => {
		const absFilePath = join(cwd, filePath);
		if (existsSync(absFilePath)) {
			// file
			const fileExtname = extname(absFilePath).slice(1);
			const fileStatus = statSync(absFilePath);
			if (!fileStatus.isDirectory() && fileExtname) {
				if (extensions.includes(fileExtname)) {
					const fakeFiles = fg.sync(convertPathToPosix(absFilePath), fastGlobOptions);
					return [...acc, ...fakeFiles];
				}
				return acc;
			}

			// folder
			const dir = join(absFilePath, "/");
			const fakeFolderFiles = fg.sync(
				extensions.map((ext) => {
					if (infixName && infixName.length > 0) {
						return convertPathToPosix(`${dir}**/*.${infixName}.${ext}`);
					}
					return convertPathToPosix(`${dir}**/*.${ext}`);
				}),
				fastGlobOptions,
			);

			return [...acc, ...fakeFolderFiles];
		}
		return acc;
	}, []);

	return fakeFilePath;
}
