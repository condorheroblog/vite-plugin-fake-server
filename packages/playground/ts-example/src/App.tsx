import "./app.css";
import { useState } from "react";
import type { ChangeEvent } from "react";

function App() {
	const [fetchIndexTsContent, setFetchIndexTsContent] = useState({});
	const [fetchIndexMjsContent, setFetchIndexMjsContent] = useState("---");
	const [xhrNestTsContent, setXhrNestTsContent] = useState("---");
	const [fetchQueryContent, setFetchQueryContent] = useState("---");
	const [responseText, setResponseText] = useState("---");
	const [fetchExternalContent, setFetchExternalContent] = useState({});

	const fetchIndexTsData = () => {
		fetch("/mock/get-user-info", { method: "get" })
			.then((response) => response.json())
			.then((response) => {
				setFetchIndexTsContent(response);
			});
	};

	const xhrNestTsContentData = (e: ChangeEvent<HTMLInputElement>) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", `/mock/nest/${e.target.value}`);
		xhr.responseType = "json";
		xhr.addEventListener("readystatechange", function () {
			console.log(typeof xhr.response);
			setXhrNestTsContent(xhr.response?.id);
		});
		xhr.send();
	};

	const fetchIndexMjsData = () => {
		fetch("/mock/mjs", { method: "POST" })
			.then((response) => response.json())
			.then((response) => {
				setFetchIndexMjsContent(response.format);
			});
	};

	const fetchQueryData = () => {
		fetch(`/mock/esm?timestamp=${Date.now()}`)
			.then((response) => response.json())
			.then((response) => {
				setFetchQueryContent(`format: ${response.format}, query: ${response.query?.timestamp}`);
			});
	};

	const fetchResponseTextData = () => {
		fetch(`/mock/response-text`, { method: "get", headers: { "Content-Type": "text/plain" } })
			.then((response) => {
				setResponseText(response.headers.get("Content-Type")!);
				return response.text();
			})
			.then((response) => {
				console.log(response);
			});
	};

	const fetchExternalLinkData = () => {
		fetch(`https://my-json-server.typicode.com/typicode/demo/posts`)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				console.log(response);
				setFetchExternalContent(response);
			});
	};

	return (
		<div className="container">
			<h1>Vite + React</h1>
			<main>
				<div>
					<textarea readOnly cols={40} rows={11} value={JSON.stringify(fetchIndexTsContent, null, 2)} />
					<br />
					<button onClick={fetchIndexTsData}>fetch index.ts</button>
				</div>

				<hr />

				<div>
					<h3>{xhrNestTsContent}</h3>
					<input onChange={xhrNestTsContentData} placeholder="XHR nest" />
				</div>

				<hr />

				<div>
					<h3>{fetchIndexMjsContent}</h3>
					<button onClick={fetchIndexMjsData}>fetch index.mjs</button>
				</div>

				<hr />

				<div>
					<h3>{fetchQueryContent}</h3>
					<button onClick={fetchQueryData}>fetch query</button>
				</div>

				<hr />

				<div>
					<h3>{responseText}</h3>
					<button onClick={fetchResponseTextData}>fetch response text</button>
				</div>

				<hr />

				<div>
					<textarea readOnly cols={40} rows={11} value={JSON.stringify(fetchExternalContent, null, 2)} />
					<br />
					<button onClick={fetchExternalLinkData}>fetch external URL</button>
				</div>
			</main>
		</div>
	);
}

export default App;
