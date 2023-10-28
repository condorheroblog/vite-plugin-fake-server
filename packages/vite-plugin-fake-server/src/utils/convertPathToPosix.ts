import { platform } from "node:os";

/**
 * The device path (\\.\ or \\?\).
 * https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
 */
const DOS_DEVICE_PATH_RE = /^\\\\(?<path>[.?])/;

/**
 * All backslashes except those escaping special characters.
 * Windows: !()+@{}
 * https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
 */
const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@{}])/g;

/**
 * Converts a file path to a POSIX-style path.
 * On Windows, it replaces DOS device paths and converts backslashes to forward slashes.
 * @param {string} path - The file path to convert.
 * @returns {string} The converted POSIX-style path.
 * @link https://github.com/mrmlnc/fast-glob/blob/28a3d61e44d5d9193ba97de4f21df6dc7725f7c0/src/utils/path.ts
 */
export function convertPathToPosix(path: string) {
	return platform() === "win32"
		? path.replace(DOS_DEVICE_PATH_RE, "//$1").replaceAll(WINDOWS_BACKSLASHES_RE, "/")
		: path;
}
