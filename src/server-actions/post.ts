"use server";

import { withAuthCheck } from "@/lib/auth";
import * as postsProxy from "@/proxies/posts";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export const getPosts = withAuthCheck(
	async (
		_,
		sort: postsProxy.SortOption = "url",
		direction: postsProxy.SortDirection = "asc",
	) => {
		return await postsProxy.getPosts(sort, direction);
	},
);

export const getPostById = withAuthCheck(async (_, postId: string) => {
	const post = await postsProxy.getPostById(postId);
	/* console.log("links", post?.latestVersion?.links); */
	return post;
});

export const createPost = withAuthCheck(async (_, type: "project" | "blog") => {
	const newPost = await postsProxy.createPost(type);

	redirect(`/editor/${newPost.id}`);
});

export const updatePost = withAuthCheck(async (_, formData: FormData) => {
	const result = await postsProxy.updatePost(formData);
	//revalidatePath(`/editor/${result.id}`);
	revalidatePath("/editor");
});

export const publishLatestVersion = withAuthCheck(async (_, postId: string) => {
	const result = await postsProxy.publishLatestVersion(postId);
	revalidatePath("/editor");
	revalidateTag("getPublishedPosts");
	revalidateTag("getPublishedFeaturedPosts");
	revalidateTag("getPublishedPostByUrl");
	return result;
});

export const unpublishLatestVersion = withAuthCheck(
	async (_, postId: string) => {
		const result = await postsProxy.unpublishLatestVersion(postId);
		revalidatePath("/editor");
		revalidateTag("getPublishedPosts");
		revalidateTag("getPublishedFeaturedPosts");
		revalidateTag("getPublishedPostByUrl");
		return result;
	},
);

export const markPublishedVersionAsFeatured = withAuthCheck(
	async (_, postId: string) => {
		const result = await postsProxy.markPublishedVersionAsFeatured(postId);
		revalidatePath("/editor");
		revalidateTag("getPublishedPosts");
		revalidateTag("getPublishedFeaturedPosts");
		revalidateTag("getPublishedPostByUrl");
		return result;
	},
);

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
