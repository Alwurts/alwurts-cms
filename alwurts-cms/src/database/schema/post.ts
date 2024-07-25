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
	time,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { postsToTags, postsVersionsToTags } from "./postTags";
import { files } from "./file";

export const posts = pgTable(
	"posts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		isFeatured: boolean("is_featured").notNull().default(false),
		latestVersionId: integer("latest_version_id"),
		publishedVersionId: integer("published_version_id"),
	},
);

export const postsRelations = relations(posts, ({ many, one }) => ({
	tags: many(postsToTags),
	versions: many(postVersions),
	latestVersion: one(postVersions, {
		fields: [posts.id, posts.latestVersionId],
		references: [postVersions.postId, postVersions.postVersion],
	}),
	publishedVersion: one(postVersions, {
		fields: [posts.id, posts.publishedVersionId],
		references: [postVersions.postId, postVersions.postVersion],
	}),
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
		date: date("date", { mode: "date" }).notNull(),
		imageLargeId: uuid("image_large_id").references(() => files.id),
		imageSmallId: uuid("image_small_id").references(() => files.id),
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
		imageLarge: one(files, {
			relationName: "imageLarge",
			fields: [postVersions.imageLargeId],
			references: [files.id],
		}),
		imageSmall: one(files, {
			relationName: "imageSmall",
			fields: [postVersions.imageSmallId],
			references: [files.id],
		}),
	}),
);
