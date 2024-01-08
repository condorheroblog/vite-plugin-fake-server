import { describe, test } from "vitest";

import { parallelLoader } from "../src";

describe(parallelLoader.name, () => {
	test(`should be return empty array`, async ({ expect }) => {
		await expect(parallelLoader([], 10)).resolves.toEqual([]);
	});

	test(`work with promise`, async ({ expect }) => {
		await expect(parallelLoader([() => Promise.resolve([1, 2])], 10)).resolves.toEqual([1, 2]);
	});

	test(`work without promise`, async ({ expect }) => {
		await expect(parallelLoader([() => 1], 10)).resolves.toEqual([1]);
	});
});
