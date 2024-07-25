"use server";

import { withAuthCheck } from "@/lib/auth";
import * as postsVersionsProxy from "@/proxies/postsVersions";
import { PostVersionSchema } from "@/zod/postVersion";
import { revalidatePath } from "next/cache";

export const getLatestPostVersion = withAuthCheck(async (session, postId: string) => {
	return await postsVersionsProxy.getLatestPostVersion(postId);
});

export const publishLatestVersion = withAuthCheck(async (session, postId: string) => {
	const result = await postsVersionsProxy.publishLatestVersion(postId);
	revalidatePath("/editor");
	return result;
});

export const createPostVersion = withAuthCheck(async (session, postFormData: FormData) => {
  console.log("postFormData", postFormData);
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
});