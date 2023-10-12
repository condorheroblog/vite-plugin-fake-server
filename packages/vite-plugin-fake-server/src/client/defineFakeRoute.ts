import type { FakeRoute } from "../node/types";

export type FakeRouteConfig = FakeRoute[] | FakeRoute;

export function defineFakeRoute(config: FakeRouteConfig) {
	return config;
}
