import { buildBundler, requireFromString, importFromString } from "import-from-string";
import { readFileSync } from "node:fs";
import { dirname, resolve, extname, basename } from "node:path";

const getPkgType = () => {
	try {
		const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf-8"));
		return pkg.type;
	} catch (error) {}
};

export function guessFormat(inputFile: string) {
	const ext = extname(inputFile);
	const type = getPkgType();
	if (ext === ".js") {
		return type === "module" ? "esm" : "cjs";
	} else if (ext === ".ts" || ext === ".mts" || ext === ".mjs") {
		return "esm";
	}
	return "cjs";
}

/* ===== esbuild begin ===== */

export interface EsbuildBundlerOptions {
	/**
	 * Provide bundle format explicitly
	 * to skip the default format inference
	 */
	format?: "cjs" | "esm";
}

export async function esbuildBundler(filepath: string, options?: EsbuildBundlerOptions) {
	const format = options?.format ?? guessFormat(filepath);
	try {
		const result = await buildBundler({
			entryPoints: [filepath],
			outfile: "out.js",
			write: false,
			platform: "node",
			bundle: true,
			metafile: true,
			format,
		});
		if (result.outputFiles) {
			return {
				code: result.outputFiles[0].text,
				deps: result.metafile?.inputs || {},
			};
		}
	} catch (e) {
		console.error(e);
	}
	return { code: "", deps: {} };
}

/* ===== esbuild end ===== */

export async function moduleFromString(filepath: string, code: string) {
	const format = guessFormat(filepath);
	const isESM = format === "esm";
	if (isESM) {
		return await importFromString(code, {
			filename: basename(filepath),
			dirname: dirname(filepath),
			skipBuild: true,
		});
	} else {
		filepath = resolve(process.cwd(), filepath);
		return requireFromString(code, { filename: basename(filepath), dirname: dirname(filepath) });
	}
}
