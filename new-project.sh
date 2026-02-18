#!/bin/bash
# Tworzenie nowego projektu z template

PROJECT_NAME="$1"
TEMPLATE="$2"

if [ -z "$PROJECT_NAME" ] || [ -z "$TEMPLATE" ]; then
    echo "Użycie: ./new-project.sh <nazwa> <template>"
    echo ""
    echo "Dostępne templaty:"
    echo "  html      - Statyczna strona HTML/CSS/JS"
    echo "  react     - Aplikacja React + Vite"
    echo "  fastapi   - Backend API FastAPI"
    echo "  flask     - Backend Flask"
    echo "  nodejs    - Backend Node.js + Express"
    echo ""
    echo "Przykład:"
    echo "  ./new-project.sh moja-strona html"
    exit 1
fi

case $TEMPLATE in
    html)
        PROJECT_PATH="projects/web/$PROJECT_NAME"
        ;;
    react)
        PROJECT_PATH="projects/frontend/$PROJECT_NAME"
        ;;
    fastapi|flask)
        PROJECT_PATH="projects/backend/$PROJECT_NAME"
        ;;
    nodejs)
        PROJECT_PATH="projects/backend/$PROJECT_NAME"
        ;;
    *)
        echo "❌ Nieznany template: $TEMPLATE"
        exit 1
        ;;
esac

if [ -d "$PROJECT_PATH" ]; then
    echo "❌ Projekt $PROJECT_PATH już istnieje!"
    exit 1
fi

echo "🎨 Tworzenie projektu: $PROJECT_NAME"
echo "📁 Lokalizacja: $PROJECT_PATH"
echo "📋 Template: $TEMPLATE"
echo ""

mkdir -p "$PROJECT_PATH"
cp -r "templates/$TEMPLATE/"* "$PROJECT_PATH/" 2>/dev/null || true

echo "✅ Projekt utworzony!"
echo ""
echo "Następne kroki:"
echo "  cd $PROJECT_PATH"
echo "  # edytuj pliki"
echo "  cd ../../.."
echo "  ./deploy.sh $PROJECT_PATH"
