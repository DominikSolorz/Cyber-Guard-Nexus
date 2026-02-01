# 📱 Instrukcja instalacji E-Kancelaria Pro na Android

## Metoda 1: Instalacja przez przeglądarkę (ZALECANA)

### Krok 1: Uruchom lokalnie
```bash
cd /workspaces/codespaces-blank/public
python3 -m http.server 8000
```

### Krok 2: Znajdź adres URL
W Codespaces kliknij "Ports" i skopiuj URL (np. `https://solid-robot-vpq96wwxrpx2wpqr-8000.app.github.dev`)

### Krok 3: Otwórz na telefonie
1. Otwórz Chrome na Androidzie
2. Wklej skopiowany URL
3. Kliknij menu (⋮) → **Dodaj do ekranu głównego**
4. Nazwij: "E-Kancelaria Pro"
5. Kliknij "Dodaj"

### Krok 4: Gotowe!
Ikona aplikacji pojawi się na ekranie głównym. Działa jak natywna aplikacja! 📱

---

## Metoda 2: Deploy na GitHub Pages

### Krok 1: Stwórz repo na GitHub
1. Wejdź na https://github.com/new
2. Nazwa: `e-kancelaria-pro`
3. Public
4. Create repository

### Krok 2: Push kodu
```bash
cd /workspaces/codespaces-blank/public
git remote add origin https://github.com/USERNAME/e-kancelaria-pro.git
git branch -M main
git push -u origin main
```

### Krok 3: Włącz GitHub Pages
1. Wejdź w Settings → Pages
2. Source: `main` / `root` lub `/docs`
3. Save
4. Poczekaj 1-2 minuty

### Krok 4: Link do instalacji
URL: `https://USERNAME.github.io/e-kancelaria-pro`

Otwórz na telefonie i zainstaluj jak w Metodzie 1!

---

## Metoda 3: Netlify (najszybsze)

### Krok 1: Deploy
1. Wejdź na https://netlify.com
2. Kliknij "Add new site" → "Import an existing project"
3. Połącz GitHub repo
4. Build command: (zostaw puste)
5. Publish directory: `./`
6. Deploy

### Krok 2: Link
Otrzymasz link: `https://e-kancelaria-pro.netlify.app`

### Krok 3: Instalacja
Otwórz link na Androidzie i zainstaluj!

---

## ✅ Weryfikacja instalacji

Po instalacji sprawdź:
1. ✅ Ikona na ekranie głównym
2. ✅ Otwiera się w pełnym ekranie (bez paska przeglądarki)
3. ✅ Działa offline (wyłącz internet i sprawdź)
4. ✅ Możesz się zarejestrować
5. ✅ Upload plików działa

---

## 🔐 Pierwsze logowanie

### Nie ma kont demo!

1. Otwórz aplikację
2. Kliknij "Zarejestruj się"
3. Wypełnij formularz:
   - **Imię**: Jan
   - **Nazwisko**: Kowalski
   - **Email**: jan.kowalski@example.com
   - **Nazwa użytkownika**: jkowalski
   - **Hasło**: Test1234!
   - **Potwierdź hasło**: Test1234!
4. Kliknij "Zarejestruj się"
5. Automatyczne logowanie!

---

## 📁 Test uploadu plików

### Jako klient (tylko pobieranie)
1. Zaloguj się jako klient
2. Wejdź w sprawę
3. Zobacz pliki
4. Kliknij "Download" aby pobrać
5. **NIE MOŻESZ** usunąć/edytować

### Jako prawnik (pełne zarządzanie)
1. Zarejestruj się jako prawnik (wymaga weryfikacji admina)
2. Admin musi aktywować konto
3. Możesz: upload, delete, edit plików

---

## 🎯 Wspierane formaty plików

- ✅ **PDF** (.pdf) - dokumenty prawne
- ✅ **Word** (.doc, .docx) - umowy, pisma
- ✅ **Excel** (.xls, .xlsx) - zestawienia
- ✅ **Obrazy** (.jpg, .jpeg, .png, .gif) - skany, dowody
- ✅ **Tekst** (.txt) - notatki

**Maksymalny rozmiar**: 10 MB na plik

---

## 🚀 Jak działa PWA?

### Offline Mode
- Service Worker cache'uje wszystkie pliki
- Działa bez internetu!
- Dane w LocalStorage

### Aktualizacje
- Odśwież stronę aby pobrać nową wersję
- Service Worker automatycznie aktualizuje cache

### Instalacja
- Chrome dodaje aplikację do ekranu głównego
- Pełny ekran (bez paska URL)
- Ikona, nazwa, kolor motywu

---

## ⚠️ Ważne!

### LocalStorage
- Dane przechowywane lokalnie w telefonie
- Czyszczenie danych przeglądarki = utrata danych
- **W produkcji: użyj backend API!**

### Bezpieczeństwo
- Hasła hashowane (Base64 - tylko demo!)
- **W produkcji: bcrypt + HTTPS!**

### Pamięć
- Każdy plik to Base64 w LocalStorage
- Limit ~5-10MB całkowitej pamięci
- **W produkcji: upload do serwera (S3, Cloudinary)!**

---

## 📲 Troubleshooting

### "Nie mogę zainstalować"
- Sprawdź czy używasz Chrome
- Upewnij się że masz HTTPS
- GitHub Pages/Netlify mają automatycznie HTTPS

### "Offline nie działa"
- Odśwież stronę (Ctrl+R)
- Wyczyść cache
- Reinstaluj aplikację

### "Upload nie działa"
- Sprawdź rozmiar pliku (max 10MB)
- Sprawdź format (PDF, Word, JPG...)
- Sprawdź czy masz uprawnienia (prawnik/asystent)

---

## 🎉 Gotowe!

Teraz masz:
- ✅ Pełną aplikację na telefonie
- ✅ Tryb offline
- ✅ Upload plików
- ✅ System uprawnień
- ✅ PWA jak natywna aplikacja

**Link do pobrania**: Po deploy przekaż użytkownikom URL i niech zainstalują!

---

**E-Kancelaria Pro** - Profesjonalne zarządzanie kancelarią prawną na Androida! 📱🏛️
