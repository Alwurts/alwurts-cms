import "server-only";

import { db } from "@/database";
import { postVersions } from "@/database/schema";
import type { TCreatePostVersion } from "@/types/database/postVersion";
import { eq, desc } from "drizzle-orm";

export const createPostVersion = async (newPostVersion: TCreatePostVersion) => {
	const currentPostVersion = await db
		.select()
		.from(postVersions)
		.where(eq(postVersions.postId, newPostVersion.postId))
		.orderBy(desc(postVersions.postVersion))
		.limit(1);

	const result = await db
		.insert(postVersions)
		.values({
			...newPostVersion,
			postVersion:
				currentPostVersion.length > 0
					? currentPostVersion[0].postVersion + 1
					: 1,
			createdAt: new Date(),
		})
		.returning();
	return result;
};
