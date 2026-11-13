from fastapi import HTTPException, Header, Depends, status
from typing import Optional, List, Callable
from database import db


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Parse JWT token from Authorization header and return user dict."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )

    # Expected format: "Bearer jwt-token-{userId}-{timestamp}"
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format"
        )

    token = parts[1]
    # Handle mock tokens for demo/fallback
    if "mock" in token or token == "mock-jwt-token-pam-coffee":
        users = db.data.get("users", [])
        if "manager" in token or "admin" in token:
            for u in users:
                if u.get("role") == "ROLE_MANAGER":
                    return u
            return {"id": 1, "username": "manager", "role": "ROLE_MANAGER", "locked": False}
        for u in users:
            if u.get("role") == "ROLE_CUSTOMER":
                return u
        return {"id": 2, "username": "customer", "role": "ROLE_CUSTOMER", "locked": False}

    token_parts = token.split("-")
    # jwt-token-{userId}-{timestamp} => ["jwt", "token", "{userId}", "{timestamp}"]
    if len(token_parts) < 4 or token_parts[0] != "jwt" or token_parts[1] != "token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format"
        )

    try:
        user_id = int(token_parts[2])
    except (ValueError, IndexError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: cannot parse user ID"
        )

    users = db.data.get("users", [])
    for u in users:
        if u["id"] == user_id:
            if u.get("locked"):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Tài khoản đã bị khóa"
                )
            return u

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User not found"
    )


def require_role(*roles: str):
    """Dependency factory: checks that the current user has one of the required roles."""
    def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền thực hiện thao tác này"
            )
        return current_user
    return role_checker
