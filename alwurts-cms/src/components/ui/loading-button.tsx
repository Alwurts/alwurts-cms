"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
	isLoading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
	children,
	isLoading = false,
	disabled,
	...props
}) => {
	return (
		<Button disabled={disabled || isLoading} {...props}>
			{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{children}
		</Button>
	);
};

export default LoadingButton;
