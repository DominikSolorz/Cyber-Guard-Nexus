#!/bin/bash
# Skrypt instalacyjny bibliotek Python dla Chat GPT, Backend i Web Apps

echo "=== Instalacja bibliotek Python ==="
echo ""

# Sprawdź czy mamy pip
if ! command -v pip3 &> /dev/null; then
    echo "⚠️  pip3 nie znaleziony. Instalacja przez wget..."
    
    # Pobierz get-pip.py
    wget -q https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py
    
    # Zainstaluj pip jako użytkownik
    python3 /tmp/get-pip.py --user
    
    # Dodaj pip do PATH
    export PATH="$HOME/.local/bin:$PATH"
    
    echo "✓ pip3 zainstalowany"
else
    echo "✓ pip3 już zainstalowany"
fi

# Zainstaluj biblioteki
echo ""
echo "Instalacja bibliotek..."
python3 -m pip install --user -q -r requirements.txt

echo ""
echo "✓ Wszystkie biblioteki zainstalowane!"
echo ""
echo "Zainstalowane pakiety:"
python3 -m pip list --user | grep -E "(openai|fastapi|flask|requests|selenium|playwright|beautifulsoup4|sqlalchemy)"
