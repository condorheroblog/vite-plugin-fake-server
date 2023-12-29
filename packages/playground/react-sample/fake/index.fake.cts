module.exports = {
	url: "/response-in-cts-file",
	timeout: 2000,
	response: () => {
		return {
			timestamp: Date.now(),
			status: "success",
			code: 200,
			message: "operation successful",
			data: {
				description: "Response in cts file",
			},
		};
	},
};
