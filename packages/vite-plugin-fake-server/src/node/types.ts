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
	extensions?: string[];
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

export interface URLRequest {
	url: string;
	body: string;
	query: Record<string, string | string[]>;
	params: Record<string, string | string[]>;
	hash: string;
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
	 * Defaults to GET if not specified.
	 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	 */
	method?: HttpMethodType;

	/**
	 * The duration in milliseconds after which the request will time out.
	 * If not provided, the request will not have a timeout.
	 */
	timeout?: number;

	/**
	 * The HTTP status code to be sent as the response.
	 * If not specified, the default status code will be used.
	 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	 */
	statusCode?: number;

	/**
	 * The status message associated with the HTTP status code.
	 * If not provided, a default status message corresponding to the status code will be used.
	 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	 */
	statusText?: string;

	/**
	 * An object containing key-value pairs representing the HTTP headers to be sent in the response.
	 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
	 */
	headers?: OutgoingHttpHeaders;

	/**
	 * Supports both synchronous and asynchronous
	 * A callback function that handles the response generation based on the received HTTP request, the incoming message, and the server response.
	 * @param HTTPRequest - The URLRequest object representing the processed HTTP request parameters.
	 * @param req - The IncomingMessage object representing the incoming HTTP message.
	 * @param res - The ServerResponse object representing the server's response.
	 * @returns The response data.
	 */
	response?: (
		HTTPRequest: URLRequest,
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
