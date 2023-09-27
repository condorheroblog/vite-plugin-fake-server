import type { FakerSchemaServerOptions } from "./types";
import { resolveOptions } from "./resolveOptions";
import { getFakeConfig } from "./getFakeConfig";
import { createWatcher } from "./createWatcher";
import { logger } from "./utils";

export async function fakerSchemaServer(options: FakerSchemaServerOptions = {}) {
	const opts = resolveOptions(options);
	let fakeData = await getFakeConfig(opts);
	const watcher = createWatcher(opts);
	if (watcher) {
		watcher.on("all", async (event, file) => {
			opts.logger && logger(`fake file ${event}`, file);
			fakeData = await getFakeConfig(opts);
		});
	}
	return fakeData;
}
