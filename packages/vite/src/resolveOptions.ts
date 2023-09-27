import type { VitePluginFakerOptions } from "./types";
import { resolveOptions as fakerResolveOptions } from "faker-schema-server";

export function resolveOptions(options: VitePluginFakerOptions = {}) {
	const fakerOptions = fakerResolveOptions({ ...options, include: [options.include ?? "mock"] });
	return {
		...fakerOptions,
		include: fakerOptions.include[0],
		enable: options.enable ?? true,
	};
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
