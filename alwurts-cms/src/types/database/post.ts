import type { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import type { posts } from "@/database/schema";

export type TPost = InferQueryModel<"posts">;

export type TCreatePost = Omit<
	InferInsertModel<typeof posts>,
	"id" | "createdAt" | "publishedAt" | "isPublished"
>;

export type TUpdatePost = TPost;
