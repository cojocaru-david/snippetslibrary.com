import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create database connection function that creates a fresh connection each time
export function createDb() {
  const client = postgres(process.env.DATABASE_URL!);
  return drizzle(client, { schema });
}

// For compatibility, also export db but recommend using createDb() in handlers
export const db = createDb();

export type DbType = typeof db;
