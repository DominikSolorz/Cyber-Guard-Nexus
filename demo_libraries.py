"""
Demo użycia zainstalowanych bibliotek z kluczami API
"""
import os
import sys

# Wczytaj klucze z .env
def load_env():
    with open('.env', 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

load_env()

print("=" * 60)
print("DEMO ZAINSTALOWANYCH BIBLIOTEK")
print("=" * 60)

# 1. OPENAI / CHAT GPT
print("\n✓ OpenAI (Chat GPT)")
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print("  → Klient OpenAI gotowy!")
    print(f"  → API Key: {os.getenv('OPENAI_API_KEY')[:20]}...")
except Exception as e:
    print(f"  ✗ Błąd: {e}")

# 2. FASTAPI (Backend)
print("\n✓ FastAPI (Backend API)")
try:
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    def read_root():
        return {"message": "Backend działa!", "openai": "ready"}
    
    print("  → FastAPI zaimportowany!")
    print("  → Endpoint '/' gotowy")
except Exception as e:
    print(f"  ✗ Błąd: {e}")

# 3. FLASK (Backend alternatywny)
print("\n✓ Flask (Backend alternatywny)")
try:
    from flask import Flask
    flask_app = Flask(__name__)
    
    @flask_app.route('/')
    def home():
        return "Flask działa!"
    
    print("  → Flask zaimportowany!")
    print("  → Route '/' gotowy")
except Exception as e:
    print(f"  ✗ Błąd: {e}")

# 4. REQUESTS (HTTP)
print("\n✓ Requests (HTTP Client)")
try:
    import requests
    print("  → Requests gotowy!")
    print("  → Możesz robić HTTP requests")
except Exception as e:
    print(f"  ✗ Błąd: {e}")

# 5. BEAUTIFULSOUP (Web Scraping)
print("\n✓ BeautifulSoup (Web Scraping)")
try:
    from bs4 import BeautifulSoup
    print("  → BeautifulSoup gotowy!")
    print("  → Możesz parsować HTML")
except Exception as e:
    print(f"  ✗ Błąd: {e}")

# 6. GOOGLE API (Gmail/Cloud)
print("\n✓ Google APIs (Gmail, Cloud)")
try:
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    print("  → Google API Client gotowy!")
    print(f"  → Gmail: {os.getenv('GMAIL_APP_PASSWORD')[:5]}...")
except Exception as e:
    print(f"  ✗ Błąd: {e}")

# 7. IO.NET
print("\n✓ IO.NET (Cloud Computing)")
print(f"  → AI Key: {os.getenv('IONET_AI_API_KEY')[:20]}...")
print(f"  → eCloud Key: {os.getenv('IONET_ECLOUD_API_KEY')[:20]}...")

print("\n" + "=" * 60)
print("WSZYSTKO GOTOWE DO PRACY!")
print("=" * 60)
print("\nAby uruchomić z venv:")
print("  source venv/bin/activate")
print("  python demo_libraries.py")
print("\nAby uruchomić backend FastAPI:")
print("  uvicorn demo_libraries:app --reload --host 0.0.0.0 --port 8000")
