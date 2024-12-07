import { useLocation, useNavigate } from "react-router";

export const REQUEST_TYPE = ["XHR", "Fetch"];
export const OPTIONS = [
	{
		label: "Response In Mock",
		value: "response-in-mock",
		method: "GET",
	},
	{
		label: "Response In Faker",
		value: "response-in-faker",
		method: "GET",
	},
	{
		label: "Response In js File",
		value: "response-in-js-file",
		method: "GET",
	},
	{
		label: "Response In ts File",
		value: "response-in-ts-file",
		method: "GET",
	},
	{
		label: "Response In mjs File",
		value: "response-in-mjs-file",
		method: "GET",
	},
	{
		label: "Response In cjs File",
		value: "response-in-cjs-file",
		method: "GET",
	},
	{
		label: "Response In mts File",
		value: "response-in-mts-file",
		method: "GET",
	},
	{
		label: "Response In cts File",
		value: "response-in-cts-file",
		method: "GET",
	},
	{
		label: "Not Load",
		value: "not-load",
		method: "GET",
	},
	{
		label: "Response In Nest File",
		value: "response-in-nest-file",
		method: "GET",
	},
	{
		label: "External URL",
		value: "https://my-json-server.typicode.com/typicode/demo/posts",
		method: "GET",
	},
	{
		label: "Response XML",
		value: "response-xml",
		responseType: "xml",
		method: "POST",
	},
	{
		label: "Response Number",
		value: "response-number",
		method: "GET",
	},
	{
		label: "Response Boolean",
		value: "response-boolean",
		method: "GET",
	},
	{
		label: "Response Is Async",
		value: "response-is-async",
		method: "POST",
	},
	{
		label: "Delay Response For 5s",
		value: "delay-response-for-5s",
		method: "PUT",
	},
	{
		label: "Request Method Is Post",
		value: "request-method-is-post",
		method: "POST",
	},
	{
		label: "Request Status Is 404",
		value: "request-status-is-404",
		method: "POST",
	},
	{
		label: "Lowercase Headers Key",
		value: "lowercase-headers-key",
		method: "GET",
		headers: {
			"ANIMAL-CROSSING": "Animal Crossing",
			"AAAAAAAAAAAAAA": "_________",
			"BBBBBBBBBBBBBB": "_________",
			"CCCCCCCCCCCCCC": "_________",
		},
	},
	{
		label: "Dynamic Route",
		value: "user/:id",
		method: "GET",
	},
	{
		label: "Get Payload",
		value: "get-payload",
		method: "GET",
		body: { name: "John", age: 18 },
	},
	{
		label: "Post Payload",
		value: "post-payload",
		method: "POST",
		body: { name: "CondorHero", age: 18 },
	},
	{
		label: "Custom Response Header",
		value: "custom-response-header",
		method: "DELETE",
	},
	{
		label: "Custom Response Status Text",
		value: "custom-response-status-text",
		method: "GET",
	},
	{
		label: "Use Raw Response(Local)",
		value: "use-raw-response",
		method: "GET",
		disabled: !import.meta.env.DEV,
	},
];

export const BUTTON_LIST = REQUEST_TYPE.flatMap(typeItem => OPTIONS.map(item => ({ ...item, type: typeItem })));

export function TheNav() {
	const navigate = useNavigate();
	const location = useLocation();

	function activeButton(type: string, path: string) {
		const buttonClass = [
			"border",
			"rounded",
			"md:text-sm",
			"text-xs",
			"md:px-2",
			"px-1",
			"py-1",
			"opacity-80",
			"text-gray-600",
			"dark:text-slate-400",
			"cursor-pointer",
			"hover:bg-gray-100",
			"disabled:cursor-not-allowed",
			"disabled:text-gray-300",
			"disabled:bg-gray-100",
		];
		const params = new URLSearchParams(location.hash.slice(1));
		if (params.get("type") === type && params.get("path") === path) {
			return [...buttonClass, "!text-black", "bg-gray-200", "opacity-100"].join(" ");
		}
		return buttonClass.join(" ");
	}

	function go(type: string, path: string) {
		navigate(`#type=${type}&path=${path}`);
	}

	return (
		<nav className="md:mt-5 md:mb-18 mt-4 mb-10 flex gap-10 flex-col">
			{REQUEST_TYPE.map((requestItem, requestIndex) => {
				return (
					<div key={requestItem} className="flex gap-4 max-md:gap-3">
						<div className="opacity-80 text-sm">{requestItem}</div>
						<div
							className={
								`flex max-md:gap-2 gap-4 flex-wrap${REQUEST_TYPE.length - 1 !== requestIndex ? " pb-5 border-b" : ""}`
							}
						>
							{OPTIONS.map(({ value, label, disabled }) => {
								return (
									<div className="relative" key={`${requestItem}-${value}`}>
										<button
											disabled={disabled}
											title={value}
											className={activeButton(requestItem, value)}
											onClick={() => go(requestItem, value)}
										>
											{label}
										</button>
										<sup
											className={`absolute right-1 -top-2 text-xs italic font-bold text-yellow-900 px-1 dark:bg-transparent dark:opacity-100 dark:text-emerald-500${
												disabled ? " opacity-20" : " opacity-80"
											}`}
										>
											{requestItem}
										</sup>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</nav>
	);
}
