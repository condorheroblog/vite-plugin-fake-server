import { describe, it } from "vitest";

import { parallelLoader } from "../src";

describe(parallelLoader.name, () => {
	it("should be return empty array", async ({ expect }) => {
		await expect(parallelLoader([], 10)).resolves.toEqual([]);
	});

	it("work with promise", async ({ expect }) => {
		await expect(parallelLoader([() => Promise.resolve([1, 2])], 10)).resolves.toEqual([1, 2]);
	});

	it("work without promise", async ({ expect }) => {
		await expect(parallelLoader([() => 1], 10)).resolves.toEqual([1]);
	});
});
