# LexVault - Legal Practice Management Platform

## Overview
LexVault is a professional legal practice management platform for lawyers (adwokaci, radcy prawni) and their clients (individual, company). Features role-based access, case management, real-time lawyer-client messaging with PDF attachments, document management, and AI legal assistant with web browsing. Dark theme with red (primary) accents. Polish language interface.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Drizzle ORM)
- **Auth**: Replit Auth (OIDC - supports Google, GitHub, Apple, email login)
- **AI**: OpenAI via Replit AI Integrations (ChatGPT with web search via DuckDuckGo)
- **File Upload**: Multer (PDF, JPG, PNG, DOCX - max 10MB)

## User Roles
- `adwokat` - Lawyer (attorney): manages clients, cases, documents
- `radca_prawny` - Legal counselor: same as adwokat
- `klient` - Individual client: views assigned cases, sends messages
- `firma` - Company client: same as klient but with company info (NIP, company name)

## Database Schema
- `sessions`: sid (PK), sess (jsonb), expire - Replit Auth sessions
- `users`: id (varchar PK, UUID), email, firstName, lastName, profileImageUrl, isAdmin, role, onboardingCompleted, phone, pesel, address, city, postalCode, companyName, nip, barNumber, lawyerType, createdAt, updatedAt
- `client_records`: id (serial PK), lawyerId (FK->users), userId (FK->users nullable), firstName, lastName, pesel, email, phone, address, city, postalCode, notes, createdAt - lawyer-managed client records
- `cases`: id (serial PK), lawyerId (FK->users), clientRecordId (FK->client_records), title, caseNumber, description, status, createdAt, updatedAt
- `folders`: id (serial PK), userId (FK->users), caseId (FK->cases), name, parentFolderId, createdAt
- `files`: id (serial PK), userId (FK->users), folderId (FK->folders), caseId (FK->cases), name, path, type, size, createdAt
- `direct_messages`: id (serial PK), caseId (FK->cases), senderId (FK->users), recipientId (FK->users), content, editedAt, createdAt
- `message_attachments`: id (serial PK), messageId (FK->direct_messages), fileId (FK->files), fileName, filePath, fileType, fileSize, createdAt
- `conversations`: id (serial PK), userId (FK->users), title, createdAt - AI chat conversations
- `messages`: id (serial PK), conversationId (FK->conversations), role, content, createdAt - AI chat messages

## Key Routes
- `/` - Landing page (public)
- `/onboarding` - Mandatory profile completion after first login
- `/dashboard` - Role-specific dashboard (protected)
- `/case/:id` - Case detail with messaging (protected)
- `/chat` - AI chat assistant with web browsing (protected)
- `/admin` - Admin user management (protected, admin only)
- `/contact` - Contact information
- `/terms` - Terms of service
- `/privacy` - Privacy policy (RODO)

## API Endpoints
- `GET /api/login` - Initiate Replit Auth login
- `GET /api/callback` - Auth callback
- `GET /api/logout` - Logout
- `GET /api/auth/user` - Current user info
- `POST /api/onboarding` - Complete onboarding (role, personal data)
- `GET/POST/PATCH/DELETE /api/clients` - Client records CRUD (lawyer only)
- `GET /api/cases` - List cases (role-aware: lawyer sees own, client sees assigned)
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
- `GET/PATCH/DELETE /api/admin/users` - Admin user management

## Security
- Role-based middleware: requireLawyer, requireAdmin
- File download authorization: owner check + case participant check
- Recipient derivation server-side for messages
- Auth upsert only updates basic profile fields (not role/onboarding)

## Owner
Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice
Email: goldservicepoland@gmail.com

## Recent Changes
- Complete redesign from simple DMS to multi-role legal practice management platform
- Added role-based system: adwokat, radca_prawny, klient, firma
- Mandatory onboarding flow after first login
- Client record management for lawyers
- Case management with lawyer-client linking
- Real-time direct messaging per case with PDF attachments
- Message editing and text-to-speech
- AI chat enhanced with web browsing (DuckDuckGo search via function calling)
- Access control on file/attachment downloads
- Server-side recipient derivation for secure messaging
