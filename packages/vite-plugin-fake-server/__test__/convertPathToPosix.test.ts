import { platform } from "node:os";

import { describe, it } from "vitest";

import { convertPathToPosix } from "../src";

describe(`${convertPathToPosix.name}`, () => {
	it(`${convertPathToPosix.name} - Posix Style`, ({ expect }) => {
		const posix = "/user/react/**/*.ts";
		const windows = "/user/react/**/*.ts";
		const expected = platform() === "win32" ? windows : posix;

		const actual = convertPathToPosix("/user/react/**/*.ts");

		expect(actual).toStrictEqual(expected);
	});

	it(`${convertPathToPosix.name} - Windows Style`, ({ expect }) => {
		const posix = "C:\\Program Files (x86)\\**\\*";
		const windows = "C:/Program Files (x86)/**/*";
		const expected = platform() === "win32" ? windows : posix;

		const actual = convertPathToPosix("C:\\Program Files (x86)\\**\\*");

		expect(actual).toStrictEqual(expected);
	});
});
