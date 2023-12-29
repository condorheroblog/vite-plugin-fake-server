export default {
	url: "/response-in-mts-file",
	response: () => {
		return {
			timestamp: Date.now(),
			status: "success",
			code: 200,
			message: "operation successful",
			data: {
				description: "Response in mts file",
			},
		};
	},
};
