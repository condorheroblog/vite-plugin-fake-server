import type { Logger } from "../utils";
import { getFakeFilePath } from "./getFakeFilePath";
import { getFakeModule } from "./getFakeModule";
import { resolveOptions } from "./resolveOptions";
import type { FakerSchemaServerOptions } from "./types";

export async function fakerSchemaServer(options: FakerSchemaServerOptions = {}, loggerOutput: Logger) {
	const opts = resolveOptions(options);

	const fakeFilePathArr = getFakeFilePath(opts);
	const fakeData = await getFakeModule(fakeFilePathArr, loggerOutput);
	return fakeData;
}
