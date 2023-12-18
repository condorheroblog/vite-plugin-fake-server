import { useState } from "react";

import { Button } from "#src/components";

export function XHRResponseNumber() {
	const [isLoading, setIsLoading] = useState(false);
	const [num, setNum] = useState({ number: 0, type: "number" });

	const xhrData = () => {
		setIsLoading(true);
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("GET", "/api/response-number");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("load", function () {
			setNum({
				number: xhr.response,
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
				number: {num.number} type: {num.type}
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
xhr.open("GET", "/api/response-number");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.addEventListener("load", function () {
	setNum({
		number: xhr.response,
		type: typeof xhr.response,
	});
});

xhr.send();`,
	element: <XHRResponseNumber />,
};
