import type { IncomingMessage as HttpIncomingMessage, ServerResponse } from "node:http";
// import type { IncomingMessage } from "connect";

export interface IncomingMessage extends HttpIncomingMessage {
	originalUrl?: HttpIncomingMessage["url"];
}

export interface FakerSchemaServerOptions {
	basename?: string;
	include?: string[];
	exclude?: string[];
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

export interface FakeRoute {
	url: string;
	method?: HttpMethodType;
	timeout?: number;
	statusCode?: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	response?: (req: IncomingMessage, res: ServerResponse) => any;
	rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
}
