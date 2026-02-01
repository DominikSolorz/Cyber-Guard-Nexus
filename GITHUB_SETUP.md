# 🚀 Instrukcje publikacji na GitHub

## Krok 1: Utwórz repozytorium na GitHub

1. Przejdź na https://github.com/new
2. Utwórz nowe repozytorium:
   - **Nazwa**: `e-kancelaria-pro`
   - **Opis**: `System zarządzania kancelarią prawną - E-Kancelaria Pro v2.0.0`
   - **Widoczność**: Public (lub Private - jak wolisz)
   - **NIE zaznaczaj**: "Add README", "Add .gitignore", "Choose license" (mamy już te pliki)

## Krok 2: Połącz lokalne repo z GitHub

Po utworzeniu repo na GitHub, skopiuj URL (będzie wyglądać jak `https://github.com/USERNAME/e-kancelaria-pro.git`)

Następnie wykonaj w terminalu:

```bash
cd /workspaces/codespaces-blank/public

# Dodaj remote
git remote add origin https://github.com/USERNAME/e-kancelaria-pro.git

# Wypchnij kod
git push -u origin main
```

## Krok 3: Weryfikacja

Odśwież stronę repozytorium na GitHub - powinieneś zobaczyć wszystkie pliki!

## 📦 Pobieranie aplikacji (różne metody)

### Metoda 1: ZIP (najprostsza)
Na stronie GitHub kliknij:
**Code → Download ZIP**

Link bezpośredni będzie:
```
https://github.com/USERNAME/e-kancelaria-pro/archive/refs/heads/main.zip
```

### Metoda 2: Git Clone
```bash
git clone https://github.com/USERNAME/e-kancelaria-pro.git
cd e-kancelaria-pro
npm install
npm run dev
```

### Metoda 3: GitHub Release (zalecane dla wersji)

1. Przejdź do: https://github.com/USERNAME/e-kancelaria-pro/releases
2. Kliknij "Create a new release"
3. Tag version: `v2.0.0`
4. Release title: `E-Kancelaria Pro v2.0.0 - Pełna Wersja`
5. Opis: (skopiuj z CHANGELOG.md)
6. Załącz plik ZIP (opcjonalnie)
7. Kliknij "Publish release"

Link do pobrania:
```
https://github.com/USERNAME/e-kancelaria-pro/releases/download/v2.0.0/e-kancelaria-pro-v2.0.0.zip
```

## 🔄 Praca w Codespace

### Rozpoczęcie pracy:

1. **Otwórz Codespace**:
   - Na stronie repo na GitHub kliknij: **Code → Codespaces → Create codespace on main**
   - Lub otwórz istniejący Codespace

2. **Instalacja zależności**:
   ```bash
   cd /workspaces/e-kancelaria-pro
   npm install
   ```

3. **Uruchom aplikację**:
   ```bash
   npm run dev
   ```

### Wprowadzanie zmian:

```bash
# 1. Sprawdź status
git status

# 2. Dodaj zmienione pliki
git add .
# lub konkretne pliki:
git add src/components/login.component.ts

# 3. Commit ze opisem zmian
git commit -m "feat: dodano nową funkcję X"

# 4. Wypchnij zmiany
git push
```

### Konwencje commitów:

```
feat: nowa funkcja
fix: naprawa błędu
docs: zmiany w dokumentacji
style: formatowanie kodu
refactor: refaktoryzacja kodu
test: dodanie testów
chore: zmiany w konfiguracji
```

Przykłady:
```bash
git commit -m "feat: dodano eksport spraw do PDF"
git commit -m "fix: naprawa walidacji formularza logowania"
git commit -m "docs: aktualizacja README z nowymi funkcjami"
```

## 🌐 GitHub Pages (opcjonalnie)

Aby udostępnić aplikację online:

1. **W repo Settings**:
   - Przejdź do: Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / folder: `/public` (lub `/dist` po build)

2. **Build i deploy**:
   ```bash
   npm run build:prod
   git add dist/
   git commit -m "build: production build"
   git push
   ```

Aplikacja będzie dostępna pod:
```
https://USERNAME.github.io/e-kancelaria-pro/
```

## 📋 Checklist publikacji

- [ ] Utworzone repo na GitHub
- [ ] Dodany remote origin
- [ ] Wykonany git push
- [ ] Zweryfikowane pliki na GitHub
- [ ] Utworzony Release v2.0.0
- [ ] Dodany opis w README na GitHub
- [ ] Dodane topics/tags: `angular`, `typescript`, `legal-tech`, `law-office`
- [ ] Ustawiona licencja (MIT)
- [ ] Dodany `.env.local` do `.gitignore` (już jest!)

## 🔗 Przydatne linki

Po publikacji:
- **Repo**: `https://github.com/USERNAME/e-kancelaria-pro`
- **Releases**: `https://github.com/USERNAME/e-kancelaria-pro/releases`
- **Issues**: `https://github.com/USERNAME/e-kancelaria-pro/issues`
- **Projects**: `https://github.com/USERNAME/e-kancelaria-pro/projects`

## 💡 Dodatkowe opcje

### 1. README badges
Dodaj do README.md:
```markdown
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Angular](https://img.shields.io/badge/Angular-21.1-red)
```

### 2. Topics/Tags
W repo Settings → About, dodaj:
- `angular`
- `typescript`
- `legal-tech`
- `law-office`
- `case-management`
- `document-management`

### 3. Branch protection
Settings → Branches → Add rule:
- Require pull request reviews
- Require status checks

### 4. GitHub Actions (CI/CD)
Utwórz `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build:prod
```

## ❓ Pomoc

Jeśli masz problemy:
1. Sprawdź czy git jest zainstalowany: `git --version`
2. Sprawdź remote: `git remote -v`
3. Sprawdź branch: `git branch`
4. Zobacz logi: `git log --oneline`

---

**Gotowe!** Twoja aplikacja jest teraz w repozytorium Git i gotowa do opublikowania na GitHub! 🎉
