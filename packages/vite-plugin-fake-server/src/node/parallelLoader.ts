import type { FakeRoute } from "../node";

export function parallelLoader<T>(promises: (() => PromiseLike<T> | T)[], limit = Infinity) {
	const len = promises.length;
	if (len === 0) {
		return Promise.resolve([]);
	}
	let current = 0;
	const result: FakeRoute[] = [];
	let resolvedCount = 0;
	return new Promise<FakeRoute[]>((resolve, reject) => {
		function processNext() {
			const index = current;
			current = index + 1;
			const promise = promises[index];
			Promise.resolve(promise())
				.then((res) => {
					if (Array.isArray(res)) {
						result.push(...res);
					}
					else {
						result.push(res as FakeRoute);
					}
					resolvedCount = resolvedCount + 1;

					if (resolvedCount === len) {
						resolve(result);
					}

					if (current < len)
						processNext();
				})
				.catch(reason => reject(reason));
		}
		for (let i = 0; i < limit && i < len; i++) {
			processNext();
		}
	});
}
