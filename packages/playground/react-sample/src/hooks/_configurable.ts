import { isClient } from "../utils";

export interface ConfigurableWindow {
	/*
	 * Specify a custom `window` instance, e.g. working with iframes or in testing environments.
	 */
	window?: Window;
}

export const defaultWindow = isClient ? window : undefined;
