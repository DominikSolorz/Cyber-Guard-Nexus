"""
FastAPI Backend Template
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Wczytaj zmienne środowiskowe
load_dotenv('../../.env')

app = FastAPI(
    title="API",
    description="Backend API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modele danych
class Item(BaseModel):
    name: str
    description: str = None

# Endpoints
@app.get("/")
def root():
    return {
        "message": "API działa!",
        "status": "ok",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/items")
def create_item(item: Item):
    return {
        "message": "Item utworzony",
        "item": item
    }

@app.get("/api-keys")
def check_keys():
    """Sprawdź dostępność kluczy API"""
    return {
        "openai": "✓" if os.getenv("OPENAI_API_KEY") else "✗",
        "gmail": "✓" if os.getenv("GMAIL_APP_PASSWORD") else "✗",
        "ionet_ai": "✓" if os.getenv("IONET_AI_API_KEY") else "✗",
        "ionet_ecloud": "✓" if os.getenv("IONET_ECLOUD_API_KEY") else "✗",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
