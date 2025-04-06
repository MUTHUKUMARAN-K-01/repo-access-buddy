
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/finance';

// for query purposes
const queryClient = postgres(connectionString, { max: 1 });
export const db = drizzle(queryClient, { schema });
export { sql }; // Export sql for use in other files

// Test database connection
export const testConnection = async () => {
  try {
    await queryClient`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Initialize database
export const initializeDatabase = async () => {
  console.log('Initializing database...');
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Could not connect to database');
    }

    // In production, we don't want to drop tables automatically
    if (process.env.NODE_ENV !== 'production') {
      console.log('Dropping all tables...');
      // Drop tables in reverse order to handle foreign key constraints
      await queryClient`DROP TABLE IF EXISTS financial_goals CASCADE`;
      await queryClient`DROP TABLE IF EXISTS chat_messages CASCADE`;
      await queryClient`DROP TABLE IF EXISTS financial_profiles CASCADE`;
      await queryClient`DROP TABLE IF EXISTS users CASCADE`;
      console.log('All tables dropped successfully');
    }

    // Create tables
    await queryClient`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Users table initialized');

    await queryClient`
      CREATE TABLE IF NOT EXISTS financial_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        monthly_income DECIMAL,
        housing_expense DECIMAL,
        transport_expense DECIMAL,
        food_expense DECIMAL,
        other_expenses DECIMAL,
        savings_goal DECIMAL,
        retirement_goal DECIMAL,
        risk_tolerance TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Financial profiles table initialized');

    await queryClient`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        is_user_message BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Chat messages table initialized');

    await queryClient`
      CREATE TABLE IF NOT EXISTS financial_goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        target_amount DECIMAL NOT NULL,
        current_amount DECIMAL DEFAULT 0,
        deadline DATE,
        status VARCHAR(50) DEFAULT 'in_progress',
        category VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Financial goals table initialized');

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
