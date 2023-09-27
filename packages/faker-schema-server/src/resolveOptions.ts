import type { FakerSchemaServerOptions } from "./types";

export function resolveOptions(options: FakerSchemaServerOptions = {}) {
	return {
		basename: options.basename ?? "",
		include: options.include ?? ["mock"],
		exclude: options.exclude ?? [],
		watch: options.watch ?? true,
		logger: options.logger ?? true,
	};
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
