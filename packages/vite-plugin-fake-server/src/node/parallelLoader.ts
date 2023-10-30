export function parallelLoader<T>(promises: (() => PromiseLike<T>)[], limit = Infinity) {
	let current = 0;
	const result: T[] = [];
	let resolvedCount = 0;
	const len = promises.length;
	return new Promise<T[]>((resolve, reject) => {
		function processNext() {
			const index = current;
			current = index + 1;
			const promise = promises[index];
			Promise.resolve(promise())
				.then((res) => {
					result[index] = res;
					resolvedCount = resolvedCount + 1;

					if (resolvedCount === len) {
						resolve(result);
					}

					if (current < len) processNext();
				})
				.catch((reason) => reject(reason));
		}
		for (let i = 0; i < limit && i < len; i++) {
			processNext();
		}
	});
}
