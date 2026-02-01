# Przewodnik instalacji i wdrożenia E-Kancelaria Pro

## Wymagania systemowe

### Minimalne wymagania:
- Node.js 18.x lub nowszy
- npm 9.x lub yarn 1.22+
- 4 GB RAM
- 500 MB wolnego miejsca na dysku
- Przeglądarka: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Zalecane:
- Node.js 20.x
- npm 10.x
- 8 GB RAM
- SSD

## Instalacja lokalna

### 1. Klonowanie repozytorium

```bash
# Jeśli masz repozytorium Git
git clone https://github.com/your-org/ekancelaria-pro.git
cd ekancelaria-pro/public

# Lub użyj rozpakowanego ZIP
cd public
```

### 2. Instalacja zależności

```bash
# Używając npm
npm install

# Lub używając yarn
yarn install
```

### 3. Konfiguracja środowiska

Utwórz plik `.env.local` w głównym katalogu:

```bash
# Linux/macOS
cat > .env.local << EOF
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
EOF

# Windows (PowerShell)
@"
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
"@ | Out-File -FilePath .env.local -Encoding utf8
```

#### Jak uzyskać klucz API Gemini:
1. Przejdź do https://makersuite.google.com/app/apikey
2. Zaloguj się kontem Google
3. Kliknij "Create API Key"
4. Skopiuj klucz i wklej do `.env.local`

### 4. Uruchomienie aplikacji

```bash
# Development server
npm run dev

# Aplikacja będzie dostępna pod adresem:
# http://localhost:4200
```

### 5. Pierwsze logowanie

Użyj jednego z kont demonstracyjnych:

```
Admin:
  Login: admin
  Hasło: admin123

Prawnik:
  Login: j.kowalski
  Hasło: lawyer123

Klient:
  Login: m.wisniewska
  Hasło: client123
```

## Build produkcyjny

### Kompilacja

```bash
# Build dla produkcji
npm run build:prod

# Pliki wygenerowane w katalogu: dist/
```

### Optymalizacje w build produkcyjnym:
- Minifikacja kodu
- Tree shaking
- AOT compilation
- Lazy loading
- Compression (gzip/brotli)

## Deployment

### Option 1: Netlify

1. **Zaloguj się do Netlify**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Deploy**
   ```bash
   npm run build:prod
   netlify deploy --prod --dir=dist
   ```

3. **Konfiguracja (`netlify.toml`)**
   ```toml
   [build]
     command = "npm run build:prod"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "20"
   ```

### Option 2: Vercel

1. **Instalacja Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build:prod
   vercel --prod
   ```

3. **Konfiguracja (`vercel.json`)**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

### Option 3: Docker

1. **Dockerfile**
   ```dockerfile
   # Stage 1: Build
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build:prod

   # Stage 2: Serve
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name _;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Kompresja
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       gzip_vary on;

       # Cache static assets
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Build i uruchomienie**
   ```bash
   # Build obrazu
   docker build -t ekancelaria-pro .

   # Uruchomienie
   docker run -d -p 80:80 --name ekancelaria ekancelaria-pro

   # Sprawdzenie
   docker ps
   docker logs ekancelaria
   ```

### Option 4: AWS S3 + CloudFront

1. **Build aplikacji**
   ```bash
   npm run build:prod
   ```

2. **Upload do S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **CloudFront cache invalidation**
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

### Option 5: GitHub Pages

1. **Instalacja gh-pages**
   ```bash
   npm install --save-dev angular-cli-ghpages
   ```

2. **Deploy**
   ```bash
   ng build --configuration=production --base-href=/ekancelaria-pro/
   npx angular-cli-ghpages --dir=dist
   ```

## Konfiguracja produkcyjna

### Zmienne środowiskowe

Dla produkcji ustaw następujące zmienne:

```bash
NODE_ENV=production
GEMINI_API_KEY=your_production_key
API_URL=https://api.yourdomain.com  # Gdy będziesz mieć backend
```

### Bezpieczeństwo

**WAŻNE dla produkcji:**

1. **Nigdy nie commituj `.env.local`**
   ```bash
   # Dodaj do .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Używaj HTTPS**
   - Let's Encrypt dla darmowych certyfikatów
   - Cloudflare dla łatwej konfiguracji

3. **Ustaw odpowiednie headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
   ```

4. **Rate limiting** (dla API)

5. **Backup danych** (regularnie)

## Monitoring i Logi

### Sentry (Error tracking)

1. **Instalacja**
   ```bash
   npm install @sentry/angular
   ```

2. **Konfiguracja**
   ```typescript
   import * as Sentry from "@sentry/angular";

   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     environment: "production",
   });
   ```

### Google Analytics

```typescript
// Dodaj do index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Aktualizacje

### Aktualizacja zależności

```bash
# Sprawdź outdated packages
npm outdated

# Aktualizuj Angular
ng update @angular/core @angular/cli

# Aktualizuj pozostałe
npm update
```

### Migracje wersji

Przed aktualizacją major version:
1. Przeczytaj changelog
2. Testuj na środowisku dev
3. Utwórz backup danych
4. Zaplanuj maintenance window

## Rozwiązywanie problemów

### Problemy z instalacją

```bash
# Wyczyść cache
npm cache clean --force

# Usuń node_modules i reinstaluj
rm -rf node_modules package-lock.json
npm install
```

### Problemy z buildem

```bash
# Zwiększ pamięć dla Node.js
NODE_OPTIONS=--max_old_space_size=4096 npm run build:prod
```

### Port zajęty

```bash
# Linux/macOS - znajdź proces
lsof -i :4200
kill -9 PID

# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

## Performance Tuning

### 1. Lazy Loading
Już zaimplementowane dla większych komponentów

### 2. Preloading Strategy
```typescript
// W app.config.ts
provideRouter(routes, withPreloading(PreloadAllModules))
```

### 3. Service Worker (PWA)
```bash
ng add @angular/pwa
npm run build:prod
```

### 4. Compression
Nginx już skonfigurowany z gzip

### 5. CDN dla assets
Rozważ użycie CDN dla statycznych plików

## Backup i Recovery

### Backup danych (LocalStorage)

```typescript
// Export wszystkich danych
const backup = {
  users: localStorage.getItem('ekancelaria_users_v2'),
  cases: localStorage.getItem('ekancelaria_cases_v2'),
  // ... pozostałe klucze
};

// Zapisz do pliku
const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'});
const url = URL.createObjectURL(blob);
// Download file
```

### Restore
```typescript
// Wczytaj backup i przywróć do localStorage
```

## Support i Pomoc

- **Dokumentacja**: README.md, ARCHITECTURE.md
- **Issues**: GitHub Issues
- **Email**: support@ekancelaria-pro.pl
- **Slack/Discord**: (do utworzenia)

## Checklist przed wdrożeniem

- [ ] Zmienne środowiskowe ustawione
- [ ] .env.local nie jest w repo
- [ ] Build produkcyjny działa
- [ ] HTTPS skonfigurowane
- [ ] Security headers ustawione
- [ ] Monitoring włączony (Sentry, GA)
- [ ] Backup skonfigurowany
- [ ] DNS prawidłowo skonfigurowany
- [ ] Testy przeszły pomyślnie
- [ ] Performance sprawdzona (Lighthouse)

---

**Powodzenia z wdrożeniem E-Kancelaria Pro!**
