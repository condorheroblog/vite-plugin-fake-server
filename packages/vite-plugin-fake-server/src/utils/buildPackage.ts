import { createRequire } from "node:module";
import { build } from "esbuild";

const require = createRequire(import.meta.url);

export async function buildPackage(packageName: string) {
	const camelCasePackageName = packageName.replace(/-\w/g, str => str[1].toUpperCase());
	const result = await build({
		entryPoints: [require.resolve(packageName)],
		bundle: true,
		write: false,
		format: "iife",
		globalName: camelCasePackageName,
		minify: false,
	});
	const code = result.outputFiles[0].text;
	return `window.__VITE__PLUGIN__FAKE__SERVER__.${camelCasePackageName} = (function() { ${code} return ${camelCasePackageName}; })();`;
}
