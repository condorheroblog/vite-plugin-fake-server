import { Button } from "#src/components";
import { useState } from "react";

export function FetchMethodPost() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("---");

	const fetchData = () => {
		setIsLoading(true);
		fetch("/mock/mjs", { method: "POST" })
			.then((response) => response.json())
			.then((response) => {
				setText(response.format);
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
				fetch a post
			</Button>
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
