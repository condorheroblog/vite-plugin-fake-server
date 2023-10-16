import "./app.css";
import { CodePreview } from "./code-preview";
import FetchCommonJS from "./fetch-commonJS";
import FetchExternal from "./fetch-external";
import FetchMethodPost from "./fetch-method-post";
import FetchQuery from "./fetch-query";
import FetchResponseText from "./fetch-response-text";
import XHRGetNest from "./xhr-get-nest";
import XHRMethodPost from "./xhr-method-post";
import XHRResponseBoolean from "./xhr-response-boolean";
import XHRResponseDocument from "./xhr-response-document";
import XHRResponseNumber from "./xhr-response-number";
import XHRResponseText from "./xhr-response-text";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const options = [
	{
		label: "xhr-method-post",
		value: "xhr-method-post",
		code: XHRMethodPost.code,
		element: XHRMethodPost.element,
	},
	{
		label: "xhr-get-nest",
		value: "xhr-get-nest",
		code: XHRGetNest.code,
		element: XHRGetNest.element,
	},
	{
		label: "xhr-response-document",
		value: "xhr-response-document",
		code: XHRResponseDocument.code,
		element: XHRResponseDocument.element,
	},
	{
		label: "xhr-response-text",
		value: "xhr-response-text",
		code: XHRResponseText.code,
		element: XHRResponseText.element,
	},
	{
		label: "xhr-response-number",
		value: "xhr-response-number",
		code: XHRResponseNumber.code,
		element: XHRResponseNumber.element,
	},
	{
		label: "xhr-response-boolean",
		value: "xhr-response-boolean",
		code: XHRResponseBoolean.code,
		element: XHRResponseBoolean.element,
	},
	{
		label: "fetch-external",
		value: "fetch-external",
		code: FetchExternal.code,
		element: FetchExternal.element,
	},
	{
		label: "fetch-method-post",
		value: "fetch-method-post",
		code: FetchMethodPost.code,
		element: FetchMethodPost.element,
	},
	{
		label: "fetch-query",
		value: "fetch-query",
		code: FetchQuery.code,
		element: FetchQuery.element,
	},
	{
		label: "fetch-response-text",
		value: "fetch-response-text",
		code: FetchResponseText.code,
		element: FetchResponseText.element,
	},
	{
		label: "fetch-commonJS",
		value: "fetch-commonJS",
		code: FetchCommonJS.code,
		element: FetchCommonJS.element,
		disabled: true,
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
					{options.map(({ label, value, disabled }) => {
						return (
							<option key={value} value={value} disabled={disabled}>
								{label}
							</option>
						);
					})}
				</select>
			</div>
			<p>Selected: {selectedValue}</p>
			<div className="container">
				{component ? <CodePreview code={component.code} element={component.element} /> : null}
			</div>
		</main>
	);
}

export default App;
