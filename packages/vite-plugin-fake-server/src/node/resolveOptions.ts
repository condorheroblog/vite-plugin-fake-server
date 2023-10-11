import type { FakerSchemaServerOptions } from "./types";

export function resolveOptions(options: FakerSchemaServerOptions = {}) {
	return {
		include: options.include ?? ["mock"],
		exclude: options.exclude ?? [],
	};
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
