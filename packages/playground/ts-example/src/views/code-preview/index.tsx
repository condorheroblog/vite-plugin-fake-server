import type { ReactNode } from "react";

interface CodePreviewProps {
	code: string;
	element: ReactNode;
}

export function CodePreview({ code, element }: CodePreviewProps) {
	return (
		<>
			<textarea className="code-textarea" value={code} readOnly rows={30} cols={50} />
			<div>{element}</div>
		</>
	);
}
