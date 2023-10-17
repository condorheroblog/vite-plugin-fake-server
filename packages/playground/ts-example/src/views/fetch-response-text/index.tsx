import { Button } from "#src/components";
import { useState } from "react";

export function FetchResponseText() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("---");

	const fetchData = () => {
		setIsLoading(true);
		fetch(`/mock/response-text`, { method: "get", headers: { "Content-Type": "text/plain" } })
			.then((response) => {
				return response.text();
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
			<code>{text}</code>
			<br />
			<Button disabled={isLoading} onClick={fetchData}>
				fetch response text
			</Button>
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
