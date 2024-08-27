import type { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import type { postTags } from "@/database/schema";

export type TPostTag = InferQueryModel<"postTags">;

export type TCreatePostTag = InferInsertModel<typeof postTags>;

export type TUpdatePostTag = TPostTag;
