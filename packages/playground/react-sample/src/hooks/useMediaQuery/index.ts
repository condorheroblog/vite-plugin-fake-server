import { useState, useEffect, useCallback } from "react";

import { useSupported } from "../useSupported";
import { defaultWindow } from "../_configurable";
import type { ConfigurableWindow } from "../_configurable";

export function useMediaQuery(query: string, options: ConfigurableWindow = {}) {
	const { window = defaultWindow } = options;
	const isSupported = useSupported(() => window && "matchMedia" in window && typeof window.matchMedia === "function");
	const [matches, setMatches] = useState(false);

	let mediaQuery: MediaQueryList | undefined;

	const handler = useCallback(
		(event: MediaQueryListEvent) => {
			setMatches(event.matches);
		},
		[setMatches],
	);

	const cleanup = useCallback(() => {
		if (!mediaQuery) return;
		if ("removeEventListener" in mediaQuery) {
			mediaQuery.removeEventListener("change", handler);
		} else {
			// @ts-expect-error deprecated API
			mediaQuery.removeListener(handler);
		}
	}, [mediaQuery, handler]);

	useEffect(() => {
		if (!isSupported) return;

		cleanup();

		mediaQuery = window!.matchMedia(query);

		if ("addEventListener" in mediaQuery) {
			mediaQuery.addEventListener("change", handler);
		} else {
			// @ts-expect-error deprecated API
			mediaQuery.addListener(handler);
		}

		setMatches(mediaQuery.matches);
		return () => {
			cleanup();
			mediaQuery = undefined;
		};
	}, [isSupported, mediaQuery, cleanup, setMatches]);

	return matches;
}
