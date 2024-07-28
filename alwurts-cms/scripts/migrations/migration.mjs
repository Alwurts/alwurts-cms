
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from 'dotenv';

dotenv.config();

const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT = process.env.POSTGRES_PORT;
const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

const connection = postgres({
	host: POSTGRES_HOST,
	port: Number(POSTGRES_PORT),
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
	database: POSTGRES_DB,
	ssl: false,
});

const db = drizzle(connection, { logger: true });

const migrateDatabase = async () => {
    console.log('🚀 Starting database migration...');

    try {
        await migrate(db, { migrationsFolder: 'src/database/drizzle' });
        console.log('✅ Successfully completed the database migration.');
        //await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during the database migration:', error);
        process.exit(1);
    }
};

migrateDatabase();
