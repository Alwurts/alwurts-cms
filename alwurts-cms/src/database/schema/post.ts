import { relations, sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const postTags = pgTable("post_tags", {
	name: varchar("tag", { length: 255 }).primaryKey().notNull(),
});

export const postTagsRelations = relations(postTags, ({ many }) => ({
	posts: many(postsToTags),
}));

export const postsToTags = pgTable(
	"posts_to_tags",
	{
		postId: uuid("post_id").references(() => posts.id),
		tagName: varchar("tag_name").references(() => postTags.name),
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

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: varchar("title", { length: 255 }).notNull(),
	content: text("content").notNull(),
	author: varchar("author", { length: 255 }).notNull(),
	isPublished: boolean("is_published").notNull().default(false),
	createdAt: timestamp("created_at").notNull(),
	publishedAt: timestamp("published_at"),
});

export const postsRelations = relations(posts, ({ many }) => ({
	tags: many(postsToTags),
	versions: many(postVersions),
}));

export const postVersions = pgTable(
	"post_versions",
	{
		postId: uuid("post_id")
			.notNull()
			.references(() => posts.id),
		postVersion: integer("post_version").notNull(),
		title: varchar("title", { length: 255 }).notNull(),
		content: text("content").notNull(),
		author: varchar("author", { length: 255 }).notNull(),
		isPublished: boolean("is_published").notNull().default(false),
		publishedAt: timestamp("published_at"),
		createdAt: timestamp("created_at").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.postId, table.postVersion],
			}),
		};
	},
);

export const postVersionsRelations = relations(postVersions, ({ one }) => ({
	post: one(posts, {
		fields: [postVersions.postId],
		references: [posts.id],
	}),
}));
