import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { buttonVariants } from "./components/ui/button";
import Logo from "@/components/icons/Logo";
import { cn } from "@/lib/utils";
import { MailIcon } from "@/components/icons/MailIcon";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedInIcon";
import { XIcon } from "@/components/icons/XIcon";
import DarkModeToggle from "./components/DarkModeToggle";

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
	{ label: "About", href: "/#about" },
	{ label: "Contact", href: "/#about" },
];

export default async function WebpageLayout({
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
			<nav className="fixed inset-x-0 top-0 z-50 bg-background-alwurts/80 backdrop-blur-sm h-fit">
				<div className="mx-auto px-6 md:px-12 flex justify-between max-w-6xl h-20 py-3">
					<Link href="/" className="flex hover:opacity-80 transition-opacity">
						<Logo className="w-auto h-auto" />
					</Link>
					<div className="flex items-center space-x-8">
						<div className="flex items-center space-x-4">
							{links.map((link) => (
								<Link
									key={link.href}
									className={buttonVariants({
										variant: "link",
										//size: "xl",
										className: "text-xl",
									})}
									href={link.href}
								>
									{link.label}
								</Link>
							))}
						</div>
						<DarkModeToggle />
					</div>
				</div>
			</nav>
			<main className={cn("pt-20")}>{children}</main>
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
