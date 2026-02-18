# LexVault - Document Management System

## Overview
LexVault is a professional Document Management System (DMS) for legal cases. It allows users to organize, store, and search their legal documents securely. Dark theme with red (primary) accents.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Drizzle ORM)
- **Auth**: bcrypt password hashing + express-session
- **File Upload**: Multer (PDF, JPG, PNG, DOCX - max 10MB)

## Database Schema
- `users`: id, firstName, lastName, email (unique), phone, birthDate, passwordHash, createdAt
- `folders`: id, userId, name, parentFolderId, createdAt
- `files`: id, userId, folderId, name, path, type, size, createdAt

## Key Routes
- `/` - Landing page
- `/login` - Login
- `/register` - Registration
- `/dashboard` - Document management (protected)
- `/terms` - Terms of service
- `/privacy` - Privacy policy (RODO)

## API Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `GET/POST/PATCH/DELETE /api/folders` - Folder CRUD
- `POST /api/files/upload` - File upload
- `GET /api/files/:id/download` - File download/preview
- `PATCH/DELETE /api/files/:id` - File management
- `GET /api/search?q=` - Search

## Owner
Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice
Email: goldservicepoland@gmail.com

## Recent Changes
- Initial MVP implementation (Feb 2026)
- Dark theme with red accents
- Full auth system with bcrypt + sessions
- Folder management with nested folders
- File upload with preview (images + PDF iframe)
- Search by name
- Terms and Privacy pages with RODO compliance
