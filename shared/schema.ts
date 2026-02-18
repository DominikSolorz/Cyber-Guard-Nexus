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
  emailVerified: boolean("email_verified").default(false).notNull(),
  phone: varchar("phone"),
  pesel: varchar("pesel"),
  address: text("address"),
  street: varchar("street"),
  city: varchar("city"),
  postalCode: varchar("postal_code"),
  voivodeship: varchar("voivodeship"),
  country: varchar("country").default("Polska"),
  companyName: varchar("company_name"),
  nip: varchar("nip"),
  barNumber: varchar("bar_number"),
  lawyerType: varchar("lawyer_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email").notNull(),
  code: varchar("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courtHearings = pgTable("court_hearings", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  lawyerId: varchar("lawyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  courtName: varchar("court_name"),
  courtRoom: varchar("court_room"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  category: varchar("category"),
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
export const insertCourtHearingSchema = createInsertSchema(courtHearings).omit({ id: true, createdAt: true });

export function validateNIP(nip: string): boolean {
  const cleaned = nip.replace(/[\s-]/g, "");
  if (!/^\d{10}$/.test(cleaned)) return false;
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }
  return sum % 11 === parseInt(cleaned[9]);
}

export function validatePESEL(pesel: string): boolean {
  if (!/^\d{11}$/.test(pesel)) return false;
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }
  const control = (10 - (sum % 10)) % 10;
  return control === parseInt(pesel[10]);
}

export const CASE_CATEGORIES = [
  "cywilne", "rodzinne", "karne", "pracy", "ubezpieczen_spolecznych",
  "gospodarcze", "wieczystoksiegowe", "upadlosciowe", "administracyjne",
] as const;

export const CASE_CATEGORY_LABELS: Record<string, string> = {
  "cywilne": "Sprawy cywilne",
  "rodzinne": "Sprawy rodzinne i nieletnich",
  "karne": "Sprawy karne",
  "pracy": "Prawo pracy",
  "ubezpieczen_spolecznych": "Prawo ubezpieczen spolecznych",
  "gospodarcze": "Sprawy gospodarcze",
  "wieczystoksiegowe": "Sprawy wieczystoksiegowe",
  "upadlosciowe": "Sprawy upadlosciowe i restrukturyzacyjne",
  "administracyjne": "Sprawy administracyjne",
};

export const CASE_CATEGORY_DESCRIPTIONS: Record<string, string[]> = {
  "cywilne": [
    "Zaplata dlugu", "Odszkodowanie", "Naruszenie dobr osobistych", "Sprawy o wlasnosc",
    "Zasiedzenie", "Podzial majatku", "Zniesienie wspolwlasnosci", "Sprawy spadkowe",
    "Umowy (niewaznosc, rozwiazanie, wykonanie)", "Eksmisja", "Ochrona konsumenta",
    "Postepowanie nieprocesowe",
  ],
  "rodzinne": [
    "Rozwod", "Separacja", "Alimenty", "Ustalenie ojcostwa",
    "Wladza rodzicielska", "Kontakty z dzieckiem", "Przysposobienie (adopcja)",
    "Ograniczenie/pozbawienie wladzy rodzicielskiej", "Demoralizacja nieletnich",
    "Czyny karalne nieletnich",
  ],
  "karne": [
    "Kradziez", "Oszustwo", "Pobicie", "Rozboj", "Narkotyki",
    "Przestepstwa gospodarcze", "Przestepstwa seksualne", "Zabojstwo",
    "Przestepstwa skarbowe", "Wykroczenia",
  ],
  "pracy": [
    "Bezprawne zwolnienie", "Przywrocenie do pracy", "Wynagrodzenie",
    "Mobbing", "Odszkodowanie", "Wypadki przy pracy", "Dyskryminacja",
  ],
  "ubezpieczen_spolecznych": [
    "Odwolania od decyzji ZUS", "Emerytury", "Renty", "Swiadczenia",
  ],
  "gospodarcze": [
    "Spory miedzy firmami", "Niewykonanie umowy", "Kary umowne",
    "Odpowiedzialnosc zarzadu",
  ],
  "wieczystoksiegowe": [
    "Wpisy do ksiag wieczystych", "Spory dotyczace nieruchomosci",
  ],
  "upadlosciowe": [
    "Upadlosc konsumencka", "Upadlosc firm", "Restrukturyzacja przedsiebiorstw",
  ],
  "administracyjne": [
    "Decyzje podatkowe", "Pozwolenia budowlane", "Koncesje", "Decyzje administracyjne",
    "Odwolania do WSA/NSA",
  ],
};

export const VOIVODESHIPS = [
  "dolnoslaskie", "kujawsko-pomorskie", "lubelskie", "lubuskie",
  "lodzkie", "malopolskie", "mazowieckie", "opolskie",
  "podkarpackie", "podlaskie", "pomorskie", "slaskie",
  "swietokrzyskie", "warminsko-mazurskie", "wielkopolskie", "zachodniopomorskie",
] as const;

export const VOIVODESHIP_LABELS: Record<string, string> = {
  "dolnoslaskie": "Dolnoslaskie",
  "kujawsko-pomorskie": "Kujawsko-pomorskie",
  "lubelskie": "Lubelskie",
  "lubuskie": "Lubuskie",
  "lodzkie": "Lodzkie",
  "malopolskie": "Malopolskie",
  "mazowieckie": "Mazowieckie",
  "opolskie": "Opolskie",
  "podkarpackie": "Podkarpackie",
  "podlaskie": "Podlaskie",
  "pomorskie": "Pomorskie",
  "slaskie": "Slaskie",
  "swietokrzyskie": "Swietokrzyskie",
  "warminsko-mazurskie": "Warminsko-mazurskie",
  "wielkopolskie": "Wielkopolskie",
  "zachodniopomorskie": "Zachodniopomorskie",
};

export const onboardingSchema = z.object({
  role: z.enum(["adwokat", "radca_prawny", "klient", "firma"]),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  street: z.string().min(3),
  city: z.string().min(2),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Format: XX-XXX"),
  voivodeship: z.string().min(1),
  country: z.string().default("Polska"),
  pesel: z.string().optional(),
  address: z.string().optional(),
  companyName: z.string().optional(),
  nip: z.string().optional(),
  barNumber: z.string().optional(),
  lawyerType: z.enum(["adwokat", "radca_prawny"]).optional(),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(9).optional(),
  street: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Format: XX-XXX").optional(),
  voivodeship: z.string().optional(),
  country: z.string().optional(),
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
export type CourtHearing = typeof courtHearings.$inferSelect;
export type InsertCourtHearing = z.infer<typeof insertCourtHearingSchema>;
export type EmailVerification = typeof emailVerifications.$inferSelect;
