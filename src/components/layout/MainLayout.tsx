import DynamicBreadcrumb from "@/components/breadcrumb/DynamicBreadcrumb";
import { SidebarNavigation } from "@/components/layout/navigation/SidebarNavigation";
import { MobileNavigation } from "@/components/layout/navigation/MobileNavigation";
import { UserActions } from "@/components/layout/navigation/UserActions";

export function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<SidebarNavigation />
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
					<MobileNavigation />
					<DynamicBreadcrumb homePath="/editor" homeTitle="Editor home" />
					<UserActions />
				</header>
				<main>{children}</main>
			</div>
		</div>
	);
}
