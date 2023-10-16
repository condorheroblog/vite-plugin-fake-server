import { useState } from "react";

export function XHRResponseBoolean() {
	const [boolean, setBoolean] = useState({ boolean: true, type: "boolean" });

	const xhrData = () => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("GET", "/mock/response-boolean");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("load", function () {
			setBoolean({
				boolean: xhr.response,
				type: typeof xhr.response,
			});
		});

		xhr.send();
	};
	return (
		<div>
			<code>
				boolean: {JSON.stringify(boolean.boolean)} type: {boolean.type}
			</code>
			<br />
			<button onClick={xhrData}>send XHR</button>
		</div>
	);
}

export default {
	code: `
const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open("GET", "/mock/response-boolean");
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
