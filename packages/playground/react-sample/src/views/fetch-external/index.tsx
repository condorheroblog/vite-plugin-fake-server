import { useState } from "react";

import { Button } from "#src/components";

export function FetchExternal() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState({});

	const fetchData = () => {
		setIsLoading(true);
		fetch(`https://my-json-server.typicode.com/typicode/demo/posts`)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				setText(response);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<div>
			<code>{JSON.stringify(text, null, 2)}</code>
			<br />
			<Button disabled={isLoading} onClick={fetchData}>
				fetch external URL
			</Button>
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
