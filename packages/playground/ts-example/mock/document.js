/** @type {import("vite-plugin-fake-server").FakeRouteConfig} */
export default {
	url: "/mock/xml",
	method: "POST",
	response: ({ body, rawBody }) => {
		console.log(body, rawBody);
		const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?><root><body>${body}</body><rawBody>${rawBody}</rawBody></root>`;
		return xmlResponse;
	},
};
