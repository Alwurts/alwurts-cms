"use server";

import * as postsVersionsProxy from "@/proxies/postsVersions";
import { PostVersionSchema } from "@/zod/postVersion";
import { revalidatePath } from "next/cache";

export async function getPostsVersions(postId: string) {
	return await postsVersionsProxy.getPostsVersions(postId);
}

export async function getLatestPostVersion(postId: string) {
	return await postsVersionsProxy.getLatestPostVersion(postId);
}

export async function createPostVersion(postFormData: FormData) {
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
}