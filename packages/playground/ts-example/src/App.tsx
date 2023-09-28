import { useState } from "react";

function App() {
	const fetchIndex = () => {
		fetch("/index");
	};
	return (
		<>
			<h1>Vite + React</h1>
			<button onClick={fetchIndex}>fetch</button>
		</>
	);
}

export default App;
