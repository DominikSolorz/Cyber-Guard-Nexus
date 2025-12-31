# Margonem-like — Strona gry (public/)

Repo zawiera prostą, statyczną wersję prototypu gry "Margonem-like" umieszczoną w katalogu `public/`.

## ✨ Nowe funkcje

- ✅ **Automatyczny deploy do GitHub Pages** - przy pushu do main
- ✅ **Efekty dźwiękowe WebAudio** - ataki, umiejętności, podnoszenie przedmiotów
- ✅ **Autosave do localStorage** - zapis gry co 5 sekund + ładowanie przy starcie
- ✅ **Responsywne UI** - działa na komputerze i telefonie
- ✅ **Dotykowe przyciski** - ATAK, UMIEJ., WEŹ, EQ, SKLP

## 🎮 Jak uruchomić lokalnie

### Opcja 1: Prosty serwer HTTP
```bash
cd public
npx http-server -p 8080
# lub
python3 -m http.server 8080
```

### Opcja 2: Bezpośrednie otwarcie
Otwórz plik `public/index.html` w przeglądarce.

## 🚀 GitHub Pages

Po zmergowaniu zmian do `main`, GitHub Actions automatycznie opublikuje grę pod adresem:
```
https://DominikSolorz.github.io/Cyber-Guard-Nexus/
```

### Konfiguracja GitHub Pages
1. Po zmergowaniu PR, przejdź do **Settings → Pages**
2. Upewnij się, że **Source** jest ustawione na **Deploy from a branch**
3. Wybierz branch **gh-pages** i folder **/root**
4. Kliknij **Save**

Workflow automatycznie utworzy branch `gh-pages` z zawartością katalogu `public/`.

## 📁 Hosting

Katalog `public/` jest przygotowany do hostingu statycznego:
- GitHub Pages ✅ (automatyczny deploy)
- Netlify
- Vercel
- Firebase Hosting

## ⚙️ Technologia

- Gra jest prototypem, używa **Phaser.js 3.60.0** z CDN
- Nie wymaga budowania ani instalacji zależności
- Wszystkie assety generowane w runtime
- Pure vanilla JavaScript

## 📦 Backup

Branch `backup-before-pages-deploy` zawiera kopię poprzedniej zawartości repozytorium.
