import { resolveOptions as fakerResolveOptions } from "./node";
import type { VitePluginFakeServerOptions } from "./types";
import { existsSync } from "node:fs";
import { join } from "node:path";

export function resolvePluginOptions(options: VitePluginFakeServerOptions = {}) {
	const fakerOptions = fakerResolveOptions({ ...options, include: [options.include || "mock"] });

	for (const filePath of fakerOptions.include) {
		const absolutePath = join(process.cwd(), filePath);
		if (!existsSync(absolutePath)) {
			throw new Error(`${filePath} does not exist`);
		}
	}

	return {
		...fakerOptions,
		include: fakerOptions.include[0],
		enableProd: options.enableProd ?? false,
		enableDev: options.enableDev ?? true,
		watch: options.watch ?? true,
		logger: options.logger ?? true,
		timeout: options.timeout,
		basename: options.basename ?? "",
		headers: options.headers ?? {},
		build: options.build ?? false,
	};
}

export type ResolvePluginOptionsType = ReturnType<typeof resolvePluginOptions>;
