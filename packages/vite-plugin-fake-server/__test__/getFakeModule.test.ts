import { getFakeFilePath, getFakeModule, FAKE_FILE_EXTENSIONS } from "../src";
import { describe, test } from "vitest";

describe(`${getFakeModule.name}`, () => {
	const fakeFilePathArr = getFakeFilePath(
		{
			include: ["./fixtures/fake"],
			exclude: ["./fixtures/fake/extra.ts"],
			extensions: FAKE_FILE_EXTENSIONS,
		},
		__dirname,
	);

	test(`${getFakeModule.name} get modules`, async ({ expect }) => {
		const modules = await getFakeModule(fakeFilePathArr);
		expect(modules).toMatchInlineSnapshot(`
			[
			  {
			    "url": "/fake-route/mock-js",
			  },
			  {
			    "url": "/fake-route/mock-mjs",
			  },
			  {
			    "url": "/fake-route/mock-ts",
			  },
			]
		`);
	});
});
