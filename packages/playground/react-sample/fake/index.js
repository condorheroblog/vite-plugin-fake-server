/** @type {import("vite-plugin-fake-server").FakeRouteConfig} */
export default [
	{
		url: "/api/esm",
		response: ({ query }) => {
			return { format: "ESM", query };
		},
	},
	{
		url: "/api/response-text",
		response: () => {
			return "I am a paragraph of text";
		},
	},
	{
		url: "/api/response-number",
		response: () => {
			return Math.random();
		},
	},
	{
		url: "/api/response-boolean",
		response: () => {
			return Math.random() > 0.5 ? true : false;
		},
	},
	{
		url: "/api/post",
		method: "POST",
		response: ({ body }) => {
			return { ...body, timestamp: Date.now() };
		},
	},
];
