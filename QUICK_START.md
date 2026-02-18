# 🚀 QUICK START - Wdrażanie Projektów

## 1. Nowy projekt z template

```bash
# Strona HTML
./new-project.sh moja-strona html

# Aplikacja React
./new-project.sh moja-app react

# Backend FastAPI
./new-project.sh api fastapi
```

## 2. Wrzuć własne pliki

```bash
# Stwórz folder i wrzuć pliki
mkdir -p projects/web/moj-projekt
# ... skopiuj swoje pliki HTML/CSS/JS

# LUB dla backendu Python
mkdir -p projects/backend/moje-api
# ... skopiuj main.py i requirements.txt

# LUB dla Node.js/React
mkdir -p projects/frontend/moja-app
# ... skopiuj package.json i kod
```

## 3. Uruchom projekt

```bash
# Automatyczne wykrywanie typu i uruchomienie
./deploy.sh projects/web/moj-projekt

# Własny port
./deploy.sh projects/backend/api 8080
```

## Wspierane typy projektów

✅ **HTML/CSS/JS** - statyczne strony (index.html)
✅ **Python FastAPI** - backend API (requirements.txt + main.py)
✅ **Python Flask** - backend (requirements.txt + app.py)
✅ **Node.js/React** - frontend/fullstack (package.json)

## Struktura

```
projects/
├── web/          # Statyczne strony HTML
├── backend/      # API Python/Node.js
├── frontend/     # React, Vue, Angular
└── fullstack/    # Pełne aplikacje

templates/        # Gotowe szablony
```

## Klucze API

Wszystkie projekty mają automatyczny dostęp do kluczy z pliku `.env`:
- `OPENAI_API_KEY`
- `OPENAI_API_KEY_2`
- `GMAIL_APP_PASSWORD`
- `IONET_AI_API_KEY`
- `IONET_ECLOUD_API_KEY`
