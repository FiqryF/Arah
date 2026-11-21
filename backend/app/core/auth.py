"""Fail-closed dependencies; replace with verified identity in the auth phase."""

from typing import Annotated, Any

from fastapi import Depends, HTTPException


def current_user():
    raise HTTPException(status_code=401, detail="Authentication is not configured")


def require_admin(user: Annotated[Any, Depends(current_user)]):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")
    return user
