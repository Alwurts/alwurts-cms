import { db } from "@/database";
import { posts } from "@/database/schema";
import type { TCreatePost } from "@/types/database/post";
import { and, asc, desc, eq, isNotNull } from "drizzle-orm";
import "server-only";

export const createPost = async (post: TCreatePost) => {
	const result = await db.insert(posts).values(post).returning();
	return result[0];
};

export const updatePost = async (postId: string, post: TCreatePost) => {
	const result = await db
		.update(posts)
		.set(post)
		.where(eq(posts.id, postId))
		.returning();
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
		orderBy: asc(posts.url),
	});
	return result;
};

export const getPublishedPosts = async () => {
	const result = await db.query.posts.findMany({
		where: isNotNull(posts.publishedVersionId),
		with: {
			publishedVersion: {
				with: {
					tags: true,
					imageSmall: true,
					imageLarge: true,
				},
			},
		},
	});
	const publishedPosts = result.map((post) => post.publishedVersion);

	const filteredPublishedPosts = publishedPosts.filter((post) => !!post);
	filteredPublishedPosts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
	return filteredPublishedPosts;
};

export const getPublishedPostByUrl = async (url: string) => {
	const result = await db.query.posts.findFirst({
		where: and(eq(posts.url, url), isNotNull(posts.publishedVersionId)),
		with: {
			publishedVersion: {
				with: {
					tags: true,
					imageSmall: true,
					imageLarge: true,
				},
			},
		},
	});
	return result?.publishedVersion;
};

export const getPublishedFeaturedPosts = async () => {
	const result = await getPublishedPosts();
	return result.filter((post) => post.isFeatured);
};
