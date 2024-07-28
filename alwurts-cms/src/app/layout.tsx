import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Alwurts",
	description: "Alejandro Wurts personal page",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<QueryProvider>
					<ThemeProvider attribute="class">{children}</ThemeProvider>
				</QueryProvider>
				<Toaster />
				<Script
					defer
					src="https://umami.alwurts.com/script.js"
					data-website-id="c3f69501-4467-4f4b-abf5-7b4ee80f34fe"
				/>
			</body>
		</html>
	);
}
