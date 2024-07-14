"use server";

import { db } from "@/database";
import * as postsProxy from "@/proxies/posts";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import type { TUpdatePost } from "@/types/database/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPosts() {
	return await postsProxy.getPosts();
}

export async function getPost(id: string) {
	return await postsProxy.getPost(id);
}

export async function createPost() {
	const newPostTransaction = await db.transaction(async (tx) => {
		const newPost = await postsProxy.createPost({
			title: "New Post",
			description: "New Post Description",
			content: "New Post Content",
			author: "Alwurts",
			date: new Date().toISOString(),
		});

		await postsVersionsProxy.createPostVersion({
			postId: newPost.id,
			title: newPost.title,
			description: newPost.description,
			content: newPost.content,
			author: newPost.author,
			date: newPost.date,
			tags: [],
		});

		return newPost;
	});

	redirect(`/editor/${newPostTransaction.id}`);
}