import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute({
	url: "/mock/nest/:id",
	timeout: 0,
	response: ({ params }) => {
		return {
			...params,
		};
	},
});