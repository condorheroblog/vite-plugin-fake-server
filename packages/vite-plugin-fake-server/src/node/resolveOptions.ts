import type { FakerSchemaServerOptions } from "./types";
import { FAKE_FILE_EXTENSIONS, INFIX_NAME } from "./constants";

export function resolveOptions(options: FakerSchemaServerOptions = {}) {
	options.include ??= [INFIX_NAME];
	const include = Array.isArray(options.include) ? options.include : [options.include];
	if (include.length === 0) {
		throw new Error("Invalid include option");
	}
	options.exclude ??= [];
	const exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude];

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
		exclude,
		infixName,
		extensions: options.extensions || FAKE_FILE_EXTENSIONS,
	} as const;
}

export type ResolveOptionsType = ReturnType<typeof resolveOptions>;
