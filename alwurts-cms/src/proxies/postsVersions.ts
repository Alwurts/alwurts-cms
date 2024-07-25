import "server-only";

import { db } from "@/database";
import { postVersions, posts, postsVersionsToTags } from "@/database/schema";
import type { TCreatePostVersion } from "@/types/database/postVersion";
import { eq, desc, and } from "drizzle-orm";
import * as filesProxy from "@/proxies/files";

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
	return result[0];
};

export const createPostVersion = async (newPostVersion: TCreatePostVersion) => {
	const {
		tags,
		imageLarge,
		imageSmall,
		imageLargeDescription,
		imageSmallDescription,
		...newPostVersionWithoutTags
	} = newPostVersion;

	return db.transaction(async (tx) => {
		const currentPostVersions = await tx
			.select()
			.from(postVersions)
			.where(eq(postVersions.postId, newPostVersionWithoutTags.postId))
			.orderBy(desc(postVersions.postVersion))
			.limit(1);

		const currentPostVersion = currentPostVersions[0];

		const imageLargeId = await filesProxy.handleImageUpdate(
			imageLarge,
			imageLargeDescription,
			currentPostVersion?.imageLargeId,
		);

		const imageSmallId = await filesProxy.handleImageUpdate(
			imageSmall,
			imageSmallDescription,
			currentPostVersion?.imageSmallId,
		);

		const newPostResult = await tx
			.insert(postVersions)
			.values({
				...newPostVersionWithoutTags,
				imageLargeId: imageLargeId ?? currentPostVersion?.imageLargeId,
				imageSmallId: imageSmallId ?? currentPostVersion?.imageSmallId,
				postVersion: currentPostVersion
					? currentPostVersion.postVersion + 1
					: 1,
				createdAt: new Date(),
				date:
					newPostVersion.date instanceof Date
						? newPostVersion.date
						: new Date(newPostVersion.date),
				publishedAt: currentPostVersion?.publishedAt
					? new Date()
					: null,
				isFeatured: currentPostVersion?.isFeatured,
			})
			.returning();

		const newPostVersionId = newPostResult[0].postVersion;

		console.log("tags", tags);

		if (tags.length > 0) {
			await tx.insert(postsVersionsToTags).values(
				tags.map((tag) => ({
					postId: newPostVersionWithoutTags.postId,
					postVersion: newPostVersionId,
					tagName: tag.name,
				})),
			);
		}

		await tx
			.update(posts)
			.set({
				latestVersionId: newPostVersionId,
			})
			.where(eq(posts.id, newPostResult[0].postId));

		return newPostResult[0];
	});
};
