import { describe, test } from "vitest";

import { defineFakeRoute } from "../src";

describe(defineFakeRoute.name, () => {
	test(`${defineFakeRoute.name} option is a object`, ({ expect }) => {
		const userConfig = defineFakeRoute({ url: "/api/user" });
		expect(userConfig).toMatchInlineSnapshot(`
			{
			  "url": "/api/user",
			}
		`);
	});

	test(`${defineFakeRoute.name} option is a array`, ({ expect }) => {
		const userConfig = defineFakeRoute([{ url: "/api/user" }]);
		expect(userConfig).toMatchInlineSnapshot(`
			[
			  {
			    "url": "/api/user",
			  },
			]
		`);
	});
});
