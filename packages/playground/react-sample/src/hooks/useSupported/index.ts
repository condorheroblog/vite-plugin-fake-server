import { useMemo } from "react";

export function useSupported(callback: () => unknown) {
	return useMemo(() => {
		return Boolean(callback());
	}, [callback]);
}
