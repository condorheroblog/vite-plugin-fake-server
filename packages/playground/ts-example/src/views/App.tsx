import "./app.css";
import { CodePreview } from "./code-preview";
import FetchCommonJS from "./fetch-commonJS";
import FetchExternal from "./fetch-external";
import FetchPost from "./fetch-post";
import FetchQuery from "./fetch-query";
import FetchResponseText from "./fetch-response-text";
import XHRGetNest from "./xhr-get-nest";
import XHRPost from "./xhr-post";
import { useState } from "react";
import type { ChangeEvent } from "react";

const options = [
	{
		label: "XHRPost",
		value: "XHRPost",
		code: XHRPost.code,
		element: XHRPost.element,
	},
	{
		label: "XHRGetNest",
		value: "XHRGetNest",
		code: XHRGetNest.code,
		element: XHRGetNest.element,
	},
	{
		label: "FetchExternal",
		value: "FetchExternal",
		code: FetchExternal.code,
		element: FetchExternal.element,
	},
	{
		label: "FetchPost",
		value: "FetchPost",
		code: FetchPost.code,
		element: FetchPost.element,
	},
	{
		label: "FetchQuery",
		value: "FetchQuery",
		code: FetchQuery.code,
		element: FetchQuery.element,
	},
	{
		label: "FetchResponseText",
		value: "FetchResponseText",
		code: FetchResponseText.code,
		element: FetchResponseText.element,
	},
	{
		label: "FetchCommonJS",
		value: "FetchCommonJS",
		code: FetchCommonJS.code,
		element: FetchCommonJS.element,
	},
];
function App() {
	const [selectedValue, setSelectedValue] = useState(options[0].value);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedValue(event.target.value);
		setSelectedValue(event.target.value);
	};

	const component = options.find((option) => option.value === selectedValue);
	return (
		<main>
			<div className="select-wrapper">
				<select className="select" value={selectedValue} onChange={handleChange}>
					<option value="">please select a component</option>
					{options.map(({ label, value }) => {
						return (
							<option key={value} value={value}>
								{label}
							</option>
						);
					})}
				</select>
			</div>
			<p>selected component: {selectedValue}</p>
			<div className="container">
				{component ? <CodePreview code={component.code} element={component.element} /> : null}
			</div>
		</main>
	);
}

export default App;
