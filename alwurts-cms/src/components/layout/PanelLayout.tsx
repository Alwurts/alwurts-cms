"use client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function PanelLayout({
	title,
	description,
	open,
	children,
}: {
	title: string;
	description: string;
	open:
		| {
				key: string;
				value: string | string[];
		  }
		| {
				open: boolean;
				setOpen: (open: boolean) => void;
		  };
} & Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const openFlag =
		"open" in open
			? open.open
			: Array.isArray(open.value)
				? open.value.includes(searchParams.get(open.key) || "")
				: open.value === searchParams.get(open.key);

	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog
				open={openFlag}
				onOpenChange={(newOpen) => {
					if (!newOpen) {
						if ("setOpen" in open) {
							open.setOpen(false);
						} else {
							router.push(pathname);
						}
					}
				}}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="sr-only">
							{description}
						</DialogDescription>
					</DialogHeader>
					{children}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer
			open={openFlag}
			onOpenChange={(newOpen) => {
				if (!newOpen) {
					if ("setOpen" in open) {
						open.setOpen(false);
					} else {
						router.push(pathname);
					}
				}
			}}
		>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription className="sr-only">
						{description}
					</DrawerDescription>
				</DrawerHeader>
				<div className="px-4 pb-4 pt-2">{children}</div>
			</DrawerContent>
		</Drawer>
	);
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
	return (
		<form className={cn("grid items-start gap-4", className)}>
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input type="email" id="email" defaultValue="shadcn@example.com" />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="username">Username</Label>
				<Input id="username" defaultValue="@shadcn" />
			</div>
			<Button type="submit">Save changes</Button>
		</form>
	);
}
