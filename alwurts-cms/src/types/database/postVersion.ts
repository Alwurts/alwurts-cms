import type { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import type { postVersions } from "@/database/schema";

export type TPostVersion = InferQueryModel<"postVersions">;

export type TCreatePostVersion = Omit<
	InferInsertModel<typeof postVersions>,
	"postVersion" | "createdAt" | "publishedAt" | "isPublished"
>;

export type TUpdatePostVersion = TPostVersion;
