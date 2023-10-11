import colors from "picocolors";
import { name } from "../../package.json";

export function loggerOutput(title: string, message: string, type: "info" | "error" = "info") {
	const colorType = type === "info" ? colors.cyan : colors.red;
	return console.log(
		`${colors.dim(new Date().toLocaleTimeString())} ${colorType(`[${name}]`)} ${colorType(title)} ${colorType(
			message,
		)}`,
	);
}

export function isFunction(fn: unknown) {
	return typeof fn === "function";
}
