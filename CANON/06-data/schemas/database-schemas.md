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
# Database Schema Templates

Neutral, reusable database schema patterns for common use cases.

## User Schema

### PostgreSQL
```sql
-- Users table
-- Note: gen_random_uuid() requires PostgreSQL 13+ or uuid-ossp extension
-- For older versions: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Then use: uuid_generate_v4() instead of gen_random_uuid()
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### MongoDB
```json
{
  "validator": {
    "$jsonSchema": {
      "bsonType": "object",
      "required": ["email", "username", "password_hash"],
      "properties": {
        "email": {
          "bsonType": "string",
          "pattern": "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
        },
        "username": {
          "bsonType": "string",
          "minLength": 3,
          "maxLength": 50
        },
        "password_hash": {
          "bsonType": "string"
        },
        "first_name": {
          "bsonType": "string",
          "maxLength": 100
        },
        "last_name": {
          "bsonType": "string",
          "maxLength": 100
        },
        "is_active": {
          "bsonType": "bool"
        },
        "is_verified": {
          "bsonType": "bool"
        },
        "created_at": {
          "bsonType": "date"
        },
        "updated_at": {
          "bsonType": "date"
        },
        "last_login": {
          "bsonType": "date"
        }
      }
    }
  }
}
```

## Authentication Tokens Schema

### PostgreSQL
```sql
-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
```

## Audit Log Schema

### PostgreSQL
```sql
-- Audit logs
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(255),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Document/File Storage Schema

### PostgreSQL
```sql
-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_file_size CHECK (file_size > 0)
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_filename ON documents(filename);
CREATE INDEX idx_documents_mime_type ON documents(mime_type);
CREATE INDEX idx_documents_created_at ON documents(created_at);
```

## Settings/Configuration Schema

### PostgreSQL
```sql
-- User settings
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Permissions Schema (RBAC)

### PostgreSQL
```sql
-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions (many-to-many)
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- User roles (many-to-many)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

## Session Schema

### PostgreSQL
```sql
-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

## API Keys Schema

### PostgreSQL
```sql
-- API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(10) NOT NULL,
    scopes JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);
```

## Best Practices

### General
- Use UUIDs for primary keys in distributed systems
- Add appropriate indexes for query performance
- Use constraints to enforce data integrity
- Include created_at and updated_at timestamps
- Use appropriate data types (TIMESTAMP WITH TIME ZONE, INET, JSONB)

### Security
- Never store passwords in plain text (use password_hash)
- Hash tokens before storage
- Use CASCADE/SET NULL appropriately for foreign keys
- Add constraints for data validation
- Implement audit logging

### Performance
- Index foreign keys
- Index columns used in WHERE clauses
- Use partial indexes when appropriate
- Consider partitioning for large tables
- Regularly analyze and optimize queries

### Maintenance
- Version your schemas
- Use migrations for changes
- Document schema changes
- Maintain backward compatibility when possible
- Regular backups and testing
