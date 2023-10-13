import { useState } from "react";

export function XHRPost() {
	const [text, setText] = useState({});

	const xhrData = () => {
		const xhr = new XMLHttpRequest();
		const data = {
			username: "admin",
			password: "123456",
		};
		xhr.responseType = "json";
		xhr.open("POST", "/mock/post", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("readystatechange", function () {
			setText(xhr.response);
		});

		xhr.send(JSON.stringify(data));
	};
	return (
		<div>
			<code>{JSON.stringify(text, null, 2)}</code>
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
xhr.responseType = "json";
xhr.open("POST", "/mock/post", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.addEventListener("readystatechange", function () {
	console.log(typeof xhr.response);
	setText(xhr.response);
});

xhr.send(JSON.stringify(data));`,
	element: <XHRPost />,
};
