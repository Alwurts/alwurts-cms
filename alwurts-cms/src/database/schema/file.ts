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

export const files = pgTable("files", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	size: integer("size").notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	date: date("date").notNull(),
	createdAt: timestamp("created_at").notNull(),
});

export const filesRelations = relations(files, ({ many }) => ({
	//versions: many(postVersions),
}));
