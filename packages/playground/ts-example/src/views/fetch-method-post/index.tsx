import { useState } from "react";

export function FetchMethodPost() {
	const [text, setText] = useState("---");

	const fetchData = () => {
		fetch("/mock/mjs", { method: "POST" })
			.then((response) => response.json())
			.then((response) => {
				setText(response.format);
			});
	};
	return (
		<div>
			<code>{text}</code>
			<br />
			<button onClick={fetchData}>fetch a post</button>
		</div>
	);
}

export default {
	code: `
fetch("/mock/mjs", { method: "POST" })
.then((response) => response.json())
.then((response) => {
	setText(response.format);
});`,
	element: <FetchMethodPost />,
};
