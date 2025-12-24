# Database Schemas

Source: Legal-Buddy-AI (adapted, neutralized)

## User Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique user identifier"
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "pattern": "^[a-zA-Z0-9_-]+$",
      "description": "Username for login"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "User email address"
    },
    "password_hash": {
      "type": "string",
      "description": "Hashed password (never store plaintext)"
    },
    "first_name": {
      "type": "string",
      "maxLength": 100
    },
    "last_name": {
      "type": "string",
      "maxLength": 100
    },
    "role": {
      "type": "string",
      "enum": ["admin", "user", "guest"],
      "default": "user"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time"
    },
    "last_login": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["id", "username", "email", "password_hash", "role", "created_at"]
}
```

## Session Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Session",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "user_id": {
      "type": "string",
      "format": "uuid"
    },
    "token": {
      "type": "string",
      "description": "Session token"
    },
    "ip_address": {
      "type": "string",
      "format": "ipv4"
    },
    "user_agent": {
      "type": "string"
    },
    "expires_at": {
      "type": "string",
      "format": "date-time"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["id", "user_id", "token", "expires_at", "created_at"]
}
```

## Document Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Document",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "user_id": {
      "type": "string",
      "format": "uuid"
    },
    "title": {
      "type": "string",
      "maxLength": 255
    },
    "content": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": ["text", "markdown", "html", "pdf"]
    },
    "status": {
      "type": "string",
      "enum": ["draft", "published", "archived"],
      "default": "draft"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "author": { "type": "string" },
        "category": { "type": "string" },
        "version": { "type": "number" }
      }
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["id", "user_id", "title", "type", "status", "created_at"]
}
```

## Audit Log Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AuditLog",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "user_id": {
      "type": "string",
      "format": "uuid"
    },
    "action": {
      "type": "string",
      "enum": ["create", "read", "update", "delete", "login", "logout"]
    },
    "resource_type": {
      "type": "string",
      "description": "Type of resource affected"
    },
    "resource_id": {
      "type": "string",
      "description": "ID of affected resource"
    },
    "changes": {
      "type": "object",
      "description": "Before/after values"
    },
    "ip_address": {
      "type": "string"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["id", "action", "timestamp"]
}
```

## API Response Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "APIResponse",
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean"
    },
    "data": {
      "type": ["object", "array", "null"]
    },
    "error": {
      "type": "object",
      "properties": {
        "code": { "type": "string" },
        "message": { "type": "string" },
        "details": { "type": "object" }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "timestamp": { "type": "string", "format": "date-time" },
        "request_id": { "type": "string", "format": "uuid" },
        "version": { "type": "string" }
      }
    }
  },
  "required": ["success"]
}
```

---

## SQL Table Definitions

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('admin', 'user', 'guest'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Sessions Table

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Documents Table

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_type CHECK (type IN ('text', 'markdown', 'html', 'pdf')),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
```

### Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    changes JSONB,
    ip_address INET,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

---

## Notes

- All schemas use UUID for primary keys
- Timestamps are in ISO 8601 format
- Passwords must be hashed (bcrypt, argon2, etc.)
- Sensitive data should be encrypted at rest
- Regular backups recommended
- Implement soft deletes where appropriate
