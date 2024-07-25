"use server";

import { withAuthCheck } from "@/lib/auth";
import * as postsProxy from "@/proxies/posts";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import { redirect } from "next/navigation";

export const getPosts = withAuthCheck(async () => {
	return await postsProxy.getPosts();
});

export const createPost = withAuthCheck(async () => {
	const newPost = await postsProxy.createPost({
		url: `new-post-${new Date().getTime()}`,
	});

	const newPostVersion = await postsVersionsProxy.createPostVersion({
		postId: newPost.id,
		url: newPost.url,
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
		url: newPost.url,
	});

	redirect(`/editor/${newPost.id}`);
});

export const getPublishedPosts = async () => {
	return await postsProxy.getPublishedPosts();
};

export const getPublishedFeaturedPosts = async () => {
	return await postsProxy.getPublishedFeaturedPosts();
};

export const getPublishedPostByUrl = async (url: string) => {
	return await postsProxy.getPublishedPostByUrl(url);
};
