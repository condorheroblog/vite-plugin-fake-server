export function XHRResponseDocument() {
	const xhrData = () => {
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

		xhr.send(data);
	};
	return (
		<div>
			<code>Check in the console</code>
			<br />
			<button onClick={xhrData}>get XML</button>
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
