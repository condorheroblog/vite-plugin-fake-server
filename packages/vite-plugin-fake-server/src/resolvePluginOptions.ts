import { resolveOptions as fakerResolveOptions } from "./node";
import type { VitePluginFakeServerOptions } from "./types";

export function resolvePluginOptions(options: VitePluginFakeServerOptions = {}) {
	const fakerOptions = fakerResolveOptions({ ...options, include: [options.include ?? "mock"] });
	return {
		...fakerOptions,
		enableProd: options.enableProd ?? false,
		enableDev: options.enableDev ?? true,
		watch: options.watch ?? true,
		logger: options.logger ?? true,
		timeout: options.timeout,
		basename: options.basename ?? "",
		build: options.build ?? false,
	};
}

export type ResolvePluginOptionsType = ReturnType<typeof resolvePluginOptions>;
