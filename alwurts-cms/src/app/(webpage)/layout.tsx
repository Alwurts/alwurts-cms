import type { Metadata } from "next";
import { auth } from "@/auth";
import { MainLayout } from "@/components/layout/MainLayout";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
	title: "Alwurts",
	description: "Alejandro Wurts website",
};

export default async function WebpageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			Only on webpage
			{children}
		</div>
	);
}
