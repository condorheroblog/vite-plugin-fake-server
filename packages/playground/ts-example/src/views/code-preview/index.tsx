import type { ReactNode } from "react";

interface CodePreviewProps {
	code: string;
	element: ReactNode;
}

export function CodePreview({ code, element }: CodePreviewProps) {
	return (
		<div style={{ display: "flex", gap: 10 }}>
			<textarea value={code} readOnly rows={30} cols={50} />
			<div>{element}</div>
		</div>
	);
}
