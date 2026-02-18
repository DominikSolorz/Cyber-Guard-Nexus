# Cyber Guard Nexus

Biblioteki i klucze API do pracy z:
- **OpenAI Chat GPT**
- **Backend (FastAPI, Flask)**
- **Google APIs (Gmail)**
- **IO.NET (AI + eCloud)**

## Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/DominikSolorz/Cyber-Guard-Nexus.git
cd Cyber-Guard-Nexus

# Skopiuj i skonfiguruj klucze
cp .env.example .env
nano .env  # wpisz swoje prawdziwe klucze

# Zainstaluj biblioteki
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Biblioteki

- openai - Chat GPT
- fastapi, uvicorn - Backend API
- flask - Backend alternatywny  
- requests, httpx - HTTP clients
- beautifulsoup4 - Web scraping
- google-api-python-client - Google APIs
- sqlalchemy - Database ORM

## Bezpieczeństwo

✅ `.gitignore` chroni klucze  
✅ GitHub Push Protection aktywna  
✅ W repo tylko szablony
