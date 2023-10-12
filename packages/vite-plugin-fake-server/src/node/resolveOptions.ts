import type { FakerSchemaServerOptions } from "./types";

export function resolveOptions(options: FakerSchemaServerOptions = {}) {
	const include = options.include ?? ["mock"];
	if (!Array.isArray(include) || include.length === 0) {
		throw new Error("Invalid include option");
	}

	return {
		include,
		exclude: options.exclude ?? [],
	};
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
