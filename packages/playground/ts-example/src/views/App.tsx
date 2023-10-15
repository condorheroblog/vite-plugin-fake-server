import "./app.css";
import { CodePreview } from "./code-preview";
import FetchCommonJS from "./fetch-commonJS";
import FetchExternal from "./fetch-external";
import FetchMethodPost from "./fetch-method-post";
import FetchQuery from "./fetch-query";
import FetchResponseText from "./fetch-response-text";
import XHRGetNest from "./xhr-get-nest";
import XHRMethodPost from "./xhr-method-post";
import XHRResponseDocument from "./xhr-response-document";
import XHRResponseText from "./xhr-response-text";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const options = [
	{
		label: "XHRMethodPost",
		value: "XHRMethodPost",
		code: XHRMethodPost.code,
		element: XHRMethodPost.element,
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
		label: "FetchMethodPost",
		value: "FetchMethodPost",
		code: FetchMethodPost.code,
		element: FetchMethodPost.element,
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
	{
		label: "XHRResponseDocument",
		value: "XHRResponseDocument",
		code: XHRResponseDocument.code,
		element: XHRResponseDocument.element,
	},
	{
		label: "XHRResponseText",
		value: "XHRResponseText",
		code: XHRResponseText.code,
		element: XHRResponseText.element,
	},
];
function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedValue, setSelectedValue] = useState(options[0].value);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedValue(event.target.value);
		navigate(`#${event.target.value}`);
	};

	useEffect(() => {
		const hash = location.hash.slice(1);
		if (hash.length > 0) {
			setSelectedValue(hash);
		} else {
			setSelectedValue(options[0].value);
		}
	}, [location]);

	const component = options.find((option) => option.value === selectedValue);
	return (
		<main>
			<div className="select-wrapper">
				<select className="select" value={selectedValue} onChange={handleChange}>
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
