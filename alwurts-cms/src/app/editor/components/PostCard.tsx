"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TPost } from "@/types/database/post";
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostCard({ post }: { post: TPost }) {
	const [activeTab, setActiveTab] = useState("current");
	const [isExpanded, setIsExpanded] = useState(false);

	const truncatedContent =
		post.content.slice(0, 150) + (post.content.length > 150 ? "..." : "");

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>{post.title}</span>
					<Badge variant={post.isPublished ? "default" : "secondary"}>
						{post.isPublished ? "Published" : "Draft"}
					</Badge>
				</CardTitle>
				<CardDescription>
					<div className="flex items-center space-x-2 mb-2">
						<CalendarIcon className="w-4 h-4" />
						<span>Created: {new Date(post.createdAt).toLocaleString()}</span>
						{post.publishedAt && (
							<>
								<ClockIcon className="w-4 h-4 ml-2" />
								<span>
									Published: {new Date(post.publishedAt).toLocaleString()}
								</span>
							</>
						)}
					</div>
					<div className="flex items-center space-x-2">
						<span>By: {post.author}</span>
						<TagIcon className="w-4 h-4 ml-2" />
						{post.tags.map((tag) => (
							<Badge key={tag.tagName} variant="outline">
								{tag.tagName}
							</Badge>
						))}
					</div>
				</CardDescription>
			</CardHeader>
			{/* <CardContent>
				
			</CardContent> */}
			<CardFooter className="flex justify-between">
				<Button variant={post.isPublished ? "secondary" : "default"}>
					{post.isPublished ? "Unpublish" : "Publish"}
				</Button>
				<Link
					className={buttonVariants({ variant: "outline" })}
					href={`/editor/${post.id}`}
				>
					Edit
				</Link>
			</CardFooter>
		</Card>
	);
}
