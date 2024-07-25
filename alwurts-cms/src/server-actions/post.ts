"use server";

import { db } from "@/database";
import { withAuthCheck } from "@/lib/auth";
import * as postsProxy from "@/proxies/posts";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import type { TUpdatePost } from "@/types/database/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getPosts = withAuthCheck(async () => {
	return await postsProxy.getPosts();
});

export const createPost = withAuthCheck(async () => {
	const newPost = await postsProxy.createPost({});

	const newPostVersion = await postsVersionsProxy.createPostVersion({
		postId: newPost.id,
		title: "New Post",
		description: "New Post Description",
		content: "New Post Content",
		author: "Alwurts",
		date: new Date(),
		tags: [],
	});

	if (!newPostVersion) {
		throw new Error("Failed to create post version");
	}

	await postsProxy.updatePost(newPost.id, {
		latestVersionId: newPostVersion.postVersion,
	});

	redirect(`/editor/${newPost.id}`);
});
