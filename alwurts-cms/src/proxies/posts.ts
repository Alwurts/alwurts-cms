import { db } from "@/database";
import { posts } from "@/database/schema";
import type { TCreatePost } from "@/types/database/post";
import "server-only";

export const createPost = async (post: TCreatePost) => {
	const result = await db.insert(posts).values(post).returning();
	return result[0];
};

export const updatePost = async (post: TCreatePost) => {
	const result = await db.update(posts).set(post).returning();
	return result[0];
};

export const getPosts = async () => {
	const result = await db.query.posts.findMany({
		with: {
			tags: true,
			versions: true,
			publishedVersion: {
				with: {
					imageLarge: true,
					imageSmall: true,
					tags: true,
				},
			},
			latestVersion: {
				with: {
					imageLarge: true,
					imageSmall: true,
					tags: true,
				},
			},
		},
	});
	console.log("result", result);
	return result;
};
