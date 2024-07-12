import { db } from "@/database";
import { posts } from "@/database/schema";
import type { TCreatePost } from "@/types/database/post";
import "server-only";

export const createPost = async (post: TCreatePost) => {
	const result = await db
		.insert(posts)
		.values({
			...post,
			createdAt: new Date(),
		})
		.returning();
	return result;
};
