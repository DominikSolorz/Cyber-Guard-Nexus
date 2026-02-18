import { eq, and, ilike, desc, or, gte, lte, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users, folders, files, conversations, messages,
  clientRecords, cases, directMessages, messageAttachments,
  emailVerifications, courtHearings, contactSubmissions,
  type User, type Folder, type File, type Conversation, type Message,
  type ClientRecord, type Case, type DirectMessage, type MessageAttachment,
  type EmailVerification, type CourtHearing, type ContactSubmission
} from "@shared/schema";

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  updateUserAdmin(id: string, isAdmin: boolean): Promise<User | undefined>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined>;
  updateUserPassword(id: string, hash: string): Promise<void>;
  deleteUser(id: string): Promise<boolean>;

  getClientRecordsByLawyer(lawyerId: string): Promise<ClientRecord[]>;
  getClientRecordById(id: number, lawyerId: string): Promise<ClientRecord | undefined>;
  createClientRecord(data: Omit<ClientRecord, "id" | "createdAt">): Promise<ClientRecord>;
  updateClientRecord(id: number, lawyerId: string, data: Partial<ClientRecord>): Promise<ClientRecord | undefined>;
  deleteClientRecord(id: number, lawyerId: string): Promise<boolean>;

  getCasesByLawyer(lawyerId: string): Promise<Case[]>;
  getCasesByClient(clientUserId: string): Promise<Case[]>;
  getCaseById(id: number): Promise<Case | undefined>;
  createCase(data: Omit<Case, "id" | "createdAt" | "updatedAt">): Promise<Case>;
  updateCase(id: number, data: Partial<Case>): Promise<Case | undefined>;
  deleteCase(id: number, lawyerId: string): Promise<boolean>;

  getFoldersByUser(userId: string): Promise<Folder[]>;
  getFolderById(id: number, userId: string): Promise<Folder | undefined>;
  createFolder(data: { userId: string; name: string; parentFolderId: number | null; caseId?: number | null }): Promise<Folder>;
  updateFolder(id: number, userId: string, name: string): Promise<Folder | undefined>;
  deleteFolder(id: number, userId: string): Promise<boolean>;

  getFilesByFolder(userId: string, folderId: number | null): Promise<File[]>;
  getFilesByCase(caseId: number): Promise<File[]>;
  getFileById(id: number, userId: string): Promise<File | undefined>;
  getFileByIdAny(id: number): Promise<File | undefined>;
  createFile(data: { userId: string; folderId?: number | null; caseId?: number | null; name: string; path: string; type: string; size: number }): Promise<File>;
  updateFileName(id: number, userId: string, name: string): Promise<File | undefined>;
  deleteFile(id: number, userId: string): Promise<File | undefined>;
  searchUserContent(userId: string, query: string): Promise<{ folders: Folder[]; files: File[] }>;

  getDirectMessages(caseId: number, limit?: number): Promise<DirectMessage[]>;
  getDirectMessageById(id: number): Promise<DirectMessage | undefined>;
  createDirectMessage(data: { caseId: number | null; senderId: string; recipientId: string; content: string }): Promise<DirectMessage>;
  updateDirectMessage(id: number, senderId: string, content: string): Promise<DirectMessage | undefined>;

  getMessageAttachments(messageId: number): Promise<MessageAttachment[]>;
  createMessageAttachment(data: Omit<MessageAttachment, "id" | "createdAt">): Promise<MessageAttachment>;

  getConversationsByUser(userId: string): Promise<Conversation[]>;
  getConversation(id: number, userId: string): Promise<Conversation | undefined>;
  createConversation(userId: string, title: string): Promise<Conversation>;
  deleteConversation(id: number, userId: string): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;

  createEmailVerification(userId: string, email: string, codeHash: string, expiresAt: Date): Promise<EmailVerification>;
  getActiveVerification(userId: string): Promise<EmailVerification | undefined>;
  markVerificationUsed(id: number): Promise<void>;
  incrementFailedAttempts(id: number): Promise<number>;
  lockVerification(id: number, lockedUntil: Date): Promise<void>;
  getRecentVerificationCount(userId: string, sinceMinutes: number): Promise<number>;

  getHearingsByCase(caseId: number): Promise<CourtHearing[]>;
  getHearingsByLawyer(lawyerId: string, startDate?: Date, endDate?: Date): Promise<CourtHearing[]>;
  getHearingById(id: number): Promise<CourtHearing | undefined>;
  createHearing(data: Omit<CourtHearing, "id" | "createdAt">): Promise<CourtHearing>;
  updateHearing(id: number, lawyerId: string, data: Partial<CourtHearing>): Promise<CourtHearing | undefined>;
  deleteHearing(id: number, lawyerId: string): Promise<boolean>;

  createContactSubmission(data: Omit<ContactSubmission, "id" | "createdAt" | "updatedAt" | "status" | "adminNotes">): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmissionById(id: number): Promise<ContactSubmission | undefined>;
  updateContactSubmission(id: number, data: Partial<ContactSubmission>): Promise<ContactSubmission | undefined>;
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

  async updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserPassword(id: string, hash: string): Promise<void> {
    await db.update(users).set({ passwordHash: hash, updatedAt: new Date() }).where(eq(users.id, id));
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getClientRecordsByLawyer(lawyerId: string): Promise<ClientRecord[]> {
    return db.select().from(clientRecords).where(eq(clientRecords.lawyerId, lawyerId)).orderBy(desc(clientRecords.createdAt));
  }

  async getClientRecordById(id: number, lawyerId: string): Promise<ClientRecord | undefined> {
    const [record] = await db.select().from(clientRecords).where(and(eq(clientRecords.id, id), eq(clientRecords.lawyerId, lawyerId)));
    return record;
  }

  async createClientRecord(data: Omit<ClientRecord, "id" | "createdAt">): Promise<ClientRecord> {
    const [record] = await db.insert(clientRecords).values(data).returning();
    return record;
  }

  async updateClientRecord(id: number, lawyerId: string, data: Partial<ClientRecord>): Promise<ClientRecord | undefined> {
    const [record] = await db.update(clientRecords).set(data).where(and(eq(clientRecords.id, id), eq(clientRecords.lawyerId, lawyerId))).returning();
    return record;
  }

  async deleteClientRecord(id: number, lawyerId: string): Promise<boolean> {
    const result = await db.delete(clientRecords).where(and(eq(clientRecords.id, id), eq(clientRecords.lawyerId, lawyerId))).returning();
    return result.length > 0;
  }

  async getCasesByLawyer(lawyerId: string): Promise<Case[]> {
    return db.select().from(cases).where(eq(cases.lawyerId, lawyerId)).orderBy(desc(cases.createdAt));
  }

  async getCasesByClient(clientUserId: string): Promise<Case[]> {
    const records = await db.select().from(clientRecords).where(eq(clientRecords.userId, clientUserId));
    if (records.length === 0) return [];
    const recordIds = records.map(r => r.id);
    const allCases: Case[] = [];
    for (const rid of recordIds) {
      const c = await db.select().from(cases).where(eq(cases.clientRecordId, rid));
      allCases.push(...c);
    }
    return allCases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCaseById(id: number): Promise<Case | undefined> {
    const [c] = await db.select().from(cases).where(eq(cases.id, id));
    return c;
  }

  async createCase(data: Omit<Case, "id" | "createdAt" | "updatedAt">): Promise<Case> {
    const [c] = await db.insert(cases).values(data).returning();
    return c;
  }

  async updateCase(id: number, data: Partial<Case>): Promise<Case | undefined> {
    const [c] = await db.update(cases).set({ ...data, updatedAt: new Date() }).where(eq(cases.id, id)).returning();
    return c;
  }

  async deleteCase(id: number, lawyerId: string): Promise<boolean> {
    const result = await db.delete(cases).where(and(eq(cases.id, id), eq(cases.lawyerId, lawyerId))).returning();
    return result.length > 0;
  }

  async getFoldersByUser(userId: string): Promise<Folder[]> {
    return db.select().from(folders).where(eq(folders.userId, userId));
  }

  async getFolderById(id: number, userId: string): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));
    return folder;
  }

  async createFolder(data: { userId: string; name: string; parentFolderId: number | null; caseId?: number | null }): Promise<Folder> {
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

  async getFilesByCase(caseId: number): Promise<File[]> {
    return db.select().from(files).where(eq(files.caseId, caseId));
  }

  async getFileById(id: number, userId: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
    return file;
  }

  async getFileByIdAny(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async createFile(data: { userId: string; folderId?: number | null; caseId?: number | null; name: string; path: string; type: string; size: number }): Promise<File> {
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
    const matchedFolders = await db.select().from(folders).where(and(eq(folders.userId, userId), ilike(folders.name, pattern)));
    const matchedFiles = await db.select().from(files).where(and(eq(files.userId, userId), ilike(files.name, pattern)));
    return { folders: matchedFolders, files: matchedFiles };
  }

  async getDirectMessages(caseId: number, limit = 100): Promise<DirectMessage[]> {
    return db.select().from(directMessages).where(eq(directMessages.caseId, caseId)).orderBy(directMessages.createdAt).limit(limit);
  }

  async getDirectMessageById(id: number): Promise<DirectMessage | undefined> {
    const [msg] = await db.select().from(directMessages).where(eq(directMessages.id, id));
    return msg;
  }

  async createDirectMessage(data: { caseId: number | null; senderId: string; recipientId: string; content: string }): Promise<DirectMessage> {
    const [msg] = await db.insert(directMessages).values(data).returning();
    return msg;
  }

  async updateDirectMessage(id: number, senderId: string, content: string): Promise<DirectMessage | undefined> {
    const [msg] = await db.update(directMessages).set({ content, editedAt: new Date() }).where(and(eq(directMessages.id, id), eq(directMessages.senderId, senderId))).returning();
    return msg;
  }

  async getMessageAttachments(messageId: number): Promise<MessageAttachment[]> {
    return db.select().from(messageAttachments).where(eq(messageAttachments.messageId, messageId));
  }

  async createMessageAttachment(data: Omit<MessageAttachment, "id" | "createdAt">): Promise<MessageAttachment> {
    const [attachment] = await db.insert(messageAttachments).values(data).returning();
    return attachment;
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

  async createEmailVerification(userId: string, email: string, codeHash: string, expiresAt: Date): Promise<EmailVerification> {
    const [v] = await db.insert(emailVerifications).values({ userId, email, code: codeHash, expiresAt, failedAttempts: 0 }).returning();
    return v;
  }

  async getActiveVerification(userId: string): Promise<EmailVerification | undefined> {
    const [v] = await db.select().from(emailVerifications)
      .where(and(
        eq(emailVerifications.userId, userId),
        gte(emailVerifications.expiresAt, new Date())
      ))
      .orderBy(desc(emailVerifications.createdAt))
      .limit(1);
    return v && !v.usedAt ? v : undefined;
  }

  async markVerificationUsed(id: number): Promise<void> {
    await db.update(emailVerifications).set({ usedAt: new Date() }).where(eq(emailVerifications.id, id));
  }

  async incrementFailedAttempts(id: number): Promise<number> {
    const [v] = await db.update(emailVerifications)
      .set({ failedAttempts: sql`failed_attempts + 1` })
      .where(eq(emailVerifications.id, id))
      .returning();
    return v.failedAttempts;
  }

  async lockVerification(id: number, lockedUntil: Date): Promise<void> {
    await db.update(emailVerifications).set({ lockedUntil }).where(eq(emailVerifications.id, id));
  }

  async getRecentVerificationCount(userId: string, sinceMinutes: number): Promise<number> {
    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);
    const results = await db.select().from(emailVerifications)
      .where(and(
        eq(emailVerifications.userId, userId),
        gte(emailVerifications.createdAt, since)
      ));
    return results.length;
  }

  async getHearingsByCase(caseId: number): Promise<CourtHearing[]> {
    return db.select().from(courtHearings).where(eq(courtHearings.caseId, caseId)).orderBy(courtHearings.startsAt);
  }

  async getHearingsByLawyer(lawyerId: string, startDate?: Date, endDate?: Date): Promise<CourtHearing[]> {
    const conditions = [eq(courtHearings.lawyerId, lawyerId)];
    if (startDate) conditions.push(gte(courtHearings.startsAt, startDate));
    if (endDate) conditions.push(lte(courtHearings.startsAt, endDate));
    return db.select().from(courtHearings).where(and(...conditions)).orderBy(courtHearings.startsAt);
  }

  async getHearingById(id: number): Promise<CourtHearing | undefined> {
    const [h] = await db.select().from(courtHearings).where(eq(courtHearings.id, id));
    return h;
  }

  async createHearing(data: Omit<CourtHearing, "id" | "createdAt">): Promise<CourtHearing> {
    const [h] = await db.insert(courtHearings).values(data).returning();
    return h;
  }

  async updateHearing(id: number, lawyerId: string, data: Partial<CourtHearing>): Promise<CourtHearing | undefined> {
    const [h] = await db.update(courtHearings).set(data).where(and(eq(courtHearings.id, id), eq(courtHearings.lawyerId, lawyerId))).returning();
    return h;
  }

  async deleteHearing(id: number, lawyerId: string): Promise<boolean> {
    const result = await db.delete(courtHearings).where(and(eq(courtHearings.id, id), eq(courtHearings.lawyerId, lawyerId))).returning();
    return result.length > 0;
  }

  async createContactSubmission(data: Omit<ContactSubmission, "id" | "createdAt" | "updatedAt" | "status" | "adminNotes">): Promise<ContactSubmission> {
    const [sub] = await db.insert(contactSubmissions).values(data).returning();
    return sub;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async getContactSubmissionById(id: number): Promise<ContactSubmission | undefined> {
    const [sub] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return sub;
  }

  async updateContactSubmission(id: number, data: Partial<ContactSubmission>): Promise<ContactSubmission | undefined> {
    const [sub] = await db.update(contactSubmissions).set({ ...data, updatedAt: new Date() }).where(eq(contactSubmissions.id, id)).returning();
    return sub;
  }
}

export const storage = new DatabaseStorage();
