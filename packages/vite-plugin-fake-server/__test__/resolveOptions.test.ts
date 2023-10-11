import { resolveOptions } from "..";
import { describe, test } from "vitest";

describe(resolveOptions.name, () => {
	test(`${resolveOptions.name} options`, ({ expect }) => {
		const options = resolveOptions();
		expect(options).toMatchInlineSnapshot(`
			{
			  "exclude": [],
			  "include": [
			    "mock",
			  ],
			}
		`);
	});
});
