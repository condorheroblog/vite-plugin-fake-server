import { join } from "node:path";

import { normalizePath } from "vite";
import { describe, it } from "vitest";

import { resolveIgnored } from "../src/plugin";

describe(resolveIgnored.name, () => {
	it("ignores include directories", ({ expect }) => {
		const rootDir = "/project";
		const ignored = resolveIgnored(rootDir, ["src/api/modules"], []);

		expect(ignored).toEqual([
			normalizePath(join(rootDir, "src/api/modules/**")),
		]);
	});

	it("preserves user configured ignored patterns", ({ expect }) => {
		const rootDir = "/project";
		const existingIgnored = ["**/.cache/**"];
		const ignored = resolveIgnored(rootDir, ["fake"], [], { ignored: existingIgnored });

		expect(ignored).toEqual([
			normalizePath(join(rootDir, "fake/**")),
			...existingIgnored,
		]);
	});

	it("keeps excluded files visible to Vite watcher", ({ expect }) => {
		const rootDir = "/project";
		const ignored = resolveIgnored(rootDir, ["fake"], ["fake/manual.fake.ts"]);

		expect(ignored).toEqual([
			normalizePath(join(rootDir, "fake/**")),
			`!${normalizePath(join(rootDir, "fake/manual.fake.ts"))}`,
		]);
	});

	it("supports the previous watchOptions-only signature", ({ expect }) => {
		const rootDir = "/project";
		const ignored = resolveIgnored(rootDir, ["fake"], { ignored: "**/node_modules/**" });

		expect(ignored).toEqual([
			normalizePath(join(rootDir, "fake/**")),
			"**/node_modules/**",
		]);
	});
});
