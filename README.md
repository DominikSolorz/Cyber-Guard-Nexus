# Cyber Guard Nexus

Kompletna przestrzeń developerska z kluczami API i narzędziami do szybkiego wdrażania aplikacji.

## 🚀 Szybki start

### 1. Sklonuj i skonfiguruj
```bash
git clone https://github.com/DominikSolorz/Cyber-Guard-Nexus.git
cd Cyber-Guard-Nexus

# Skonfiguruj klucze API
cp .env.example .env
nano .env  # wpisz swoje klucze
```

### 2. Zainstaluj biblioteki Python  
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Utwórz i wdróż projekt
```bash
# Nowy projekt z template
./new-project.sh moja-strona html

# LUB wrzuć własne pliki do projects/
mkdir -p projects/web/moj-projekt
# ... skopiuj pliki

# Uruchom
./deploy.sh projects/web/moj-projekt
```

Szczegóły: [QUICK_START.md](QUICK_START.md)

## 📦 Co zawiera

**Klucze API:**
- OpenAI Chat GPT (2 klucze)
- Gmail App Password
- IO.NET AI + eCloud

**Biblioteki Python:**
- openai, fastapi, flask - Backend & AI
- requests, httpx - HTTP clients
- beautifulsoup4 - Web scraping
- google-api-python-client - Google APIs

**Narzędzia deployment:**
- `deploy.sh` - Automatyczne uruchamianie projektów
- `new-project.sh` - Tworzenie z templateów
- Templaty: HTML, React, FastAPI

## 📁 Struktura

```
├── .env              # Klucze API (chronione)
├── KLUCZE_API.txt    # Backup kluczy (chroniony)
├── deploy.sh         # Skrypt wdrożeniowy
├── new-project.sh    # Tworzenie projektów
├── projects/         # Twoje projekty
│   ├── web/          # Strony HTML
│   ├── backend/      # API Python/Node.js
│   └── frontend/     # React, Vue
└── templates/        # Szablony startowe
    ├── html/         # Template HTML
    ├── python/       # Template FastAPI
    └── react/        # Template React
```

## 🛡️ Bezpieczeństwo

✅ `.gitignore` chroni klucze i projekty  
✅ GitHub Push Protection aktywna  
✅ W repo tylko szablony i narzędzia
