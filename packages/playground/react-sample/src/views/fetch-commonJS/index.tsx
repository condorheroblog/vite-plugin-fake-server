import { useState } from "react";

import { Button } from "#src/components";

export function FetchCommonJS() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("---");

	const fetchData = () => {
		setIsLoading(true);
		fetch("/api/commonJS")
			.then((response) => response.json())
			.then((response) => {
				setText(`format: ${response.format}`);
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
fetch("/api/commonJS")
.then((response) => response.json())
.then((response) => {});`,
	element: <FetchCommonJS />,
};
