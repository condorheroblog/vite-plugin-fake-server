import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
	{
		url: "/mock/hello",
		response: () => {
			return { code: 200, message: "Hello Vue!", timestamp: Date.now() };
		},
	},
]);
