import { Button } from "#src/components";
import { useState } from "react";

export function XHRResponseDocument() {
	const [isLoading, setIsLoading] = useState(false);

	const xhrData = () => {
		setIsLoading(true);
		const xhr = new XMLHttpRequest();
		const data = "Hello, XML";
		xhr.responseType = "document";
		xhr.open("POST", "/mock/xml", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		// Force the response to be parsed as XML
		xhr.overrideMimeType("application/xml");
		xhr.addEventListener("load", function () {
			console.log(xhr.response, xhr.responseXML);
		});

		xhr.addEventListener("loadend", function () {
			setIsLoading(false);
		});

		xhr.send(data);
	};
	return (
		<div>
			<code>Check in the console</code>
			<br />
			<Button disabled={isLoading} onClick={xhrData}>
				get XML
			</Button>
		</div>
	);
}

export default {
	code: `
const xhr = new XMLHttpRequest();
const data = "Hello, XML";
xhr.responseType = "document";
xhr.open("POST", "/mock/xml", true);
xhr.setRequestHeader("Content-Type", "application/json");

// Force the response to be parsed as XML
xhr.overrideMimeType("text/xml");
xhr.addEventListener("load", function () {
	console.log(xhr.response, xhr.responseXML);
});

xhr.send(data);`,
	element: <XHRResponseDocument />,
};
