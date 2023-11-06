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
				infixName: "fake",
			},
			__dirname,
		).map((filePath) => relative(__dirname, filePath));

		expect(fakeFilePath).toMatchInlineSnapshot(`
			[
			  "fixtures/fake/a.fake.mjs",
			  "fixtures/fake/b.fake.ts",
			  "fixtures/fake/c.fake.js",
			  "fixtures/fake/d.fake.ts",
			  "fixtures/fake/e.fake.cjs",
			  "fixtures/fake/f.fake.cts",
			  "fixtures/fake/g.fake.mts",
			]
		`);
	});

	test(`${getFakeFilePath.name} exclude`, ({ expect }) => {
		const fakeFilePath = getFakeFilePath(
			{
				include: ["./fixtures/fake"],
				exclude: ["./fixtures/fake/[a-b].fake.*"],
				extensions: FAKE_FILE_EXTENSIONS,
				infixName: "fake",
			},
			__dirname,
		).map((filePath) => relative(__dirname, filePath));

		expect(fakeFilePath).toMatchInlineSnapshot(`
			[
			  "fixtures/fake/c.fake.js",
			  "fixtures/fake/d.fake.ts",
			  "fixtures/fake/e.fake.cjs",
			  "fixtures/fake/f.fake.cts",
			  "fixtures/fake/g.fake.mts",
			]
		`);

		const fakeFilePath1 = getFakeFilePath(
			{
				include: ["./fixtures/fake"],
				exclude: ["./fixtures/fake/a.fake.mjs"],
				extensions: FAKE_FILE_EXTENSIONS,
				infixName: "fake",
			},
			__dirname,
		).map((filePath) => relative(__dirname, filePath));

		expect(fakeFilePath1).toMatchInlineSnapshot(`
			[
			  "fixtures/fake/b.fake.ts",
			  "fixtures/fake/c.fake.js",
			  "fixtures/fake/d.fake.ts",
			  "fixtures/fake/e.fake.cjs",
			  "fixtures/fake/f.fake.cts",
			  "fixtures/fake/g.fake.mts",
			]
		`);
	});

	test(`${getFakeFilePath.name} extensions`, ({ expect }) => {
		const fakeFilePath = getFakeFilePath(
			{
				include: ["./fixtures/fake"],
				exclude: ["./fixtures/fake/a.fake.*"],
				extensions: ["ts"],
				infixName: "fake",
			},
			__dirname,
		).map((filePath) => relative(__dirname, filePath));

		expect(fakeFilePath).toMatchInlineSnapshot(`
			[
			  "fixtures/fake/b.fake.ts",
			  "fixtures/fake/d.fake.ts",
			]
		`);
	});
});
