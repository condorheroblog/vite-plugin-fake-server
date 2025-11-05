import { version } from "#/package.json";

import { SwitchAppearance } from "#src/components";
import { useNavigate } from "react-router";

export function TheHead() {
	const navigate = useNavigate();
	return (
		<header className="sticky top-0 z-10 bg-white dark:bg-slate-900 flex justify-between py-4 pl-10 max-md:pl-3">
			<h1 className="max-md:text-lg text-3xl font-extraligh opacity-80">
				<sup className="max-md:hidden">
					<a href="https://github.com/condorheroblog/vite-plugin-fake-server" target="_blank">
						<img src="https://img.shields.io/badge/-:green?logo=github" alt="GitHub" className="inline pr-2" />
					</a>
				</sup>
				<span onClick={() => navigate("/")} className="cursor-pointer">
					Vite Plugin Fake Server Examples
				</span>
				<sup className="opacity-50">
					v
					{version}
				</sup>
			</h1>

			<div className="flex">
				<SwitchAppearance />
				<button
					onClick={() => navigate("/")}
					className="flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md max-md:px-1 px-3 mr-4 max-md:mr-2"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
						<path
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="32"
							d="M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212"
						/>
						<path
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="32"
							d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"
						/>
					</svg>
				</button>
			</div>
		</header>
	);
}
