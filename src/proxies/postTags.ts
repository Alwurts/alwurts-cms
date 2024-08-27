import { db } from "@/database";
import { postTags } from "@/database/schema";
import type { TCreatePostTag } from "@/types/database/postTags";
import { sql } from "drizzle-orm";
import "server-only";

export const createPostTag = async (postTag: TCreatePostTag) => {
	const result = await db.insert(postTags).values(postTag).returning();
	return result[0];
};

export const getPostTags = async () => {
	const result = await db.query.postTags.findMany();
	return result;
};

export const getPostTagsFilter = async (filter: string) => {
	const result = await db.query.postTags.findMany({
		where: (postTags) =>
			sql`LOWER(${postTags.name}) LIKE ${`${filter.toLowerCase()}%`}`,
	});
	return result;
};
