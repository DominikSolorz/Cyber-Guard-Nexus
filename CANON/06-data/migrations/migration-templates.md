# Database Migration Templates

Neutral, reusable migration patterns for database changes.

## Migration Structure

### File Naming Convention
```
YYYYMMDDHHMMSS_descriptive_name.sql
or
YYYYMMDDHHMMSS_descriptive_name.js (for NoSQL)

Example: 20241224120000_create_users_table.sql
```

## PostgreSQL Migrations

### Migration Template
```sql
-- Migration: 20241224120000_create_users_table
-- Description: Create users table with basic authentication fields
-- Author: [Your Name]
-- Date: 2024-12-24

-- UP Migration
BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

COMMIT;

-- DOWN Migration
-- BEGIN;
-- DROP TABLE IF EXISTS users CASCADE;
-- COMMIT;
```

### Add Column Migration
```sql
-- Migration: 20241224130000_add_user_verification
-- Description: Add email verification fields

BEGIN;

ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
    ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_users_verification_token ON users(verification_token);

COMMIT;

-- DOWN
-- BEGIN;
-- ALTER TABLE users 
--     DROP COLUMN IF EXISTS is_verified,
--     DROP COLUMN IF EXISTS verification_token,
--     DROP COLUMN IF EXISTS verification_sent_at;
-- COMMIT;
```

### Modify Column Migration
```sql
-- Migration: 20241224140000_modify_username_length
-- Description: Increase username max length

BEGIN;

-- Store existing data if needed
CREATE TEMP TABLE users_backup AS 
SELECT * FROM users;

-- Modify column
ALTER TABLE users 
    ALTER COLUMN username TYPE VARCHAR(100);

COMMIT;

-- DOWN
-- BEGIN;
-- ALTER TABLE users 
--     ALTER COLUMN username TYPE VARCHAR(50);
-- COMMIT;
```

### Add Foreign Key Migration
```sql
-- Migration: 20241224150000_add_user_profile
-- Description: Create user profiles with foreign key

BEGIN;

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY,
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

COMMIT;

-- DOWN
-- BEGIN;
-- DROP TABLE IF EXISTS user_profiles CASCADE;
-- COMMIT;
```

### Data Migration
```sql
-- Migration: 20241224160000_migrate_user_data
-- Description: Migrate and transform user data

BEGIN;

-- Backup existing data
CREATE TEMP TABLE users_backup AS 
SELECT * FROM users;

-- Transform data
UPDATE users 
SET email = LOWER(email)
WHERE email IS NOT NULL;

-- Add default values
UPDATE users 
SET is_verified = FALSE
WHERE is_verified IS NULL;

COMMIT;

-- DOWN
-- BEGIN;
-- UPDATE users u
-- SET email = b.email,
--     is_verified = b.is_verified
-- FROM users_backup b
-- WHERE u.id = b.id;
-- COMMIT;
```

### Add Index Migration
```sql
-- Migration: 20241224170000_add_performance_indexes
-- Description: Add indexes for query performance

BEGIN;

-- Add index for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_created 
    ON users(is_active, created_at DESC);

-- Partial index for active users
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active 
    ON users(email) 
    WHERE is_active = TRUE;

COMMIT;

-- DOWN
-- BEGIN;
-- DROP INDEX IF EXISTS idx_users_active_created;
-- DROP INDEX IF EXISTS idx_users_active;
-- COMMIT;
```

## MongoDB Migrations

### JavaScript Migration Template
```javascript
// Migration: 20241224120000_create_users_collection
// Description: Create users collection with validation

module.exports = {
    async up(db) {
        // Create collection with validation
        await db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['email', 'username', 'password_hash'],
                    properties: {
                        email: {
                            bsonType: 'string',
                            pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
                        },
                        username: {
                            bsonType: 'string',
                            minLength: 3,
                            maxLength: 50
                        },
                        password_hash: {
                            bsonType: 'string'
                        },
                        is_active: {
                            bsonType: 'bool'
                        },
                        created_at: {
                            bsonType: 'date'
                        }
                    }
                }
            }
        });

        // Create indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('users').createIndex({ username: 1 }, { unique: true });
        await db.collection('users').createIndex({ is_active: 1 });
    },

    async down(db) {
        await db.collection('users').drop();
    }
};
```

### Add Field Migration (MongoDB)
```javascript
// Migration: 20241224130000_add_user_verification
// Description: Add verification fields to users

module.exports = {
    async up(db) {
        await db.collection('users').updateMany(
            {},
            {
                $set: {
                    is_verified: false,
                    verification_token: null,
                    verification_sent_at: null
                }
            }
        );

        // Update validation schema
        await db.command({
            collMod: 'users',
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['email', 'username', 'password_hash'],
                    properties: {
                        // ... existing properties
                        is_verified: {
                            bsonType: 'bool'
                        },
                        verification_token: {
                            bsonType: ['string', 'null']
                        },
                        verification_sent_at: {
                            bsonType: ['date', 'null']
                        }
                    }
                }
            }
        });
    },

    async down(db) {
        await db.collection('users').updateMany(
            {},
            {
                $unset: {
                    is_verified: '',
                    verification_token: '',
                    verification_sent_at: ''
                }
            }
        );
    }
};
```

### Data Transformation Migration (MongoDB)
```javascript
// Migration: 20241224140000_normalize_emails
// Description: Normalize all email addresses to lowercase

module.exports = {
    async up(db) {
        const users = await db.collection('users').find({}).toArray();
        
        for (const user of users) {
            await db.collection('users').updateOne(
                { _id: user._id },
                {
                    $set: {
                        email: user.email.toLowerCase(),
                        updated_at: new Date()
                    }
                }
            );
        }
    },

    async down(db) {
        // Restore from backup if needed
        // Note: This is a destructive operation, backup recommended
    }
};
```

## Node.js Migration Runner

```javascript
// migration-runner.js
const fs = require('fs');
const path = require('path');

class MigrationRunner {
    constructor(db) {
        this.db = db;
        this.migrationsDir = path.join(__dirname, 'migrations');
    }

    async ensureMigrationsTable() {
        // For PostgreSQL
        await this.db.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    async getExecutedMigrations() {
        const result = await this.db.query(
            'SELECT version FROM schema_migrations ORDER BY version'
        );
        return result.rows.map(row => row.version);
    }

    async getPendingMigrations() {
        const executed = await this.getExecutedMigrations();
        const allMigrations = fs.readdirSync(this.migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort();
        
        return allMigrations.filter(m => !executed.includes(m));
    }

    async runMigration(filename) {
        const filepath = path.join(this.migrationsDir, filename);
        const sql = fs.readFileSync(filepath, 'utf8');
        
        // Extract UP migration (ignore DOWN)
        const upMatch = sql.match(/-- UP Migration\s+([\s\S]*?)(?=-- DOWN|$)/i);
        if (!upMatch) {
            throw new Error(`No UP migration found in ${filename}`);
        }
        
        const upSql = upMatch[1].trim();
        
        try {
            await this.db.query('BEGIN');
            await this.db.query(upSql);
            await this.db.query(
                'INSERT INTO schema_migrations (version) VALUES ($1)',
                [filename]
            );
            await this.db.query('COMMIT');
            console.log(`✓ Executed migration: ${filename}`);
        } catch (error) {
            await this.db.query('ROLLBACK');
            throw error;
        }
    }

    async migrate() {
        await this.ensureMigrationsTable();
        const pending = await this.getPendingMigrations();
        
        if (pending.length === 0) {
            console.log('No pending migrations');
            return;
        }
        
        console.log(`Running ${pending.length} migration(s)...`);
        
        for (const migration of pending) {
            await this.runMigration(migration);
        }
        
        console.log('All migrations completed');
    }
}

module.exports = MigrationRunner;
```

## Best Practices

### General
1. **Always use transactions** for migrations
2. **Test migrations** in development first
3. **Backup data** before running migrations
4. **Write reversible migrations** (include DOWN)
5. **Version control** all migrations
6. **Never modify** executed migrations

### Safety
1. Use `IF EXISTS` / `IF NOT EXISTS` when appropriate
2. Create temporary backups before destructive operations
3. Test rollback procedures
4. Use `CONCURRENTLY` for index creation on large tables
5. Consider downtime requirements

### Performance
1. Avoid blocking operations during peak hours
2. Use batch operations for data migrations
3. Add indexes CONCURRENTLY
4. Monitor migration execution time
5. Split large migrations into smaller ones

### Documentation
1. Include clear descriptions
2. Document breaking changes
3. Note data transformations
4. List dependencies
5. Specify rollback procedures
