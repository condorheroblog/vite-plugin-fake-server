import { defineFakeRoute } from "vite-plugin-fake-server/client";

import response from "@/response";

export default defineFakeRoute([
	{
		url: "/api/hello",
		response: () => {
			return response();
		},
	},
]);
