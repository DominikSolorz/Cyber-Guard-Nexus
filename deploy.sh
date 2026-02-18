#!/bin/bash
# Skrypt wdrożeniowy - automatyczne uruchamianie projektów

set -e

PROJECT_DIR="$1"
PORT="${2:-8000}"

if [ -z "$PROJECT_DIR" ]; then
    echo "Użycie: ./deploy.sh <folder_projektu> [port]"
    echo ""
    echo "Przykłady:"
    echo "  ./deploy.sh projects/web/moja-strona"
    echo "  ./deploy.sh projects/backend/api 8080"
    exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Folder $PROJECT_DIR nie istnieje!"
    exit 1
fi

cd "$PROJECT_DIR"
echo "📦 Wdrażanie projektu: $PROJECT_DIR"
echo "🔌 Port: $PORT"
echo ""

# Wykryj typ projektu i uruchom
if [ -f "package.json" ]; then
    echo "🟢 Wykryto projekt Node.js/React"
    if [ ! -d "node_modules" ]; then
        echo "📥 Instalacja zależności..."
        npm install
    fi
    
    if grep -q "\"dev\":" package.json; then
        echo "🚀 Uruchamianie dev server..."
        npm run dev
    elif grep -q "\"start\":" package.json; then
        echo "🚀 Uruchamianie..."
        npm start
    else
        echo "❌ Brak skryptu start/dev w package.json"
        exit 1
    fi

elif [ -f "requirements.txt" ]; then
    echo "🐍 Wykryto projekt Python"
    
    if [ ! -d "venv" ]; then
        echo "📥 Tworzenie środowiska wirtualnego..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    echo "📥 Instalacja zależności..."
    pip install -q -r requirements.txt
    
    if [ -f "main.py" ]; then
        if grep -q "fastapi" requirements.txt; then
            echo "🚀 Uruchamianie FastAPI..."
            uvicorn main:app --reload --host 0.0.0.0 --port $PORT
        else
            echo "🚀 Uruchamianie Python..."
            python main.py
        fi
    elif [ -f "app.py" ]; then
        if grep -q "flask" requirements.txt; then
            echo "🚀 Uruchamianie Flask..."
            export FLASK_APP=app.py
            export FLASK_ENV=development
            flask run --host 0.0.0.0 --port $PORT
        else
            echo "🚀 Uruchamianie Python..."
            python app.py
        fi
    else
        echo "❌ Nie znaleziono main.py ani app.py"
        exit 1
    fi

elif [ -f "index.html" ]; then
    echo "🌐 Wykryto statyczną stronę HTML"
    echo "🚀 Uruchamianie serwera HTTP..."
    python3 -m http.server $PORT

else
    echo "❌ Nieznany typ projektu!"
    echo "Obsługiwane:"
    echo "  - Node.js/React (package.json)"
    echo "  - Python (requirements.txt)"
    echo "  - HTML (index.html)"
    exit 1
fi
