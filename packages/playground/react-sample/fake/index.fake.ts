import { faker } from "@faker-js/faker/locale/zh_CN";
import Mock from "mockjs";
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
	{
		url: "/response-in-ts-file",
		timeout: 2000,
		response: () => {
			return {
				timestamp: Date.now(),
				status: "success",
				code: 200,
				message: "operation successful",
				data: {
					description: "Response in TS file",
				},
			};
		},
	},
	{
		url: "/response-xml",
		method: "POST",
		response: () => {
			const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?><root id="xml-root"><timestamp>响应时间：${new Date().toLocaleString()}</timestamp><data>响应内容：Hello XML</data><words>${faker.word.words(
				5,
			)}</words></root>`;
			return xmlResponse;
		},
	},
	{
		url: "/request-status-is-404",
		method: "POST",
		statusCode: 404,
		statusText: "Not Found",
		response: () => {
			return { timestamp: Date.now(), status: "error", code: 404, message: "Not Found" };
		},
	},
	{
		url: "/lowercase-headers-key",
		method: "GET",
		response: ({ headers }) => {
			return { timestamp: Date.now(), ...headers };
		},
	},
	{
		url: "/response-is-async",
		method: "POST",
		response: async () => {
			return {
				timestamp: Date.now(),
				status: "success",
				code: 200,
				message: "operation successful",
				data: {
					description: "Response is Async",
				},
			};
		},
	},
	{
		url: "/custom-response-header",
		method: "DELETE",
		headers: {
			"show-header": "true",
			"access-control-allow-credentials": "true",
			"access-control-allow-origin": "https://developer.mozilla.org/",
		},
		response: async () => {
			return {
				timestamp: Date.now(),
				status: "success",
				code: 200,
				message: "operation successful",
				data: {
					description: "Custom response header",
				},
			};
		},
	},
	{
		url: "/delay-response-for-5s",
		timeout: 1000 * 5,
		method: "PUT",
		response: async () => {
			return {
				timestamp: Date.now(),
				status: "success",
				code: 200,
				message: "operation successful",
				data: {
					description: "Delay response for 5s",
				},
			};
		},
	},
	{
		url: "/response-in-mock",
		response: () => {
			return Mock.mock({
				id: "@guid",
				username: "@first",
				email: "@email",
				avatar: '@image("200x200")',
				role: "admin",
			});
		},
	},
	{
		url: "/response-in-faker",
		response: () => {
			return {
				id: faker.string.uuid(),
				avatar: faker.image.avatar(),
				birthday: faker.date.birthdate(),
				email: faker.internet.email(),
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				sex: faker.person.sexType(),
				role: "admin",
			};
		},
	},
	{
		url: "/custom-response-status-text",
		statusText: "*_*",
		response: async () => {
			return {
				timestamp: Date.now(),
				status: "success",
				code: 200,
				message: "operation successful",
				data: {
					description: "Custom response status text",
				},
			};
		},
	},
	{
		url: "/user/:id",
		response: ({ params }) => {
			return {
				params: params,
			};
		},
	},
	{
		url: "/get-payload",
		response: (processedRequest) => {
			return processedRequest;
		},
	},
	{
		url: "/post-payload",
		method: "post",
		response: (processedRequest) => {
			return processedRequest;
		},
	},
	{
		url: "/use-raw-response",
		rawResponse: async (_, res) => {
			const body = JSON.stringify({ hello: "(G)I-DLE" });
			res.end(body);
		},
	},
]);
