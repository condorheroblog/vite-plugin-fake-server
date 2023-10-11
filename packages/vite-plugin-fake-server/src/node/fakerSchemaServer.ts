import { getFakeConfig } from "./getFakeConfig";
import { resolveOptions } from "./resolveOptions";
import type { FakerSchemaServerOptions } from "./types";

export async function fakerSchemaServer(options: FakerSchemaServerOptions = {}) {
	const opts = resolveOptions(options);
	const fakeData = await getFakeConfig(opts);
	return fakeData;
}
