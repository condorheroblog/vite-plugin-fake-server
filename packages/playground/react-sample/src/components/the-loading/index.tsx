import type { ReactNode } from "react";

export interface TheLoadingProps {
	children?: ReactNode
	loading?: boolean
}

export function TheLoading({ children, loading }: TheLoadingProps) {
	return (
		<div className="relative">
			{loading
				? (
					<svg
						viewBox="0 0 50 50"
						className="absolute inset-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 animation-spin"
					>
						<circle
							cx="25"
							cy="25"
							r="20"
							fill="none"
							strokeDasharray="90,150"
							strokeDashoffset="0"
							strokeLinecap="round"
							className="animate-[loading-dash_1.5s_ease-in-out_infinite] stroke-blue-500 stroke-2"
						/>
					</svg>
				)
				: null}

			{children}
		</div>
	);
}
