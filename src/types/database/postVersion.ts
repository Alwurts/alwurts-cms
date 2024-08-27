import type { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import type { postTags, postVersions } from "@/database/schema";
import type { ZPostVersion } from "@/zod/postVersion";

export type TPostVersion = InferQueryModel<
	"postVersions",
	undefined,
	{
		tags: true;
		imageLarge: true;
		imageSmall: true;
	}
>;

export type TCreatePostVersion = Omit<ZPostVersion, "tags"> & {
	tags: InferInsertModel<typeof postTags>[];
};
