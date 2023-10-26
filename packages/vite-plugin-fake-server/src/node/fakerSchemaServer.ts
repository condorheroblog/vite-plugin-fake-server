import type { Logger } from "../utils";
import { getFakeFilePath } from "./getFakeFilePath";
import { getFakeModule } from "./getFakeModule";
import { resolveOptions } from "./resolveOptions";
import type { FakerSchemaServerOptions } from "./types";

export async function fakerSchemaServer(options: FakerSchemaServerOptions = {}, loggerOutput: Logger, root?: string) {
	const opts = resolveOptions(options);

	const fakeFilePathArr = getFakeFilePath(opts, root);
	const fakeData = await getFakeModule(fakeFilePathArr, loggerOutput);
	return fakeData;
}
