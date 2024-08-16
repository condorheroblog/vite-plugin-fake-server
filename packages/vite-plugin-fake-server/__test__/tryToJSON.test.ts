import { describe, expectTypeOf, it } from "vitest";

import { tryToJSON } from "../src";

describe(`${tryToJSON.name}`, () => {
	it(`${tryToJSON.name} - parameters type`, () => {
		expectTypeOf<typeof tryToJSON>().parameters.toEqualTypeOf<[string]>();
	});

	it(`${tryToJSON.name} - object`, ({ expect }) => {
		const result = tryToJSON("{}");
		expect(result).toEqual({});
	});

	it(`${tryToJSON.name} - array`, ({ expect }) => {
		const result = tryToJSON("[]");
		expect(Array.isArray(result)).toBeTruthy();
	});

	it(`${tryToJSON.name} - number`, ({ expect }) => {
		const result = tryToJSON("1");
		expect(result).toBe(1);
	});

	it(`${tryToJSON.name} - boolean`, ({ expect }) => {
		const result = tryToJSON("true");
		expect(result).toBe(true);
	});

	it(`${tryToJSON.name} - undefined`, ({ expect }) => {
		const result = tryToJSON("undefined");
		expect(result).toBe("undefined");
	});

	it(`${tryToJSON.name} - null`, ({ expect }) => {
		const result = tryToJSON("null");
		expect(result).toBe(null);
	});
});
