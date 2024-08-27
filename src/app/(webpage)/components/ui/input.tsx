import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex font-semibold h-10 w-full rounded-[1px] border-b-[3px] border-x-none border-t-none border-input-alwurts bg-background-alwurts px-3 py-2 text-base ring-offset-background-alwurts file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground-alwurts placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-alwurts focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
