import { relations, sql } from "drizzle-orm";
import {
	boolean,
	date,
	foreignKey,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { postVersions, posts } from "./post";

export const postTags = pgTable("post_tags", {
	name: varchar("tag", { length: 255 }).primaryKey().notNull(),
});

export const postTagsRelations = relations(postTags, ({ many }) => ({
	posts: many(postsToTags),
	//postsVersions: many(postsVersionsToTags),
}));

export const postsToTags = pgTable(
	"posts_to_tags",
	{
		postId: uuid("post_id")
			.references(() => posts.id)
			.notNull(),
		tagName: varchar("tag_name")
			.references(() => postTags.name)
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.postId, t.tagName] }),
	}),
);

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
	tag: one(postTags, {
		fields: [postsToTags.tagName],
		references: [postTags.name],
	}),
	post: one(posts, {
		fields: [postsToTags.postId],
		references: [posts.id],
	}),
}));


export const postsVersionsToTags = pgTable(
	"posts_versions_to_tags",
	{
		postId: uuid("post_id").notNull(),
		postVersion: integer("post_version").notNull(),
		tagName: varchar("tag_name")
			.references(() => postTags.name)
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.postId, t.postVersion, t.tagName] }),
		postVersionReference: foreignKey({
			columns: [t.postId, t.postVersion],
			foreignColumns: [postVersions.postId, postVersions.postVersion],
			name: "posts_versions_to_tags_post_version_fkey",
		}),
	}),
);

export const postsVersionsToTagsRelations = relations(
	postsVersionsToTags,
	({ one }) => ({
		postVersion: one(postVersions, {
			fields: [postsVersionsToTags.postId, postsVersionsToTags.postVersion],
			references: [postVersions.postId, postVersions.postVersion],
		}),
	}),
);
