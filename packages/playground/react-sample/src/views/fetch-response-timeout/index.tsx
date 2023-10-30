import { Button } from "#src/components";
import { useState } from "react";

export function FetchResponseTimeout() {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState({});
	const [timeoutValue, setTimeoutValue] = useState(5);

	const startCountdown = (num: number) => {
		if (num <= 0) {
			return;
		}

		setTimeout(() => {
			setTimeoutValue((prevTimeoutValue) => prevTimeoutValue - 1);
			startCountdown(num - 1);
		}, 1000);
	};

	const fetchData = () => {
		setIsLoading(true);
		startCountdown(5);

		fetch("/api/timeout", { method: "PUT" })
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				setText(response);

				setTimeoutValue(5);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<div>
			<code>
				{JSON.stringify(text, null, 2)}
				<br></br>
				<br></br>
				<br></br>
				click button start countdown: {timeoutValue} seconds
			</code>
			<br />
			<Button disabled={isLoading} onClick={fetchData}>
				fetch delay response
			</Button>
		</div>
	);
}

export default {
	code: `
fetch("/api/timeout", { method: "PUT" })
.then((response) => {
	return response.json();
})
.then((response) => {
	setText(response);
	setIsLoading(false);
	setTimeoutValue(5);
});`,
	element: <FetchResponseTimeout />,
};
