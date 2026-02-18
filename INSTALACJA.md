# 🚀 Instrukcja Instalacji i Uruchomienia LexVault

## ✅ BEZPIECZEŃSTWO - SPRAWDZONE!

**Raport bezpieczeństwa:** Zobacz [BEZPIECZENSTWO.md](BEZPIECZENSTWO.md)

**Status:** ✅ Bezpieczny - wszystkie klucze API są prawidłowo zabezpieczone!

---

## 📋 Wymagania

- **Node.js** 18+ ([https://nodejs.org/](https://nodejs.org/))
- **PostgreSQL** 14+ ([https://www.postgresql.org/](https://www.postgresql.org/))
- **npm** (instalowany z Node.js)

---

## 🔧 Instalacja

### 1. Zainstaluj Node.js (jeśli nie masz)

**Alpine Linux:**
```bash
apk add nodejs npm
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS (Homebrew):**
```bash
brew install node
```

**Windows:**
- Pobierz z [https://nodejs.org/](https://nodejs.org/)

### 2. Zainstaluj PostgreSQL

**Alpine Linux:**
```bash
apk add postgresql postgresql-dev
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### 3. Utwórz bazę danych

```bash
# Zaloguj się do PostgreSQL
sudo -u postgres psql

# Utwórz bazę
CREATE DATABASE lexvault;
CREATE USER lexvault_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE lexvault TO lexvault_user;
\q
```

### 4. Skonfiguruj zmienne środowiskowe

```bash
# Skopiuj szablon
cp .env.example .env

# Edytuj plik .env
nano .env
```

**Wypełnij .env:**
```env
DATABASE_URL=postgresql://lexvault_user:your_secure_password@localhost:5432/lexvault
AI_INTEGRATIONS_OPENAI_API_KEY=sk-proj-TWOJ_KLUCZ_OPENAI
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
NODE_ENV=development
PORT=5000
```

### 5. Zainstaluj zależności

```bash
cd /workspaces/Cyber-Guard-Nexus/Lex-Vault
npm install
```

### 6. Skonfiguruj bazę danych (migracje)

```bash
npm run db:push
```

---

## 🚀 Uruchomienie

### Tryb deweloperski (development)

```bash
npm run dev
```

Aplikacja będzie dostępna na: **http://localhost:5000**

### Tryb produkcyjny (production)

```bash
# 1. Zbuduj aplikację
npm run build

# 2. Uruchom
npm start
```

---

## 🔐 WAŻNE - BEZPIECZEŃSTWO

### ✅ Co jest zabezpieczone:
- ✅ Hasła użytkowników (bcrypt, salt=12)
- ✅ Klucze API w `.env` (nie w kodzie)
- ✅ `.env` w `.gitignore` (nie trafi do Git)
- ✅ SQL Injection protection (Drizzle ORM)
- ✅ Kody weryfikacyjne hashowane

### ⚠️ Sprawdź przed uruchomieniem:
```bash
# Czy .env jest ignorowany?
git status | grep ".env"  # powinno być puste

# Czy .gitignore działa?
cat .gitignore | grep ".env"  # powinno pokazać .env
```

### 🚫 NIGDY NIE COMMITUJ:
- ❌ `.env` - klucze API
- ❌ `uploads/` - pliki użytkowników  
- ❌ `*.log` - logi
- ❌ `node_modules/` - dependencies

---

## 📝 Dostępne komendy

```bash
npm run dev          # Uruchom w trybie development
npm run build        # Zbuduj dla produkcji
npm start            # Uruchom produkcyjnie
npm run db:push      # Synchronizuj schemat bazy
npm run check        # Sprawdź typy TypeScript
```

---

## 🌐 Po uruchomieniu

1. Otwórz przeglądarkę: **http://localhost:5000**
2. Zarejestruj się jako pierwszy użytkownik
3. Potwierdź email kodem weryfikacyjnym
4. Gotowe! 🎉

---

## 📊 Funkcje

- ✅ System logowania (email/hasło + OAuth)
- ✅ Zarządzanie sprawami prawnymi
- ✅ Chat prawnik-klient (szyfrowany)
- ✅ Asystent AI (ChatGPT)
- ✅ Obieg dokumentów (PDF, JPG, DOCX)
- ✅ Kalendarz rozpraw
- ✅ Weryfikacja email
- ✅ Panel admina

---

## 🐛 Troubleshooting

### Problem: `npm: command not found`
**Rozwiązanie:** Zainstaluj Node.js (zobacz sekcję Instalacja)

### Problem: `DATABASE_URL is not set`
**Rozwiązanie:** Utwórz plik `.env` i wypełnij `DATABASE_URL`

### Problem: `Error connecting to database`
**Rozwiązanie:** 
1. Sprawdź czy PostgreSQL działa: `pg_isready`
2. Sprawdź czy baza istnieje: `psql -l | grep lexvault`
3. Sprawdź hasło w `DATABASE_URL`

### Problem: `OpenAI API error`
**Rozwiązanie:** Sprawdź czy `AI_INTEGRATIONS_OPENAI_API_KEY` w `.env` jest prawidłowy

---

## 📞 Kontakt

**Autor:** Dominik Solorz  
**Email:** goldservicepoland@gmail.com  
**GitHub:** https://github.com/DominikSolorz/Cyber-Guard-Nexus

---

**Gotowe do pracy! Aplikacja jest bezpieczna! 🔐✨**
