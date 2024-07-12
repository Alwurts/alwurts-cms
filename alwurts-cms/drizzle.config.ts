import "dotenv";
import type { Config } from "drizzle-kit";

const POSTGRES_HOST = process.env.POSTGRES_HOST!;
const POSTGRES_PORT = process.env.POSTGRES_PORT!;
const POSTGRES_DB = process.env.POSTGRES_DB!;
const POSTGRES_USER = process.env.POSTGRES_USER!;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;

export default {
  schema: "./src/database/schema/index.ts",
  out: "./src/database/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: POSTGRES_HOST,
    //host: "159.69.214.229",
    port: Number(POSTGRES_PORT),
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    ssl: false,
  },
  verbose: true,
  strict: true,
} satisfies Config;
