import { useState } from "react";

import { Button } from "#src/components";

export function XHRResponseBoolean() {
	const [isLoading, setIsLoading] = useState(false);
	const [boolean, setBoolean] = useState({ boolean: true, type: "boolean" });

	const xhrData = () => {
		setIsLoading(true);
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("GET", "/api/response-boolean");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("load", function () {
			setBoolean({
				boolean: xhr.response,
				type: typeof xhr.response,
			});
		});

		xhr.addEventListener("loadend", function () {
			setIsLoading(false);
		});

		xhr.send();
	};
	return (
		<div>
			<code>
				boolean: {JSON.stringify(boolean.boolean)} type: {boolean.type}
			</code>
			<br />
			<Button disabled={isLoading} onClick={xhrData}>
				send XHR
			</Button>
		</div>
	);
}

export default {
	code: `
const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open("GET", "/api/response-boolean");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.addEventListener("load", function () {
	setBoolean({
		boolean: xhr.response,
		type: typeof xhr.response,
	});
});

xhr.send();`,
	element: <XHRResponseBoolean />,
};
