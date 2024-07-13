"use server";

import * as postTagsProxy from "@/proxies/postTags";
import type { TCreatePostTag } from "@/types/database/postTags";
import { z } from "zod";

export async function getPostTags() {
	return await postTagsProxy.getPostTags();
}

export async function getPostTagsFilter(filter: string) {
	if (filter.length === 0) {
		return await postTagsProxy.getPostTags();
	}
	return await postTagsProxy.getPostTagsFilter(filter);
}

export async function createPostTag(postTag: TCreatePostTag) {
	const zodTag = z.object({
		name: z.string(),
	});
	const tag = zodTag.parse(postTag);
	return await postTagsProxy.createPostTag({
		name: tag.name.toLowerCase(),
	});
}
