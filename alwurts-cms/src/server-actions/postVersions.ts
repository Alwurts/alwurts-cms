"use server";

import { db } from "@/database";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import type { TUpdatePost } from "@/types/database/post";
import type { TUpdatePostVersion } from "@/types/database/postVersion";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPostsVersions(postId: string) {
	return await postsVersionsProxy.getPostsVersions(postId);
}

export async function getLatestPostVersion(postId: string) {
	return await postsVersionsProxy.getLatestPostVersion(postId);
}

export async function createPostVersion(post: TUpdatePostVersion) {
	if (!post.postId) {
		throw new Error("Post ID is required");
	}

	await postsVersionsProxy.createPostVersion({
		postId: post.postId,
		title: post.title,
		description: post.description,
		content: post.content,
		author: post.author,
		tags: post.tags,
	});

	revalidatePath(`/editor/${post.postId}`);
	revalidatePath("/editor");
}
