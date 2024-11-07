import type { ConfigurableWindow } from "../_configurable";
import { useMediaQuery } from "../useMediaQuery";

export function usePreferredDark(options?: ConfigurableWindow) {
	return useMediaQuery("(prefers-color-scheme: dark)", options);
}
