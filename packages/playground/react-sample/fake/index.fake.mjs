export default {
	url: "/api/mjs",
	method: "POST",
	response: () => {
		return { format: "ESM" };
	},
};
