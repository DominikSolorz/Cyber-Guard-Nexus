import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, serial, index, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  role: varchar("role"),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  phone: varchar("phone"),
  pesel: varchar("pesel"),
  address: text("address"),
  city: varchar("city"),
  postalCode: varchar("postal_code"),
  companyName: varchar("company_name"),
  nip: varchar("nip"),
  barNumber: varchar("bar_number"),
  lawyerType: varchar("lawyer_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clientRecords = pgTable("client_records", {
  id: serial("id").primaryKey(),
  lawyerId: varchar("lawyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  pesel: varchar("pesel"),
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  city: varchar("city"),
  postalCode: varchar("postal_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  lawyerId: varchar("lawyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientRecordId: integer("client_record_id").references(() => clientRecords.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  caseNumber: varchar("case_number"),
  description: text("description"),
  status: varchar("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  caseId: integer("case_id").references(() => cases.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  parentFolderId: integer("parent_folder_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  folderId: integer("folder_id").references(() => folders.id, { onDelete: "cascade" }),
  caseId: integer("case_id").references(() => cases.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  path: text("path").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const directMessages = pgTable("direct_messages", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  recipientId: varchar("recipient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageAttachments = pgTable("message_attachments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => directMessages.id, { onDelete: "cascade" }),
  fileId: integer("file_id").references(() => files.id, { onDelete: "set null" }),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertFolderSchema = createInsertSchema(folders).omit({ id: true, createdAt: true });
export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertClientRecordSchema = createInsertSchema(clientRecords).omit({ id: true, createdAt: true });
export const insertCaseSchema = createInsertSchema(cases).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDirectMessageSchema = createInsertSchema(directMessages).omit({ id: true, createdAt: true, editedAt: true });
export const insertMessageAttachmentSchema = createInsertSchema(messageAttachments).omit({ id: true, createdAt: true });

export const onboardingSchema = z.object({
  role: z.enum(["adwokat", "radca_prawny", "klient", "firma"]),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  pesel: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  companyName: z.string().optional(),
  nip: z.string().optional(),
  barNumber: z.string().optional(),
  lawyerType: z.enum(["adwokat", "radca_prawny"]).optional(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type ClientRecord = typeof clientRecords.$inferSelect;
export type InsertClientRecord = z.infer<typeof insertClientRecordSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type DirectMessage = typeof directMessages.$inferSelect;
export type InsertDirectMessage = z.infer<typeof insertDirectMessageSchema>;
export type MessageAttachment = typeof messageAttachments.$inferSelect;
export type InsertMessageAttachment = z.infer<typeof insertMessageAttachmentSchema>;
