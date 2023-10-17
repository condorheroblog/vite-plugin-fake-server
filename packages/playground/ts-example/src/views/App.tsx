import "./app.css";
import { CodePreview } from "./code-preview";
import FetchAsyncResponse from "./fetch-async-response";
import FetchCommonJS from "./fetch-commonJS";
import FetchExternal from "./fetch-external";
import FetchMethodPost from "./fetch-method-post";
import FetchQuery from "./fetch-query";
import FetchResponse404 from "./fetch-response-404";
import FetchResponseText from "./fetch-response-text";
import FetchResponseTimeout from "./fetch-response-timeout";
import XHRGetNest from "./xhr-get-nest";
import XHRMethodPost from "./xhr-method-post";
import XHRResponseBoolean from "./xhr-response-boolean";
import XHRResponseDocument from "./xhr-response-document";
import XHRResponseNumber from "./xhr-response-number";
import XHRResponseText from "./xhr-response-text";
import XHRWithCredentials from "./xhr-with-credentials";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const fetchGroupOptions = [
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
		label: "fetch-response-404",
		value: "fetch-response-404",
		code: FetchResponse404.code,
		element: FetchResponse404.element,
	},
	{
		label: "fetch-response-timeout",
		value: "fetch-response-timeout",
		code: FetchResponseTimeout.code,
		element: FetchResponseTimeout.element,
	},
	{
		label: "fetch-async-response",
		value: "fetch-async-response",
		code: FetchAsyncResponse.code,
		element: FetchAsyncResponse.element,
	},
	{
		label: "fetch-commonJS",
		value: "fetch-commonJS",
		code: FetchCommonJS.code,
		element: FetchCommonJS.element,
		disabled: true,
	},
];

const xhrGroupOptions = [
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
		label: "xhr-with-credentials",
		value: "xhr-with-credentials",
		code: XHRWithCredentials.code,
		element: XHRWithCredentials.element,
	},
];

const options = [...xhrGroupOptions, ...fetchGroupOptions];

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
					<optgroup label="XMLHttpRequest">
						{xhrGroupOptions.map(({ label, value }) => {
							return (
								<option key={value} value={value}>
									{label}
								</option>
							);
						})}
					</optgroup>
					<optgroup label="Fetch">
						{fetchGroupOptions.map(({ label, value, disabled }) => {
							return (
								<option key={value} value={value} disabled={disabled}>
									{label}
								</option>
							);
						})}
					</optgroup>
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
