import { useState } from "react";

function App() {
	const [fetchText] = useState("");
	const [xhrText] = useState("");

	const fetchData = () => {
		fetch("/mock/1/😄/18?name=tom&name=john&123")
			.then((response) => response.json())
			.then((response) => console.log(typeof response, response));
	};

	const xhrData = () => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "/mock/2/😄/20?hobby=tennis&name=soccer&你好");
		xhr.addEventListener("readystatechange", function () {
			console.log(xhr.responseText);
		});
		xhr.send();
	};

	return (
		<>
			<h1>Vite + React</h1>
			<main>
				<div>
					<h3>{fetchText}</h3>
					<button onClick={fetchData}>fetch</button>
				</div>
				<div>
					<h3>{xhrText}</h3>
					<button onClick={xhrData}>XHR</button>
				</div>
			</main>
		</>
	);
}

export default App;
