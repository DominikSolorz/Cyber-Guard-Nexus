# LexVault - Document Management System

## Overview
LexVault is a professional Document Management System (DMS) for legal cases. It allows users to organize, store, and search their legal documents securely. Dark theme with red (primary) accents. Polish language interface.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Drizzle ORM)
- **Auth**: Replit Auth (OIDC - supports Google, GitHub, Apple, email login)
- **AI**: OpenAI via Replit AI Integrations (ChatGPT assistant)
- **File Upload**: Multer (PDF, JPG, PNG, DOCX - max 10MB)

## Database Schema
- `sessions`: sid (PK), sess (jsonb), expire - Replit Auth sessions
- `users`: id (varchar PK, UUID), email, firstName, lastName, profileImageUrl, isAdmin, createdAt, updatedAt
- `folders`: id (serial PK), userId (FK->users), name, parentFolderId, createdAt
- `files`: id (serial PK), userId (FK->users), folderId (FK->folders), name, path, type, size, createdAt
- `conversations`: id (serial PK), userId (FK->users), title, createdAt
- `messages`: id (serial PK), conversationId (FK->conversations), role, content, createdAt

## Key Routes
- `/` - Landing page
- `/dashboard` - Document management (protected)
- `/chat` - AI chat assistant (protected)
- `/admin` - Admin user management (protected, admin only)
- `/contact` - Contact information
- `/terms` - Terms of service
- `/privacy` - Privacy policy (RODO)

## API Endpoints
- `GET /api/login` - Initiate Replit Auth login
- `GET /api/callback` - Auth callback
- `GET /api/logout` - Logout
- `GET /api/auth/user` - Current user info
- `GET/POST/PATCH/DELETE /api/folders` - Folder CRUD
- `POST /api/files/upload` - File upload
- `GET /api/files/:id/download` - File download/preview
- `PATCH/DELETE /api/files/:id` - File management
- `GET /api/search?q=` - Search
- `GET/POST/DELETE /api/chat/conversations` - Chat conversations
- `GET/POST /api/chat/conversations/:id/messages` - Chat messages (streaming SSE)
- `GET/PATCH/DELETE /api/admin/users` - Admin user management

## Owner
Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice
Email: goldservicepoland@gmail.com

## Recent Changes
- Switched auth from bcrypt to Replit Auth (OIDC) for Google/GitHub/Apple/email login
- Added AI chat assistant with ChatGPT streaming responses
- Added admin panel for user management
- Added contact page
- User IDs changed from serial to varchar (UUID) for Replit Auth compatibility
- Added isAdmin field to users table
- Added conversations and messages tables for AI chat
