import { FAKE_FILE_EXTENSIONS } from "./constants";
import type { FakerSchemaServerOptions } from "./types";

export function resolveOptions(options: FakerSchemaServerOptions = {}) {
	const include = options.include ?? ["fake"];
	if (!Array.isArray(include) || include.length === 0) {
		throw new Error("Invalid include option");
	}

	return {
		include,
		exclude: options.exclude || [],
		extensions: options.extensions || FAKE_FILE_EXTENSIONS,
	};
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
