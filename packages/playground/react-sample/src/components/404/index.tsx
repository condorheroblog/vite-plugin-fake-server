import { useNavigate } from "react-router";

export function NotFound() {
	const navigate = useNavigate();
	return (
		<div className="m-10 text-center">
			<h3 className="text-3xl">Not Found</h3>
			<button
				className="p-2 m-8 text-sm font-bold rounded border border-gray-200 dark:border-gray-600 bg-slate-300 hover:bg-gray-500 hover:text-cyan-200"
				onClick={() => {
					navigate("/");
				}}
			>
				Go Home
			</button>
		</div>
	);
}
