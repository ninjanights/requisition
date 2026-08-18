from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    GEMINI_API_KEY: str | None = None
    JINA_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"
    JINA_EMBEDDING_MODEL: str = "jina-embeddings-v3"
    ENVIRONMENT: str = "production"
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
