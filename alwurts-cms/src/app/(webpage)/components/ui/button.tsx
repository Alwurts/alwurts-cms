import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// input

const buttonVariants = cva(
	"rounded-[200px] dark:rounded-[200px] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background-alwurts transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-alwurts focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"bg-primary-alwurts text-primary-foreground-alwurts hover:bg-primary-alwurts/90",
				outline:
					"border-[3px] border-input-alwurts font-bold bg-background-alwurts hover:bg-accent-alwurts hover:text-accent-foreground-alwurts",
				ghost: "rounded-full font-bold hover:bg-accent-alwurts hover:text-accent-foreground-alwurts",
				link: "font-bold text-primary-alwurts underline-offset-4 hover:underline hover:text-accent-alwurts",
			},
			size: {
        sm: "h-9 px-3 text-base",
				default: "h-10 px-4 py-2 text-md",
				lg: "h-11 px-8 text-lg",
				xl: "h-14 px-10 text-xl",
				icon: "h-16 w-16 p-2 border-[4px]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
