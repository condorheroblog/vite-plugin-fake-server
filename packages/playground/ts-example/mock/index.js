/** @type {import("vite-plugin-fake-server").FakeRouteConfig} */
export default [
	{
		url: "/mock/esm",
		response: ({ query }) => {
			return { format: "ESM", query };
		},
	},
	{
		url: "/mock/response-text",
		response: (_, req) => {
			return req.headers["content-type"];
		},
	},
	{
		url: "/mock/post",
		method: "POST",
		response: ({ body }) => {
			return body;
		},
	},
];
