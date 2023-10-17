import type { ReactNode, DetailedHTMLProps, ButtonHTMLAttributes } from "react";

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	disabled?: boolean;
	children: ReactNode;
}

const Svg = (
	<svg viewBox="0 0 50 50" className="circle">
		<circle cx="25" cy="25" r="20" fill="none" className="path"></circle>
	</svg>
);

export function Button({ disabled, children, ...rest }: ButtonProps) {
	return (
		<button disabled={disabled} {...rest}>
			{disabled ? <i className="prefix-button-icon">{Svg}</i> : null}
			{children}
		</button>
	);
}
