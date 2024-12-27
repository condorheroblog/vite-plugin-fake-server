// Request method type
type Method = "GET" | "POST" | "PUT" | "DELETE";

// Response type
type ResponseType = "xml" | undefined;

// Request header value type
type HeaderValue = string;

// Option interface
export interface Option {
	type?: "XHR" | "Fetch"
	// Displayed label text
	label: string
	// Value/path
	value: string
	// HTTP method
	method: Method
	// Sync request
	sync?: boolean
	// Optional response type
	responseType?: ResponseType
	// Optional request headers
	headers?: Record<string, HeaderValue>
	// Optional request body
	body?: Record<string, unknown>
	// Only use XHR
	onlyXHR?: boolean
	// Optional disabled status
	disabled?: boolean
}
