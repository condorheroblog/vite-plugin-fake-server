import { useState } from "react";

export function FetchCommonJS() {
	const [text, setText] = useState("---");

	const fetchData = () => {
		fetch("/mock/commonJS")
			.then((response) => response.json())
			.then((response) => {
				setText(`format: ${response.format}`);
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
fetch("/mock/commonJS")
.then((response) => response.json())
.then((response) => {});`,
	element: <FetchCommonJS />,
};
