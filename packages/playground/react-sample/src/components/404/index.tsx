import { useNavigate } from "react-router-dom";

export function NotFound() {
	const navigate = useNavigate();
	return (
		<div className="text-center m-10">
			<h3 className="text-3xl">Not Found</h3>
			<button
				className="border text-sm m-8 p-2 rounded bg-slate-300 hover:bg-gray-500 hover:text-cyan-200 font-bold"
				onClick={() => {
					navigate("/");
				}}
			>
				Go Home
			</button>
		</div>
	);
}
