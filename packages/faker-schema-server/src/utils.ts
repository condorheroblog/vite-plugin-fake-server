import colors from "picocolors";
import { name } from "../package.json";

export function logger(title: string, message: string, type: "info" | "error" = "info") {
	const colorType = type === "info" ? colors.cyan : colors.red;
	return console.log(
		`${colors.dim(new Date().toLocaleTimeString())} ${colorType(`[${name}]`)} ${colorType(title)} ${colorType(
			message,
		)}`,
	);
}
