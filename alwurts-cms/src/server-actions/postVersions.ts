"use server";

import { db } from "@/database";
import { uploadImage } from "@/lib/s3";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import type { TUpdatePost } from "@/types/database/post";
import type { TUpdatePostVersion } from "@/types/database/postVersion";
import { PostVersionSchema } from "@/zod/postVersion";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPostsVersions(postId: string) {
	return await postsVersionsProxy.getPostsVersions(postId);
}

export async function getLatestPostVersion(postId: string) {
	return await postsVersionsProxy.getLatestPostVersion(postId);
}

export async function createPostVersion(postFormData: FormData) {
	console.log("postFormData", postFormData);
	const post = PostVersionSchema.parse(Object.fromEntries(postFormData));

	const { imageLarge, imageSmall, ...postData } = post;
	if (!post.postId) {
		throw new Error("Post ID is required");
	}

	let imageLargeUrl: string | undefined;
	let imageSmallUrl: string | undefined;

	if (imageLarge) {
		imageLargeUrl = await uploadImage(imageLarge);
	}
	if (imageSmall) {
		imageSmallUrl = await uploadImage(imageSmall);
	}

	await postsVersionsProxy.createPostVersion({
		postId: postData.postId,
		title: postData.title,
		description: postData.description,
		content: postData.content,
		author: postData.author,
		tags:
			postData.tags.length > 0
				? postData.tags.split(",").map((tag) => ({ name: tag }))
				: [],
		date: postData.date,
		imageLarge: imageLargeUrl,
		imageSmall: imageSmallUrl,
	});

	revalidatePath(`/editor/${postData.postId}`);
	revalidatePath("/editor");
}
