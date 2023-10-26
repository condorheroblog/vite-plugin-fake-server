import { Button } from "#src/components";
import { useState } from "react";

export function XHRResponseText() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("---");

	const xhrData = () => {
		setIsLoading(true);
		const xhr = new XMLHttpRequest();
		const data = {
			username: "admin",
			password: "123456",
		};
		xhr.responseType = "text";
		xhr.open("GET", "/mock/response-text");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("load", function () {
			console.log(xhr.responseText);
			setText(xhr.response);
		});

		xhr.addEventListener("loadend", function () {
			setIsLoading(false);
		});

		xhr.send(JSON.stringify(data));
	};
	return (
		<div>
			<code>{text}</code>
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
	password: "123456",
};
xhr.responseType = "text";
xhr.open("GET", "/mock/response-text");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.addEventListener("load", function () {
	console.log(xhr.responseText);
	setText(xhr.response);
});

xhr.send(JSON.stringify(data));`,
	element: <XHRResponseText />,
};
