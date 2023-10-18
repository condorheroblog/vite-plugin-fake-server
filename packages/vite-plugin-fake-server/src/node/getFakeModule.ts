import { resolveModule } from "./resolveModule";
import { loggerOutput } from "./utils";

export async function getFakeModule(filePaths: string[]) {
	const ret = [];

	for (const absoluteFilePath of filePaths) {
		try {
			const resolvedModule = await resolveModule(absoluteFilePath);
			if (Array.isArray(resolvedModule)) {
				ret.push(...resolvedModule);
			} else {
				ret.push(resolvedModule);
			}
		} catch (error) {
			loggerOutput(`load module error`, error as string, "error");
		}
	}

	return ret;
}
