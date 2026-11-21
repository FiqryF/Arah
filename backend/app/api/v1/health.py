import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import get_session

router = APIRouter(prefix="/health", tags=["health"])
logger = logging.getLogger(__name__)


class Health(BaseModel):
    status: str
    service: str


class DatabaseHealth(BaseModel):
    status: str
    database: str


@router.get("", response_model=Health)
def health():
    return {"status": "ok", "service": "ARAH API"}


@router.get("/db", response_model=DatabaseHealth, responses={503: {"description": "Database unavailable"}})
def database_health(session: Annotated[Session, Depends(get_session)]):
    try:
        if session.execute(text("SELECT 1")).scalar_one() != 1:
            raise HTTPException(status_code=503, detail="Database unavailable")
    except SQLAlchemyError:
        logger.warning("Database health check failed")
        raise HTTPException(status_code=503, detail="Database unavailable") from None
    return {"status": "ok", "database": "connected"}
