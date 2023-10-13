import { useState } from "react";

export function FetchExternal() {
	const [text, setText] = useState({});

	const fetchData = () => {
		fetch(`https://my-json-server.typicode.com/typicode/demo/posts`)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				setText(response);
			});
	};
	return (
		<div>
			<code>{JSON.stringify(text, null, 2)}</code>
			<br />
			<button onClick={fetchData}>fetch external URL</button>
		</div>
	);
}

export default {
	code: `
fetch("https://my-json-server.typicode.com/typicode/demo/posts")
.then((response) => {
	return response.json();
})
.then((response) => {
	setText(response);
});`,
	element: <FetchExternal />,
};
