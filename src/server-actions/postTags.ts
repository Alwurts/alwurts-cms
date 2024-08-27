"use server";

import { withAuthCheck } from "@/lib/auth";
import * as postTagsProxy from "@/proxies/postTags";
import type { TCreatePostTag } from "@/types/database/postTags";
import { z } from "zod";

export const getPostTagsFilter = withAuthCheck(async (session, filter: string) => {
	if (filter.length === 0) {
		return await postTagsProxy.getPostTags();
	}
	return await postTagsProxy.getPostTagsFilter(filter);
});

export const createPostTag = withAuthCheck(async (session, postTag: TCreatePostTag) => {
	const zodTag = z.object({
		name: z.string(),
	});
	const tag = zodTag.parse(postTag);
	return await postTagsProxy.createPostTag({
		name: tag.name.toLowerCase(),
	});
});
