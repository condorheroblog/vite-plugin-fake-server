import { useCallback, useEffect, useState } from "react";

import { usePreferredDark } from "../usePreferredDark";

export function useColorMode() {
	const STORAGE_KEY = "color-mode";

	const preferredDark = usePreferredDark({ window });
	const [mode, setMode] = useState<boolean>(() => {
		try {
			const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
			if (stored === "dark")
				return true;
			if (stored === "light")
				return false;
		}
		catch {
			// ignore storage errors and fall back to preferredDark
		}
		return preferredDark;
	});

	const updateHTMLAttrs = useCallback((isDark: boolean) => {
		const htmlDOM = document.querySelector("html");
		if (isDark) {
			htmlDOM?.classList.add("dark");
			htmlDOM?.style.setProperty("color-scheme", "dark");
		}
		else {
			htmlDOM?.style.removeProperty("color-scheme");
			htmlDOM?.classList.remove("dark");
		}
	}, []);

	const changeMode = useCallback(
		(isDark: boolean) => {
			setMode(isDark);
			try {
				if (typeof window !== "undefined")
					window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
			}
			catch {
				// ignore storage errors
			}
			updateHTMLAttrs(isDark);
		},
		[updateHTMLAttrs, setMode],
	);

	// initialize based on storage or system preference
	useEffect(() => {
		try {
			const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
			const initial = stored === "dark" ? true : stored === "light" ? false : preferredDark;
			setMode(initial);
			updateHTMLAttrs(initial);
		}
		catch {
			setMode(preferredDark);
			updateHTMLAttrs(preferredDark);
		}
	}, [preferredDark, setMode, updateHTMLAttrs]);

	// cross-tab/theme sync via storage event
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key === STORAGE_KEY) {
				if (e.newValue) {
					const isDark = e.newValue === "dark";
					setMode(isDark);
					updateHTMLAttrs(isDark);
				}
				else {
					// cleared storage: fall back to system preference
					setMode(preferredDark);
					updateHTMLAttrs(preferredDark);
				}
			}
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, [updateHTMLAttrs, preferredDark]);

	return { mode, changeMode };
}
