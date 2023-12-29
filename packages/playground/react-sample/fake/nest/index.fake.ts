import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute({
	url: "/response-in-nest-file",
	response: () => {
		return {
			timestamp: Date.now(),
			status: "success",
			code: 200,
			message: "operation successful",
			data: {
				description: "Response in nest file",
			},
		};
	},
});
