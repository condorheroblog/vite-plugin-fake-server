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

export function sleepSync(ms) {
	if (ms <= 0) {
		return;
	}
	const start = performance.now();
	while (performance.now() - start < ms);
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
	}
	catch {
		result = str;
	}
	return result;
}

export function createSimulateResponse(sleepFn) {
	/**
	 * Simulates a server response.
	 * @param {object} req - The request object.
	 * @param {Array} fakeModuleList - The list of fake modules.
	 * @param {object} config - The configuration object.
	 * @returns {import('./types').SimulateServerResponseType} - A Promise that resolves with the server response.
	 */
	return function simulateServerResponse(req = {}, fakeModuleList = [], config = {}) {
		const {
			match,
			basename = "",
			defaultTimeout = 0,
			globalResponseHeaders = {},
		} = config;

		/**
		 * Join two paths into a complete path
		 */

		function joinPathname(a, b) {
			const aPathname = new URL(a, "http://localhost:5173/").pathname;
			const bPathname = new URL(b, "http://localhost:5173/").pathname;
			return aPathname.endsWith("/") ? aPathname.slice(0, -1) + bPathname : aPathname + bPathname;
		}

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
				const realURL = joinPathname(basename, item.url);
				return !!match(realURL)(pathname);
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

				const joinedUrl = joinPathname(basename, url);
				const urlMatch = match(joinedUrl, { encode: encodeURI });

				const searchParams = instanceURL.searchParams;
				const query = {};
				for (const [key, value] of searchParams.entries()) {
					if (Object.prototype.hasOwnProperty.call(query, key)) {
						const queryValue = query[key];
						if (Array.isArray(queryValue)) {
							queryValue.push(value);
						}
						else {
							query[key] = [queryValue, value];
						}
					}
					else {
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

				const result = {
					response,
					rawResponse,
					timeout,
					statusCode: statusCode ?? 200,
					statusText,
					url: req.url,
					query,
					params,
					responseHeaders: new Headers({ ...globalResponseHeaders, ...responseHeaders }),
				};
				// timeout
				const delayPromise = timeout ? sleepFn(timeout) : false;
				return delayPromise && delayPromise?.then ? delayPromise.then(() => result) : result;
			}
		}
	};
}

export const simulateServerResponse = createSimulateResponse(sleep);

export const simulateServerResponseSync = createSimulateResponse(sleepSync);
