import { match } from "path-to-regexp";
import { describe, expect, it } from "vitest";

import { defineFakeRoute, simulateServerResponse } from "../src";

describe("vite-plugin-fake-server URL Simulation", () => {
	it("disable URL Encoding Test", async ({ expect }) => {
		const responseResult = await simulateServerResponse(
			{ url: "/prefix-root/api/你好", method: "POST" },
			[
				{
					url: "/api/你好",
					method: "POST",
				},
			],
			{
				match,
				basename: "prefix-root",
				defaultTimeout: 0,
				globalResponseHeaders: {},
			},
		);

		expect(!!responseResult).toBe(true);
	});

	it("enable URL Encoding Test", async ({ expect }) => {
		const responseResult = await simulateServerResponse(
			{ url: "/prefix-root/api/%E4%BD%A0%E5%A5%BD", method: "POST" },
			[
				{
					url: "/api/你好",
					method: "POST",
				},
			],
			{
				match,
				basename: "prefix-root",
				defaultTimeout: 0,
				globalResponseHeaders: {},
			},
		);

		expect(!!responseResult).toBe(true);
	});
});

describe("vite-plugin-fake-server options", () => {
	it("vite-plugin-fake-server basename", async ({ expect }) => {
		const responseResult = await simulateServerResponse(
			{ url: "/prefix-root/api/basename", method: "POST" },
			[
				{
					url: "/api/basename",
					method: "POST",
				},
			],
			{
				match,
				basename: "prefix-root",
				defaultTimeout: 0,
				globalResponseHeaders: {},
			},
		);

		expect(!!responseResult).toBe(true);
	});

	it.each([
		["/prefix-root/", "/dynamic-route/:id"],
		["/prefix-root", "/dynamic-route/:id"],
		["prefix-root/", "/dynamic-route/:id"],
		["/prefix-root/", "dynamic-route/:id"],
		["/prefix-root", "dynamic-route/:id"],
		["prefix-root/", "dynamic-route/:id"],
	])("basename(%s) + fake URL(%s) is match request url", async (a, b) => {
		const responseResult = await simulateServerResponse(
			{ url: "/prefix-root/dynamic-route/icu" },
			[
				{
					url: b,
					response: () => {
						return {};
					},
				},
			],
			{
				match,
				basename: a,
				defaultTimeout: 0,
				globalResponseHeaders: {},
			},
		);
		expect(!!responseResult).toBeTruthy();
		expect(responseResult?.params).toMatchObject({ id: "icu" });
	});

	it("vite-plugin-fake-server basename with response params", async ({ expect }) => {
		const basename = "prefix-root";
		const responseResult = await simulateServerResponse(
			{ url: `${basename}/dynamic-route/996` },
			[
				{
					url: "/dynamic-route/:id",
					response: () => {
						return { message: "async-response" };
					},
				},
			],
			{
				match,
				basename,
				defaultTimeout: 0,
				globalResponseHeaders: {},
			},
		);

		expect(responseResult?.params).toMatchObject({
			id: "996",
		});
	});

	it("vite-plugin-fake-server globalResponseHeaders", async ({ expect }) => {
		const globalResponseHeaders = { a: "foo", b: "bar" };
		const responseResult = await simulateServerResponse(
			{ url: "/api/global-response-headers", method: "POST" },
			[
				{
					url: "/api/global-response-headers",
					method: "POST",
				},
			],
			{
				match,
				basename: "",
				defaultTimeout: 0,
				globalResponseHeaders,
			},
		);

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
			url: "/api/:id",
			method: "POST",
			statusText: "OK",
			headers: { e: "eyes" },
			response: (_) => {
				return _;
			},
		},
	]);
	const req = {
		url: "/api/1?age=18&weight=50#chapter-10",
		method: "POST",
		headers: { "Content-Type": "application/json" },
	};
	const simulateServerResponseOptions = {
		match,
		basename: "",
		defaultTimeout: 0,
		globalResponseHeaders: {},
	};
	const responseResult = await simulateServerResponse(
		req,
		Array.isArray(fakeData) ? fakeData : [fakeData],
		simulateServerResponseOptions,
	);

	if (responseResult) {
		it("http response headers", ({ expect }) => {
			const responseHeaders = responseResult.responseHeaders;
			expect(responseHeaders.get("e")).toBe("eyes");
		});

		it("http status code", async ({ expect }) => {
			const statusCode = responseResult.statusCode;
			expect(statusCode).toBe(200);
		});

		it("http status text", async ({ expect }) => {
			const statusText = responseResult.statusText;
			expect(statusText).toBe("OK");
		});

		it("http timeout", async ({ expect }) => {
			const timeout = responseResult.timeout;
			expect(timeout).toBe(0);
		});

		it("request url", async ({ expect }) => {
			const url = responseResult.url;
			expect(url).toMatchInlineSnapshot("\"/api/1?age=18&weight=50#chapter-10\"");
		});

		it("request query", async ({ expect }) => {
			const query = responseResult.query;
			expect(query).toMatchInlineSnapshot(`
				{
				  "age": "18",
				  "weight": "50",
				}
			`);
		});

		it("request params", async ({ expect }) => {
			const url = responseResult.url;
			expect(url).toMatchInlineSnapshot("\"/api/1?age=18&weight=50#chapter-10\"");
		});

		it("get serialize url in response", async ({ expect }) => {
			const { response, url, query, params } = responseResult;
			const fakeResponse = await Promise.resolve(
				response?.({
					url,
					// @ts-expect-error body
					body: "x",
					query,
					params,
					headers: req.headers,
				}, {}, {}),
			);
			expect(fakeResponse).toMatchInlineSnapshot(`
				{
				  "body": "x",
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
				  "url": "/api/1?age=18&weight=50#chapter-10",
				}
			`);
		});
	}
});
