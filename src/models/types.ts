// Modele danych dla systemu E-Kancelaria Pro

export type UserRole = 'lawyer' | 'client' | 'admin' | 'assistant';
export type CaseStatus = 'draft' | 'active' | 'pending' | 'closed' | 'archived';
export type CasePriority = 'low' | 'medium' | 'high' | 'urgent';
export type DocumentStatus = 'draft' | 'review' | 'approved' | 'signed' | 'archived';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';
export type EventType = 'hearing' | 'meeting' | 'deadline' | 'consultation' | 'other';
export type NotificationType = 'info' | 'warning' | 'success' | 'error';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  pesel?: string; // Dla klientów
  nip?: string; // Dla firm/prawników
  address?: Address;
  specialization?: string[]; // Dla prawników
  licenseNumber?: string; // Numer prawa wykonywania zawodu
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  settings?: UserSettings;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'pl' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  twoFactorAuth: boolean;
}

export interface Client {
  id: string;
  userId: string;
  type: 'individual' | 'company';
  companyName?: string;
  registrationNumber?: string;
  taxId?: string;
  notes?: string;
  assignedLawyers: string[]; // IDs prawników
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalCase {
  id: string;
  caseNumber: string; // Sygnatura sprawy
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  type: string; // Typ sprawy (cywilna, karna, etc.)
  court?: string;
  judge?: string;
  opposingParty?: string;
  opposingLawyer?: string;
  
  // Powiązania
  clientId: string;
  assignedLawyers: string[]; // Główny i asystenci
  
  // Daty
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  deadlines: Deadline[];
  
  // Finansowe
  estimatedValue?: number;
  actualValue?: number;
  hourlyRate?: number;
  
  // Organizacja
  folders: CaseFolder[];
  files: CaseFile[];
  tasks: Task[];
  events: CalendarEvent[];
  notes: Note[];
  timeline: TimelineEntry[];
  
  // Meta
  tags?: string[];
  customFields?: { [key: string]: any };
  isArchived: boolean;
  confidential: boolean;
}

export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: CasePriority;
  completed: boolean;
  completedAt?: Date;
  reminderDays?: number; // Dni przed przypomnieniem
  assignedTo?: string;
}

export interface CaseFolder {
  id: string;
  name: string;
  parentId?: string | null;
  isExpanded: boolean;
  color?: string;
  icon?: string;
  createdAt: Date;
}

export interface CaseFile {
  id: string;
  folderId?: string | null;
  name: string;
  originalName: string;
  type: 'pdf' | 'image' | 'word' | 'excel' | 'email' | 'other';
  mimeType: string;
  size: number; // w bajtach
  sizeFormatted: string;
  dateAdded: Date;
  uploadedBy: string;
  contentUrl: string;
  thumbnailUrl?: string;
  
  // Metadata
  status: DocumentStatus;
  version: number;
  versionHistory?: FileVersion[];
  tags?: string[];
  description?: string;
  
  // AI Analysis
  aiSummary?: string;
  aiKeyPoints?: string[];
  aiEntities?: EntityExtraction[];
  
  // Podpisy i weryfikacja
  signed: boolean;
  signedBy?: string[];
  signedAt?: Date;
  verified: boolean;
  
  // Kontrola dostępu
  accessLevel: 'public' | 'confidential' | 'restricted';
  sharedWith?: string[];
}

export interface FileVersion {
  version: number;
  fileName: string;
  uploadedBy: string;
  uploadedAt: Date;
  changes?: string;
  contentUrl: string;
}

export interface EntityExtraction {
  type: 'person' | 'organization' | 'date' | 'amount' | 'location';
  value: string;
  confidence: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: CasePriority;
  assignedTo: string[];
  createdBy: string;
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  attachments?: string[]; // File IDs
  subtasks?: SubTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  location?: string;
  attendees: string[]; // User IDs
  reminderMinutes?: number;
  isAllDay: boolean;
  color?: string;
  videoConferenceUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  tags?: string[];
  attachments?: string[];
  mentions?: string[]; // User IDs
}

export interface TimelineEntry {
  id: string;
  type: 'file_upload' | 'status_change' | 'note_added' | 'task_completed' | 'event_scheduled' | 'payment_received' | 'custom';
  title: string;
  description?: string;
  performedBy: string;
  timestamp: Date;
  metadata?: { [key: string]: any };
  icon?: string;
  color?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  caseId?: string;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: PaymentStatus;
  paidAt?: Date;
  paymentMethod?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
}

export interface TimeEntry {
  id: string;
  caseId: string;
  userId: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // w minutach
  hourlyRate: number;
  billable: boolean;
  invoiced: boolean;
  invoiceId?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  caseId?: string;
  subject?: string;
  content: string;
  status: MessageStatus;
  readAt?: Date;
  attachments?: string[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  caseId?: string;
  lastMessage?: Message;
  unreadCount: { [userId: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  metadata?: { [key: string]: any };
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  type: 'document' | 'email' | 'contract';
  content: string;
  variables: string[]; // Zmienne do wypełnienia
  category?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  usageCount: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: { [key: string]: { old: any; new: any } };
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  helpful: number;
  notHelpful: number;
  isPublished: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: 'cases' | 'financial' | 'productivity' | 'client';
  parameters: { [key: string]: any };
  generatedBy: string;
  generatedAt: Date;
  data: any;
  format: 'pdf' | 'excel' | 'json';
}
