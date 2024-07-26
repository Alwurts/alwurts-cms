import "server-only";

import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const POSTGRES_HOST = process.env.POSTGRES_HOST!;
const POSTGRES_PORT = process.env.POSTGRES_PORT!;
const POSTGRES_DB = process.env.POSTGRES_DB!;
const POSTGRES_USER = process.env.POSTGRES_USER!;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;

const client = postgres({
	host: POSTGRES_HOST,
	port: Number(POSTGRES_PORT),
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
	database: POSTGRES_DB,
	ssl: false,
});

export const db = drizzle(client, { schema: schema/* , logger: true */ });
