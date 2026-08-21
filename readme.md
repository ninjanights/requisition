Requisition - https://requisitionninjanights.vercel.app/login

## Database Process

1. **Designed the database schema with SQLAlchemy** — `users`, `requisitions`, and `requisition_items`, connected through user → requisitions → items relationships.

2. **Created the SQLAlchemy models and Pydantic schemas** for database structure and request/response validation.

3. **Connected PostgreSQL with Neon** and used **Alembic migrations** to create and update the database schema.

4. **Added and seeded the Admin user** with securely hashed credentials.

5. **Added `RequisitionStatus` enum** with `DRAFT`, `SUBMITTED`, `APPROVED`, and `REJECTED` states.

6. **Created `usp_get_requisition()` PostgreSQL function** to return a complete requisition with its items and calculated totals as JSON.

7. **Added browser-session fields** (`session_id`, `session_expires_at`) to support 24-hour public user sessions.

8. **Added PostgreSQL `pgvector` extension** to prepare the database for storing embeddings and semantic search.

### Stack

**SQLAlchemy • Alembic • PostgreSQL • Neon • PostgreSQL Functions • pgvector**
