import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
	{
		url: "/hello",
		method: "POST",
		response: ({ body }) => {
			return { message: `request method is ${body.method}`, timestamp: Date.now() };
		},
	},
]);
