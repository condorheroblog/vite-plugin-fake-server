import { useState } from "react";

export function FetchQuery() {
	const [text, setText] = useState("---");

	const fetchData = () => {
		fetch(`/mock/esm?timestamp=${Date.now()}`)
			.then((response) => response.json())
			.then((response) => {
				setText(`format: ${response.format}, query: ${response.query?.timestamp}`);
			});
	};
	return (
		<div>
			<code>{text}</code>
			<br />
			<button onClick={fetchData}>fetch query</button>
		</div>
	);
}

export default {
	code: `
fetch("/mock/esm?timestamp=${Date.now()}")
	.then((response) => response.json())
	.then((response) => {});`,
	element: <FetchQuery />,
};
