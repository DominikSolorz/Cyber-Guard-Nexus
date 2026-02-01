# Architektura E-Kancelaria Pro

## Przegląd architektury

E-Kancelaria Pro to aplikacja SPA (Single Page Application) zbudowana w Angular z wykorzystaniem najnowszych funkcji frameworka.

## Stack technologiczny

### Frontend
- **Angular 21.1** - Framework aplikacji
- **TypeScript 5.8** - Język programowania
- **TailwindCSS** - Utility-first CSS framework
- **Angular Signals** - Zarządzanie stanem
- **RxJS** - Programowanie reaktywne

### AI & Integracje
- **Google Gemini AI** - Asystent AI, analiza dokumentów
- **Material Symbols** - Ikony

### Przechowywanie danych (Demo)
- **LocalStorage** - Przechowywanie danych w przeglądarce

## Struktura modułów

### 1. Models (`src/models/`)

Definicje wszystkich typów danych używanych w aplikacji:

#### Główne typy:
- `User` - Użytkownicy systemu (prawnik, klient, admin, asystent)
- `LegalCase` - Sprawy prawne
- `CaseFile` - Dokumenty i pliki
- `Task` - Zadania
- `CalendarEvent` - Wydarzenia kalendarzowe
- `Invoice` - Faktury
- `Message` - Wiadomości
- `Notification` - Powiadomienia
- `Client` - Klienci kancelarii

#### Typy pomocnicze:
- `UserRole` - Role użytkowników
- `CaseStatus` - Statusy spraw
- `CasePriority` - Priorytety
- `DocumentStatus` - Statusy dokumentów
- i wiele innych...

### 2. Services (`src/services/`)

Serwisy zarządzające logiką biznesową i stanem aplikacji:

#### AuthService
Zarządzanie autoryzacją i użytkownikami:
- Logowanie/wylogowanie
- Rejestracja nowych użytkowników
- Zarządzanie sesjami
- System uprawnień (RBAC)
- Aktualizacja profilu i hasła

Metody kluczowe:
- `login(username, password)` - Logowanie
- `register(data)` - Rejestracja
- `hasPermission(permission)` - Sprawdzanie uprawnień
- `getUsersByRole(role)` - Pobieranie użytkowników według roli

#### CaseService
Kompleksowe zarządzanie sprawami:
- CRUD dla spraw
- Zarządzanie folderami i dokumentami
- Zadania i notatki
- Wydarzenia i terminy
- Timeline zmian

Metody kluczowe:
- `addCase(...)` - Dodawanie sprawy
- `updateCaseStatus(id, status)` - Zmiana statusu
- `addTask(caseId, ...)` - Dodawanie zadania
- `addNote(caseId, ...)` - Dodawanie notatki
- `addEvent(caseId, ...)` - Dodawanie wydarzenia
- `addDeadline(caseId, ...)` - Dodawanie terminu

#### CalendarService
Zarządzanie kalendarzem:
- CRUD dla wydarzeń
- Filtrowanie po użytkowniku i dacie
- Wykrywanie konfliktów terminów
- Wydarzenia nadchodzące

Metody kluczowe:
- `addEvent(event)` - Dodawanie wydarzenia
- `getUpcomingEvents(userId, days)` - Nadchodzące wydarzenia
- `hasConflict(...)` - Sprawdzanie konfliktów

#### ClientService
Zarządzanie klientami:
- CRUD dla klientów
- Przypisywanie prawników
- Tagi i notatki
- Wyszukiwanie

#### InvoiceService
Faktury i finanse:
- Tworzenie faktur
- Time tracking
- Raporty finansowe
- Status płatności

#### MessagingService
System wiadomości:
- Konwersacje
- Wysyłanie wiadomości
- Licznik nieprzeczytanych
- Historia

#### NotificationService
Powiadomienia systemowe:
- Tworzenie powiadomień
- Oznaczanie jako przeczytane
- Różne typy powiadomień
- Metody pomocnicze dla różnych wydarzeń

### 3. Components (`src/components/`)

Komponenty UI aplikacji:

#### LoginComponent
- Formularz logowania
- Formularz rejestracji
- Szybkie logowanie (demo accounts)
- Walidacja formularzy

#### DashboardComponent
Główny panel aplikacji:
- Lista spraw
- Workspace z dokumentami
- Asystent AI
- Filtry i wyszukiwanie

#### TaskManagerComponent
Zarządzanie zadaniami:
- Lista zadań z filtrami
- Tworzenie nowych zadań
- Zmiana statusu
- Podzadania (subtasks)

#### CalendarWidgetComponent
Widget kalendarza:
- Mini kalendarz
- Lista wydarzeń
- Tworzenie wydarzeń
- Filtrowanie po dacie

#### AiAssistantComponent
Asystent AI:
- Chat z AI
- Analiza dokumentów
- Sugestie i podsumowania

#### DocViewerComponent
Podgląd dokumentów:
- Wyświetlanie różnych typów plików
- Metadane dokumentu
- Akcje (pobierz, usuń)

#### SettingsComponent
Ustawienia użytkownika:
- Profil
- Zmiana hasła
- Preferencje
- Eksport/import danych

## Zarządzanie stanem

Aplikacja wykorzystuje Angular Signals do zarządzania stanem:

```typescript
// Przykład w CaseService
private allCasesSignal = signal<LegalCase[]>([]);
cases = computed(() => this.allCasesSignal());
```

### Zalety Signals:
- Automatyczna detekcja zmian
- Lepsza wydajność niż Zone.js
- Prostsza składnia
- Fine-grained reactivity

## Przepływ danych

```
Component → Service → Signal → LocalStorage
                ↓
           Computed Values
                ↓
           Component (UI Update)
```

## System uprawnień (RBAC)

### Role i uprawnienia:

#### Admin
- Pełen dostęp do systemu
- Zarządzanie użytkownikami
- Raporty i statystyki

#### Lawyer (Prawnik)
- Zarządzanie sprawami
- Dodawanie klientów
- Tworzenie faktur
- Pełny dostęp do dokumentów

#### Assistant (Asystent)
- Przeglądanie spraw
- Edycja spraw
- Upload dokumentów
- Zarządzanie kalendarzem

#### Client (Klient)
- Dostęp tylko do własnych spraw
- Przeglądanie dokumentów
- Wysyłanie wiadomości
- Przeglądanie faktur

## Persistencja danych

### LocalStorage (Demo)
Wszystkie dane przechowywane w LocalStorage przeglądarki:

```typescript
localStorage.setItem('ekancelaria_cases_v2', JSON.stringify(cases));
localStorage.setItem('ekancelaria_users_v2', JSON.stringify(users));
// itd.
```

### Produkcja (Rekomendacje)
Dla wersji produkcyjnej zalecamy:

```
Frontend (Angular) ←→ REST API (Node.js/NestJS)
                           ↓
                      PostgreSQL/MongoDB
                           ↓
                      File Storage (S3/Azure)
```

## Integracja AI

### Gemini AI
Wykorzystanie API Google Gemini:

1. **Analiza dokumentów**
   - Podsumowania
   - Ekstrakcja kluczowych informacji
   - Identyfikacja encji

2. **Asystent konwersacyjny**
   - Odpowiedzi na pytania prawne
   - Sugestie działań
   - Kontekst sprawy

## Bezpieczeństwo

### Obecne (Demo):
- Hasła w plain text (tylko demo!)
- Dane w LocalStorage
- Brak szyfrowania

### Produkcja (Wymagane):
- Hasła: bcrypt hashing
- JWT tokens
- HTTPS
- Rate limiting
- CORS
- CSP headers
- XSS protection
- SQL injection protection

## Wydajność

### Optymalizacje:
- Lazy loading komponentów
- Virtual scrolling dla dużych list
- Memoization w computed signals
- Debouncing wyszukiwania
- Pagination danych

## Testowanie

### Struktura testów (do implementacji):
```
src/
├── services/
│   ├── auth.service.spec.ts
│   ├── case.service.spec.ts
│   └── ...
└── components/
    ├── login.component.spec.ts
    └── ...
```

### Rodzaje testów:
- Unit tests (Jasmine/Jest)
- Integration tests
- E2E tests (Playwright/Cypress)

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build:prod
```

### Docker (przykład)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

## Monitoring i Logi

### Rekomendacje dla produkcji:
- Sentry - Error tracking
- Google Analytics - User analytics
- LogRocket - Session replay
- New Relic - Performance monitoring

## Roadmap techniczny

### v2.1
- [ ] Migracja do backend API
- [ ] Implementacja testów
- [ ] CI/CD pipeline
- [ ] Docker containerization

### v2.2
- [ ] GraphQL API
- [ ] WebSocket dla real-time
- [ ] Service Workers (PWA)
- [ ] Offline support

### v3.0
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced caching (Redis)
- [ ] Event sourcing

## Wsparcie i dokumentacja

- **API Docs**: (do stworzenia)
- **Component Library**: (do stworzenia - Storybook)
- **Developer Guide**: ten dokument
- **User Manual**: (do stworzenia)
