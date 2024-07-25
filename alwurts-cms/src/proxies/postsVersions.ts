import "server-only";

import { db } from "@/database";
import { postVersions, posts, postsVersionsToTags } from "@/database/schema";
import type { TCreatePostVersion } from "@/types/database/postVersion";
import { eq, desc } from "drizzle-orm";
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

export const publishLatestVersion = async (postId: string) => {
	const latestVersion = await getLatestPostVersion(postId);
	const result = await db.update(posts).set({
		publishedVersionId: latestVersion?.postVersion,
	}).returning();
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

		await tx.update(posts).set({
			latestVersionId: newPostVersionId,
		});

		return newPostResult[0];
	});
};
