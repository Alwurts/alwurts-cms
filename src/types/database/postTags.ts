import type { InferInsertModel } from "drizzle-orm";
import type { postTags } from "@/database/schema";

export type TCreatePostTag = InferInsertModel<typeof postTags>;
