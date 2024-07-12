import type { Metadata } from "next";
/* import { auth } from "@/auth"; */
import { MainLayout } from "@/components/layout/MainLayout";
export const metadata: Metadata = {
	title: "Alwurts CMS",
	description: "Alejandro CMS",
};

export default async function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	/* const authSession = await auth();
	if (!authSession?.user?.id) {
		redirect("/signin");
	} */

	return <MainLayout>{children}</MainLayout>;
}
