import { BUTTON_LIST, TheCard, TheHead, TheNav } from "#src/components";

import { useLocation } from "react-router";

function App() {
	const location = useLocation();
	const option = BUTTON_LIST.find(({ type, value }) => {
		const params = new URLSearchParams(location.hash.slice(1));
		return params.get("type") === type && params.get("path") === value;
	});

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
