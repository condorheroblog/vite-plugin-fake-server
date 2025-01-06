import response from "@/response";

import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
	{
		url: "/api/hello",
		response: () => {
			return response();
		},
	},
]);
