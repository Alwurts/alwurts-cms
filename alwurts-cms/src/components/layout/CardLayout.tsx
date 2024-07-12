import type React from "react";
import type { ReactNode } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { isReactNode } from "@/lib/types";

export function CardLayout({
	layoutTools,
	cardHeaderContent: headerContent,
	cardFooterContent: footerContent,
	children,
}: {
	layoutTools?: ReactNode;
	cardHeaderContent: ReactNode | { title: string; description: string };
	cardFooterContent?: ReactNode;
} & Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col gap-4 p-4 sm:px-6 sm:py-0">
			<div className="flex items-center">
				<div className="ml-auto">{layoutTools}</div>
			</div>
			<Card>
				<CardHeader>
					{isReactNode(headerContent) ? (
						headerContent
					) : (
						<>
							<CardTitle>{headerContent.title}</CardTitle>
							<CardDescription>{headerContent.description}</CardDescription>
						</>
					)}
				</CardHeader>
				<CardContent>{children}</CardContent>
				{footerContent && <CardFooter>{footerContent}</CardFooter>}
			</Card>
		</div>
	);
}
