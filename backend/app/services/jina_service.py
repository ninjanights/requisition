import httpx

from app.core.config import settings


class JinaEmbeddingService:

    URL = "https://api.jina.ai/v1/embeddings"

    async def generate_embedding(self, text: str) -> list[float]:

        headers = {
            "Authorization": f"Bearer {settings.JINA_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": settings.JINA_EMBEDDING_MODEL,
            "input": [text],
            "dimensions": 1024,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                self.URL,
                headers=headers,
                json=payload,
            )

        response.raise_for_status()

        data = response.json()

        return data["data"][0]["embedding"]