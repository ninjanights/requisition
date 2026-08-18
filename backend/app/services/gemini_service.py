import httpx

from app.core.config import settings


class GeminiService:

    async def generate_answer(
        self,
        question: str,
        context: str,
    ) -> str:

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent"
        )

        params = {
            "key": settings.GEMINI_API_KEY,
        }

        prompt = f"""
You are an AI assistant for a procurement requisition system.

Answer the user's question using ONLY the provided context.

If the answer cannot be determined from the context, say that
you don't have enough information.

Context:
{context}

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

        return data["candidates"][0]["content"]["parts"][0]["text"]
