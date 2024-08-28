"use server";

import { withAuthCheck } from "@/lib/auth";
import * as postsProxy from "@/proxies/posts";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import { redirect } from "next/navigation";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export const getPosts = withAuthCheck(async (_, sort: postsProxy.SortOption = "url", direction: postsProxy.SortDirection = "asc") => {
	return await postsProxy.getPosts(sort, direction);
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

export const getPublishedPosts = unstable_cache(
	postsProxy.getPublishedPosts,
	["getPublishedPosts"],
	{
		tags: ["getPublishedPosts"],
	},
);

export const getPublishedFeaturedPosts = unstable_cache(
	postsProxy.getPublishedFeaturedPosts,
	["getPublishedFeaturedPosts"],
	{
		tags: ["getPublishedFeaturedPosts"],
	},
);

export const getPublishedPostByUrl = unstable_cache(
	postsProxy.getPublishedPostByUrl,
	["getPublishedPostByUrl"],
	{
		tags: ["getPublishedPostByUrl"],
	},
);
