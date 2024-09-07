import { db } from "@/database";
import { posts, postsVersionsToTags, postVersions } from "@/database/schema";
import * as filesProxy from "@/proxies/files";
import type { TPost } from "@/types/database/post";
import { PostEditorFormSchema } from "@/zod/post";
import { linksSchema } from "@/zod/postLinks";
import { tagsSchema } from "@/zod/postTags";
import { and, eq, isNotNull } from "drizzle-orm";
import "server-only";

export const createPost = async (type: "project" | "blog") => {
	const newPostResult = await db
		.insert(posts)
		.values({
			type,
			url: `new-post-${new Date().getTime()}`,
			latestVersionId: 1,
		})
		.returning();

	const newPost = newPostResult[0];

	await db
		.insert(postVersions)
		.values({
			postId: newPost.id,
			url: newPost.url,
			title: "New Post",
			description: "New Post Description",
			content: "New Post Content",
			author: "Alwurts",
			date: new Date(),
			postVersion: 1,
			createdAt: new Date(),
			isFeatured: false,
			imageLargeId: null,
			imageSmallId: null,
		})
		.returning();

	return newPost;
};

export const updatePost = async (formData: FormData) => {
	const postFormData = Object.fromEntries(formData);
	const postData = PostEditorFormSchema.parse(postFormData);

	const { tags: tagsJson, type, ...postDataRest } = postData;

	const post = await getPostById(postData.postId);
	const previousLatestVersion = post?.latestVersion;

	if (!previousLatestVersion) {
		throw new Error("Post not found");
	}

	const imageLargeId = await filesProxy.handleImageUpdate(
		postDataRest.imageLarge,
		postDataRest.imageLargeDescription,
		previousLatestVersion?.imageLargeId,
	);

	const imageSmallId = await filesProxy.handleImageUpdate(
		postDataRest.imageSmall,
		postDataRest.imageSmallDescription,
		previousLatestVersion?.imageSmallId,
	);

	const tags = tagsSchema.parse(
		typeof tagsJson === "string" ? JSON.parse(tagsJson) : [],
	);

	const links = linksSchema.parse(
		typeof postDataRest.links === "string"
			? JSON.parse(postDataRest.links)
			: [],
	);

	const newPostVersionResult = await db
		.insert(postVersions)
		.values({
			author: postDataRest.author,
			date: new Date(postDataRest.date),
			title: postDataRest.title,
			description: postDataRest.description,
			content: postDataRest.content,
			links: links,
			postId: postDataRest.postId,
			url: postDataRest.url,
			postVersion: previousLatestVersion.postVersion + 1,
			isFeatured: previousLatestVersion?.isFeatured,
			imageLargeId: imageLargeId ?? previousLatestVersion?.imageLargeId,
			imageSmallId: imageSmallId ?? previousLatestVersion?.imageSmallId,
			createdAt: new Date(),
		})
		.returning();

	const newPostVersion = newPostVersionResult[0];

	if (tags && tags.length > 0) {
		await db.insert(postsVersionsToTags).values(
			tags.map((tag) => ({
				postId: postDataRest.postId,
				postVersion: newPostVersion.postVersion,
				tagName: tag,
			})),
		);
	}

	const updatePostResult = await db
		.update(posts)
		.set({
			latestVersionId: newPostVersion.postVersion,
			type: type,
		})
		.where(eq(posts.id, postDataRest.postId))
		.returning();
	return updatePostResult[0];
};

export const publishLatestVersion = async (postId: string) => {
	const post = await getPostById(postId);
	const latestVersion = post?.latestVersion;

	if (!latestVersion) {
		throw new Error("No latest version found");
	}

	const result = await db
		.update(posts)
		.set({
			publishedVersionId: latestVersion.postVersion,
			url: latestVersion.url,
		})
		.where(eq(posts.id, postId))
		.returning();

	await db
		.update(postVersions)
		.set({
			publishedAt: new Date(),
		})
		.where(
			and(
				eq(postVersions.postId, postId),
				eq(postVersions.postVersion, latestVersion.postVersion),
			),
		);
	return result[0];
};

export const unpublishLatestVersion = async (postId: string) => {
	const result = await db
		.update(posts)
		.set({
			publishedVersionId: null,
		})
		.where(eq(posts.id, postId))
		.returning();
	return result[0];
};

export const markPublishedVersionAsFeatured = async (postId: string) => {
	const post = await getPostById(postId);
	const publishedVersion = post?.publishedVersion;

	const result = await db
		.update(postVersions)
		.set({
			isFeatured: !publishedVersion?.isFeatured,
		})
		.where(eq(postVersions.postId, postId))
		.returning();

	return result[0];
};

export const getPostById = async (postId: string): Promise<TPost | null> => {
	const result = await db.query.posts.findFirst({
		where: eq(posts.id, postId),
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
	return result ?? null;
};

export type SortOption = "title" | "date" | "url" | "tags";
export type SortDirection = "asc" | "desc";

export const getPosts = async (
	sort: SortOption = "url",
	direction: SortDirection = "asc",
): Promise<TPost[]> => {
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

	function sortPosts(
		posts: TPost[],
		sort: SortOption,
		direction: SortDirection,
	): TPost[] {
		return [...posts].sort((a, b) => {
			let comparison = 0;
			switch (sort) {
				case "title": {
					const aTitle =
						a.publishedVersion?.title || a.latestVersion?.title || "";
					const bTitle =
						b.publishedVersion?.title || b.latestVersion?.title || "";
					comparison = aTitle.localeCompare(bTitle);
					break;
				}
				case "date": {
					const aDate =
						a.publishedVersion?.date || a.latestVersion?.date || new Date(0);
					const bDate =
						b.publishedVersion?.date || b.latestVersion?.date || new Date(0);
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

	return sortPosts(result, sort, direction);
};

/* export const getPublishedPosts = async () => {
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
}; */

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

export const getPublishedFeaturedProjects = async () => {
	const result = await getPublishedProjects();
	return result.filter((post) => post.isFeatured);
};

export const getPublishedProjects = async () => {
	const result = await db.query.posts.findMany({
		where: and(isNotNull(posts.publishedVersionId), eq(posts.type, "project")),
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
	const publishedProjects = result
		.map((post) => post.publishedVersion)
		.filter((post): post is NonNullable<typeof post> => !!post);
	publishedProjects.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
	return publishedProjects;
};

export const getPublishedBlogs = async () => {
	const result = await db.query.posts.findMany({
		where: and(isNotNull(posts.publishedVersionId), eq(posts.type, "blog")),
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
	const publishedBlogs = result
		.map((post) => post.publishedVersion)
		.filter((post): post is NonNullable<typeof post> => !!post);
	publishedBlogs.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
	return publishedBlogs;
};
