# Environment Configuration Examples

Neutral, reusable environment variable templates for various deployment scenarios.

## Development Environment

```bash
# .env.development

# Application
NODE_ENV=development
APP_NAME=MyApplication
APP_URL=http://localhost:3000
APP_PORT=3000
LOG_LEVEL=debug

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=dev_user
DB_PASSWORD=dev_password_change_me
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis (Cache/Session)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Authentication
JWT_SECRET=dev_secret_change_in_production_min_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=dev_session_secret_change_in_production

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=10

# Email (Development - use mailtrap/ethereal)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASSWORD=your_mailtrap_password
SMTP_FROM=noreply@localhost

# File Storage
STORAGE_TYPE=local
STORAGE_PATH=./uploads
MAX_FILE_SIZE=10485760

# External APIs
# OPENAI_API_KEY=sk-...
# GEMINI_API_KEY=...
# STRIPE_SECRET_KEY=sk_test_...

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_EMAIL_VERIFICATION=false

# Monitoring
SENTRY_DSN=
ANALYTICS_ID=
```

## Production Environment

```bash
# .env.production

# Application
NODE_ENV=production
APP_NAME=MyApplication
APP_URL=https://myapp.com
APP_PORT=3000
LOG_LEVEL=info

# Database
DB_HOST=your-db-host.amazonaws.com
DB_PORT=5432
DB_NAME=myapp_prod
DB_USER=prod_user
DB_PASSWORD=strong_random_password_here
DB_SSL=true
DB_POOL_MIN=5
DB_POOL_MAX=20

# Redis
REDIS_HOST=your-redis-host.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=strong_redis_password_here
REDIS_DB=0
REDIS_TLS=true

# Authentication
JWT_SECRET=generate_with_openssl_rand_base64_48_or_similar
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=generate_strong_random_session_secret_here

# Security
CORS_ORIGIN=https://myapp.com,https://www.myapp.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=50
BCRYPT_ROUNDS=12
HELMET_ENABLED=true
CSP_ENABLED=true

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=noreply@myapp.com
SMTP_TLS=true

# File Storage (S3)
STORAGE_TYPE=s3
AWS_REGION=us-east-1
AWS_BUCKET=myapp-production-uploads
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
MAX_FILE_SIZE=52428800

# External APIs
OPENAI_API_KEY=sk-prod-...
GEMINI_API_KEY=prod_key_here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_EMAIL_VERIFICATION=true

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
ANALYTICS_ID=G-XXXXXXXXXX
APM_ENABLED=true
```

## Staging Environment

```bash
# .env.staging

# Application
NODE_ENV=staging
APP_NAME=MyApplication-Staging
APP_URL=https://staging.myapp.com
APP_PORT=3000
LOG_LEVEL=debug

# Database
DB_HOST=staging-db-host.amazonaws.com
DB_PORT=5432
DB_NAME=myapp_staging
DB_USER=staging_user
DB_PASSWORD=staging_password_change_me
DB_SSL=true
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis
REDIS_HOST=staging-redis-host.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=staging_redis_password
REDIS_DB=0
REDIS_TLS=true

# Authentication
JWT_SECRET=staging_jwt_secret_min_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=staging_session_secret

# Security
CORS_ORIGIN=https://staging.myapp.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=10

# Email (Test service)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=staging_mailtrap_user
SMTP_PASSWORD=staging_mailtrap_password
SMTP_FROM=staging@myapp.com

# File Storage
STORAGE_TYPE=s3
AWS_REGION=us-east-1
AWS_BUCKET=myapp-staging-uploads
AWS_ACCESS_KEY_ID=staging_aws_key
AWS_SECRET_ACCESS_KEY=staging_aws_secret
MAX_FILE_SIZE=52428800

# External APIs (Test keys)
OPENAI_API_KEY=sk-test-...
STRIPE_SECRET_KEY=sk_test_...

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_EMAIL_VERIFICATION=true

# Monitoring
SENTRY_DSN=https://staging-sentry-dsn@sentry.io/project
ANALYTICS_ID=
```

## Testing Environment

```bash
# .env.test

# Application
NODE_ENV=test
APP_NAME=MyApplication-Test
APP_URL=http://localhost:3001
APP_PORT=3001
LOG_LEVEL=error

# Database (Use test database)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_test
DB_USER=test_user
DB_PASSWORD=test_password
DB_SSL=false
DB_POOL_MIN=1
DB_POOL_MAX=5

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=1

# Authentication
JWT_SECRET=test_jwt_secret_for_testing_only
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=test_session_secret

# Security
CORS_ORIGIN=*
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=1000
BCRYPT_ROUNDS=4

# Email (Mock)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=test@localhost

# File Storage
STORAGE_TYPE=local
STORAGE_PATH=./test-uploads
MAX_FILE_SIZE=1048576

# External APIs (Mock/Test keys)
OPENAI_API_KEY=test-key
STRIPE_SECRET_KEY=sk_test_mock

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_EMAIL_VERIFICATION=false

# Monitoring
SENTRY_DSN=
ANALYTICS_ID=
```

## Docker Environment

```bash
# .env.docker

# Application
NODE_ENV=production
APP_NAME=MyApplication
APP_URL=http://localhost:8080
APP_PORT=3000
LOG_LEVEL=info

# Database (Docker service name)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=postgres_password
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis (Docker service name)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Authentication
JWT_SECRET=docker_jwt_secret_change_for_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=docker_session_secret

# Security
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=10

# Email
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@localhost

# File Storage
STORAGE_TYPE=local
STORAGE_PATH=/app/uploads
MAX_FILE_SIZE=10485760

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_EMAIL_VERIFICATION=false
```

## Environment Variable Guidelines

### Security Best Practices

1. **Never commit** `.env` files to version control
2. **Use `.env.example`** with dummy values for documentation
3. **Rotate secrets** regularly
4. **Use strong random values** for secrets (min 32 characters)
5. **Different secrets** for each environment
6. **Restrict access** to production secrets

### Secret Generation

```bash
# Generate random secret (Linux/Mac)
openssl rand -base64 48

# Generate random secret (Node.js)
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

# Generate random secret (Python)
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### Loading Environment Variables

#### Node.js
```javascript
// Load at application start
require('dotenv').config();

// With path
require('dotenv').config({ path: '.env.production' });

// Access variables
const dbHost = process.env.DB_HOST;
```

#### Python
```python
# Load at application start
from dotenv import load_dotenv
import os

load_dotenv()

# Access variables
db_host = os.getenv('DB_HOST')
```

### Validation

Always validate required environment variables at startup:

```javascript
const requiredEnvVars = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'SESSION_SECRET'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});
```

### .gitignore

```
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.staging

# But keep example
!.env.example
!.env.*.example
```

### .env.example Template

```bash
# .env.example
# Copy this file to .env and fill in your values

# Application
NODE_ENV=development
APP_NAME=
APP_URL=
APP_PORT=3000

# Database
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_SSL=false

# Authentication
JWT_SECRET=
SESSION_SECRET=

# Add other required variables...
```
