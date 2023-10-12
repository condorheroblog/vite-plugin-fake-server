import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute({
	url: "/mock/nest/:id",
	response: ({ params }) => {
		return {
			...params,
		};
	},
});
