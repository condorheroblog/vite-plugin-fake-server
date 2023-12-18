import { describe, test } from "vitest";

import { isFunction } from "../src";

describe(isFunction.name, () => {
	test(`should be return true`, ({ expect }) => {
		expect(isFunction(() => {})).toBe(true);
	});

	test(`should be return false`, ({ expect }) => {
		expect(isFunction({})).toBe(false);
	});
});
