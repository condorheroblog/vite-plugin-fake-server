import { useState } from "react";

export function XHRResponseText() {
	const [text, setText] = useState("");

	const xhrData = () => {
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

		xhr.send(JSON.stringify(data));
	};
	return (
		<div>
			<code>{text}</code>
			<br />
			<button onClick={xhrData}>send XHR</button>
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
