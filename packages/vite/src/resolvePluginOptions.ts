import type { VitePluginFakerOptions } from "./types";
import { resolveOptions as fakerResolveOptions } from "faker-schema-server";

export function resolvePluginOptions(options: VitePluginFakerOptions = {}) {
	const fakerOptions = fakerResolveOptions({ ...options, include: [options.include ?? "mock"] });
	return {
		...fakerOptions,
		enable: options.enable ?? true,
	};
}

export type resolvePluginOptions = ReturnType<typeof resolvePluginOptions>;
