"use client";

import Link from "next/link";
import { NavigationItem } from "@/components/layout/navigation/NavigationItem";
import { navigationRoutes } from "./navigationRoutes";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
	SheetHeader,
	SheetDescription,
} from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import LogoMonochrome from "@/components/icons/LogoMonochrome";

export function MobileNavigation() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size="icon" variant="outline" className="sm:hidden">
					<PanelLeft className="h-5 w-5" />
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="sm:max-w-xs">
				<SheetHeader className="sr-only">
					<SheetTitle>Navigation Menu</SheetTitle>
					<SheetDescription>
						Navigation menu for Alwurts CMS
					</SheetDescription>
				</SheetHeader>
				<nav className="grid gap-6 text-lg font-medium">
					<Link
						href="/editor"
						className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
					>
						<LogoMonochrome className="h-6 w-6 transition-all group-hover:scale-110" />
						<span className="sr-only">Alwurts CMS</span>
					</Link>
					{navigationRoutes.map((item) => (
						<NavigationItem key={item.title} type="panel" item={item} />
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
