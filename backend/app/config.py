
import os
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "PhishGuard Phishing URL Detection System"
    ENVIRONMENT: str = "development"

    # No insecure fallback: SECRET_KEY must come from the environment or .env.
    SECRET_KEY: str = Field(min_length=32)

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    DATABASE_URL: str = "sqlite:///./phishguard.db"

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    MODEL_DIR: str = os.path.join(
        os.path.dirname(__file__), "ml", "model_storage"
    )

    DEFAULT_ADMIN_EMAIL: str = "admin@phishguard.ac.in"
    DEFAULT_ADMIN_PASSWORD: str = ""
    DEFAULT_USER_EMAIL: str = "student@phishguard.ac.in"
    DEFAULT_USER_PASSWORD: str = ""

    ENABLE_DEMO_LOGIN: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow",
    )


settings = Settings()