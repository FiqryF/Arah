from functools import lru_cache
from typing import Literal

from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: PostgresDsn
    frontend_origin: str = "http://localhost:5173"
    default_user_timezone: Literal["Asia/Jakarta"] = "Asia/Jakarta"


@lru_cache
def get_settings() -> Settings:
    return Settings()
