import { defineFakeRoute } from "vite-plugin-fake-server/client";

import { resultSuccess } from "./utils";

export default defineFakeRoute({
	url: "/response-in-nest-file",
	response: () => {
		return resultSuccess({
			timestamp: Date.now(),
			status: "success",
			code: 200,
			message: "operation successful",
			data: {
				description: "Response in nest file",
			},
		});
	},
});
