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
import Image from "next/image";
import type { TPost } from "@/types/database/post";
import {
	CalendarIcon,
	ChevronDownIcon,
	ClockIcon,
	ImageIcon,
	LinkIcon,
	Loader2Icon,
	StarIcon,
	TagIcon,
	TextIcon,
	User2Icon,
} from "lucide-react";
import Link from "next/link";
import {
	markPublishedVersionAsFeatured,
	publishLatestVersion,
	unpublish,
} from "@/server-actions/postVersions";
import type { TPostVersion } from "@/types/database/postVersion";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StarFilledIcon } from "@/components/icons/StartFilledIcon";
import { StarOutlineIcon } from "@/components/icons/StartOutlineIcon";
import LoadingButton from "@/components/ui/loading-button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

function PostCardContent({
	post,
	version,
	className,
}: {
	post: TPostVersion;
	version: "published" | "latest";
	className?: string;
}) {
	return (
		<div className={cn(className, "flex flex-col h-full")}>
			<div
				className={cn("space-y-1 p-4 border-2 rounded-md flex-grow", {
					"border-dashed": version === "latest",
				})}
			>
				<h3 className="text-base font-medium capitalize">
					{`${version}: ${post.postVersion}`}
				</h3>
				<div className="flex flex-col gap-4">
					<div>
						<div className="flex items-center space-x-2 text-sm">
							<LinkIcon className="w-4 h-4" />
							<span>URL: {post.url}</span>
						</div>

						<div className="flex items-center space-x-2 text-sm">
							<CalendarIcon className="w-4 h-4" />
							<span>Date: {post.date.toDateString()}</span>
						</div>
						<div className="flex items-center space-x-2 text-sm">
							<User2Icon className="w-4 h-4" />
							<span>Author: {post.author}</span>
						</div>

						<div className="flex items-center space-x-2 text-sm">
							<TagIcon className="w-4 h-4" />
							{post.tags.map((tag) => (
								<Badge key={tag.tagName} variant="outline">
									{tag.tagName}
								</Badge>
							))}
						</div>
					</div>
					<Accordion type="single" collapsible className="w-full text-sm" defaultValue="small-image">
						<AccordionItem value="small-image">
							<AccordionTrigger className="py-2">Small Image</AccordionTrigger>
							<AccordionContent>
								<div className="flex flex-col items-start gap-2">
									{post.imageSmall ? (
										<Image
											src={post.imageSmall.url ?? ""}
											alt={post.imageSmall.description ?? ""}
											width={150}
											height={150}
											className="object-contain h-[150px] w-auto border-2 border-stone-400 rounded-md"
										/>
									) : (
										<div>No image small</div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="large-image">
							<AccordionTrigger className="py-2">Large Image</AccordionTrigger>
							<AccordionContent>
								<div className="flex flex-col items-start gap-2">
									{post.imageLarge ? (
										<Image
											src={post.imageLarge.url ?? ""}
											alt={post.imageLarge.description ?? ""}
											width={150}
											height={150}
											className="object-contain h-[150px] w-auto border-2 border-stone-400 rounded-md"
										/>
									) : (
										<div>No image large</div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	);
}

export default function PostCard({
	post: { id: postId, publishedVersion, latestVersion },
}: { post: TPost }) {
	const handlePublishLatestVersion = useMutation({
		mutationFn: publishLatestVersion,
	});

	const handleUnpublish = useMutation({
		mutationFn: unpublish,
	});

	const handleMarkPublishedVersionAsFeatured = useMutation({
		mutationFn: markPublishedVersionAsFeatured,
	});

	return (
		<Card className="w-full h-full flex flex-col">
			<CardHeader className="flex-shrink-0">
				<CardTitle className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 text-base sm:text-lg">
					<span className="truncate">
						{publishedVersion ? publishedVersion.url : latestVersion?.url}
					</span>
					<Badge variant={publishedVersion ? "default" : "destructive"}>
						{publishedVersion ? "Published" : "Not published"}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow overflow-auto flex flex-col">
				{publishedVersion && latestVersion ? (
					<div className="flex flex-col gap-2 h-full">
						<PostCardContent
							post={publishedVersion}
							version="published"
							className="flex-grow"
						/>
						{publishedVersion.postVersion < latestVersion.postVersion && (
							<span className="text-destructive px-6 mt-3">{`Published version is ${latestVersion.postVersion - publishedVersion.postVersion} version${latestVersion.postVersion - publishedVersion.postVersion > 1 ? "s" : ""} behind latest version`}</span>
						)}
					</div>
				) : latestVersion ? (
					<PostCardContent
						post={latestVersion}
						version="latest"
						className="flex-grow"
					/>
				) : null}
			</CardContent>
			<CardFooter className="flex-shrink-0 flex flex-wrap justify-start gap-2 mt-4">
				{latestVersion && (
					<Collapsible className="w-full">
						<div className="flex flex-wrap justify-start gap-2">
							{publishedVersion &&
								latestVersion?.postVersion > publishedVersion?.postVersion && (
									<CollapsibleTrigger
										className={buttonVariants({
											variant: "outline",
											className: "",
											size: "sm",
										})}
									>
										See latest version
										<ChevronDownIcon className="w-4 h-4" />
									</CollapsibleTrigger>
								)}
							<LoadingButton
								size="sm"
								isLoading={handlePublishLatestVersion.isPending}
								disabled={
									handlePublishLatestVersion.isPending ||
									publishedVersion?.postVersion === latestVersion?.postVersion
								}
								onClick={() => handlePublishLatestVersion.mutate(postId)}
							>
								{publishedVersion?.postVersion === latestVersion?.postVersion
									? "Latest version is published"
									: "Publish latest version"}
							</LoadingButton>
							{publishedVersion && (
								<LoadingButton
									size="sm"
									disabled={handleUnpublish.isPending}
									onClick={() => handleUnpublish.mutate(postId)}
									isLoading={handleUnpublish.isPending}
								>
									Unpublish
								</LoadingButton>
							)}
							{publishedVersion && (
								<LoadingButton
									size="sm"
									variant="outline"
									isLoading={handleMarkPublishedVersionAsFeatured.isPending}
									onClick={() =>
										handleMarkPublishedVersionAsFeatured.mutate(postId)
									}
								>
									{publishedVersion?.isFeatured ? (
										<StarFilledIcon className="w-4 h-4 text-yellow-500" />
									) : (
										<StarOutlineIcon className="w-4 h-4" />
									)}
								</LoadingButton>
							)}
							<Link
								className={buttonVariants({ variant: "outline" })}
								href={`/editor/${postId}`}
							>
								Edit
							</Link>
						</div>
						{publishedVersion &&
							latestVersion?.postVersion > publishedVersion?.postVersion && (
								<CollapsibleContent>
									<PostCardContent post={latestVersion} version="latest" />
								</CollapsibleContent>
							)}
					</Collapsible>
				)}
			</CardFooter>
		</Card>
	);
}
