import { useCallback, useSyncExternalStore } from "react";

import { useSupported } from "../useSupported";
import { defaultWindow } from "../_configurable";
import type { ConfigurableWindow } from "../_configurable";

function getMediaSnapshot(query: string) {
	return window.matchMedia(query).matches;
}

// https://julesblom.com/writing/usesyncexternalstore
export function useMediaQuery(query: string, options: ConfigurableWindow = {}) {
	const { window = defaultWindow } = options;
	const isSupported = useSupported(() => window && "matchMedia" in window && typeof window.matchMedia === "function");
	if (!isSupported) return false;

	const subscribeMediaQuery = useCallback(
		(handler: (ev: MediaQueryListEvent) => void) => {
			const mediaQuery = window!.matchMedia(query);
			if ("addEventListener" in mediaQuery) {
				mediaQuery.addEventListener("change", handler);
			} else {
				// @ts-expect-error deprecated API
				mediaQuery.addListener(handler);
			}

			return () => {
				if ("removeEventListener" in mediaQuery) {
					mediaQuery.removeEventListener("change", handler);
				} else {
					// @ts-expect-error deprecated API
					mediaQuery.removeListener(handler);
				}
			};
		},
		[query],
	);

	const matches = useSyncExternalStore(subscribeMediaQuery, () => getMediaSnapshot(query));
	return matches;
}
