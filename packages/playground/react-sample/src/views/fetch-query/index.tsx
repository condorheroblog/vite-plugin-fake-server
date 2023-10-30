import { Button } from "#src/components";
import { useState } from "react";

export function FetchQuery() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("---");

	const fetchData = () => {
		setIsLoading(true);
		fetch(`/api/esm?timestamp=${Date.now()}`)
			.then((response) => response.json())
			.then((response) => {
				setText(`format: ${response.format}, query: ${response.query?.timestamp}`);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<div>
			<code>{text}</code>
			<br />
			<Button disabled={isLoading} onClick={fetchData}>
				fetch query
			</Button>
		</div>
	);
}

export default {
	code: `
fetch("/api/esm?timestamp=${Date.now()}")
	.then((response) => response.json())
	.then((response) => {});`,
	element: <FetchQuery />,
};
