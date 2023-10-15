import { defineFakeRoute } from "../src";
import { describe, test } from "vitest";

describe(defineFakeRoute.name, () => {
	test(`${defineFakeRoute.name} option is a object`, ({ expect }) => {
		const userConfig = defineFakeRoute({ url: "/mock/user" });
		expect(userConfig).toMatchInlineSnapshot(`
			{
			  "url": "/mock/user",
			}
		`);
	});

	test(`${defineFakeRoute.name} option is a array`, ({ expect }) => {
		const userConfig = defineFakeRoute([{ url: "/mock/user" }]);
		expect(userConfig).toMatchInlineSnapshot(`
			[
			  {
			    "url": "/mock/user",
			  },
			]
		`);
	});
});
