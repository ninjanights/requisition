from enum import Enum

import httpx

from app.core.config import settings


class QuestionType(str, Enum):
    SQL = "SQL"
    RAG = "RAG"


class QuestionRouterService:

    async def classify(
        self,
        question: str,
    ) -> QuestionType:

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent"
        )

        params = {
            "key": settings.GEMINI_API_KEY,
        }

        prompt = f"""
You are a question classifier for a Purchase Requisition
Management System.

Classify the user's question into exactly ONE category:

SQL
- Questions requiring exact database information.
- Counts
- Totals
- Averages
- Specific statuses
- Dates
- Departments
- Exact requisition numbers
- Exact project names
- Filtering/sorting
- Aggregations
- Any question where the PostgreSQL database is the source of truth.

RAG
- Questions requiring semantic understanding.
- Finding requisitions based on meaning.
- Similar procurement requirements.
- Searching descriptions semantically.
- Summarization of relevant requisitions.
- Questions where keyword matching or SQL filtering alone
  is insufficient.

Return ONLY:
SQL

or:

RAG

User question:
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

        result = (
            data["candidates"][0]["content"]["parts"][0]["text"]
            .strip()
            .upper()
        )

        if result == "SQL":
            return QuestionType.SQL

        if result == "RAG":
            return QuestionType.RAG

        # Safe fallback
        return QuestionType.RAG