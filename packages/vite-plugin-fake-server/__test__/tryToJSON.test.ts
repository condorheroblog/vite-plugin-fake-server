import { tryToJSON } from "../src";
import { describe, test, expectTypeOf } from "vitest";

describe(`${tryToJSON.name}`, () => {
	test(`${tryToJSON.name} - parameters type`, () => {
		expectTypeOf<typeof tryToJSON>().parameters.toEqualTypeOf<[string]>();
	});

	test(`${tryToJSON.name} - object`, ({ expect }) => {
		const result = tryToJSON("{}");
		expect(result).toEqual({});
	});

	test(`${tryToJSON.name} - array`, ({ expect }) => {
		const result = tryToJSON("[]");
		expect(Array.isArray(result)).toBeTruthy();
	});

	test(`${tryToJSON.name} - number`, ({ expect }) => {
		const result = tryToJSON("1");
		expect(result).toBe(1);
	});

	test(`${tryToJSON.name} - boolean`, ({ expect }) => {
		const result = tryToJSON("true");
		expect(result).toBe(true);
	});

	test(`${tryToJSON.name} - undefined`, ({ expect }) => {
		const result = tryToJSON("undefined");
		expect(result).toBe("undefined");
	});

	test(`${tryToJSON.name} - null`, ({ expect }) => {
		const result = tryToJSON("null");
		expect(result).toBe(null);
	});
});
