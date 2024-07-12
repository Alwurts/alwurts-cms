import "dotenv/config";
import type { Config } from "drizzle-kit";

const POSTGRES_DB = process.env.POSTGRES_DB!;
const POSTGRES_USER = process.env.POSTGRES_USER!;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;

export default {
  schema: "./src/database/schema/index.ts",
  out: "./src/database/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "w-social-lab-db",
    //host: "159.69.214.229",
    port: 5432,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    ssl: false,
  },
  verbose: true,
  strict: true,
} satisfies Config;
