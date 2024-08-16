import type { IncomingMessage } from "node:http";
import type { Buffer } from "node:buffer";

export function getRequestData(req: IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		let body = "";

		req.on("data", (chunk: Buffer) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			resolve(body);
		});

		req.on("error", (error: Error) => {
			reject(error);
		});
	});
}
