import { version } from "#/package.json";
import { SwitchAppearance } from "#src/components";

export function TheHead() {
	return (
		<header className="flex gap-4 py-4 pl-10 max-md:pl-3">
			<h1 className="max-md:text-lg text-3xl font-extraligh opacity-80">
				<sup className="max-md:hidden">
					<img src="https://img.shields.io/badge/-:green?logo=github" alt="GitHub" className="inline pr-2" />
				</sup>
				<a href="https://github.com/condorheroblog/vite-plugin-fake-server" target="_blank">
					Vite Plugin Fake Server Examples
				</a>
				<sup className="opacity-50">v{version}</sup>
			</h1>

			<SwitchAppearance />
		</header>
	);
}
