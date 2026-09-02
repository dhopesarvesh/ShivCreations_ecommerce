import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = os.getenv("APP_NAME", "Rangoli Store")
    api_v1_prefix: str = os.getenv("API_V1_PREFIX", "/api/v1")
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://root:root@localhost:5432/rangoli_store",
    )
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-production")


settings = Settings()
