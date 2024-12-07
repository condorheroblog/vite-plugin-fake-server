// import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import { NotFound } from "../components/";
import App from "../views/App.tsx";

// const App = lazy(() => import("../views/App.tsx"));

export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <App />,
		},
		{
			path: "*",
			element: <NotFound />,
		},
	],
	{ basename: import.meta.env.BASE_URL },
);
