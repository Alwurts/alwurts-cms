import { sql } from 'drizzle-orm';
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	body: text("body").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`),
	updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const postVersions = pgTable("post_versions", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id").notNull().references(() => posts.id),
	body: text("body").notNull(),
	versionNumber: integer("version_number").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`),
}, (table) => {
	return {
		// An index is added on postId and versionNumber for efficient querying of versions for a specific post.
		postIdVersionIdx: index("post_id_version_idx").on(table.postId, table.versionNumber),
	}
});