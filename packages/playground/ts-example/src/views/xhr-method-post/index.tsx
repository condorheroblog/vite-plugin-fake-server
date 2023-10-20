import { Button } from "#src/components";
import { useState } from "react";

export function XHRMethodPost() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState({});

	const xhrData = () => {
		setIsLoading(true);
		const xhr = new XMLHttpRequest();
		const data = {
			username: "admin",
			password: Math.random(),
		};
		xhr.responseType = "json";
		xhr.open("POST", "/mock/post", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("load", function () {
			setText(xhr.response);
		});

		xhr.addEventListener("loadend", function () {
			setIsLoading(false);
		});

		xhr.send(JSON.stringify(data));
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
const data = {
	username: "admin",
	password: Math.random(),
};
xhr.responseType = "json";
xhr.open("POST", "/mock/post", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.addEventListener("load", function () {
	console.log(typeof xhr.response);
	setText(xhr.response);
});

xhr.send(JSON.stringify(data));`,
	element: <XHRMethodPost />,
};
