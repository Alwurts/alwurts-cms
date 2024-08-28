"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import type { TPost } from "@/types/database/post";
import {
	CalendarIcon,
	LinkIcon,
	TagIcon,
	User2Icon,
	ChevronDownIcon,
	StarIcon,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
	markPublishedVersionAsFeatured,
	publishLatestVersion,
	unpublish,
} from "@/server-actions/postVersions";
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

export default function PostCards({ posts }: { posts: TPost[] }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
			{posts.map((post) => {
				const version = post.publishedVersion || post.latestVersion;
				if (!version) return null; // Skip if no version is available

				const handlePublishLatestVersion = useMutation({
					mutationFn: publishLatestVersion,
				});

				const handleUnpublish = useMutation({
					mutationFn: unpublish,
				});

				const handleMarkPublishedVersionAsFeatured = useMutation({
					mutationFn: markPublishedVersionAsFeatured,
				});

				const hasNewerVersion = post.latestVersion && post.publishedVersion && 
					post.latestVersion.postVersion > post.publishedVersion.postVersion;

				return (
					<Card key={post.id} className="w-full h-full flex flex-col">
						{hasNewerVersion && (
							<div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm font-medium">
								Newer version available (v{post.latestVersion?.postVersion})
							</div>
						)}
						<CardHeader className="flex-shrink-0">
							<CardTitle className="text-base font-medium capitalize flex justify-between items-center">
								<span className="truncate">{version.title}</span>
								<Badge variant={post.publishedVersion ? "default" : "secondary"}>
									{post.publishedVersion ? "Published" : "Draft"}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="flex-grow overflow-auto">
							<div className="flex flex-col gap-4">
								<div>
									<div className="flex items-center space-x-2 text-sm">
										<LinkIcon className="w-4 h-4" />
										<span className="truncate">URL: {version.url}</span>
									</div>

									<div className="flex items-center space-x-2 text-sm">
										<CalendarIcon className="w-4 h-4" />
										<span>Date: {new Date(version.date).toLocaleDateString()}</span>
									</div>
									<div className="flex items-center space-x-2 text-sm">
										<User2Icon className="w-4 h-4" />
										<span>Author: {version.author}</span>
									</div>

									<div className="flex items-center space-x-2 text-sm flex-wrap">
										<TagIcon className="w-4 h-4" />
										{version.tags.map((tag) => (
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
												{version.imageSmall ? (
													<Image
														src={version.imageSmall.url ?? ""}
														alt={version.imageSmall.description ?? ""}
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
												{version.imageLarge ? (
													<Image
														src={version.imageLarge.url ?? ""}
														alt={version.imageLarge.description ?? ""}
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
						</CardContent>
						<CardFooter className="flex-shrink-0 flex flex-wrap justify-start gap-2 mt-4">
							<div className="flex flex-wrap justify-start gap-2 w-full">
								{hasNewerVersion && (
									<LoadingButton
										size="sm"
										isLoading={handlePublishLatestVersion.isPending}
										onClick={() => handlePublishLatestVersion.mutate(post.id)}
									>
										Publish latest version
									</LoadingButton>
								)}
								{post.publishedVersion && (
									<LoadingButton
										size="sm"
										variant="outline"
										disabled={handleUnpublish.isPending}
										onClick={() => handleUnpublish.mutate(post.id)}
										isLoading={handleUnpublish.isPending}
									>
										Unpublish
									</LoadingButton>
								)}
								{post.publishedVersion && (
									<LoadingButton
										size="sm"
										variant="outline"
										isLoading={handleMarkPublishedVersionAsFeatured.isPending}
										onClick={() => handleMarkPublishedVersionAsFeatured.mutate(post.id)}
									>
										{post.publishedVersion?.isFeatured ? (
											<StarFilledIcon className="w-4 h-4 text-yellow-500" />
										) : (
											<StarOutlineIcon className="w-4 h-4" />
										)}
									</LoadingButton>
								)}
								<Link
									className={buttonVariants({ variant: "outline", size: "sm" })}
									href={`/editor/${post.id}`}
								>
									Edit
								</Link>
							</div>
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}
