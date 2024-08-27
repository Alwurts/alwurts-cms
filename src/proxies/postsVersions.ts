import "server-only";

import { db } from "@/database";
import { postVersions, posts, postsVersionsToTags } from "@/database/schema";
import type { TCreatePostVersion } from "@/types/database/postVersion";
import { eq, desc, and } from "drizzle-orm";
import * as filesProxy from "@/proxies/files";
import { revalidateTag } from "next/cache";

export const getLatestPostVersion = async (postId: string) => {
	const latestPostVersion = await db.query.posts.findFirst({
		where: eq(posts.id, postId),
		with: {
			latestVersion: {
				with: {
					imageLarge: true,
					imageSmall: true,
					tags: true,
				},
			},
		},
	});

	return latestPostVersion?.latestVersion;
};

export const getPublishedVersion = async (postId: string) => {
	const publishedVersion = await db.query.posts.findFirst({
		where: eq(posts.id, postId),
		with: {
			publishedVersion: {
				with: {
					imageLarge: true,
					imageSmall: true,
					tags: true,
				},
			},
		},
	});
	return publishedVersion?.publishedVersion;
};

export const publishLatestVersion = async (postId: string) => {
	const latestVersion = await getLatestPostVersion(postId);

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
	revalidateTag("getPublishedPosts");
	revalidateTag("getPublishedFeaturedPosts");
	revalidateTag("getPublishedPostByUrl");
	return result[0];
};

export const unpublish = async (postId: string) => {
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
	const publishedVersion = await getPublishedVersion(postId);
	const result = await db
		.update(postVersions)
		.set({
			isFeatured: !publishedVersion?.isFeatured,
		})
		.where(eq(postVersions.postId, postId))
		.returning();
	revalidateTag("getPublishedPosts");
	revalidateTag("getPublishedFeaturedPosts");
	revalidateTag("getPublishedPostByUrl");
	return result[0];
};

export const createPostVersion = async (newPostVersion: TCreatePostVersion) => {
	const { publish, tags, ...newPostVersionRest } = newPostVersion;

	const newPostResult = await db.transaction(async (tx) => {
		const previousLatestPostVersion = await getLatestPostVersion(
			newPostVersionRest.postId,
		);

		const imageLargeId = await filesProxy.handleImageUpdate(
			newPostVersionRest.imageLarge,
			newPostVersionRest.imageLargeDescription,
			previousLatestPostVersion?.imageLargeId,
		);

		const imageSmallId = await filesProxy.handleImageUpdate(
			newPostVersionRest.imageSmall,
			newPostVersionRest.imageSmallDescription,
			previousLatestPostVersion?.imageSmallId,
		);

		const newPostResult = await tx
			.insert(postVersions)
			.values({
				...newPostVersionRest,
				postVersion: previousLatestPostVersion
					? previousLatestPostVersion.postVersion + 1
					: 1,
				links:
					typeof newPostVersionRest.links === "string"
						? JSON.parse(newPostVersionRest.links)
						: newPostVersionRest.links,
				isFeatured: previousLatestPostVersion?.isFeatured,
				imageLargeId: imageLargeId ?? previousLatestPostVersion?.imageLargeId,
				imageSmallId: imageSmallId ?? previousLatestPostVersion?.imageSmallId,
				date:
					newPostVersionRest.date instanceof Date
						? newPostVersionRest.date
						: new Date(newPostVersionRest.date),
				createdAt: new Date(),
				/* publishedAt: previousLatestPostVersion?.publishedAt
					? new Date()
					: null, */
			})
			.returning();

		const newPostVersionVersion = newPostResult[0].postVersion;

		// Add tags to post version relation
		if (tags.length > 0) {
			await tx.insert(postsVersionsToTags).values(
				tags.map((tag) => ({
					postId: newPostVersionRest.postId,
					postVersion: newPostVersionVersion,
					tagName: tag.name,
				})),
			);
		}

		await tx
			.update(posts)
			.set({
				latestVersionId: newPostVersionVersion,
			})
			.where(eq(posts.id, newPostResult[0].postId));

		return newPostResult[0];
	});

	if (newPostVersion.publish) {
		await publishLatestVersion(newPostVersionRest.postId);
	}

	return newPostResult;
};
