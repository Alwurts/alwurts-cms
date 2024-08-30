import { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import { posts, postVersions } from "@/database/schema/post";

export type TPost = InferQueryModel<
	"posts",
	undefined,
	{
		tags: true;
		versions: true;
		publishedVersion: {
			with: {
				imageLarge: true;
				imageSmall: true;
				tags: true;
			};
		};
		latestVersion: {
			with: {
				imageLarge: true;
				imageSmall: true;
				tags: true;
			};
		};
	}
>;
