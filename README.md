# E-Kancelaria Pro v2.0.0 - Professional

## 📱 System zarządzania kancelarią prawną - Wersja produkcyjna

![E-Kancelaria Pro](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Angular](https://img.shields.io/badge/Angular-21.1-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-success.svg)

E-Kancelaria Pro to kompleksowy system zarządzania kancelarią prawną dla profesjonalistów prawnych, asystentów i klientów. **Wersja produkcyjna** z pełną rejestracją użytkowników i uploadem plików.

---

## 🚀 Funkcje

### ✅ Zarządzanie sprawami
- Pełna obsługa spraw prawnych z sygnaturami i timeline
- Upload dokumentów (PDF, Word, Excel, JPG) do 10MB
- Zadania, terminy i notatki do każdej sprawy

### ✅ Upload plików
- **PDF** - dokumenty prawne, pozwy, wnioski
- **Word/Excel** - dokumentacja, umowy
- **JPG/PNG** - skany, zdjęcia dowodów
- Podgląd miniatur dla obrazów
- Download plików

### ✅ System uprawnień (RBAC)
- **Admin** - pełne zarządzanie systemem
- **Prawnik** - zarządzanie sprawami, upload/delete plików, faktury
- **Asystent** - pomoc przy sprawach, upload plików, kalendarz
- **Klient** - **TYLKO ODCZYT** - podgląd sprawy i plików, brak edycji

### ✅ Kalendarz i terminy
- Zarządzanie rozprawami, spotkaniami, konsultacjami
- Przypomnienia o ważnych datach
- Detekcja konfliktów terminów

### ✅ Faktury i rozliczenia
- Time tracking - ewidencja czasu pracy
- Generowanie faktur
- Raporty finansowe

### ✅ Komunikacja
- Wiadomości wewnętrzne kancelaria-klient
- System powiadomień

### ✅ PWA - Progressive Web App
- **Instalacja na Android/iOS** - Dodaj do ekranu głównego
- **Tryb offline** - Praca bez internetu (Service Worker)
- **Szybkie ładowanie** - Cache strategia

---

## 📦 Instalacja na telefon Android

### Metoda 1: Przeglądarka (zalecana)
1. Otwórz aplikację w Chrome: `https://twoja-domena.pl`
2. Kliknij menu (3 kropki) → **Dodaj do ekranu głównego**
3. Potwierdź instalację
4. Ikona pojawi się na ekranie głównym

### Metoda 2: GitHub Pages (demo)
1. Wejdź na: `https://USERNAME.github.io/e-kancelaria-pro`
2. Zainstaluj jak powyżej

---

## 💻 Instalacja lokalna (deweloperzy)

```bash
# Sklonuj repozytorium
git clone https://github.com/USERNAME/e-kancelaria-pro.git
cd e-kancelaria-pro

# Zainstaluj zależności (opcjonalne - ESM import)
npm install

# Uruchom serwer deweloperski
npm run dev

# Zbuduj wersję produkcyjną
npm run build:prod
```

---

## 🔐 Rejestracja i logowanie

### ⚠️ NIE MA KONT DEMO

Każdy użytkownik musi się **zarejestrować**:

### Rejestracja klienta
1. Kliknij "Zarejestruj się"
2. Wypełnij formularz:
   - Imię i nazwisko
   - Email (unikalny)
   - Nazwa użytkownika (unikalna)
   - Hasło (minimum 8 znaków)
   - Telefon (opcjonalnie)
3. Kliknij "Zarejestruj się"
4. **Automatyczne logowanie** po rejestracji

### Rejestracja prawnika/asystenta
1. Wypełnij formularz rejestracji
2. Wybierz rolę: "Prawnik" lub "Asystent"
3. Dodaj numer licencji (dla prawników)
4. Dodaj specjalizację
5. **Konto wymaga weryfikacji przez administratora**
6. Po akceptacji admin aktywuje konto

### Logowanie
- Email lub nazwa użytkownika
- Hasło
- Zapamiętaj mnie (opcjonalnie)

---

## 📁 Upload plików - Jak używać

### Dla kancelarii (prawnik/asystent)
1. Wejdź w sprawę
2. Kliknij "Dodaj plik"
3. Wybierz pliki (PDF, Word, JPG, PNG...)
4. Pliki zostaną przesłane i będą widoczne dla klienta
5. Możliwość **usuwania** i **edycji** plików

### Dla klienta
1. Wejdź w swoją sprawę
2. Zobacz listę plików
3. **Pobierz** plik (kliknij download)
4. **BRAK** możliwości usuwania/edycji

---

## 🛡️ Bezpieczeństwo

- ✅ Hashowanie haseł (Base64 w localStorage - DEMO, w produkcji użyj bcrypt + backend)
- ✅ Walidacja formularzy
- ✅ Uprawnienia RBAC - klient nie może edytować
- ✅ Maksymalny rozmiar pliku: 10MB
- ✅ Dozwolone typy plików: PDF, Word, Excel, JPG, PNG, GIF
- ⚠️ LocalStorage do przechowywania danych (demo mode)
- 🚀 **W produkcji: backend API + PostgreSQL/MySQL**

---

## 🎯 Role i uprawnienia

| Funkcja | Admin | Prawnik | Asystent | Klient |
|---------|-------|---------|----------|--------|
| Przeglądanie spraw | ✅ | ✅ | ✅ | ✅ (tylko swoje) |
| Tworzenie spraw | ✅ | ✅ | ❌ | ❌ |
| Edycja spraw | ✅ | ✅ | ✅ | ❌ |
| Usuwanie spraw | ✅ | ✅ | ❌ | ❌ |
| Upload plików | ✅ | ✅ | ✅ | ❌ |
| Pobieranie plików | ✅ | ✅ | ✅ | ✅ (tylko swoje) |
| Usuwanie plików | ✅ | ✅ | ❌ | ❌ |
| Faktury | ✅ | ✅ (twórz) | ❌ | ✅ (podgląd) |
| Zarządzanie użytkownikami | ✅ | ❌ | ❌ | ❌ |

---

## 🎨 Technologie

- **Angular 21.1** - Standalone Components, Signals
- **TypeScript 5.8** - Strict mode, pełna typizacja
- **TailwindCSS** - Modern dark UI
- **Google Gemini AI** - Asystent prawny (w przygotowaniu)
- **Service Worker** - PWA, offline mode
- **LocalStorage** - Persistencja danych (demo mode)

---

## 📲 Deployment

### GitHub Pages
```bash
# Build
npm run build:prod

# Deploy (ręcznie)
cp -r dist/* docs/

# Push
git add .
git commit -m "Deploy v2.0.0"
git push

# Włącz GitHub Pages w Settings → Pages → Source: main/docs
```

### Netlify/Vercel
1. Połącz repo GitHub
2. Build command: `npm run build:prod`
3. Publish directory: `dist`
4. Deploy!

---

## 📞 Wsparcie

- 📧 Email: support@kancelaria.pl
- 🌐 Web: https://e-kancelaria-pro.pl
- 📱 Tel: +48 123 456 789

---

## 📄 Licencja

© 2026 E-Kancelaria Pro. Wszelkie prawa zastrzeżone.

---

## 🔥 Changelog v2.0.0

### Nowe funkcje
- ✅ Upload plików (PDF, Word, JPG) - maks. 10MB
- ✅ PWA - instalacja na Android/iOS
- ✅ Service Worker - tryb offline
- ✅ Prawdziwa rejestracja (usunięto konta demo)
- ✅ RBAC - klient tylko read-only
- ✅ Weryfikacja dla prawników przez admina
- ✅ Hashowanie haseł
- ✅ Walidacja formularzy

### Zmiany
- ❌ Usunięto 25 kont demonstracyjnych
- ✅ Dodano pełny system rejestracji
- ✅ Klient nie może usuwać/edytować
- ✅ Prawnik może zarządzać wszystkim

---

**E-Kancelaria Pro** - Profesjonalne zarządzanie kancelarią prawną 🏛️
