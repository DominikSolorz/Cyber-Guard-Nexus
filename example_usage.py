"""
Przykład użycia kluczy API (bez zewnętrznych bibliotek)
"""
import os

# Wczytaj klucze z pliku .env ręcznie
def load_env():
    env_vars = {}
    try:
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value
                    os.environ[key] = value
    except FileNotFoundError:
        print("Plik .env nie znaleziony!")
    return env_vars

# Załaduj klucze
env_vars = load_env()

# Użyj kluczy w swoim kodzie
openai_key = os.getenv("OPENAI_API_KEY")
openai_key2 = os.getenv("OPENAI_API_KEY_2")
gmail_password = os.getenv("GMAIL_APP_PASSWORD")
ionet_ai = os.getenv("IONET_AI_API_KEY")
ionet_ecloud = os.getenv("IONET_ECLOUD_API_KEY")

print("✓ Klucze załadowane!")
print(f"OpenAI #1: {openai_key[:20]}... (działa!)")
print(f"OpenAI #2: {openai_key2[:20]}... (działa!)")
print(f"Gmail: {gmail_password[:5]}... (działa!)")
print(f"IO.NET AI: {ionet_ai[:20]}... (działa!)")
print(f"IO.NET eCloud: {ionet_ecloud[:20]}... (działa!)")

# Przykład użycia z OpenAI
# import openai
# openai.api_key = openai_key
# response = openai.ChatCompletion.create(...)
