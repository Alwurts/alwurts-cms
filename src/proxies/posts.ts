import { db } from "@/database";
import { posts, postVersions } from "@/database/schema";
import type { TCreatePost, TPost } from "@/types/database/post";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
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

export type SortOption = "title" | "date" | "url" | "tags";
export type SortDirection = "asc" | "desc";

export const getPosts = async (sort: SortOption = "url", direction: SortDirection = "asc"): Promise<TPost[]> => {
	const result = await db.query.posts.findMany({
		with: {
			tags: true,
			versions: true,
			latestVersion: {
				with: {
					imageLarge: true,
					imageSmall: true,
					tags: true,
				},
			},
			publishedVersion: {
				with: {
					imageLarge: true,
					imageSmall: true,
					tags: true,
				},
			},
		},
	});

	return sortPosts(result, sort, direction);
};

function sortPosts(posts: TPost[], sort: SortOption, direction: SortDirection): TPost[] {
	return [...posts].sort((a, b) => {
		let comparison = 0;
		switch (sort) {
			case "title": {
				const aTitle = a.publishedVersion?.title || a.latestVersion?.title || "";
				const bTitle = b.publishedVersion?.title || b.latestVersion?.title || "";
				comparison = aTitle.localeCompare(bTitle);
				break;
			}
			case "date": {
				const aDate = a.publishedVersion?.date || a.latestVersion?.date || new Date(0);
				const bDate = b.publishedVersion?.date || b.latestVersion?.date || new Date(0);
				comparison = aDate.getTime() - bDate.getTime();
				break;
			}
			case "url":
				comparison = (a.url || "").localeCompare(b.url || "");
				break;
			case "tags": {
				const aTags = a.publishedVersion?.tags || a.latestVersion?.tags || [];
				const bTags = b.publishedVersion?.tags || b.latestVersion?.tags || [];
				comparison = aTags.length - bTags.length;
				break;
			}
		}
		return direction === "asc" ? comparison : -comparison;
	});
}

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
