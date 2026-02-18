# LexVault - Legal Practice Management Platform

## Overview
LexVault is a professional legal practice management platform for lawyers (adwokaci, radcy prawni) and their clients (individual, company). Features role-based access, case management with Polish legal system categories, real-time lawyer-client messaging with PDF attachments, document management, advanced AI legal assistant with Polish law knowledge and web browsing, court hearing calendar, email 2FA verification, profile management, comprehensive legal pages (privacy/RODO, terms, confidentiality clause). Dark theme with red (primary) accents. Polish language interface.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Drizzle ORM)
- **Auth**: Replit Auth (OIDC - supports Google, GitHub, Apple, email login)
- **AI**: OpenAI GPT-4o via Replit AI Integrations (unrestricted topics, Polish law knowledge, web search, GPT-4o vision for image analysis, DALL-E 3 image generation)
- **Email**: SendGrid (verification emails with branded HTML templates)
- **File Upload**: Multer (PDF, JPG, PNG, GIF, WEBP, DOCX - max 10MB)
- **File Conversion**: sharp + pdf-lib (JPG/PNG→PDF, PDF→JPG, DOCX→PDF)

## User Roles
- `adwokat` - Lawyer (attorney): manages clients, cases, documents, court hearings
- `radca_prawny` - Legal counselor: same as adwokat
- `klient` - Individual client: views assigned cases, sends messages, views hearings (read-only)
- `firma` - Company client: same as klient but with company info (NIP, company name)

## Admin Access
- Owner-only admin: goldservicepoland@gmail.com is automatically set as admin on login
- Admin toggle removed from UI - only the owner email gets admin privileges
- Admin can view all users, delete accounts, manage contact submissions

## Case Categories (Polish Legal System)
- `cywilne` - Sprawy cywilne (civil: debt, damages, property, inheritance, contracts, eviction)
- `rodzinne` - Sprawy rodzinne i nieletnich (family: divorce, alimony, custody, adoption)
- `karne` - Sprawy karne (criminal: theft, fraud, assault, narcotics, homicide)
- `pracy` - Prawo pracy (labor: dismissal, wages, mobbing, discrimination)
- `ubezpieczen_spolecznych` - Prawo ubezpieczen spolecznych (social insurance: ZUS appeals, pensions)
- `gospodarcze` - Sprawy gospodarcze (commercial: disputes between companies)
- `wieczystoksiegowe` - Sprawy wieczystoksiegowe (land registry)
- `upadlosciowe` - Sprawy upadlosciowe i restrukturyzacyjne (bankruptcy, restructuring)
- `administracyjne` - Sprawy administracyjne (administrative: tax, permits, WSA/NSA appeals)

## Database Schema
- `sessions`: sid (PK), sess (jsonb), expire - Replit Auth sessions
- `users`: id (varchar PK, UUID), email, firstName, lastName, profileImageUrl, isAdmin, role, onboardingCompleted, emailVerified, phone, pesel, address, street, city, postalCode, voivodeship, country, companyName, nip, barNumber, lawyerType, createdAt, updatedAt
- `email_verifications`: id (serial PK), userId (FK->users), email, code (SHA-256 hash), expiresAt, usedAt, failedAttempts (default 0), lockedUntil, createdAt
- `client_records`: id (serial PK), lawyerId (FK->users), userId (FK->users nullable), firstName, lastName, pesel, email, phone, address, city, postalCode, notes, createdAt
- `cases`: id (serial PK), lawyerId (FK->users), clientRecordId (FK->client_records), title, caseNumber, category, description, status, createdAt, updatedAt
- `folders`: id (serial PK), userId (FK->users), caseId (FK->cases), name, parentFolderId, createdAt
- `files`: id (serial PK), userId (FK->users), folderId (FK->folders), caseId (FK->cases), name, path, type, size, createdAt
- `direct_messages`: id (serial PK), caseId (FK->cases), senderId (FK->users), recipientId (FK->users), content, editedAt, createdAt
- `message_attachments`: id (serial PK), messageId (FK->direct_messages), fileId (FK->files), fileName, filePath, fileType, fileSize, createdAt
- `conversations`: id (serial PK), userId (FK->users), title, createdAt - AI chat conversations
- `messages`: id (serial PK), conversationId (FK->conversations), role, content, createdAt - AI chat messages
- `email_verifications`: id (serial PK), userId (FK->users), email, code, expiresAt, usedAt, createdAt - Email 2FA codes
- `court_hearings`: id (serial PK), caseId (FK->cases), lawyerId (FK->users), title, description, courtName, courtRoom, startsAt, endsAt, createdAt
- `contact_submissions`: id (serial PK), firstName, lastName, email, phone, senderType, category, caseCategory, subject, description, attachmentName, attachmentPath, attachmentType, attachmentSize, priority, status, adminNotes, createdAt, updatedAt

## Key Routes
- `/` - Landing page (public) - comprehensive with hero, features, security, how-it-works sections
- `/onboarding` - Mandatory 4-step profile completion after first login (role, basic data, address, role-specific)
- `/verify-email` - Email 2FA verification (6-digit code)
- `/dashboard` - Role-specific dashboard (protected, requires onboarding + email verification)
- `/case/:id` - Case detail with messaging (protected)
- `/chat` - AI chat assistant with Polish law knowledge and web browsing (protected)
- `/calendar` - Court hearing calendar with month/week views (protected)
- `/profile` - Profile settings - view/edit personal data (protected)
- `/admin` - Admin user management (protected, owner-only)
- `/contact` - Advanced contact form with categories, file upload, email notification
- `/terms` - Terms of service (comprehensive, 2026)
- `/privacy` - Privacy policy / RODO (comprehensive, 2026)
- `/confidentiality` - Klauzula poufnosci (confidentiality clause)

## API Endpoints
- `GET /api/login` - Initiate Replit Auth login
- `GET /api/callback` - Auth callback
- `GET /api/logout` - Logout
- `GET /api/auth/user` - Current user info
- `POST /api/onboarding` - Complete onboarding (role, personal data, triggers email verification)
- `POST /api/verify-email` - Verify email with 6-digit code
- `POST /api/resend-verification` - Resend verification email
- `GET /api/profile` - Get current user profile
- `PATCH /api/profile` - Update profile data
- `GET/POST/PATCH/DELETE /api/clients` - Client records CRUD (lawyer only)
- `GET /api/cases` - List cases (role-aware)
- `GET /api/cases/:id` - Get single case with access control
- `POST/PATCH/DELETE /api/cases` - Case management (lawyer only, now includes category field)
- `GET/POST /api/cases/:id/messages` - Case messaging (both parties)
- `POST /api/cases/:id/messages/upload` - Send message with file attachment
- `PATCH /api/messages/:id` - Edit own message
- `GET /api/attachments/:id/download` - Download file with access control
- `GET/POST/PATCH/DELETE /api/folders` - Folder CRUD
- `POST /api/files/upload` - File upload
- `GET /api/files/:id/download` - File download/preview
- `PATCH/DELETE /api/files/:id` - File management
- `GET /api/search?q=` - Search
- `GET/POST/DELETE /api/chat/conversations` - AI chat conversations
- `GET/POST /api/chat/conversations/:id/messages` - AI chat messages (SSE streaming, web search, GPT-4o)
- `GET /api/hearings?start=&end=` - List hearings (role-aware, date-filtered)
- `GET /api/cases/:caseId/hearings` - Case hearings (with access control)
- `POST /api/hearings` - Create hearing (lawyer only)
- `PATCH /api/hearings/:id` - Update hearing (lawyer only)
- `DELETE /api/hearings/:id` - Delete hearing (lawyer only)
- `POST /api/contact` - Submit contact form (public, with file upload)
- `GET /api/admin/contact-submissions` - List all contact submissions (admin only)
- `GET /api/admin/contact-submissions/:id` - Get single submission (admin only)
- `PATCH /api/admin/contact-submissions/:id` - Update status/notes (admin only)
- `GET /api/admin/contact-submissions/:id/attachment` - Download attachment (admin only)
- `GET/DELETE /api/admin/users` - Admin user management (owner-only)

## Security
- Owner-only admin: goldservicepoland@gmail.com auto-promoted on login
- Role-based middleware: requireLawyer, requireAdmin
- File download authorization: owner check + case participant check
- Hearings access control: lawyer ownership + client case participation check
- Email 2FA: gates dashboard access (onboardingCompleted + emailVerified required), 5-min code expiry, SHA-256 hashed codes in DB, 3-attempt lockout (15 min), resend rate limit (5 per 15 min), crypto.randomBytes code generation, timing-safe comparison
- Recipient derivation server-side for messages
- Auth upsert only updates basic profile fields (not role/onboarding)
- NIP validation: Polish checksum algorithm (weights: 6,5,7,2,3,4,5,6,7, modulo 11)
- PESEL validation: Polish checksum algorithm (weights: 1,3,7,9,1,3,7,9,1,3)

## Polish Constants
- 16 voivodeships (VOIVODESHIP_LABELS in shared/schema.ts)
- 9 case categories (CASE_CATEGORY_LABELS, CASE_CATEGORY_DESCRIPTIONS in shared/schema.ts)
- Polish date/time formatting (Europe/Warsaw timezone, client/src/lib/date-utils.ts)
- All UI text in Polish

## Owner
Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice
Email: goldservicepoland@gmail.com

## Recent Changes
- Voice features in AI Chat: Speech-to-Text (Web Speech API, pl-PL) for voice input via microphone button, Text-to-Speech (SpeechSynthesis API, pl-PL) for listening to AI responses with per-message "Odsluchaj" button, auto-speak toggle for automatic reading of new responses
- Collapsible sidebar navigation: Shadcn Sidebar with AppSidebar + AuthenticatedLayout wrapper for all authenticated pages (Dashboard, Czat AI, Kalendarz, Profil, Admin)
- Registration flow merged with onboarding: 4-step wizard (role, basic data + password, address, professional info) integrated into login page with Login/Register tabs
- Dual auth: email/password registration + Replit Auth (OIDC)
- Enhanced document management: rename folders/files via context menus, download/print/preview buttons, file format conversion (JPG/PNG→PDF, PDF→JPG, DOCX→PDF)
- AI Chat unrestricted topics: responds to any question, not limited to legal topics
- AI Chat file/image uploads: GPT-4o vision for image analysis, file attachments in chat
- AI Chat DALL-E 3 integration: image generation on request, display in chat with download button
- AI Chat web search: DuckDuckGo integration for current information
- Case categories based on Polish legal system (9 branches)
- Enhanced landing page with comprehensive sections
- Owner-only admin system (goldservicepoland@gmail.com whitelisted)
- Advanced contact form with 9 categories, file attachment, priority levels, email notification via SendGrid
- Enhanced onboarding form: country selector, phone country code prefix, searchable city selection (300+ Polish cities), disposable email detection
