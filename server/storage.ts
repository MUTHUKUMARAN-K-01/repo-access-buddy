
import { 
  User, InsertUser, 
  FinancialProfile, InsertFinancialProfile,
  ChatMessage, InsertChatMessage,
  FinancialGoal, InsertFinancialGoal
} from "../shared/schema";
import { db, sql } from './db';
import { eq, desc } from 'drizzle-orm';
import { users, financialProfiles, chatMessages, financialGoals } from '../shared/schema';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Financial Profile operations
  getFinancialProfile(userId: number): Promise<FinancialProfile | undefined>;
  createFinancialProfile(profile: InsertFinancialProfile): Promise<FinancialProfile>;
  updateFinancialProfile(userId: number, profile: Partial<InsertFinancialProfile>): Promise<FinancialProfile | undefined>;
  
  // Chat Message operations
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Financial Goal operations
  getFinancialGoals(userId: number): Promise<FinancialGoal[]>;
  getFinancialGoal(id: number): Promise<FinancialGoal | undefined>;
  createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoal(id: number, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined>;
  deleteFinancialGoal(id: number): Promise<boolean>;
}

// In-memory storage implementation for fallback/testing
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private financialProfiles: Map<number, FinancialProfile>;
  private chatMessages: Map<number, ChatMessage>;
  private financialGoals: Map<number, FinancialGoal>;
  
  private userIdCounter: number;
  private profileIdCounter: number;
  private messageIdCounter: number;
  private goalIdCounter: number;

  constructor() {
    this.users = new Map();
    this.financialProfiles = new Map();
    this.chatMessages = new Map();
    this.financialGoals = new Map();
    
    this.userIdCounter = 1;
    this.profileIdCounter = 1;
    this.messageIdCounter = 1;
    this.goalIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Financial Profile operations
  async getFinancialProfile(userId: number): Promise<FinancialProfile | undefined> {
    return Array.from(this.financialProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }
  
  async createFinancialProfile(insertProfile: InsertFinancialProfile): Promise<FinancialProfile> {
    const id = this.profileIdCounter++;
    const updatedAt = new Date();
    
    // Create a properly typed profile object to match FinancialProfile
    const profile: FinancialProfile = {
      id,
      userId: insertProfile.userId,
      monthlyIncome: insertProfile.monthlyIncome ?? null,
      housingExpense: insertProfile.housingExpense ?? null,
      transportExpense: insertProfile.transportExpense ?? null,
      foodExpense: insertProfile.foodExpense ?? null,
      otherExpenses: insertProfile.otherExpenses ?? null,
      savingsGoal: insertProfile.savingsGoal ?? null,
      retirementGoal: insertProfile.retirementGoal ?? null,
      riskTolerance: insertProfile.riskTolerance ?? null,
      updatedAt
    };
    
    this.financialProfiles.set(id, profile);
    return profile;
  }
  
  async updateFinancialProfile(userId: number, updateData: Partial<InsertFinancialProfile>): Promise<FinancialProfile | undefined> {
    const existingProfile = await this.getFinancialProfile(userId);
    
    if (!existingProfile) {
      return undefined;
    }
    
    const updatedProfile: FinancialProfile = {
      ...existingProfile,
      ...updateData,
      updatedAt: new Date(),
    };
    
    this.financialProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Chat Message operations
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    const userMessages = Array.from(this.chatMessages.values())
      .filter((message) => message.userId === userId)
      .sort((a, b) => {
        // Safely handle null timestamps by defaulting to 0
        const aTime = a.timestamp ? a.timestamp.getTime() : 0;
        const bTime = b.timestamp ? b.timestamp.getTime() : 0;
        return aTime - bTime;
      });
    
    if (limit) {
      return userMessages.slice(-limit);
    }
    
    return userMessages;
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.messageIdCounter++;
    const timestamp = new Date();
    const message: ChatMessage = { ...insertMessage, id, timestamp };
    this.chatMessages.set(id, message);
    return message;
  }
  
  // Financial Goal operations
  async getFinancialGoals(userId: number): Promise<FinancialGoal[]> {
    return Array.from(this.financialGoals.values())
      .filter((goal) => goal.userId === userId)
      .sort((a, b) => {
        // Safely handle null createdAt values
        const aTime = a.createdAt ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt ? b.createdAt.getTime() : 0;
        return aTime - bTime;
      });
  }
  
  async getFinancialGoal(id: number): Promise<FinancialGoal | undefined> {
    return this.financialGoals.get(id);
  }
  
  async createFinancialGoal(insertGoal: InsertFinancialGoal): Promise<FinancialGoal> {
    const id = this.goalIdCounter++;
    const createdAt = new Date();
    
    // Create properly typed goal object
    const goal: FinancialGoal = {
      id,
      userId: insertGoal.userId,
      title: insertGoal.title,
      targetAmount: insertGoal.targetAmount,
      currentAmount: insertGoal.currentAmount,
      category: insertGoal.category,
      deadline: insertGoal.deadline ?? null,
      createdAt
    };
    
    this.financialGoals.set(id, goal);
    return goal;
  }
  
  async updateFinancialGoal(id: number, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined> {
    const existingGoal = await this.getFinancialGoal(id);
    
    if (!existingGoal) {
      return undefined;
    }
    
    // Handle the special case for the deadline field
    const deadline = goal.deadline !== undefined ? goal.deadline : existingGoal.deadline;
    
    const updatedGoal: FinancialGoal = {
      ...existingGoal,
      title: goal.title || existingGoal.title,
      targetAmount: goal.targetAmount || existingGoal.targetAmount,
      currentAmount: goal.currentAmount || existingGoal.currentAmount,
      category: goal.category || existingGoal.category,
      deadline: deadline
    };
    
    this.financialGoals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteFinancialGoal(id: number): Promise<boolean> {
    return this.financialGoals.delete(id);
  }
}

// PostgreSQL database storage implementation
export class PostgresStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      throw new Error("Failed to retrieve user");
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw new Error("Failed to retrieve user by username");
    }
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new Error("Failed to retrieve user by email");
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      if (!user) {
        throw new Error("Failed to create user");
      }
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }
  
  // Financial Profile operations
  async getFinancialProfile(userId: number): Promise<FinancialProfile | undefined> {
    try {
      const result = await db.select().from(financialProfiles)
        .where(eq(financialProfiles.userId, userId));
      return result[0];
    } catch (error) {
      console.error('Error fetching financial profile:', error);
      throw error;
    }
  }
  
  async createFinancialProfile(insertProfile: InsertFinancialProfile): Promise<FinancialProfile> {
    try {
      const [profile] = await db.insert(financialProfiles).values(insertProfile).returning();
      if (!profile) {
        throw new Error("Failed to create financial profile");
      }
      return profile;
    } catch (error) {
      console.error('Error creating financial profile:', error);
      throw error;
    }
  }
  
  async updateFinancialProfile(userId: number, updateData: Partial<InsertFinancialProfile>): Promise<FinancialProfile | undefined> {
    try {
      const [profile] = await db.update(financialProfiles)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(financialProfiles.userId, userId))
        .returning();
      
      return profile;
    } catch (error) {
      console.error('Error updating financial profile:', error);
      throw error;
    }
  }
  
  // Chat Message operations
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    try {
      const query = db.select().from(chatMessages)
        .where(eq(chatMessages.userId, userId))
        .orderBy(desc(chatMessages.timestamp));
      
      if (limit) {
        query.limit(limit);
      }
      
      return await query;
    } catch (error) {
      console.error("Error getting chat messages:", error);
      throw new Error("Failed to retrieve chat messages");
    }
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    try {
      const [chatMessage] = await db.insert(chatMessages).values(message).returning();
      if (!chatMessage) {
        throw new Error("Failed to create chat message");
      }
      return chatMessage;
    } catch (error) {
      console.error("Error creating chat message:", error);
      throw new Error("Failed to create chat message");
    }
  }
  
  // Financial Goal operations
  async getFinancialGoals(userId: number): Promise<FinancialGoal[]> {
    try {
      return await db.select().from(financialGoals)
        .where(eq(financialGoals.userId, userId))
        .orderBy(desc(financialGoals.createdAt));
    } catch (error) {
      console.error('Error fetching financial goals:', error);
      throw error;
    }
  }
  
  async getFinancialGoal(id: number): Promise<FinancialGoal | undefined> {
    try {
      const result = await db.select().from(financialGoals)
        .where(eq(financialGoals.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching financial goal:', error);
      throw error;
    }
  }
  
  async createFinancialGoal(insertGoal: InsertFinancialGoal): Promise<FinancialGoal> {
    try {
      const [goal] = await db.insert(financialGoals).values(insertGoal).returning();
      if (!goal) {
        throw new Error("Failed to create financial goal");
      }
      return goal;
    } catch (error) {
      console.error('Error creating financial goal:', error);
      throw error;
    }
  }
  
  async updateFinancialGoal(id: number, updateData: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined> {
    try {
      const [goal] = await db.update(financialGoals)
        .set(updateData)
        .where(eq(financialGoals.id, id))
        .returning();
      
      return goal;
    } catch (error) {
      console.error('Error updating financial goal:', error);
      throw error;
    }
  }
  
  async deleteFinancialGoal(id: number): Promise<boolean> {
    try {
      const result = await db.delete(financialGoals)
        .where(eq(financialGoals.id, id))
        .returning({ id: financialGoals.id });
      
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting financial goal:', error);
      throw error;
    }
  }
}

// Create the appropriate storage instance
export const storage = process.env.USE_MEMORY_STORAGE === 'true' 
  ? new MemStorage() 
  : new PostgresStorage();
