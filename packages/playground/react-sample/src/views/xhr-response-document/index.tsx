import { Button } from "#src/components";
import { useState } from "react";

export function XHRResponseDocument() {
	const [isLoading, setIsLoading] = useState(false);
	const [content, setContent] = useState({
		body: "---",
		rawBody: "---",
	});

	const xhrData = () => {
		setIsLoading(true);
		const xhr = new XMLHttpRequest();
		const data = `Hello, ${Date.now().toString().slice(-6)}!`;
		xhr.responseType = "document";
		xhr.open("POST", "/mock/xml", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		// Force the response to be parsed as XML
		xhr.overrideMimeType("application/xml");
		xhr.addEventListener("load", function () {
			console.log(xhr.response, xhr.responseXML);
			const xmlDoc = xhr.responseXML;
			if (xmlDoc) {
				const bodyContent = xmlDoc.querySelector("body")!.textContent!;
				const rawBodyContent = xmlDoc.querySelector("rawBody")!.textContent!;
				setContent({
					body: bodyContent,
					rawBody: rawBodyContent,
				});
			}
		});

		xhr.addEventListener("loadend", function () {
			setIsLoading(false);
		});

		xhr.send(data);
	};
	return (
		<div>
			<code>{JSON.stringify(content, null, 2)}</code>
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
