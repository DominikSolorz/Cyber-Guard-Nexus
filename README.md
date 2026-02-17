# Cyber Guard Nexus - Biblioteki API

Repozytorium z kluczami API i bibliotekami do pracy z:
- **OpenAI Chat GPT**
- **Backend (FastAPI, Flask)**
- **Google APIs (Gmail)**
- **IO.NET (AI + eCloud)**
- **Web Scraping**

## 🚀 Szybki start

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/DominikSolorz/Cyber-Guard-Nexus.git
cd Cyber-Guard-Nexus
```

### 2. Skopiuj szablon kluczy
```bash
cp .env.example .env
```

### 3. Wpisz swoje klucze API w `.env`
```bash
# Edytuj plik .env i wpisz swoje prawdziwe klucze
nano .env
```

### 4. Zainstaluj biblioteki
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 5. Przetestuj instalację
```bash
python demo_libraries.py
```

## 📦 Zainstalowane biblioteki

- **openai** - Chat GPT API
- **fastapi** - Nowoczesny backend framework
- **flask** - Klasyczny backend framework
- **uvicorn** - ASGI server dla FastAPI
- **requests** - HTTP client
- **httpx** - Async HTTP client
- **beautifulsoup4** - Web scraping
- **sqlalchemy** - Database ORM
- **google-api-python-client** - Google APIs
- **pydantic** - Data validation

## 🔑 Klucze API

Klucze są przechowywane w:
- `.env` - lokalne zmienne środowiskowe (NIE COMMITUJ!)
- `KLUCZE_API.txt` - backup kluczy (NIE COMMITUJ!)

## 🛡️ Bezpieczeństwo

✅ `.gitignore` chroni klucze przed wysłaniem do GitHub  
✅ GitHub Push Protection blokuje klucze automatycznie  
✅ W repozytorium tylko szablony bez prawdziwych kluczy

## 📚 Przykłady użycia

### OpenAI Chat GPT
```python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### FastAPI Backend
```python
from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok", "openai": "ready"}

# Uruchom: uvicorn demo_libraries:app --reload
```

## 📝 Licencja

Prywatne repozytorium - tylko do użytku osobistego.
