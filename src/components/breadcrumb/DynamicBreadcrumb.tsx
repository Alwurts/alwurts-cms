"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formatTitle = (segment: string) => {
	// Convert kebab-case or snake_case to Title Case
	return segment
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const DynamicBreadcrumb = ({ homePath = "/app", homeTitle = "App" }) => {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");

	// Remove the segments that make up the homePath
	const homeSegments = homePath.split("/").filter((segment) => segment !== "");
	const relevantSegments = pathSegments.slice(homeSegments.length);

	const breadcrumbItems = relevantSegments.map((segment, index) => {
		const href = `${homePath}/${relevantSegments.slice(0, index + 1).join("/")}`;
		const isLast = index === relevantSegments.length - 1;
		const title = formatTitle(segment);

		return (
			<React.Fragment key={href}>
				<BreadcrumbItem>
					{isLast ? (
						<BreadcrumbPage>{title}</BreadcrumbPage>
					) : (
						<BreadcrumbLink asChild>
							<Link href={href}>{title}</Link>
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				{!isLast && <BreadcrumbSeparator />}
			</React.Fragment>
		);
	});

	return (
		<Breadcrumb className="hidden md:flex">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href={homePath}>{homeTitle}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{relevantSegments.length > 0 && <BreadcrumbSeparator />}
				{breadcrumbItems}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default DynamicBreadcrumb;
