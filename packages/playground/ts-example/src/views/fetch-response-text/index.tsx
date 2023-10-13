import { useState } from "react";

export function FetchResponseText() {
	const [text, setText] = useState("---");

	const fetchData = () => {
		fetch(`/mock/response-text`, { method: "get", headers: { "Content-Type": "text/plain" } })
			.then((response) => {
				setText(response.headers.get("Content-Type")!);
				return response.text();
			})
			.then((response) => {
				console.log(response);
			});
	};
	return (
		<div>
			<code>{text}</code>
			<br />
			<button onClick={fetchData}>fetch response text</button>
		</div>
	);
}

export default {
	code: `
fetch("/mock/response-text", { method: "get", headers: { "Content-Type": "text/plain" } })
.then((response) => {
	setText(response.headers.get("Content-Type")!);
	return response.text();
})
.then((response) => {
	console.log(response);
});`,
	element: <FetchResponseText />,
};
