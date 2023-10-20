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
		url: "/mock/response-number",
		response: () => {
			return Math.random();
		},
	},
	{
		url: "/mock/response-boolean",
		response: () => {
			return Math.random() > 0.5 ? true : false;
		},
	},
	{
		url: "/mock/post",
		method: "POST",
		response: ({ body }) => {
			return { ...body, timestamp: Date.now() };
		},
	},
];
