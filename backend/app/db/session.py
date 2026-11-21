from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings

POSTGRES_CONNECT_ARGS = {"connect_timeout": 3, "options": "-c timezone=UTC"}


@lru_cache
def get_engine():
    return create_engine(str(get_settings().database_url), pool_pre_ping=True, connect_args=POSTGRES_CONNECT_ARGS)


def get_session():
    factory = sessionmaker(bind=get_engine(), expire_on_commit=False)
    with factory() as session:
        yield session
