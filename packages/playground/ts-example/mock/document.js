/** @type {import("vite-plugin-fake-server").FakeRouteConfig} */
export default {
	url: "/mock/xml",
	method: "POST",
	response: ({ body }) => {
		const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?><message>${body}</message>`;
		return xmlResponse;
	},
};
