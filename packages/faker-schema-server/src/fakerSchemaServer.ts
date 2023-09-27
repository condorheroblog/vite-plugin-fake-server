import type { FakerSchemaServerOptions } from "./types";
import { resolveOptions } from "./resolveOptions";
import { getFakeConfig } from "./getFakeConfig";

export async function fakerSchemaServer(options: FakerSchemaServerOptions = {}) {
	const opts = resolveOptions(options);
	return await getFakeConfig(opts);
}
