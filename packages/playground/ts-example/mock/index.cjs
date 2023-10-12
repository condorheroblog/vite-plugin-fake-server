const { defineFakeRoute } = require("vite-plugin-fake-server/client");

exports.default = defineFakeRoute({
	url: "/mock/cjs",
	method: "POST",
	response: () => {
		return { format: "CJS" };
	},
});
