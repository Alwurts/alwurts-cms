"use server";

import { withAuthCheck } from "@/lib/auth";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import { PostVersionSchema } from "@/zod/postVersion";
import { revalidatePath } from "next/cache";

export const getLatestPostVersion = withAuthCheck(
	async (session, postId: string) => {
		const latestPostVersion = await postsVersionsProxy.getLatestPostVersion(postId);
    console.log("latestPostVersion", latestPostVersion);
		return latestPostVersion;
	},
);

export const publishLatestVersion = withAuthCheck(
	async (session, postId: string) => {
		const result = await postsVersionsProxy.publishLatestVersion(postId);
		revalidatePath("/editor");
		return result;
	},
);

export const markPublishedVersionAsFeatured = withAuthCheck(
	async (session, postId: string) => {
		const result =
			await postsVersionsProxy.markPublishedVersionAsFeatured(postId);
		revalidatePath("/editor");
		return result;
	},
);

export const createPostVersion = withAuthCheck(
	async (session, postFormData: FormData) => {
		const formData = Object.fromEntries(postFormData);
		const newPostVersion = PostVersionSchema.parse(formData);

		await postsVersionsProxy.createPostVersion({
			...newPostVersion,
			tags:
				newPostVersion.tags.length > 0
					? newPostVersion.tags.split(",").map((tag) => ({ name: tag }))
					: [],
		});

		revalidatePath(`/editor/${newPostVersion.postId}`);
		revalidatePath("/editor");
	},
);
