import { loggerOutput } from "../utils";
import { resolveModule } from "./resolveModule";
import colors from "picocolors";

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
			loggerOutput.error(colors.red(`failed to load module from ${absoluteFilePath}`), {
				error: error as Error,
				timestamp: true,
			});
		}
	}

	return ret;
}
