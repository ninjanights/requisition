import httpx

from app.core.config import settings


class SQLGeneratorService:

    async def generate_sql(
        self,
        question: str,
    ) -> str:

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent"
        )

        params = {
            "key": settings.GEMINI_API_KEY,
        }

        schema = """
PostgreSQL database schema:

TABLE users
-----------
id                  INTEGER PRIMARY KEY
email               VARCHAR(255)
password_hash       VARCHAR(255)
role                VARCHAR(20)
session_id          VARCHAR(64)
session_expires_at  TIMESTAMP

TABLE requisitions
------------------
id              INTEGER PRIMARY KEY
requisition_no  VARCHAR(50)
project_name    VARCHAR(255)
requested_by    INTEGER
department      VARCHAR(100)
status          requisition_status
is_embedded     BOOLEAN
created_at      TIMESTAMP

TABLE requisition_items
-----------------------
id              INTEGER PRIMARY KEY
requisition_id  INTEGER
description     VARCHAR(500)
quantity        NUMERIC(12,2)
unit            VARCHAR(50)
estimated_rate  NUMERIC(12,2)

Relationships:
---------------
requisitions.requested_by
    -> users.id

requisition_items.requisition_id
    -> requisitions.id

Allowed requisition statuses:
- Draft
- Submitted
- Approved
- Rejected
"""

        prompt = f"""
You are a PostgreSQL SQL generation assistant
for a Purchase Requisition Management System.

Your task is to convert the user's natural-language
question into ONE PostgreSQL SELECT query.

DATABASE SCHEMA:
{schema}

STRICT RULES:

1. Generate ONLY SELECT queries.
2. Never generate INSERT, UPDATE, DELETE, DROP,
   ALTER, TRUNCATE, CREATE, GRANT, REVOKE,
   EXECUTE or any other write operation.
3. Never modify the database.
4. Use ONLY tables and columns from the schema.
5. Do not invent tables or columns.
6. Use proper PostgreSQL syntax.
7. If a relationship is needed, use the correct JOIN.
8. For counts, use COUNT().
9. For totals, use SUM().
10. For averages, use AVG().
11. For maximum/minimum, use MAX()/MIN().
12. When returning requisition information, prefer
    requisition_no over the internal id.
13. Never expose password_hash.
14. Never expose session_id.
15. Never expose session_expires_at.
16. Never use SELECT *.
17. Return ONLY the SQL query.
18. Do not use markdown code fences.
19. Do not provide explanations.

USER QUESTION:
{question}
"""

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt,
                        }
                    ]
                }
            ]
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                params=params,
                json=payload,
            )

        response.raise_for_status()

        data = response.json()

        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
