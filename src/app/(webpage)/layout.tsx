import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { buttonVariants } from "./components/ui/button";
import { cn } from "@/lib/utils";
import { MailIcon } from "@/components/icons/MailIcon";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedInIcon";
import { XIcon } from "@/components/icons/XIcon";
import { Suspense } from "react";
import MobileNav from "./components/MobileNav";
import DesktopNav from "./components/DesktopNav";
import MainLoader from "@/components/skeleton/MainLoader";

const roboto = Roboto({
	weight: ["100", "300", "400", "500", "700", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Alwurts",
	description: "Alejandro Wurts website",
};

const links = [
	{ label: "Projects", href: "/projects" },
	{ label: "Blog", href: "/blogs" },
	{ label: "About", href: "/#about" },
	{ label: "Contact", href: "/#about" },
];

export default function WebpageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div
			className={cn(
				"bg-background-alwurts text-foreground-alwurts flex flex-col min-h-screen",
				roboto.className,
			)}
		>
			<MobileNav links={links} />
			<DesktopNav links={links} />
			<main className={cn("pt-20")}>
				<Suspense fallback={<MainLoader />}>{children}</Suspense>
			</main>
			<footer className="bg-background-alwurts flex flex-col items-center space-y-6 py-14 mt-auto">
				<div className="flex items-center justify-center space-x-3">
					<Link
						className={buttonVariants({ variant: "outline", size: "icon" })}
						href="https://github.com/alwurts"
					>
						<GithubIcon className="w-10 h-10" />
					</Link>
					<Link
						className={buttonVariants({ variant: "outline", size: "icon" })}
						href="https://www.linkedin.com/in/alejandrowurts/"
					>
						<LinkedinIcon className="w-10 h-10" />
					</Link>
					<Link
						className={buttonVariants({ variant: "outline", size: "icon" })}
						href="https://x.com/alwurts"
					>
						<XIcon className="w-10 h-10" />
					</Link>
					<Link
						className={buttonVariants({ variant: "outline", size: "icon" })}
						href="mailto:alejandrowurts@gmail.com"
					>
						<MailIcon className="w-10 h-10" />
					</Link>
				</div>
				<div className="text-xl space-y-2 font-semibold text-center">
					<p>© 2024 Alejandro Wurts</p>
					<p>All Rights Reserved</p>
				</div>
			</footer>
		</div>
	);
}
