# LexVault - Legal Practice Management Platform

## Overview
LexVault is a professional legal practice management platform for lawyers (adwokaci, radcy prawni) and their clients (individual, company). Features role-based access, case management, real-time lawyer-client messaging with PDF attachments, document management, AI legal assistant with web browsing, court hearing calendar, email 2FA verification, and profile management. Dark theme with red (primary) accents. Polish language interface.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Drizzle ORM)
- **Auth**: Replit Auth (OIDC - supports Google, GitHub, Apple, email login)
- **AI**: OpenAI via Replit AI Integrations (ChatGPT with web search via DuckDuckGo)
- **Email**: SendGrid (verification emails with branded HTML templates)
- **File Upload**: Multer (PDF, JPG, PNG, DOCX - max 10MB)

## User Roles
- `adwokat` - Lawyer (attorney): manages clients, cases, documents, court hearings
- `radca_prawny` - Legal counselor: same as adwokat
- `klient` - Individual client: views assigned cases, sends messages, views hearings (read-only)
- `firma` - Company client: same as klient but with company info (NIP, company name)

## Database Schema
- `sessions`: sid (PK), sess (jsonb), expire - Replit Auth sessions
- `users`: id (varchar PK, UUID), email, firstName, lastName, profileImageUrl, isAdmin, role, onboardingCompleted, emailVerified, phone, pesel, address, street, city, postalCode, voivodeship, country, companyName, nip, barNumber, lawyerType, createdAt, updatedAt
- `client_records`: id (serial PK), lawyerId (FK->users), userId (FK->users nullable), firstName, lastName, pesel, email, phone, address, city, postalCode, notes, createdAt
- `cases`: id (serial PK), lawyerId (FK->users), clientRecordId (FK->client_records), title, caseNumber, description, status, createdAt, updatedAt
- `folders`: id (serial PK), userId (FK->users), caseId (FK->cases), name, parentFolderId, createdAt
- `files`: id (serial PK), userId (FK->users), folderId (FK->folders), caseId (FK->cases), name, path, type, size, createdAt
- `direct_messages`: id (serial PK), caseId (FK->cases), senderId (FK->users), recipientId (FK->users), content, editedAt, createdAt
- `message_attachments`: id (serial PK), messageId (FK->direct_messages), fileId (FK->files), fileName, filePath, fileType, fileSize, createdAt
- `conversations`: id (serial PK), userId (FK->users), title, createdAt - AI chat conversations
- `messages`: id (serial PK), conversationId (FK->conversations), role, content, createdAt - AI chat messages
- `email_verifications`: id (serial PK), userId (FK->users), email, code, expiresAt, usedAt, createdAt - Email 2FA codes
- `court_hearings`: id (serial PK), caseId (FK->cases), lawyerId (FK->users), title, description, courtName, courtRoom, startsAt, endsAt, createdAt

## Key Routes
- `/` - Landing page (public)
- `/onboarding` - Mandatory 4-step profile completion after first login (role, basic data, address, role-specific)
- `/verify-email` - Email 2FA verification (6-digit code)
- `/dashboard` - Role-specific dashboard (protected, requires onboarding + email verification)
- `/case/:id` - Case detail with messaging (protected)
- `/chat` - AI chat assistant with web browsing (protected)
- `/calendar` - Court hearing calendar with month/week views (protected)
- `/profile` - Profile settings - view/edit personal data (protected)
- `/admin` - Admin user management (protected, admin only)
- `/contact` - Contact information
- `/terms` - Terms of service
- `/privacy` - Privacy policy (RODO)

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
- `POST/PATCH/DELETE /api/cases` - Case management (lawyer only)
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
- `GET/POST /api/chat/conversations/:id/messages` - AI chat messages (SSE streaming, web search)
- `GET /api/hearings?start=&end=` - List hearings (role-aware, date-filtered)
- `GET /api/cases/:caseId/hearings` - Case hearings (with access control)
- `POST /api/hearings` - Create hearing (lawyer only)
- `PATCH /api/hearings/:id` - Update hearing (lawyer only)
- `DELETE /api/hearings/:id` - Delete hearing (lawyer only)
- `GET/PATCH/DELETE /api/admin/users` - Admin user management

## Security
- Role-based middleware: requireLawyer, requireAdmin
- File download authorization: owner check + case participant check
- Hearings access control: lawyer ownership + client case participation check
- Email 2FA: gates dashboard access (onboardingCompleted + emailVerified required)
- Recipient derivation server-side for messages
- Auth upsert only updates basic profile fields (not role/onboarding)
- NIP validation: Polish checksum algorithm (weights: 6,5,7,2,3,4,5,6,7, modulo 11)
- PESEL validation: Polish checksum algorithm (weights: 1,3,7,9,1,3,7,9,1,3)

## Polish Constants
- 16 voivodeships (VOIVODESHIP_LABELS in shared/schema.ts)
- Polish date/time formatting (Europe/Warsaw timezone, client/src/lib/date-utils.ts)
- All UI text in Polish

## Owner
Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice
Email: goldservicepoland@gmail.com

## Recent Changes
- Email 2FA verification flow with branded SendGrid templates
- Enhanced 4-step onboarding wizard (role, basic data, address, role-specific data)
- NIP and PESEL validation with Polish checksum algorithms
- Profile settings page for viewing/editing personal data
- Court hearing calendar with month and week views
- Hearing CRUD API with access control (lawyers manage, clients view)
- Polish date/time formatting utility (Europe/Warsaw timezone)
- Added emailVerified, street, voivodeship, country fields to users
- Added email_verifications and court_hearings database tables
