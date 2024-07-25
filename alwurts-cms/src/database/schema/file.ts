import { relations } from "drizzle-orm";
import {
	date,
	integer,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { posts, postVersions } from "./post";

export const files = pgTable("files", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	size: integer("size").notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	url: varchar("url", { length: 255 }).notNull(),
	date: date("date").notNull(),
	createdAt: timestamp("created_at").notNull(),
});

export const filesRelations = relations(files, ({ many }) => ({
	postsImageLarge: many(posts, { relationName: "imageLarge" }),
	postsImageSmall: many(posts, { relationName: "imageSmall" }),
	postVersionsImageLarge: many(postVersions, { relationName: "imageLarge" }),
	postVersionsImageSmall: many(postVersions, { relationName: "imageSmall" }),
}));
