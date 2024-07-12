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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TPost } from "@/types/database/post";
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PostCard({ post }: { post: TPost }) {
	const [activeTab, setActiveTab] = useState("current");
	const [isExpanded, setIsExpanded] = useState(false);

	const truncatedContent =
		post.content.slice(0, 150) + (post.content.length > 150 ? "..." : "");

	return (
		<Card className="w-full mb-6">
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
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList>
						<TabsTrigger value="current">Current Version</TabsTrigger>
						<TabsTrigger value="history">Version History</TabsTrigger>
					</TabsList>
					<TabsContent value="current">
						<p>{isExpanded ? post.content : truncatedContent}</p>
						{post.content.length > 150 && (
							<Button variant="link" onClick={() => setIsExpanded(!isExpanded)}>
								{isExpanded ? "Show Less" : "Read More"}
							</Button>
						)}
						{/* <div className="flex items-center space-x-4 mt-4">
							<span className="flex items-center">
								<EyeIcon className="w-4 h-4 mr-1" /> {post.views}
							</span>
							<span className="flex items-center">
								<ThumbsUpIcon className="w-4 h-4 mr-1" /> {post.likes}
							</span>
							<span className="flex items-center">
								<MessageSquareIcon className="w-4 h-4 mr-1" /> {post.comments}
							</span>
						</div> */}
					</TabsContent>
					<TabsContent value="history">
						<ScrollArea className="h-[200px]">
							{post.versions.map((version) => (
								<div
									key={version.postVersion}
									className="mb-4 p-4 border rounded"
								>
									<h4 className="font-bold">Version {version.postVersion}</h4>
									<p className="text-sm text-gray-500">
										Created: {new Date(version.createdAt).toLocaleString()}
									</p>
									<p className="mt-2">{version.content.slice(0, 100)}...</p>
									<Badge
										variant={version.isPublished ? "default" : "secondary"}
										className="mt-2"
									>
										{version.isPublished ? "Published" : "Draft"}
									</Badge>
								</div>
							))}
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</CardContent>
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
