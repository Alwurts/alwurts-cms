import type { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import type { posts, postTags } from "@/database/schema";

export type TPost = InferQueryModel<
	"posts",
	undefined,
	{
		tags: true;
		versions: true;
	}
>;

export type TCreatePost = Omit<
	InferInsertModel<typeof posts>,
	"id" | "createdAt" | "publishedAt" | "isPublished"
>;

export type TUpdatePost = Omit<
	InferInsertModel<typeof posts>,
	"createdAt" | "publishedAt" | "isPublished"
> & {
	tags: InferInsertModel<typeof postTags>[];
};
