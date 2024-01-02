import { useEffect, useState } from "react";

import { TheLoading, REQUEST_TYPE } from "#src/components";
import type { BUTTON_LIST } from "#src/components";

function getType(value: unknown) {
	return Object.prototype.toString.call(value).slice(8, -1);
}

export function TheCard({ value, method = "GET", label, type, responseType, body }: (typeof BUTTON_LIST)[number]) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [responseOrigin, setResponseOrigin] = useState<{ [key: string]: any }>({});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [responseData, setResponseData] = useState<any>();
	const [loading, setLoading] = useState(false);

	const fetchDetail = () => {
		let queryParams = "";
		if ((method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") && body) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			queryParams = new URLSearchParams(body).toString();
		}
		const baseURL = value.startsWith("http") ? "" : "/api/";
		// :id 动态路由
		const requestURL = !value.endsWith(":id")
			? `${baseURL}${value}`
			: `${baseURL}${value}`.replace(":id", Math.random().toString());

		if (type === REQUEST_TYPE[0]) {
			setLoading(true);
			const xhr = new XMLHttpRequest();

			if (responseType === "xml") {
				xhr.responseType = "document";
				// Force the response to be parsed as XML
				xhr.overrideMimeType("application/xml");
			} else {
				xhr.responseType = "json";
			}

			if (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") {
				xhr.open(method, `${requestURL}?${queryParams}`, true);
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send();
			} else {
				xhr.open(method, requestURL, true);
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(JSON.stringify(body));
			}

			xhr.addEventListener("load", function () {
				const showHeader = xhr.getResponseHeader("show-header");
				const accessControlAllowOrigin = xhr.getResponseHeader("access-control-allow-origin");
				setResponseOrigin({
					status: xhr.status,
					statusText: xhr.statusText,
					url: xhr.responseURL,
					headers: new Headers({
						"show-header": showHeader ? showHeader : "",
						"access-control-allow-origin": accessControlAllowOrigin ? accessControlAllowOrigin : "",
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

			xhr.addEventListener("loadend", function () {
				setLoading(false);
			});
		} else if (type === REQUEST_TYPE[1]) {
			setLoading(true);
			let payloadFetch;
			if ((method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") && body) {
				payloadFetch = fetch(`${requestURL}?${queryParams}`, { method });
			} else {
				payloadFetch = fetch(requestURL, { method, body: JSON.stringify(body) });
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
					} else {
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
			<div className="relative border border-t-0 rounded font-mono">
				<div className="absolute right-2 p-2  text-right text-3xl opacity-[.15] italic dark:opacity-50">#{type}</div>
				<div
					className="whitespace-nowrap -translate-y-1/2 flex items-center before:border-t before:rounded before:relative before:translate-y-1/2 before:h-1 before:w-[calc(0.05_*_100%)] after:block after:relative after:border-t after:rounded after:translate-y-1/2 after:h-1 after:w-[calc(100%_-_0.05_*_100%)]"
					role="separator"
				>
					<span className="flex gap-2 px-4">
						<span className="opacity-80">{label}</span>
						<button
							className={
								`block w-5 cursor-pointer text-blue-800 opacity-80 hover:scale-125 transition-transform dark:text-blue-200` +
								(loading ? " animate-[loading_1.5s_linear_infinite]" : "")
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
				<div className="text-sm p-6 space-y-2">
					<li>
						<span className="inline-block w-36 pr-1 opacity-50">Request URL:</span>
						<a className="text-blue-400 hover:text-blue-600 dark:text-blue-400 underline dark:hover:text-blue-600">
							{responseOrigin.url}
						</a>
					</li>
					<li className="opacity-50">
						<span className="inline-block w-36 pr-1">Request Method:</span>
						{method}
					</li>
					<li className="opacity-50">
						<span className="inline-block w-36 pr-1">Request Status:</span>
						{responseOrigin.status} {responseOrigin.statusText}
					</li>

					<li className="opacity-80">
						<span className="inline-block w-36 pr-1 font-bold">Response Type:</span>
						{getType(responseData)}
					</li>
					{responseOrigin?.headers?.get("show-header") ? (
						<li className="opacity-80">
							<span className="inline-block w-40 font-bold">Response Headers:</span>
							{responseOrigin?.headers?.get("access-control-allow-origin")}
						</li>
					) : null}

					<li className="opacity-80">
						<span className="inline-block w-36 pr-1 font-bold">Response Body:</span>
						{responseType ? (
							<div id="xmlContainer" className="overflow-auto md:ml-36 ml-4 pl-4 border-l"></div>
						) : (
							<pre className="overflow-auto md:ml-36 ml-4 pl-4 border-l">{JSON.stringify(responseData, null, 2)}</pre>
						)}
					</li>
				</div>
			</div>
		</TheLoading>
	);
}
