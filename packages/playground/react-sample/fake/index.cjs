const { defineFakeRoute } = require("vite-plugin-fake-server/client");

exports.default = defineFakeRoute({
	url: "/api/cjs",
	method: "POST",
	response: () => {
		return { format: "CJS" };
	},
});
