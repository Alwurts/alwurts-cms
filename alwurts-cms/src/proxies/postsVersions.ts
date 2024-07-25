import "server-only";

import { db } from "@/database";
import { postVersions, postsVersionsToTags } from "@/database/schema";
import type { TCreatePostVersion } from "@/types/database/postVersion";
import { eq, desc } from "drizzle-orm";
import { uploadImage } from "@/lib/s3";
import * as filesProxy from "@/proxies/files";

export const getPostsVersions = async (postId: string) => {
	return db.select().from(postVersions).where(eq(postVersions.postId, postId));
};

export const getLatestPostVersion = async (postId: string) => {
	const latestPostVersion = await db.query.postVersions.findFirst({
		where: eq(postVersions.postId, postId),
		orderBy: desc(postVersions.postVersion),
		with: {
			tags: true,
			imageLarge: true,
			imageSmall: true,
		},
	});

	return latestPostVersion;
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

		const newPostResult = await db
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
			await db.insert(postsVersionsToTags).values(
				tags.map((tag) => ({
					postId: newPostVersionWithoutTags.postId,
					postVersion: newPostVersionId,
					tagName: tag.name,
				})),
			);
		}

		return newPostResult;
	});
};
