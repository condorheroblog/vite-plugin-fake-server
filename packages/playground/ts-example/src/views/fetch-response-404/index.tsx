import { Button } from "#src/components";
import { useState } from "react";

export function FetchResponse404() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState({});

	const fetchData = () => {
		setIsLoading(true);
		fetch("/mock/404", { method: "POST" })
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				console.log(response);
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
				fetch response 404
			</Button>
		</div>
	);
}

export default {
	code: `
fetch("/mock/404", { method: "POST" })
.then((response) => {
	return response.json();
})
.then((response) => {
	setText(response);
});
};`,
	element: <FetchResponse404 />,
};
