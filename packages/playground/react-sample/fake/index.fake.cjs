const { defineFakeRoute } = require("vite-plugin-fake-server/client");

exports.default = defineFakeRoute({
	url: "/response-in-cjs-file",
	timeout: 2000,
	response: () => {
		return {
			timestamp: Date.now(),
			status: "success",
			code: 200,
			message: "operation successful",
			data: {
				description: "Response in cjs file",
			},
		};
	},
});
