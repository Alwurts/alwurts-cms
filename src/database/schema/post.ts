import { sql } from 'drizzle-orm';
import {
	bigint,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	body: text("body").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`),
	updatedAt: timestamp("updated_at").default(sql`now()`),
});
