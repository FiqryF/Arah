from typing import Annotated, Any

from fastapi import Depends
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.core.auth import current_user, require_admin
from app.db.session import get_session
from app.main import create_app


def test_health_and_docs():
    with TestClient(create_app()) as client:
        assert client.get("/api/v1/health").json() == {"status": "ok", "service": "ARAH API"}
        assert client.get("/docs").status_code == 200
        assert "/api/v1/health/db" in client.get("/openapi.json").json()["paths"]


def test_database_failure_is_503_without_details():
    class Unavailable:
        def execute(self, query):
            assert str(query) == "SELECT 1"
            raise OperationalError("sensitive", {}, Exception("secret"))

    app = create_app()
    app.dependency_overrides[get_session] = lambda: Unavailable()
    with TestClient(app) as client:
        response = client.get("/api/v1/health/db")
        assert response.status_code == 503
        assert response.json() == {"detail": "Database unavailable"}


def test_cors():
    with TestClient(create_app()) as client:
        response = client.get("/api/v1/health", headers={"Origin": "http://localhost:5173"})
        assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
        response = client.get("/api/v1/health", headers={"Origin": "https://untrusted.example"})
        assert "access-control-allow-origin" not in response.headers


def test_real_unreachable_database_returns_503():
    engine = create_engine("postgresql+psycopg://unused:unused@127.0.0.1:1/unused", connect_args={"connect_timeout": 1})
    app = create_app()

    def unavailable_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = unavailable_session
    try:
        with TestClient(app) as client:
            response = client.get("/api/v1/health/db")
            assert response.status_code == 503
            assert response.json() == {"detail": "Database unavailable"}
    finally:
        engine.dispose()


def test_auth_fails_closed_and_admin_role_enforced():
    app = create_app()

    @app.get("/private")
    def private(user: Annotated[Any, Depends(require_admin)]):
        return {"ok": True}

    with TestClient(app) as client:
        assert client.get("/private").status_code == 401
        from types import SimpleNamespace

        app.dependency_overrides[current_user] = lambda: SimpleNamespace(role="user")
        assert client.get("/private").status_code == 403
        app.dependency_overrides[current_user] = lambda: SimpleNamespace(role="admin")
        assert client.get("/private").status_code == 200
