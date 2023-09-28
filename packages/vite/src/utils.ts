import { IncomingMessage } from "node:http";

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

export function sleep(time: number) {
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			resolve(timer);
			clearTimeout(timer);
		}, time);
	});
}
