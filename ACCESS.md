# 🔐 DOSTĘP DO APLIKACJI E-KANCELARIA PRO

## 📱 LINK DO INSTALACJI

### Główny URL (Codespaces):
```
https://solid-robot-vpq96wwxrpx2wpqr-8000.app.github.dev
```

### Instalacja na Android:
1. Otwórz powyższy link na telefonie w **Chrome**
2. Menu (⋮) → **Dodaj do ekranu głównego**
3. Gotowe! Aplikacja zainstalowana jak natywna 📱

---

## 👤 KONTO ADMINA

### Dane logowania:
```
Login:    admin
Hasło:    Admin2026!
Rola:     Administrator
```

### Uprawnienia admina:
✅ Pełny dostęp do systemu
✅ Zarządzanie wszystkimi sprawami
✅ Zarządzanie wszystkimi użytkownikami
✅ Weryfikacja i aktywacja kont prawników
✅ Upload i usuwanie plików
✅ Generowanie raportów
✅ Wszystkie operacje CRUD
✅ Dostęp do wszystkich sekcji

---

## 🎯 PIERWSZE KROKI

### 1. Zaloguj się jako admin
1. Otwórz aplikację
2. Login: `admin`
3. Hasło: `Admin2026!`
4. Kliknij "Zaloguj się"

### 2. Utworzysz konta dla klientów
- Dashboard admina → Użytkownicy → Dodaj nowego
- Lub pozwól klientom zarejestrować się samodzielnie

### 3. Weryfikuj konta prawników
Gdy prawnik się zarejestruje:
- Dostaniesz powiadomienie
- Dashboard → Użytkownicy → Nieaktywni
- Aktywuj konto prawnika

---

## 🔄 TESTOWANIE RÓŻNYCH RÓL

### Zarejestruj testowe konta:

#### 1. Konto KLIENTA:
```
Typ: Klient
Imię: Jan
Nazwisko: Kowalski
Email: jan.kowalski@test.pl
Username: jkowalski
Hasło: Test1234!
Typ klienta: Osoba fizyczna
```
→ Dostaniesz **zielony, prosty dashboard**

#### 2. Konto KANCELARII:
```
Typ: Kancelaria
Imię: Anna
Nazwisko: Nowak
Email: anna.nowak@kancelaria.pl
Username: anowak
Hasło: Test1234!
Zawód: Adwokat
Licencja: ADW/12345/2024
Specjalizacja: Prawo karne, prawo cywilne
```
→ Wymaga **aktywacji przez admina**
→ Po aktywacji: **zaawansowany niebieski dashboard**

---

## 🌐 DOSTĘP ZDALNY

### GitHub Pages (jeśli wdrożysz):
```bash
# 1. Push do GitHub
git remote add origin https://github.com/USERNAME/e-kancelaria-pro.git
git push -u origin main

# 2. Włącz GitHub Pages (Settings → Pages)
# 3. URL: https://USERNAME.github.io/e-kancelaria-pro
```

### Netlify (najszybsze):
1. https://netlify.com
2. Import GitHub repo
3. Deploy!
4. URL: `https://e-kancelaria-pro.netlify.app`

---

## 📊 FUNKCJE ADMINA

Po zalogowaniu jako admin masz dostęp do:

### Dashboard
- Statystyki całego systemu
- Wszystkie sprawy wszystkich klientów
- Wszystkie faktury
- Wszystkie dokumenty

### Użytkownicy
- Lista wszystkich użytkowników
- Aktywacja/dezaktywacja kont
- Zmiana ról
- Usuwanie użytkowników

### Sprawy
- Pełny dostęp do wszystkich spraw
- Tworzenie, edycja, usuwanie
- Przypisywanie prawników do spraw
- Zarządzanie dokumentami

### Pliki
- Dostęp do wszystkich plików w systemie
- Upload, download, delete
- Zarządzanie przestrzenią dyskową

### Raporty
- Raporty finansowe
- Statystyki spraw
- Aktywność użytkowników
- Export do PDF/Excel

---

## 🔒 BEZPIECZEŃSTWO

### Zmiana hasła admina:
Po pierwszym logowaniu zmień hasło:
1. Dashboard → Profil → Zmień hasło
2. Nowe hasło (min. 8 znaków)

### Backup danych:
Dane przechowywane w `localStorage`:
- Eksport: Console → `localStorage.getItem('ekancelaria_users_v2')`
- Import: Wklej z powrotem

⚠️ **W produkcji: użyj backend API + baza danych!**

---

## 📱 QR CODE (opcjonalnie)

Wygeneruj QR code dla linku:
```
https://solid-robot-vpq96wwxrpx2wpqr-8000.app.github.dev
```

Użytkownicy mogą zeskanować i zainstalować aplikację!

---

## 🎉 GOTOWE!

**Link do aplikacji:**
```
https://solid-robot-vpq96wwxrpx2wpqr-8000.app.github.dev
```

**Dane admina:**
```
Login: admin
Hasło: Admin2026!
```

**Aplikacja działa i czeka na użytkowników!** 🚀

---

**E-Kancelaria Pro v2.0.0** - System gotowy do użycia! 🏛️📱
