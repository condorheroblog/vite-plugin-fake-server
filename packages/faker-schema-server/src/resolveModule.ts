import { bundleRequire } from "bundle-require";

export async function resolveModule(filepath: string) {
	let { mod } = await bundleRequire({
		filepath,
	});
	mod = mod.default || mod;

	return mod;
}
