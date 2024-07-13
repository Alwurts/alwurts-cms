"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const DarkModeToggle = () => {
	const { systemTheme, theme, setTheme } = useTheme();
	//const currentTheme = theme === "system" ? systemTheme : theme;

	return (
		<Button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			variant="ghost"
			className="w-10 h-10 relative overflow-hidden"
		>
			<div
				className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out"
				style={{
					transform: `translateY(${theme === "dark" ? "0%" : "-100%"})`,
				}}
			>
				<MoonIcon className="w-4 h-4" />
			</div>
			<div
				className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
				style={{ transform: `translateY(${theme === "dark" ? "100%" : "0%"})` }}
			>
				<SunIcon className="w-4 h-4" />
			</div>
		</Button>
	);
};

export default DarkModeToggle;
