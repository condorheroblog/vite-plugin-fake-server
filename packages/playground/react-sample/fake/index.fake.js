/** @type {import("vite-plugin-fake-server").FakeRouteConfig} */
export default [
	{
		url: "/response-in-js-file",
		timeout: 2000,
		response: () => {
			return {
				// 响应时间戳
				timestamp: Date.now(),
				// 描述 HTTP 响应结果：HTTP 状态响应码在 500-599 之间为 fail，在 400-499 之间为 error，其它均为 success
				status: "success",
				// 包含一个整数类型的 HTTP 响应状态码，也可以是业务描述操作码，比如 200001 表示注册成功
				code: 200,
				// 多语言的响应描述
				message: "operation successful",
				// 实际的响应数据
				data: {
					description: "Response in JS file",
				},
			};
		},
	},
	{
		url: "/response-text",
		response: () => {
			return "I am a paragraph of text";
		},
	},
	{
		url: "/response-number",
		response: () => {
			return Math.random();
		},
	},
	{
		url: "/response-boolean",
		response: () => {
			return Math.random() > 0.5 ? true : false;
		},
	},
	{
		url: "/request-method-is-post",
		method: "POST",
		response: () => {
			return {
				timestamp: Date.now(),
				status: "success",
				code: 200,
				message: "operation successful",
				data: {
					description: "Request method is post",
				},
			};
		},
	},
];
