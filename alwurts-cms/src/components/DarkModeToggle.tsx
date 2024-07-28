"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const DarkModeToggle = () => {
	const { systemTheme, theme, setTheme } = useTheme();
	const [currentTheme, setCurrentTheme] = useState<string | undefined>(
		undefined,
	);

	useEffect(() => {
		setCurrentTheme(theme === "system" ? systemTheme : theme);
	}, [systemTheme, theme]);

	const toggleTheme = () => {
		if (currentTheme === "dark") {
			setTheme("light");
		} else if (currentTheme === "light") {
			setTheme("system");
		} else {
			setTheme("dark");
		}
	};

	if (currentTheme === undefined) return null;

	return (
		<Button
			onClick={toggleTheme}
			variant="ghost"
			className="w-10 h-10 relative overflow-hidden"
		>
			<div
				className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out"
				style={{
					transform: `translateY(${currentTheme === "dark" ? "0%" : "-100%"})`,
				}}
			>
				<MoonIcon className="w-4 h-4" />
			</div>
			<div
				className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
				style={{
					transform: `translateY(${currentTheme === "dark" ? "100%" : "0%"})`,
				}}
			>
				<SunIcon className="w-4 h-4" />
			</div>
		</Button>
	);
};

export default DarkModeToggle;
