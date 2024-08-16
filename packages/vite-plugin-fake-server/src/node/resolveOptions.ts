import { FAKE_FILE_EXTENSIONS, INFIX_NAME } from "./constants";
import type { FakerSchemaServerOptions } from "./types";

export function resolveOptions(options: FakerSchemaServerOptions = {}) {
	const include = options.include ?? [INFIX_NAME];
	if (!Array.isArray(include) || include.length === 0) {
		throw new Error("Invalid include option");
	}

	let infixName: false | string;

	if (typeof options.infixName === "boolean") {
		if (options.infixName) {
			infixName = INFIX_NAME;
		}
		else {
			infixName = false;
		}
	}
	else if (typeof options.infixName === "string") {
		if (options.infixName.length === 0) {
			infixName = false;
		}
		else {
			infixName = options.infixName;
		}
	}
	else {
		infixName = INFIX_NAME;
	}

	return {
		include,
		exclude: options.exclude || [],
		infixName,
		extensions: options.extensions || FAKE_FILE_EXTENSIONS,
	} as const;
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
