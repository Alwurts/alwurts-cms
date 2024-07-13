"use server";

import { db } from "@/database";
import * as postsProxy from "@/proxies/posts";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import type { TCreatePost } from "@/types/database/post";
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
		});

		await postsVersionsProxy.createPostVersion({
			postId: newPost.id,
			title: newPost.title,
			description: newPost.description,
			content: newPost.content,
			author: newPost.author,
		});

		return newPost;
	});

	redirect(`/editor/${newPostTransaction.id}`);
}
