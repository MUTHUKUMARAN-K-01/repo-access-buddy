
import { pgTable, text, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow()
});

// Financial Profile model
export const financialProfiles = pgTable("financial_profiles", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  monthly_income: numeric("monthly_income"),
  housing_expense: numeric("housing_expense"),
  transport_expense: numeric("transport_expense"),
  food_expense: numeric("food_expense"),
  other_expenses: numeric("other_expenses"),
  savings_goal: numeric("savings_goal"),
  retirement_goal: numeric("retirement_goal"),
  risk_tolerance: text("risk_tolerance"),
  updated_at: timestamp("updated_at").defaultNow()
});

// Chat Message model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  is_user_message: boolean("is_user_message").notNull(),
  created_at: timestamp("created_at").defaultNow()
});

// Financial Goal model
export const financialGoals = pgTable("financial_goals", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  target_amount: numeric("target_amount").notNull(),
  current_amount: numeric("current_amount").default('0'),
  deadline: timestamp("deadline"),
  status: text("status").default('in_progress'),
  category: text("category"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});
