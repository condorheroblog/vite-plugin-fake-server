import type { Option } from "#src/components/the-nav/type";

import { REQUEST_TYPE, TheLoading } from "#src/components";
import { useEffect, useState } from "react";

function getType(value: unknown) {
	if (value === undefined) {
		return "";
	}
	return Object.prototype.toString.call(value).slice(8, -1);
}

export function TheCard({
	value,
	method = "GET",
	label,
	type,
	responseType,
	body,
	headers,
	sync,
}: Option) {
	const [responseOrigin, setResponseOrigin] = useState<{ [key: string]: any }>({});
	const [responseData, setResponseData] = useState<any>();
	const [loading, setLoading] = useState(false);

	const fetchDetail = () => {
		let queryParams = "";
		if ((method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") && body) {
			queryParams = new URLSearchParams(body as any).toString();
		}
		const baseURL = value.startsWith("http") ? "" : "/api/";
		// :id 动态路由
		const requestURL = !value.endsWith(":id")
			? `${baseURL}${value}`
			: `${baseURL}${value}`.replace(":id", Math.random().toString());

		if (type === REQUEST_TYPE[0]) {
			if (!sync) {
				setLoading(true);
				const xhr = new XMLHttpRequest();

				if (responseType === "xml") {
					xhr.responseType = "document";
					// Force the response to be parsed as XML
					xhr.overrideMimeType("application/xml");
				}
				else {
					xhr.responseType = "json";
				}

				if (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") {
					xhr.open(method, `${requestURL}?${queryParams}`, true);
					xhr.setRequestHeader("Content-Type", "application/json");
					for (const key in headers) {
						xhr.setRequestHeader(key.toString(), headers[key as keyof typeof headers]);
					}
					xhr.send();
				}
				else {
					xhr.open(method, requestURL, true);
					xhr.setRequestHeader("Content-Type", "application/json");
					xhr.send(JSON.stringify(body));
				}

				xhr.addEventListener("load", () => {
					const showHeader = xhr.getResponseHeader("show-header");
					const accessControlAllowOrigin = xhr.getResponseHeader("access-control-allow-origin");
					setResponseOrigin({
						status: xhr.status,
						statusText: xhr.statusText,
						url: xhr.responseURL,
						headers: new Headers({
							"show-header": showHeader || "",
							"access-control-allow-origin": accessControlAllowOrigin || "",
						}),
					});
					setResponseData(xhr.response);

					if (responseType === "xml") {
						const xmlContainer = document.getElementById("xmlContainer");
						const xmlDoc = xhr.responseXML!;
						const xmlRoot = xmlDoc.querySelector("#xml-root");
						xmlContainer!.appendChild(xmlRoot!);
					}
				});

				xhr.addEventListener("loadend", () => {
					setLoading(false);
				});
			}
			else {
				setLoading(true);
				const xhr = new XMLHttpRequest();
				// Note: It's a sync request
				const isAsync = false;
				if (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") {
					xhr.open(method, `${requestURL}?${queryParams}`, isAsync);
					xhr.setRequestHeader("Content-Type", "application/json");
					for (const key in headers) {
						xhr.setRequestHeader(key.toString(), headers[key as keyof typeof headers]);
					}
					xhr.send();
				}
				else {
					xhr.open(method, requestURL, isAsync);
					xhr.setRequestHeader("Content-Type", "application/json");
					xhr.send(JSON.stringify(body));
				}
				const showHeader = xhr.getResponseHeader("show-header");
				const accessControlAllowOrigin = xhr.getResponseHeader("access-control-allow-origin");
				setResponseOrigin({
					status: xhr.status,
					statusText: xhr.statusText,
					url: xhr.responseURL,
					headers: new Headers({
						"show-header": showHeader || "",
						"access-control-allow-origin": accessControlAllowOrigin || "",
					}),
				});
				setResponseData(xhr.response);
				setLoading(false);
			}
		}
		else if (type === REQUEST_TYPE[1]) {
			setLoading(true);
			let payloadFetch;
			if ((method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") && body) {
				payloadFetch = fetch(`${requestURL}?${queryParams}`, { method, headers });
			}
			else {
				const request = new Request("https://api.sampleapis.com/coffee/hot", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ foo: true }),
				});

				fetch(request);
				payloadFetch = fetch(new Request(requestURL, { method, body: JSON.stringify(body), headers }));
			}

			payloadFetch
				.then((response) => {
					setResponseOrigin(response);
					if (responseType === "xml") {
						return response.text();
					}
					return response.json();
				})
				.then((response) => {
					if (responseType === "xml") {
						const parser = new DOMParser();
						const xmlDoc = parser.parseFromString(response, "application/xml");
						const xmlContainer = document.getElementById("xmlContainer");
						xmlContainer!.appendChild(xmlDoc.documentElement);
						setResponseData(xmlDoc);
					}
					else {
						setResponseData(response);
					}
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	const refresh = () => {
		fetchDetail();
	};

	useEffect(() => {
		fetchDetail();
	}, [value]);

	return (
		<TheLoading loading={loading}>
			<div className="relative font-mono rounded border border-t-0 border-gray-200 dark:border-gray-600">
				<div className="absolute right-2 p-2  text-right text-3xl opacity-[.15] italic dark:opacity-50">
					#
					{type}
				</div>
				<div
					className="whitespace-nowrap -translate-y-1/2 flex items-center before:border-t before:border-gray-200 dark:before:border-gray-600 before:rounded before:relative before:translate-y-1/2 before:h-1 before:w-[calc(0.05*100%)] after:block after:relative after:border-t after:border-gray-200 dark:after:border-gray-600 after:rounded after:translate-y-1/2 after:h-1 after:w-[calc(100%-0.05*100%)]"
					role="separator"
				>
					<span className="flex gap-2 px-4">
						<span className="opacity-80">{label}</span>
						<button
							className={
								`block w-5 cursor-pointer text-blue-800 opacity-80 hover:scale-125 transition-transform dark:text-blue-200 ${
									loading ? " animate-[loading_1.5s_linear_infinite]" : ""}`
							}
							title="Refresh"
							onClick={refresh}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
								<path
									fill="currentColor"
									d="M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z"
								/>
							</svg>
						</button>
					</span>
				</div>
				<div className="p-6 space-y-2 text-sm">
					<li>
						<span className="inline-block pr-1 w-36 opacity-50">Request URL:</span>
						<a className="text-blue-400 underline hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-600">
							{responseOrigin.url}
						</a>
					</li>
					<li className="opacity-50">
						<span className="inline-block pr-1 w-36">Request Method:</span>
						{method}
					</li>
					<li className="opacity-50">
						<span className="inline-block pr-1 w-36">Request Status:</span>
						{responseOrigin.status}
						{" "}
						{responseOrigin.statusText}
					</li>

					<li className="opacity-80">
						<span className="inline-block pr-1 w-36 font-bold">Response Type:</span>
						{getType(responseData)}
					</li>
					{responseOrigin?.headers?.get("show-header")
						? (
							<li className="opacity-80">
								<span className="inline-block w-40 font-bold">Response Headers:</span>
								{responseOrigin?.headers?.get("access-control-allow-origin")}
							</li>
						)
						: null}

					<li className="opacity-80">
						<span className="inline-block pr-1 w-36 font-bold">Response Body:</span>
						{responseType
							? (
								<div id="xmlContainer" className="overflow-auto pl-4 ml-4 border-l border-gray-200 dark:border-gray-600 md:ml-36"></div>
							)
							: (
								<pre className="overflow-auto pl-4 ml-4 border-l border-gray-200 dark:border-gray-600 md:ml-36">{JSON.stringify(responseData, null, 2)}</pre>
							)}
					</li>
				</div>
			</div>
		</TheLoading>
	);
}
