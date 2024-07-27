"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, buttonVariants } from "./ui/button";
import Logo from "@/components/icons/Logo";
import DarkModeToggle from "./DarkModeToggle";
import { cn } from "@/lib/utils";

interface NavLink {
	label: string;
	href: string;
}

interface MobileNavProps {
	links: NavLink[];
}

export default function MobileNav({ links }: MobileNavProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<>
			<nav
				className={cn(
					"md:hidden fixed inset-x-0 top-0 z-50 backdrop-blur-sm h-fit",
					isMenuOpen ? "bg-background-alwurts" : "bg-background-alwurts/80",
				)}
			>
				<div className="mx-auto px-6 flex justify-between max-w-6xl h-20 py-3">
					<Link href="/" className="flex hover:opacity-80 transition-opacity">
						<Logo className="w-auto h-auto" />
					</Link>
					<Button
						type="button"
						variant="link"
						className="flex flex-col justify-center items-center shrink-0 self-center"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<span
							className={`bg-current h-0.5 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
						/>
						<span
							className={`bg-current h-0.5 w-6 rounded-full transition-all duration-300 my-1 ${isMenuOpen ? "opacity-0" : ""}`}
						/>
						<span
							className={`bg-current h-0.5 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
						/>
					</Button>
				</div>
			</nav>
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="md:hidden fixed inset-x-0 top-20 z-50 backdrop-blur-sm h-screen"
					>
						<div className="flex flex-col items-center space-y-4 py-6 bg-background-alwurts">
							{links.map((link) => (
								<Link
									key={link.href}
									className={buttonVariants({
										variant: "link",
										className: "text-xl",
									})}
									href={link.href}
									onClick={() => setIsMenuOpen(false)}
								>
									{link.label}
								</Link>
							))}
							<DarkModeToggle />
						</div>
						<div
							className="h-full w-full bg-black/70"
							onClick={() => setIsMenuOpen(false)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									setIsMenuOpen(false);
								}
							}}
							role="button"
							tabIndex={0}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}