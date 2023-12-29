import { useLocation } from "react-router-dom";

import { TheHead, TheNav, TheCard, BUTTON_LIST } from "#src/components";

function App() {
	const location = useLocation();
	const option = BUTTON_LIST.find(({ type, value }) => {
		const params = new URLSearchParams(location.hash.slice(1));
		return params.get("type") === type && params.get("path") === value;
	});

	return (
		<section className="max-md:p-5 p-10">
			<TheHead />
			<TheNav />
			<main className="space-y-14">
				{option ? (
					<TheCard key={`${option.type}-${option.value}`} {...option} />
				) : (
					BUTTON_LIST.map((item) => <TheCard key={`${item.type}-${item.value}-${item.label}`} {...item} />)
				)}
			</main>
		</section>
	);
}

export default App;
