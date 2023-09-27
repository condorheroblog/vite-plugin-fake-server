import { bundleRequire } from "bundle-require";

export async function resolveModule(filepath: string) {
	const { mod } = await bundleRequire({
		filepath,
	});
	return mod.default || mod;
}
