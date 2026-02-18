import { eq, and, ilike, or } from "drizzle-orm";
import { db } from "./db";
import { users, folders, files, type User, type InsertFolder, type Folder, type File } from "@shared/schema";

export interface IStorage {
  createUser(data: { firstName: string; lastName: string; email: string; phone: string; birthDate: string; passwordHash: string }): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getFoldersByUser(userId: number): Promise<Folder[]>;
  getFolderById(id: number, userId: number): Promise<Folder | undefined>;
  createFolder(data: { userId: number; name: string; parentFolderId: number | null }): Promise<Folder>;
  updateFolder(id: number, userId: number, name: string): Promise<Folder | undefined>;
  deleteFolder(id: number, userId: number): Promise<boolean>;
  getFilesByFolder(userId: number, folderId: number | null): Promise<File[]>;
  getFileById(id: number, userId: number): Promise<File | undefined>;
  createFile(data: { userId: number; folderId: number; name: string; path: string; type: string; size: number }): Promise<File>;
  updateFileName(id: number, userId: number, name: string): Promise<File | undefined>;
  deleteFile(id: number, userId: number): Promise<File | undefined>;
  searchUserContent(userId: number, query: string): Promise<{ folders: Folder[]; files: File[] }>;
}

export class DatabaseStorage implements IStorage {
  async createUser(data: { firstName: string; lastName: string; email: string; phone: string; birthDate: string; passwordHash: string }): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getFoldersByUser(userId: number): Promise<Folder[]> {
    return db.select().from(folders).where(eq(folders.userId, userId));
  }

  async getFolderById(id: number, userId: number): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));
    return folder;
  }

  async createFolder(data: { userId: number; name: string; parentFolderId: number | null }): Promise<Folder> {
    const [folder] = await db.insert(folders).values(data).returning();
    return folder;
  }

  async updateFolder(id: number, userId: number, name: string): Promise<Folder | undefined> {
    const [folder] = await db.update(folders).set({ name }).where(and(eq(folders.id, id), eq(folders.userId, userId))).returning();
    return folder;
  }

  async deleteFolder(id: number, userId: number): Promise<boolean> {
    const result = await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, userId))).returning();
    return result.length > 0;
  }

  async getFilesByFolder(userId: number, folderId: number | null): Promise<File[]> {
    if (folderId) {
      return db.select().from(files).where(and(eq(files.userId, userId), eq(files.folderId, folderId)));
    }
    return db.select().from(files).where(eq(files.userId, userId));
  }

  async getFileById(id: number, userId: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
    return file;
  }

  async createFile(data: { userId: number; folderId: number; name: string; path: string; type: string; size: number }): Promise<File> {
    const [file] = await db.insert(files).values(data).returning();
    return file;
  }

  async updateFileName(id: number, userId: number, name: string): Promise<File | undefined> {
    const [file] = await db.update(files).set({ name }).where(and(eq(files.id, id), eq(files.userId, userId))).returning();
    return file;
  }

  async deleteFile(id: number, userId: number): Promise<File | undefined> {
    const [file] = await db.delete(files).where(and(eq(files.id, id), eq(files.userId, userId))).returning();
    return file;
  }

  async searchUserContent(userId: number, query: string): Promise<{ folders: Folder[]; files: File[] }> {
    const pattern = `%${query}%`;
    const matchedFolders = await db.select().from(folders).where(
      and(eq(folders.userId, userId), ilike(folders.name, pattern))
    );
    const matchedFiles = await db.select().from(files).where(
      and(eq(files.userId, userId), ilike(files.name, pattern))
    );
    return { folders: matchedFolders, files: matchedFiles };
  }
}

export const storage = new DatabaseStorage();
