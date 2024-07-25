import React from "react";
import type { SVGProps } from "react";

export function StarFilledIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={30}
			height={30}
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Star</title>
			<path
				fill="currentColor"
				d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
			/>
		</svg>
	);
}
