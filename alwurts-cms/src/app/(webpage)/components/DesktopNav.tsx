import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Logo from "@/components/icons/Logo";
import DarkModeToggle from "./DarkModeToggle";

interface NavLink {
	label: string;
	href: string;
}

interface DesktopNavProps {
	links: NavLink[];
}

export default function DesktopNav({ links }: DesktopNavProps) {
	return (
		<nav className="hidden md:block fixed inset-x-0 top-0 z-50 bg-background-alwurts/80 backdrop-blur-sm h-fit">
			<div className="mx-auto px-12 flex justify-between max-w-6xl h-20 py-3">
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
	);
}
