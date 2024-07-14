import "server-only";

import { db } from "@/database";
import {
	postTags,
	postTagsRelations,
	postVersions,
	postsToTags,
	postsVersionsToTags,
} from "@/database/schema";
import type { TCreatePostVersion } from "@/types/database/postVersion";
import { eq, desc, and } from "drizzle-orm";

export const getPostsVersions = async (postId: string) => {
	return db.select().from(postVersions).where(eq(postVersions.postId, postId));
};

export const getLatestPostVersion = async (postId: string) => {
	const latestPostVersion = await db.query.postVersions.findFirst({
		where: eq(postVersions.postId, postId),
		orderBy: desc(postVersions.postVersion),
		with: {
			tags: true,
		},
	});

	return latestPostVersion;
};

export const createPostVersion = async (newPostVersion: TCreatePostVersion) => {
	const { tags, imageLarge, imageSmall, ...newPostVersionWithoutTags } = newPostVersion;

	return db.transaction(async (tx) => {
		const currentPostVersions = await tx
			.select()
			.from(postVersions)
			.where(eq(postVersions.postId, newPostVersionWithoutTags.postId))
			.orderBy(desc(postVersions.postVersion))
			.limit(1);

		const currentPostVersion = currentPostVersions[0];

		const newPostResult = await db
			.insert(postVersions)
			.values({
				...newPostVersionWithoutTags,
				imageLarge: imageLarge ?? currentPostVersion?.imageLarge,
				imageSmall: imageSmall ?? currentPostVersion?.imageSmall,
				postVersion:
					currentPostVersion
						? currentPostVersion.postVersion + 1
						: 1,
				createdAt: new Date(),
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
