"""Integration tests require a dedicated, migrated PostgreSQL test database."""

import os
import uuid
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import IntegrityError

from app.core.config import get_settings
from app.db.session import get_engine
from app.main import create_app

pytestmark = pytest.mark.skipif(not os.getenv("ARAH_TEST_DATABASE"), reason="Dedicated PostgreSQL not configured")


def test_database_utc_and_user_timezone():
    assert get_settings().default_user_timezone == "Asia/Jakarta"
    with get_engine().connect() as connection:
        assert connection.execute(text("SHOW timezone")).scalar_one() == "UTC"
        now = connection.execute(text("SELECT now()")).scalar_one()
        assert now.utcoffset() == timedelta(0)
        row = connection.execute(
            text("SELECT TIMESTAMPTZ '2026-11-21 18:30:00+00' AT TIME ZONE 'Asia/Jakarta'")
        ).scalar_one()
        assert (row.day, row.hour, row.minute) == (22, 1, 30)


def test_erd_users_keys_and_only_phase_2_tables():
    inspector = inspect(get_engine())
    assert set(inspector.get_table_names()) == {"users", "alembic_version"}
    assert inspector.get_pk_constraint("users")["constrained_columns"] == ["id"]
    assert any(item["column_names"] == ["email"] for item in inspector.get_unique_constraints("users"))
    assert inspector.get_foreign_keys("users") == []
    columns = {item["name"]: item for item in inspector.get_columns("users")}
    assert str(columns["id"]["type"]) == "UUID"
    for name in ["email", "password_hash", "role", "display_name"]:
        assert str(columns[name]["type"]).startswith("VARCHAR")
    assert str(columns["onboarding_completed"]["type"]) == "BOOLEAN"
    assert columns["email"]["nullable"] is False
    assert columns["role"]["nullable"] is False
    assert columns["password_hash"]["nullable"] is True
    assert columns["display_name"]["nullable"] is True


def test_real_database_health_and_schema():
    with TestClient(create_app()) as client:
        response = client.get("/api/v1/health/db")
        assert response.status_code == 200
        assert response.json() == {"status": "ok", "database": "connected"}
    engine = create_engine(os.environ["DATABASE_URL"])
    columns = {col["name"]: col for col in inspect(engine).get_columns("users")}
    assert set(columns) == {
        "id",
        "email",
        "password_hash",
        "role",
        "display_name",
        "onboarding_completed",
        "created_at",
        "updated_at",
    }
    assert columns["created_at"]["type"].timezone
    assert columns["updated_at"]["type"].timezone
    engine.dispose()


def test_defaults_constraints_and_timestamp():
    engine = create_engine(os.environ["DATABASE_URL"])
    with engine.connect() as connection:
        transaction = connection.begin()
        try:
            uid = uuid.uuid4()
            values = {"id": uid, "email": f"{uid}@example.test"}
            row = connection.execute(
                text(
                    "INSERT INTO users(id,email) VALUES (:id,:email) RETURNING role,onboarding_completed,password_hash,updated_at"
                ),
                values,
            ).one()
            assert row.role == "user" and row.onboarding_completed is False and row.password_hash is None
            connection.execute(text("SELECT pg_sleep(0.01)"))
            changed = connection.execute(
                text("UPDATE users SET display_name='Test' WHERE id=:id RETURNING updated_at"), {"id": uid}
            ).scalar_one()
            assert changed > row.updated_at
            for sql, params in [
                ("INSERT INTO users(id,email) VALUES (:id,:email)", {**values, "id": uuid.uuid4()}),
                ("UPDATE users SET role='owner' WHERE id=:id", {"id": uid}),
                ("UPDATE users SET email=NULL WHERE id=:id", {"id": uid}),
            ]:
                with connection.begin_nested() as savepoint:
                    with pytest.raises(IntegrityError):
                        connection.execute(text(sql), params)
                    savepoint.rollback()
        finally:
            transaction.rollback()
    engine.dispose()
