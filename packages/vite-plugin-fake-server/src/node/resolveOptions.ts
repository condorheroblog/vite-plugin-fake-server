import { FAKE_FILE_EXTENSIONS, INFIX_NAME } from "./constants";
import type { FakerSchemaServerOptions } from "./types";

export function resolveOptions(options: FakerSchemaServerOptions = {}) {
	const include = options.include ?? ["fake"];
	if (!Array.isArray(include) || include.length === 0) {
		throw new Error("Invalid include option");
	}

	return {
		include,
		exclude: options.exclude || [],
		infixName: options.infixName || INFIX_NAME,
		extensions: options.extensions || FAKE_FILE_EXTENSIONS,
	};
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
