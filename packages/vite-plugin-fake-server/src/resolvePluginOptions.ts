import type { VitePluginFakeServerOptions } from "./types";
import { existsSync } from "node:fs";
import { join } from "node:path";

import process from "node:process";
import { resolveOptions as fakerResolveOptions } from "./node";

export function resolvePluginOptions(options: VitePluginFakeServerOptions = {}, cwd = process.cwd()) {
	const fakerOptions = fakerResolveOptions({ ...options, include: [options.include || "fake"] });

	for (const filePath of fakerOptions.include) {
		const absolutePath = join(cwd, filePath);
		if (!existsSync(absolutePath)) {
			throw new Error(`${filePath} folder does not exist`);
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
		http2: options.http2,
	};
}

export type ResolvePluginOptionsType = ReturnType<typeof resolvePluginOptions>;
