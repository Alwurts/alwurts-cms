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
	return result[0];
};

export const getPosts = async () => {
	const result = await db.query.posts.findMany({
		with: {
			tags: true,
			versions: true,
		},
	});
	return result;
};

export const getPost = async (id: string) => {
	const result = await db.query.posts.findFirst({
		where: (posts, { eq }) => eq(posts.id, id),
		with: {
			tags: true,
			versions: true,
		},
	});
	return result;
};
