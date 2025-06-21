import { 
  users, 
  files,
  codeExtractions,
  type User, 
  type InsertUser,
  type File,
  type InsertFile,
  type CodeExtraction,
  type InsertCodeExtraction
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // File operations
  createFile(file: InsertFile): Promise<File>;
  getFile(id: number): Promise<File | undefined>;
  
  // Code extraction operations
  createCodeExtraction(extraction: InsertCodeExtraction): Promise<CodeExtraction>;
  getCodeExtraction(id: number): Promise<CodeExtraction | undefined>;
  getCodeExtractionByFileId(fileId: number): Promise<CodeExtraction | undefined>;
  updateCodeExtraction(id: number, updates: Partial<CodeExtraction>): Promise<CodeExtraction | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private files: Map<number, File>;
  private codeExtractions: Map<number, CodeExtraction>;
  private currentUserId: number;
  private currentFileId: number;
  private currentExtractionId: number;

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.codeExtractions = new Map();
    this.currentUserId = 1;
    this.currentFileId = 1;
    this.currentExtractionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentFileId++;
    const file: File = { 
      ...insertFile, 
      id,
      uploadedAt: new Date()
    };
    this.files.set(id, file);
    return file;
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async createCodeExtraction(insertExtraction: InsertCodeExtraction): Promise<CodeExtraction> {
    const id = this.currentExtractionId++;
    const extraction: CodeExtraction = {
      ...insertExtraction,
      id,
      createdAt: new Date(),
      status: insertExtraction.status || "extracted",
      language: insertExtraction.language || null,
      improvedCode: insertExtraction.improvedCode || null
    };
    this.codeExtractions.set(id, extraction);
    return extraction;
  }

  async getCodeExtraction(id: number): Promise<CodeExtraction | undefined> {
    return this.codeExtractions.get(id);
  }

  async getCodeExtractionByFileId(fileId: number): Promise<CodeExtraction | undefined> {
    return Array.from(this.codeExtractions.values()).find(
      (extraction) => extraction.fileId === fileId
    );
  }

  async updateCodeExtraction(id: number, updates: Partial<CodeExtraction>): Promise<CodeExtraction | undefined> {
    const existing = this.codeExtractions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.codeExtractions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
