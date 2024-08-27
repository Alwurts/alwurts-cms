import type { Metadata } from "next";
import { auth } from "@/auth";
import { MainLayout } from "@/components/layout/MainLayout";
import { redirect } from "next/navigation";
import MainLoader from "@/components/skeleton/MainLoader";
import { Suspense } from "react";
export const metadata: Metadata = {
	title: "Alwurts CMS",
	description: "Alejandro CMS",
};

export default async function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const authSession = await auth();
	if (!authSession?.user) {
		redirect("/");
	}

	return (
		<MainLayout>
			<Suspense fallback={<MainLoader />}>{children}</Suspense>
		</MainLayout>
	);
}
