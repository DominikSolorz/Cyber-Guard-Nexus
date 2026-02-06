# 🚀 Document Manager AI

Zaawansowany system zarządzania dokumentami z wbudowaną sztuczną inteligencją.

## ✨ Funkcje

- 📁 **Zarządzanie plikami** - organizacja dokumentów w folderach
- 🤖 **Chat AI** - konwersacja z ChatGPT-4 z edytorem WYSIWYG
- 📧 **Email** - integracja z Gmail (wysyłanie, odbieranie, załączniki)
- 📱 **Responsive** - działa na komputerze i telefonie
- 🔒 **Bezpieczeństwo** - JWT autentykacja, szyfrowanie haseł
- 💾 **Offline mode** - praca bez internetu z synchronizacją
- 🔍 **Wyszukiwanie** - szybkie znajdowanie plików i wiadomości
- 🏷️ **Tagi** - organizacja przez etykiety

## 🛠️ Technologie

### Backend
- **Python 3.13** - język programowania
- **FastAPI 0.128.2** - framework webowy
- **PostgreSQL** - baza danych
- **SQLAlchemy 2.0** - ORM
- **Redis** - cache i sesje

### Frontend
- **React 18.3** - biblioteka UI
- **TypeScript 5.9** - typowanie
- **Vite 7.3** - build tool
- **Material-UI** - komponenty
- **TinyMCE** - edytor WYSIWYG

### AI & Integracje
- **OpenAI GPT-4** - sztuczna inteligencja
- **Gmail API** - email (IMAP/SMTP)

## 📦 Instalacja

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/DominikSolorz/Cyber-Guard-Nexus.git
cd Cyber-Guard-Nexus
```

### 2. Skonfiguruj środowisko
```bash
# Skopiuj plik konfiguracyjny
cp .env.example .env

# Edytuj .env i wpisz prawdziwe klucze API
nano .env
```

### 3. Uruchom backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 4. Uruchom frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Otwórz w przeglądarce
```
http://localhost:5173
```

## 🔑 Konfiguracja kluczy API

### OpenAI API Key
1. Zarejestruj się na https://platform.openai.com
2. Przejdź do https://platform.openai.com/api-keys
3. Kliknij "Create new secret key"
4. Skopiuj klucz i wklej do `.env` jako `OPENAI_API_KEY`

### Gmail App Password
1. Zaloguj się do Gmail
2. Włącz 2FA: https://myaccount.google.com/signinoptions/two-step-verification
3. Wygeneruj hasło aplikacji: https://myaccount.google.com/apppasswords
4. Wybierz "Mail" i "Other device"
5. Skopiuj 16-znakowe hasło do `.env` jako `GMAIL_APP_PASSWORD`

## 👤 Autor

**Dominik Solorz**
- Email: goldservicepoland@gmail.com
- GitHub: [@DominikSolorz](https://github.com/DominikSolorz)

## 📄 Licencja

© 2026 Document Manager AI - All rights reserved

---

Stworzone z ❤️ przez Dominika Solorza
