import { getFakeFilePath, getFakeModule, FAKE_FILE_EXTENSIONS, createLogger } from "../src";
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
		const loggerOutput = createLogger();
		const modules = await getFakeModule(fakeFilePathArr, loggerOutput);
		expect(modules).toMatchInlineSnapshot(`
			[
			  {
			    "url": "/fake-route/fake-js",
			  },
			  {
			    "url": "/fake-route/fake-mjs",
			  },
			  {
			    "url": "/fake-route/fake-ts",
			  },
			]
		`);
	});
});
