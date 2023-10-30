import { useState } from "react";
import type { ChangeEvent } from "react";

export function XHRGetNest() {
	const [text, setText] = useState("---");

	const xhrData = (e: ChangeEvent<HTMLInputElement>) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("GET", `/api/nest/${e.target.value}`);
		xhr.addEventListener("load", function () {
			setText(xhr.response?.id);
		});
		xhr.send();
	};
	return (
		<div>
			<h3>{text}</h3>
			<input onChange={xhrData} placeholder="XHR nest" />
		</div>
	);
}

export default {
	code: `
const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open("GET", "/api/nest/:id");
xhr.addEventListener("load", function () {
	console.log(typeof xhr.response);
	setXhrNestTsContent(xhr.response?.id);
});
xhr.send();`,
	element: <XHRGetNest />,
};
