import type { FakerSchemaServerOptions } from "./types";
import { resolveOptions } from "./resolveOptions";
import { getFakeConfig } from "./getFakeConfig";

export async function fakerSchemaServer(options: FakerSchemaServerOptions = {}) {
	const opts = resolveOptions(options);
	const fakeData = await getFakeConfig(opts);
	return fakeData;
}
