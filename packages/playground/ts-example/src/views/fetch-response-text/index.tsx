import { useState } from "react";

export function FetchResponseText() {
	const [text, setText] = useState("---");

	const fetchData = () => {
		fetch(`/mock/response-text`, { method: "get", headers: { "Content-Type": "text/plain" } })
			.then((response) => {
				return response.text();
			})
			.then((response) => {
				setText(response);
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
	return response.text();
})
.then((response) => {
	setText(response);
});`,
	element: <FetchResponseText />,
};
