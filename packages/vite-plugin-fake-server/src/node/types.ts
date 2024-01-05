import type {
	IncomingMessage as HttpIncomingMessage,
	ServerResponse,
	IncomingHttpHeaders,
	OutgoingHttpHeaders,
} from "node:http";

export interface IncomingMessage extends HttpIncomingMessage {
	originalUrl?: HttpIncomingMessage["url"];
}
export type { ServerResponse };

export interface FakerSchemaServerOptions {
	include?: string[];
	exclude?: string[];
	/**
	 * @description Set the fake files extensions.
	 * @default ["ts", "js", "mjs", "cjs", "cts", "mts"]
	 */
	extensions?: string[];
	/**
	 * @description Set the infix name used in the fake file name.
	 * @default fake
	 */
	infixName?: string | boolean;
}

export type UppercaseHttpMethodType =
	| "GET"
	| "POST"
	| "PUT"
	| "PATCH"
	| "DELETE"
	| "HEAD"
	| "OPTIONS"
	| "CONNECT"
	| "TRACE";
type lowercase<T extends string> = T extends Uppercase<T> ? Lowercase<T> : T;
export type LowercaseHttpMethod = lowercase<UppercaseHttpMethodType>;
export type HttpMethodType = UppercaseHttpMethodType | LowercaseHttpMethod;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Recordable<T = any> = Record<string, T>;

export interface ProcessedRequest {
	/**
	 * The URL of the request.
	 */
	url: string;
	/**
	 * The raw body of the request.
	 */
	rawBody: string;
	/**
	 * The parsed body of the request, try using `JSON.parse` to get a JSON.
	 * May return boolean, number, array, object etc. For convenience, the type is forced to be Record<string, any>.
	 */
	body: Recordable;
	/**
	 * The query parameters of the request, represented as a key-value object.
	 */
	query: Record<string, string | string[]>;
	/**
	 * The route parameters of the request, represented as a key-value object.
	 */
	params: Record<string, string | string[]>;
	/**
	 * The headers of the request.
	 */
	headers: IncomingHttpHeaders;
}

/**
 * Represents a fake route in a server application.
 */
export interface FakeRoute {
	/**
	 * The URL path of the route.
	 */
	url: string;

	/**
	 * The HTTP method type of the route (e.g., GET, POST, PUT, DELETE).
	 * @default GET
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	 */
	method?: HttpMethodType;

	/**
	 * The duration in milliseconds after which the request will time out.
	 * @default undefined
	 */
	timeout?: number;

	/**
	 * The HTTP status codes to be sent as the response.
	 * @default 200
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	 */
	statusCode?: number;

	/**
	 * The status text associated with the HTTP status codes.
	 * If not provided, a default status text corresponding to the status code will be used.
	 * Responses over an HTTP/2 connection will always have an empty string as status message as HTTP/2 does not support them.
	 * Option {@link https://github.com/condorheroblog/vite-plugin-fake-server#http2} of the plugin can control this behavior.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	 */
	statusText?: string;

	/**
	 * An object containing key(the key is lowercase) and value pairs representing the HTTP headers to be sent in the response.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
	 */
	headers?: OutgoingHttpHeaders;

	/**
	 * Supports both synchronous and asynchronous
	 * A callback function that handles the response generation based on the received HTTP request, the incoming message, and the server response.
	 * @param processedRequest - The ProcessedRequest object representing the processed HTTP request parameters.
	 * @param req - The IncomingMessage object representing the incoming HTTP message.
	 * @param res - The ServerResponse object representing the server's response.
	 * @returns The response data.
	 */
	response?: (
		processedRequest: ProcessedRequest,
		req: IncomingMessage,
		res: ServerResponse,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) => any;

	/**
	 * Supports both synchronous and asynchronous
	 * A callback function that handles the custom response.
	 * @param req - The IncomingMessage object representing the incoming HTTP message.
	 * @param res - The ServerResponse object representing the server's response.
	 */
	rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
}
