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
 * Synchronous sleep function that blocks the event loop.
 * @param {number} ms - Sleep duration in milliseconds.
 */
export function sleepSync(ms) {
	if (ms <= 0) {
		return;
	}
	const start = performance.now();
	while (performance.now() - start < ms);
}

/**
 * Safely parses a string into a JSON object.
 * @param {string} str - The string to be parsed.
 * @returns {object|string} - Parsed JSON object, or original string if parsing fails.
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

/**
 * Creates a simulated server response function with custom sleep logic.
 * @param {Function} sleepFn - Sleep function to use for delay.
 * @returns {Function} Simulated server response function.
 */
export function createSimulateResponse(sleepFn) {
	/**
	 * Simulates a server response for mock API requests.
	 * @param {object} req - Request object.
	 * @param {Array} fakeModuleList - List of mock API modules.
	 * @param {object} config - Configuration object.
	 * @returns {import('./types').SimulateServerResponseType|undefined} Simulated response or undefined.
	 */
	return function simulateServerResponse(req = {}, fakeModuleList = [], config = {}) {
		// Set default config values to prevent undefined errors
		const {
			match = () => () => false,
			basename = "",
			defaultTimeout = 0,
			globalResponseHeaders = {},
		} = config || {};

		/**
		 * Safely joins two URL pathnames, handles null/empty values.
		 * @param {string} a - Base pathname.
		 * @param {string} b - Suffix pathname.
		 * @returns {string} Joined normalized pathname.
		 */
		function joinPathname(a, b) {
			try {
				const aPathname = new URL(a || "", "http://localhost:5173/").pathname;
				const bPathname = new URL(b || "", "http://localhost:5173/").pathname;
				return aPathname.endsWith("/") ? aPathname.slice(0, -1) + bPathname : aPathname + bPathname;
			}
			catch {
				return "";
			}
		}

		// Exit early if request or request URL is missing
		if (!req || !req.url) {
			return undefined;
		}

		// Safely parse request URL and pathname
		let pathname = "";
		try {
			const instanceURL = new URL(req.url, "http://localhost:5173/");
			// https://nodejs.org/api/url.html#urlpathname
			// Invalid URL characters included in the value assigned to the pathname property are percent-encoded
			pathname = instanceURL.pathname;
		}
		catch {
			return undefined;
		}

		// Ensure fakeModuleList is always an array
		const moduleList = Array.isArray(fakeModuleList) ? fakeModuleList : [];

		// Find matching mock request module
		const matchRequest = moduleList.find((item) => {
			if (!pathname || !item || !item.url) {
				return false;
			}

			const method = item.method ?? "GET";
			const reqMethod = req.method ?? "GET";
			if (method.toUpperCase() !== reqMethod.toUpperCase()) {
				return false;
			}

			const realURL = joinPathname(basename, item.url);
			try {
				return !!match(realURL)(pathname);
			}
			catch {
				return false;
			}
		});

		if (matchRequest) {
			const {
				response,
				rawResponse,
				timeout = defaultTimeout,
				statusCode = 200,
				statusText = "OK",
				url = "",
				headers: responseHeaders = {},
			} = matchRequest || {};

			const joinedUrl = joinPathname(basename, url);
			let urlMatch = () => ({ params: {} });
			try {
				urlMatch = match(joinedUrl, { encode: encodeURI });
			}
			catch {}

			// Safely parse query parameters from request URL
			const query = {};
			try {
				const instanceURL = new URL(req.url, "http://localhost:5173/");
				const searchParams = instanceURL.searchParams;
				for (const [key, value] of searchParams.entries()) {
					if (Object.hasOwn(query, key)) {
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
			}
			catch {}

			// Safely parse route parameters
			let params = {};
			try {
				if (pathname) {
					const matchParams = urlMatch(pathname);
					if (matchParams?.params) {
						params = matchParams.params;
					}
				}
			}
			catch {}

			// Merge response headers safely
			const baseHeaders = globalResponseHeaders || {};
			const resHeaders = responseHeaders || {};

			// Build final response object
			const result = {
				response,
				rawResponse,
				timeout,
				statusCode,
				statusText,
				url: req.url,
				query,
				params,
				responseHeaders: new Headers({ ...baseHeaders, ...resHeaders }),
			};

			// Handle delay with error safety
			try {
				const delayPromise = timeout ? sleepFn?.(timeout) : false;
				return delayPromise?.then ? delayPromise.then(() => result) : result;
			}
			catch {
				return result;
			}
		}

		// No matching mock found
		return undefined;
	};
}

export const simulateServerResponse = createSimulateResponse(sleep);

export const simulateServerResponseSync = createSimulateResponse(sleepSync);
