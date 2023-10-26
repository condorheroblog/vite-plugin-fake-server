module.exports = [
	{
		url: "/mock/commonJS",
		response: () => {
			console.log(23);
			return { format: "commonJS" };
		},
	},
];
