import { BUTTON_LIST, TheCard, TheHead, TheNav } from "#src/components";

import { useEffect } from "react";
import { useLocation } from "react-router";

function App() {
	const location = useLocation();
	const option = BUTTON_LIST.find(({ type, value }) => {
		const params = new URLSearchParams(location.hash.slice(1));
		return params.get("type") === type && params.get("path") === value;
	});

	useEffect(() => {
		/**
		 * @see https://github.com/jpillora/xhook/issues/183
		 * 测试外部请求在 Firefox 中是否会携带 payload
		 */
		const request = new Request("https://api.sampleapis.com/coffee/hot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ foo: "浏览器检查是否会携带 payload" }),
		});

		fetch(request);
	}, [location.hash]);

	return (
		<>
			<TheHead />
			<section className="px-10 pb-10 max-md:px-4">
				<TheNav />
				<main className="space-y-14">
					{option
						? (
							<TheCard key={`${option.type}-${option.value}`} {...option} />
						)
						: (
							BUTTON_LIST.filter(item => !item.disabled).map(item => (
								<TheCard key={`${item.type}-${item.value}-${item.label}`} {...item} />
							))
						)}
				</main>
			</section>
		</>
	);
}

export default App;
