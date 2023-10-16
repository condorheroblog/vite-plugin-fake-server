import { useState } from "react";

export function XHRResponseNumber() {
	const [num, setNum] = useState({ number: 0, type: "number" });

	const xhrData = () => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("GET", "/mock/response-number");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("load", function () {
			setNum({
				number: xhr.response,
				type: typeof xhr.response,
			});
		});

		xhr.send();
	};
	return (
		<div>
			<code>
				number: {num.number} type: {num.type}
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
xhr.open("GET", "/mock/response-number");
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
