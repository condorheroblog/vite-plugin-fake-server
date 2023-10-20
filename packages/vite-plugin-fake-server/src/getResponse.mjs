/**
 * Sleeps for a specified amount of time.
 * @param {number} time - The time to sleep in milliseconds.
 * @returns {Promise<number>} - A Promise that resolves with the timer ID.
 */
export function sleep(time) {
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			resolve(timer);
			clearTimeout(timer);
		}, time);
	});
}

/**
 * Parses a string into a JSON object.
 * @param {string} str - The string to be parsed.
 * @returns {object} - The parsed to JSON. If parsing fails, a input string is returned.
 */
export function tryToJSON(str) {
	let result = "";
	try {
		result = JSON.parse(str);
	} catch (err) {
		result = str;
	}
	return result;
}

export async function getResponse({
	URL,
	req,
	fakeModuleList,
	pathToRegexp,
	match,
	basename,
	defaultTimeout,
	globalResponseHeaders,
}) {
	if (req.url) {
		const instanceURL = new URL(req.url, "http://localhost:5173/");

		// https://nodejs.org/api/url.html#urlpathname
		// Invalid URL characters included in the value assigned to the pathname property are percent-encoded
		const pathname = instanceURL.pathname;

		const matchRequest = fakeModuleList.find((item) => {
			if (!pathname || !item || !item.url) {
				return false;
			}
			const method = item.method ?? "GET";
			const reqMethod = req.method ?? "GET";
			if (method.toUpperCase() !== reqMethod.toUpperCase()) {
				return false;
			}
			const absolutePath = new URL(item.url, "http://localhost:5173/").pathname;
			const basePath = new URL(basename, "http://localhost:5173/").pathname;
			let realURL = "";
			if (basePath.endsWith("/")) {
				realURL = basePath.slice(0, basePath.length - 1) + absolutePath;
			} else {
				realURL = basePath + absolutePath;
			}
			return pathToRegexp(realURL).test(pathname);
		});
		if (matchRequest) {
			const {
				response,
				rawResponse,
				timeout = defaultTimeout,
				statusCode,
				statusText,
				url,
				headers: responseHeaders = {},
			} = matchRequest;

			if (timeout) {
				await sleep(timeout);
			}

			const urlMatch = match(url, { encode: encodeURI });

			const searchParams = instanceURL.searchParams;
			const query = {};
			for (const [key, value] of searchParams.entries()) {
				if (query.hasOwnProperty(key)) {
					const queryValue = query[key];
					if (Array.isArray(queryValue)) {
						queryValue.push(value);
					} else {
						query[key] = [queryValue, value];
					}
				} else {
					query[key] = value;
				}
			}

			let params = {};

			if (pathname) {
				const matchParams = urlMatch(pathname);
				if (matchParams) {
					params = matchParams.params;
				}
			}

			return {
				response,
				rawResponse,
				timeout,
				statusCode: statusCode ?? 200,
				statusText,
				url: req.url,
				query,
				params,
				responseHeaders: new Headers({ ...globalResponseHeaders, ...responseHeaders }),
				hash: instanceURL.hash,
			};
		}
	}
}
