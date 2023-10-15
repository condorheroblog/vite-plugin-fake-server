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
		response: () => {
			return "I am a paragraph of text";
		},
	},
	{
		url: "/mock/post",
		method: "POST",
		response: ({ body }) => {
			return { ...JSON.parse(body), timestamp: Date.now() };
		},
	},
];
