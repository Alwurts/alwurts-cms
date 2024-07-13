import type { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import type { postTags, postVersions } from "@/database/schema";

export type TPostVersion = InferQueryModel<
	"postVersions",
	undefined,
	{
		tags: true;
	}
>;

export type TCreatePostVersion = Omit<
	InferInsertModel<typeof postVersions>,
	"postVersion" | "createdAt" | "publishedAt" | "isPublished"
> & {
	tags: InferInsertModel<typeof postTags>[];
};

export type TUpdatePostVersion = Omit<
	InferInsertModel<typeof postVersions>,
	"postVersion" | "createdAt" | "publishedAt" | "isPublished"
> & {
	tags: InferInsertModel<typeof postTags>[];
};
