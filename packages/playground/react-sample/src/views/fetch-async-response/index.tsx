import { Button } from "#src/components";
import { useState } from "react";

export function FetchAsyncResponse() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("---");

	const fetchData = () => {
		setIsLoading(true);
		fetch("/mock/async-response", { method: "POST" })
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				setText(response.message);
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
				fetch async response
			</Button>
		</div>
	);
}

export default {
	code: `
fetch("/mock/async-response", { method: "POST" })
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		setText(response.message);
	});
};`,
	element: <FetchAsyncResponse />,
};
