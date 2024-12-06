import { join } from "node:path";
import { normalizePath } from "vite";

interface GetWatchPathsParams {
	infixName: string | false
	extensions: string[]
	include: string[]
}

/**
 * 获取监控文件路径的通配符表达式
 */
export function getWatchPaths({ infixName, extensions, include }: GetWatchPathsParams) {
	let watchPath;
	// tinyglobby doesn't support `*.{js}` it must be `*.js`
	const extString = extensions.length === 1 ? extensions[0] : `{${extensions.join(",")}}`;
	if (infixName && infixName.length > 0) {
		watchPath = `/**/*.${infixName}.${extString}`;
	}
	else {
		watchPath = `/**/*.${extString}`;
	}

	return include.map(path => normalizePath(join(path, watchPath)));
}
