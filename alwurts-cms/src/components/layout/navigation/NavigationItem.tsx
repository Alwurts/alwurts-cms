"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationRoute } from "./navigationRoutes";

export function NavigationItem({
	item,
	matchExact = true,
	type,
}: {
	item: NavigationRoute;
	matchExact?: boolean;
	type: "sidebar" | "panel";
}) {
	const pathname = usePathname();
	const isActive = matchExact
		? pathname === item.href
		: pathname.startsWith(item.href);

	if (type === "panel") {
		return (
			<Link
				href={item.href}
				className={cn(
					"flex items-center gap-4 px-2.5",
					isActive
						? "text-foreground"
						: "text-muted-foreground hover:text-foreground",
				)}
			>
				<item.icon className="h-5 w-5" />
				{item.title}
			</Link>
		);
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={item.href}
						className={cn(
							"flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
							isActive
								? "bg-accent text-accent-foreground"
								: "text-muted-foreground",
						)}
					>
						<item.icon className="h-5 w-5" />
						{<span className="sr-only">{item.title}</span>}
					</Link>
				</TooltipTrigger>
				<TooltipContent side="right">{item.title}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
