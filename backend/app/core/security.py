from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings

#  protect apis
from fastapi import (
    Cookie,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User

password_hash = PasswordHash.recommended()


# - hash_password
def hash_password(password: str) -> str:
    return password_hash.hash(password)


# - verify_password
def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


# - create_access_token
def create_access_token(
    user_id: int,
    role: str,
) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


# - decode_access_token
def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError:
        return None


# get_current_admin
def get_current_admin(
    access_token: str | None = Cookie(
        default=None,
        alias="access_token",
    ),
    db: Session = Depends(get_db),
) -> User:
    """
    Authenticate an administrator using the JWT stored
    in the HttpOnly access_token cookie.
    """

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    payload = decode_access_token(access_token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )

    user = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.role == "ADMIN",
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrator not found",
        )

    return user


def get_optional_admin(
    access_token: str | None = Cookie(
        default=None,
        alias="access_token",
    ),
    db: Session = Depends(get_db),
) -> User | None:
    """
    Return the current admin if a valid access_token exists.
    Otherwise return None.
    """

    if not access_token:
        return None

    payload = decode_access_token(access_token)

    if not payload:
        return None

    user_id = payload.get("sub")

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return None

    user = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.role == "ADMIN",
        )
        .first()
    )

    return user