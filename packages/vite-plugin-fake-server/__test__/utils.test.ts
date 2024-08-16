import { describe, it } from "vitest";

import { isFunction } from "../src";

describe(isFunction.name, () => {
	it("should be return true", ({ expect }) => {
		expect(isFunction(() => {})).toBe(true);
	});

	it("should be return false", ({ expect }) => {
		expect(isFunction({})).toBe(false);
	});
});
