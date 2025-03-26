import { 
  User, InsertUser, 
  FinancialProfile, InsertFinancialProfile,
  ChatMessage, InsertChatMessage,
  FinancialGoal, InsertFinancialGoal
} from "@shared/schema";

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
    const profile: FinancialProfile = { ...insertProfile, id, updatedAt };
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
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
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
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async getFinancialGoal(id: number): Promise<FinancialGoal | undefined> {
    return this.financialGoals.get(id);
  }
  
  async createFinancialGoal(insertGoal: InsertFinancialGoal): Promise<FinancialGoal> {
    const id = this.goalIdCounter++;
    const createdAt = new Date();
    const goal: FinancialGoal = { ...insertGoal, id, createdAt };
    this.financialGoals.set(id, goal);
    return goal;
  }
  
  async updateFinancialGoal(id: number, updateData: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined> {
    const existingGoal = await this.getFinancialGoal(id);
    
    if (!existingGoal) {
      return undefined;
    }
    
    const updatedGoal: FinancialGoal = {
      ...existingGoal,
      ...updateData,
    };
    
    this.financialGoals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteFinancialGoal(id: number): Promise<boolean> {
    return this.financialGoals.delete(id);
  }
}

export const storage = new MemStorage();
