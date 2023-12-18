import { useState } from "react";

import { Button } from "#src/components";

export function XHRWithCredentials() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState({});

	const xhrData = () => {
		setIsLoading(true);
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("POST", "/api/with-credentials", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("authorization", "token");

		xhr.withCredentials = true;
		xhr.addEventListener("load", function () {
			console.log(xhr.getAllResponseHeaders());
			console.log(xhr.response);
			setText(xhr.response);
		});

		xhr.addEventListener("loadend", function () {
			setIsLoading(false);
		});

		xhr.send();
	};
	return (
		<div>
			<code>{JSON.stringify(text, null, 2)}</code>
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
xhr.open("POST", "/api/with-credentials", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("authorization", "token");

xhr.withCredentials = true;
xhr.addEventListener("load", function () {
	console.log(xhr.getAllResponseHeaders());
	console.log(xhr.response);
	setText(xhr.response);
});

xhr.send();`,
	element: <XHRWithCredentials />,
};
