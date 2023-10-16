import { useState } from "react";

export function FetchAsyncResponse() {
	const [text, setText] = useState("---");

	const fetchData = () => {
		fetch("/mock/async-response", { method: "POST" })
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				setText(response.message);
			});
	};
	return (
		<div>
			<code>{text}</code>
			<br />
			<button onClick={fetchData}>fetch async response</button>
		</div>
	);
}

export default {
	code: `
fetch("/mock/async-response", { method: "POST" })
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		setText(response.message);
	});
};`,
	element: <FetchAsyncResponse />,
};
