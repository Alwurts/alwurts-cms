"use client";

import Link from "next/link";
import { NavigationItem } from "@/components/layout/navigation/NavigationItem";
import { navigationRoutes } from "./navigationRoutes";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings } from "lucide-react";
import LogoMonochrome from "@/components/icons/LogoMonochrome";

export function SidebarNavigation() {
	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
				<Link
					href="/editor"
					className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
				>
					<LogoMonochrome className="h-6 w-6 transition-all group-hover:scale-110" />
					<span className="sr-only">Alwurts CMS</span>
				</Link>
				{navigationRoutes.map((item) => (
					<NavigationItem key={item.title} type="sidebar" item={item}/>
				))}
			</nav>
			<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href="#"
								className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							>
								<Settings className="h-5 w-5" />
								<span className="sr-only">Settings</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Settings</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</nav>
		</aside>
	);
}
