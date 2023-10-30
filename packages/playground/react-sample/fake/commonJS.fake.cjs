module.exports = [
	{
		url: "/api/commonJS",
		response: () => {
			console.log(23);
			return { format: "commonJS" };
		},
	},
];
