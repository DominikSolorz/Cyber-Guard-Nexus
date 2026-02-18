import { eq, and, ilike, desc } from "drizzle-orm";
import { db } from "./db";
import { users, folders, files, conversations, messages, type User, type Folder, type File, type Conversation, type Message } from "@shared/schema";

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  updateUserAdmin(id: string, isAdmin: boolean): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getFoldersByUser(userId: string): Promise<Folder[]>;
  getFolderById(id: number, userId: string): Promise<Folder | undefined>;
  createFolder(data: { userId: string; name: string; parentFolderId: number | null }): Promise<Folder>;
  updateFolder(id: number, userId: string, name: string): Promise<Folder | undefined>;
  deleteFolder(id: number, userId: string): Promise<boolean>;
  getFilesByFolder(userId: string, folderId: number | null): Promise<File[]>;
  getFileById(id: number, userId: string): Promise<File | undefined>;
  createFile(data: { userId: string; folderId: number; name: string; path: string; type: string; size: number }): Promise<File>;
  updateFileName(id: number, userId: string, name: string): Promise<File | undefined>;
  deleteFile(id: number, userId: string): Promise<File | undefined>;
  searchUserContent(userId: string, query: string): Promise<{ folders: Folder[]; files: File[] }>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  getConversation(id: number, userId: string): Promise<Conversation | undefined>;
  createConversation(userId: string, title: string): Promise<Conversation>;
  deleteConversation(id: number, userId: string): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserAdmin(id: string, isAdmin: boolean): Promise<User | undefined> {
    const [user] = await db.update(users).set({ isAdmin }).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getFoldersByUser(userId: string): Promise<Folder[]> {
    return db.select().from(folders).where(eq(folders.userId, userId));
  }

  async getFolderById(id: number, userId: string): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));
    return folder;
  }

  async createFolder(data: { userId: string; name: string; parentFolderId: number | null }): Promise<Folder> {
    const [folder] = await db.insert(folders).values(data).returning();
    return folder;
  }

  async updateFolder(id: number, userId: string, name: string): Promise<Folder | undefined> {
    const [folder] = await db.update(folders).set({ name }).where(and(eq(folders.id, id), eq(folders.userId, userId))).returning();
    return folder;
  }

  async deleteFolder(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, userId))).returning();
    return result.length > 0;
  }

  async getFilesByFolder(userId: string, folderId: number | null): Promise<File[]> {
    if (folderId) {
      return db.select().from(files).where(and(eq(files.userId, userId), eq(files.folderId, folderId)));
    }
    return db.select().from(files).where(eq(files.userId, userId));
  }

  async getFileById(id: number, userId: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
    return file;
  }

  async createFile(data: { userId: string; folderId: number; name: string; path: string; type: string; size: number }): Promise<File> {
    const [file] = await db.insert(files).values(data).returning();
    return file;
  }

  async updateFileName(id: number, userId: string, name: string): Promise<File | undefined> {
    const [file] = await db.update(files).set({ name }).where(and(eq(files.id, id), eq(files.userId, userId))).returning();
    return file;
  }

  async deleteFile(id: number, userId: string): Promise<File | undefined> {
    const [file] = await db.delete(files).where(and(eq(files.id, id), eq(files.userId, userId))).returning();
    return file;
  }

  async searchUserContent(userId: string, query: string): Promise<{ folders: Folder[]; files: File[] }> {
    const pattern = `%${query}%`;
    const matchedFolders = await db.select().from(folders).where(
      and(eq(folders.userId, userId), ilike(folders.name, pattern))
    );
    const matchedFiles = await db.select().from(files).where(
      and(eq(files.userId, userId), ilike(files.name, pattern))
    );
    return { folders: matchedFolders, files: matchedFiles };
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.createdAt));
  }

  async getConversation(id: number, userId: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(and(eq(conversations.id, id), eq(conversations.userId, userId)));
    return conversation;
  }

  async createConversation(userId: string, title: string): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values({ userId, title }).returning();
    return conversation;
  }

  async deleteConversation(id: number, userId: string): Promise<void> {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(and(eq(conversations.id, id), eq(conversations.userId, userId)));
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(conversationId: number, role: string, content: string): Promise<Message> {
    const [message] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
