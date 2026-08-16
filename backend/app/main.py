from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine


from app.api.test import router as test_router
from app.api.auth import router as auth_router
from app.api.requisitions import router as requisitions_router

app = FastAPI(
    title="Requisition API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(test_router)
app.include_router(requisitions_router)

@app.get("/health")
def health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": result.scalar()
        }