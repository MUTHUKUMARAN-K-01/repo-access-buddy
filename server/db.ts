
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variables with fallbacks
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/financedb';

// For production, set SSL to true
const ssl = process.env.NODE_ENV === 'production';

// Create the connection
let client;
let db: ReturnType<typeof drizzle>;

try {
  client = postgres(connectionString, { ssl });
  db = drizzle(client, { schema });
  console.log('Database connection established successfully');
} catch (error) {
  console.error('Failed to connect to database:', error);
  throw error;
}

export { db, client as sql };

// Initialize the database
export async function initializeDatabase() {
  try {
    // Test the connection by executing a simple query
    const result = await db.select().from(schema.users).limit(1);
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
