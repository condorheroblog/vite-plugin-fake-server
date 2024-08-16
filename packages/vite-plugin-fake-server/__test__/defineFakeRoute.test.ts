import { describe, it } from "vitest";

import { defineFakeRoute } from "../src";

describe(defineFakeRoute.name, () => {
	it(`${defineFakeRoute.name} option is a object`, ({ expect }) => {
		const userConfig = defineFakeRoute({ url: "/api/user" });
		expect(userConfig).toMatchInlineSnapshot(`
			{
			  "url": "/api/user",
			}
		`);
	});

	it(`${defineFakeRoute.name} option is a array`, ({ expect }) => {
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
