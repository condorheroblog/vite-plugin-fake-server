/** @type {import("vite-plugin-fake-server").FakeRouteConfig} */
export default {
	url: "/api/xml",
	method: "POST",
	response: ({ body, rawBody }) => {
		const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?><root><body>${body}</body><rawBody>${rawBody}</rawBody></root>`;
		return xmlResponse;
	},
};
