import type { FakeRoute } from "../node/types";

export type SimulateServerResponseType = Promise<{
	response: FakeRoute["response"]
	rawResponse?: FakeRoute["rawResponse"]
	timeout: number
	statusCode: number
	statusText?: string
	url: string
	query: Record<string, string | string[]>
	params: Record<string, string>
	responseHeaders: Headers
} | undefined>;
