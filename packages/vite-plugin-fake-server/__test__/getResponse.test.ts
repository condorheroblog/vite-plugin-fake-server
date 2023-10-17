import { getResponse, defineFakeRoute } from "../src";
import { URL } from "node:url";
import { pathToRegexp, match } from "path-to-regexp";
import { describe, test } from "vitest";

describe("vite-plugin-fake-server options", () => {
	const fakeData = defineFakeRoute([
		{
			url: "/mock/async-response",
			method: "POST",
			response: () => {
				return { message: "async-response" };
			},
		},
	]);
	const req = { url: "/mock/async-response", method: "POST" };
	const getResponseOptions = {
		req,
		URL,
		fakeModuleList: fakeData,
		pathToRegexp,
		match,
		basename: "",
		defaultTimeout: 0,
		globalResponseHeaders: {},
	};
	test(`vite-plugin-fake-server basename`, async ({ expect }) => {
		const basename = "api";
		const responseResult = await getResponse({
			...getResponseOptions,
			req: { ...req, url: "/api/mock/async-response" },
			basename,
		});

		expect(!!responseResult).toBe(true);
	});

	test(`vite-plugin-fake-server globalResponseHeaders`, async ({ expect }) => {
		const globalResponseHeaders = { a: "foo", b: "bar" };
		const responseResult = await getResponse({
			...getResponseOptions,
			globalResponseHeaders,
		});

		if (responseResult) {
			const responseHeaders = responseResult.responseHeaders;
			expect(responseHeaders.get("a")).toBe("foo");
			expect(responseHeaders.get("b")).toBe("bar");
		}
	});
});

describe("vite-plugin-fake-server response schema", async () => {
	const fakeData = defineFakeRoute([
		{
			url: "/mock/:id",
			method: "POST",
			statusText: "OK",
			headers: { e: "eyes" },
			response: (_) => {
				return _;
			},
		},
	]);
	const req = {
		url: "/mock/1?age=18&weight=50#chapter-10",
		method: "POST",
		headers: { "Content-Type": "application/json" },
	};
	const getResponseOptions = {
		req,
		URL,
		fakeModuleList: fakeData,
		pathToRegexp,
		match,
		basename: "",
		defaultTimeout: 0,
		globalResponseHeaders: {},
	};
	const responseResult = await getResponse(getResponseOptions);

	if (responseResult) {
		test(`http response headers`, ({ expect }) => {
			const responseHeaders = responseResult.responseHeaders;
			expect(responseHeaders.get("e")).toBe("eyes");
		});

		test(`http status code`, async ({ expect }) => {
			const statusCode = responseResult.statusCode;
			expect(statusCode).toBe(200);
		});

		test(`http status text`, async ({ expect }) => {
			const statusText = responseResult.statusText;
			expect(statusText).toBe("OK");
		});

		test(`http timeout`, async ({ expect }) => {
			const timeout = responseResult.timeout;
			expect(timeout).toBe(0);
		});

		test(`request url`, async ({ expect }) => {
			const url = responseResult.url;
			expect(url).toMatchInlineSnapshot('"/mock/1?age=18&weight=50#chapter-10"');
		});

		test(`request query`, async ({ expect }) => {
			const query = responseResult.query;
			expect(query).toMatchInlineSnapshot(`
				{
				  "age": "18",
				  "weight": "50",
				}
			`);
		});

		test(`request params`, async ({ expect }) => {
			const url = responseResult.url;
			expect(url).toMatchInlineSnapshot('"/mock/1?age=18&weight=50#chapter-10"');
		});

		test(`request hash`, async ({ expect }) => {
			const hash = responseResult.hash;
			expect(hash).toMatchInlineSnapshot('"#chapter-10"');
		});

		test(`get serialize url in response`, async ({ expect }) => {
			const { response, url, query, params, hash } = responseResult;
			const fakeResponse = await Promise.resolve(
				response({ url, body: "x", query, params, headers: req.headers, hash }),
			);
			expect(fakeResponse).toMatchInlineSnapshot(`
				{
				  "body": "x",
				  "hash": "#chapter-10",
				  "headers": {
				    "Content-Type": "application/json",
				  },
				  "params": {
				    "id": "1",
				  },
				  "query": {
				    "age": "18",
				    "weight": "50",
				  },
				  "url": "/mock/1?age=18&weight=50#chapter-10",
				}
			`);
		});
	}
});
