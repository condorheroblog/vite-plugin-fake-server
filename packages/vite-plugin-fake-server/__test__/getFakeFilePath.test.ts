import { getFakeFilePath, FAKE_FILE_EXTENSIONS } from "../src";
import { relative } from "node:path";
import { describe, test } from "vitest";

describe(`${getFakeFilePath.name}`, () => {
	test(`${getFakeFilePath.name} include`, ({ expect }) => {
		const fakeFilePath = getFakeFilePath(
			{
				include: ["./fixtures/fake"],
				exclude: [],
				extensions: FAKE_FILE_EXTENSIONS,
			},
			__dirname,
		).map((filePath) => relative(__dirname, filePath));

		expect(fakeFilePath).toMatchInlineSnapshot(`
			[
			  "fixtures/fake/extra.ts",
			  "fixtures/fake/mock.js",
			  "fixtures/fake/mock.mjs",
			  "fixtures/fake/mock.ts",
			]
		`);
	});

	test(`${getFakeFilePath.name} exclude`, ({ expect }) => {
		const fakeFilePath = getFakeFilePath(
			{
				include: ["./fixtures/fake"],
				exclude: ["./fixtures/fake/extra.ts"],
				extensions: FAKE_FILE_EXTENSIONS,
			},
			__dirname,
		).map((filePath) => relative(__dirname, filePath));

		expect(fakeFilePath).toMatchInlineSnapshot(`
			[
			  "fixtures/fake/mock.js",
			  "fixtures/fake/mock.mjs",
			  "fixtures/fake/mock.ts",
			]
		`);
	});

	test(`${getFakeFilePath.name} extensions`, ({ expect }) => {
		const fakeFilePath = getFakeFilePath(
			{
				include: ["./fixtures/fake"],
				exclude: ["./fixtures/fake/extra.ts"],
				extensions: ["ts"],
			},
			__dirname,
		).map((filePath) => relative(__dirname, filePath));

		expect(fakeFilePath).toMatchInlineSnapshot(`
			[
			  "fixtures/fake/mock.ts",
			]
		`);
	});
});
