from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine


from app.api.test import router as test_router
from app.api.auth import router as auth_router
from app.api.requisitions import router as requisitions_router
from app.api.embeddings import router as embeddings_router
from app.api.questions import router as questions_router

app = FastAPI(
    title="Requisition API",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://requisitionninjanights.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(test_router)
app.include_router(requisitions_router)
app.include_router(embeddings_router)
app.include_router(questions_router)


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"status": "ok", "database": result.scalar()}
