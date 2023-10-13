import type { IncomingMessage as HttpIncomingMessage, ServerResponse, IncomingHttpHeaders } from "node:http";

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

export interface FakeRoute {
	url: string;
	method?: HttpMethodType;
	timeout?: number;
	statusCode?: number;

	response?: (
		HTTPRequest: URLRequest,
		req: IncomingMessage,
		res: ServerResponse,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) => any;
	rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
}
