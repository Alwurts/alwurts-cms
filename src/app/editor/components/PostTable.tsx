"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	TableCell,
	TableRow,
	Table,
	TableBody,
	TableHeader,
	TableHead,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Upload, XCircle } from "lucide-react";
import Link from "next/link";
import {
	markPublishedVersionAsFeatured,
	publishLatestVersion,
	unpublishLatestVersion,
} from "@/server-actions/post";
import { useMutation } from "@tanstack/react-query";
import type { TPost } from "@/types/database/post";
import { StarFilledIcon } from "@/components/icons/StartFilledIcon";
import { StarOutlineIcon } from "@/components/icons/StartOutlineIcon";

export default function PostTable({ posts }: { posts: TPost[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Title</TableHead>
					<TableHead>URL</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Version</TableHead>
					<TableHead>Author</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Featured</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{posts.map((post) => (
					<PostTableRow key={post.id} post={post} />
				))}
			</TableBody>
		</Table>
	);
}

function PostTableRow({ post }: { post: TPost }) {
	const handlePublishLatestVersion = useMutation({
		mutationFn: publishLatestVersion,
	});

	const handleUnpublish = useMutation({
		mutationFn: unpublishLatestVersion,
	});

	const handleMarkPublishedVersionAsFeatured = useMutation({
		mutationFn: markPublishedVersionAsFeatured,
	});

	const hasNewerVersion =
		post.latestVersion &&
		post.publishedVersion &&
		post.latestVersion.postVersion > post.publishedVersion.postVersion;

	return (
		<TableRow>
			<TableCell className="font-medium">
				{post.publishedVersion?.title ||
					post.latestVersion?.title ||
					"Untitled"}
			</TableCell>
			<TableCell>
				{post.publishedVersion?.url || post.latestVersion?.url}
			</TableCell>
			<TableCell>
				<Badge variant={post.publishedVersion ? "default" : "destructive"}>
					{post.publishedVersion ? "Published" : "Not published"}
				</Badge>
			</TableCell>
			<TableCell>
				{post.publishedVersion?.postVersion || post.latestVersion?.postVersion}
				{hasNewerVersion && (
					<Badge variant="outline" className="ml-2 text-yellow-500">
						New: v{post.latestVersion?.postVersion}
					</Badge>
				)}
			</TableCell>
			<TableCell>
				{post.publishedVersion?.author || post.latestVersion?.author}
			</TableCell>
			<TableCell>
				{new Date(
					post.publishedVersion?.date || post.latestVersion?.date || 0,
				).toLocaleDateString()}
			</TableCell>
			<TableCell>
				{post.publishedVersion?.isFeatured ? (
					<StarFilledIcon className="w-4 h-4 text-yellow-500" />
				) : (
					<StarOutlineIcon className="w-4 h-4" />
				)}
			</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link href={`/editor/${post.id}`}>Edit</Link>
						</DropdownMenuItem>
						{post.latestVersion && (
							<DropdownMenuItem
								onClick={() => handlePublishLatestVersion.mutate(post.id)}
								disabled={
									post.publishedVersion?.postVersion ===
									post.latestVersion.postVersion
								}
							>
								<Upload className="mr-2 h-4 w-4" />
								Publish latest version
							</DropdownMenuItem>
						)}
						{post.publishedVersion && (
							<>
								<DropdownMenuItem
									onClick={() => handleUnpublish.mutate(post.id)}
								>
									<XCircle className="mr-2 h-4 w-4" />
									Unpublish
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										handleMarkPublishedVersionAsFeatured.mutate(post.id)
									}
								>
									<Star className="mr-2 h-4 w-4" />
									{post.publishedVersion.isFeatured
										? "Unmark as featured"
										: "Mark as featured"}
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
