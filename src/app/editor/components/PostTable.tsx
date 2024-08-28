"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
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
	unpublish,
} from "@/server-actions/postVersions";
import { useMutation } from "@tanstack/react-query";
import type { TPost } from "@/types/database/post";

export default function PostTableRow({ post }: { post: TPost }) {
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
		<TableRow>
			<TableCell className="font-medium">
				{post.publishedVersion?.url || post.latestVersion?.url}
			</TableCell>
			<TableCell>
				<Badge
					variant={post.publishedVersion ? "default" : "destructive"}
				>
					{post.publishedVersion ? "Published" : "Not published"}
				</Badge>
			</TableCell>
			<TableCell>
				{post.publishedVersion?.postVersion ||
					post.latestVersion?.postVersion}
			</TableCell>
			<TableCell>
				{post.publishedVersion?.author || post.latestVersion?.author}
			</TableCell>
			<TableCell>
				{(
					post.publishedVersion?.date || post.latestVersion?.date
				)?.toDateString()}
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
									post.latestVersion?.postVersion
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
