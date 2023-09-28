import type { IncomingMessage as HttpIncomingMessage, ServerResponse, IncomingHttpHeaders } from "node:http";
import type { UrlWithParsedQuery } from "node:url";
// import type { IncomingMessage } from "connect";

export interface IncomingMessage extends HttpIncomingMessage {
	originalUrl?: HttpIncomingMessage["url"];
}
export type { ServerResponse };

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

	response?: (
		HTTPRequest: { url: string; body: string; query: UrlWithParsedQuery["query"]; headers: IncomingHttpHeaders },
		req: IncomingMessage,
		res: ServerResponse,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) => any;
	rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
}
