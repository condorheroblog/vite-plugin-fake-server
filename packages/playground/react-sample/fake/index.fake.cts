// https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#new-file-extensions
// https://twitter.com/atcb/status/1528501621025406976
// `.cts` 使用的是 ESM 模块而不是 CommonJS 模块

export default {
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
