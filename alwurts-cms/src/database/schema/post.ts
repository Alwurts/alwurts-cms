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
import { postsToTags, postsVersionsToTags } from "./postTags";

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: varchar("title", { length: 255 }).notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	content: text("content").notNull(),
	author: varchar("author", { length: 255 }).notNull(),
	date: date("date").notNull(),
	imageLarge: varchar("image_large", { length: 255 }),
	imageSmall: varchar("image_small", { length: 255 }),
	isFeatured: boolean("is_featured").notNull().default(false),
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
		description: varchar("description", { length: 255 }).notNull(),
		content: text("content").notNull(),
		author: varchar("author", { length: 255 }).notNull(),
		date: date("date").notNull(),
		imageLarge: varchar("image_large", { length: 255 }),
		imageSmall: varchar("image_small", { length: 255 }),
		isFeatured: boolean("is_featured").notNull().default(false),
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

export const postVersionsRelations = relations(
	postVersions,
	({ one, many }) => ({
		post: one(posts, {
			fields: [postVersions.postId],
			references: [posts.id],
		}),
		tags: many(postsVersionsToTags),
	}),
);