import { defineFakeRoute } from "vite-plugin-fake-server/client";

import { resultSuccess } from "./nest/utils";

export default defineFakeRoute({
	url: "/sync-request",
	/**
	 * The sleep function for synchronous requests will block the browser's rendering.
	 * When making a synchronous request, it is recommended to set the delay to 0.
	 */
	timeout: 0,
	response: () => {
		return resultSuccess({
			timestamp: Date.now(),
			status: "success",
			code: 200,
			message: "ok",
			data: {
				description: `
				The sleep function for synchronous requests will block the browser's rendering.
				When making a synchronous request, it is recommended to set the delay to 0.
				`,
			},
		});
	},
});
