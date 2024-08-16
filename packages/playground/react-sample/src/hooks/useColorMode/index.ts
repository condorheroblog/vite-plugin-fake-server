import { useCallback, useEffect, useState } from "react";

import { usePreferredDark } from "../usePreferredDark";

export function useColorMode() {
	const preferredDark = usePreferredDark({ window });
	const [mode, setMode] = useState(preferredDark);

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
			updateHTMLAttrs(isDark);
		},
		[updateHTMLAttrs, setMode],
	);

	useEffect(() => {
		setMode(preferredDark);
		updateHTMLAttrs(preferredDark);
	}, [preferredDark, setMode, updateHTMLAttrs]);

	return { mode, changeMode };
}
