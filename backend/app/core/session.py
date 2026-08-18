"""
The session file will handle normal browser users only.
Admin JWT authentication stays in security.py.
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import Cookie, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.core.config import settings

# will shift this code to - settings | .env
SESSION_COOKIE_NAME = "requisition_session"
SESSION_DURATION = timedelta(hours=24)


def get_or_create_session_user(
    response: Response,
    session_id: str | None = Cookie(
        default=None, alias=SESSION_COOKIE_NAME
    ),  # comes from cookie
    db: Session = Depends(get_db),
) -> User:
    """
    Identify a normal browser user using an HttpOnly session cookie.

    If the browser has no valid session, a new USER is created and
    a new session cookie is issued.

    A session remains valid for 24 hours from its creation/refresh.
    """

    now = datetime.now(timezone.utc)

    # This function is intentionally not calling : get_current_user. | cause its top level identity check
    # 1. Existing browser session ---------
    if session_id:
        user = (
            db.query(User)
            .filter(
                User.session_id == session_id,
                User.role == "PUBLIC",
            )
            .first()
        )

        # Session exists and has not expired
        if user and user.session_expires_at and user.session_expires_at > now:
            return user

    # 2. No valid session -> create a new browser user ---------
    new_session_id = uuid4().hex

    user = User(
        role="PUBLIC",
        session_id=new_session_id,
        session_expires_at=now + SESSION_DURATION,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # 3. Send the session cookie to the browser ---------
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=new_session_id,
        max_age=int(SESSION_DURATION.total_seconds()),
        httponly=True,
        samesite="none",
        secure=settings.ENVIRONMENT == "production" # Change to True when using HTTPS in production
    )

    return user


# if PUBLIC makes a requisition, update the expiry time to the next 24h.
def refresh_session(
    response: Response,
    user: User,
) -> None:
    """
    Extend the browser session by another 24 hours.
    Used after meaningful user activity such as creating a requisition.
    """

    expires_at = datetime.now(timezone.utc) + SESSION_DURATION

    user.session_expires_at = expires_at

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=user.session_id,
        max_age=int(SESSION_DURATION.total_seconds()),
        httponly=True,
        samesite="none",
        secure=settings.ENVIRONMENT == "production",  # True in production over HTTPS
    )

"""
POST /api/requisitions
        |
get_or_create_session_user()
        │
current_user
        │
create requisition + items
        │
refresh_session()
        │
db.commit()
        │
cookie gets another 24 hours
"""

# get current session user | .../me
def get_current_session_user(
    session_id: str | None = Cookie(
        default=None,
        alias=SESSION_COOKIE_NAME,
    ),
    db: Session = Depends(get_db),
) -> User | None:
    """
    Identify an existing public browser session.

    Does NOT create a new user or session.
    """

    if not session_id:
        return None

    now = datetime.now(timezone.utc)

    user = (
        db.query(User)
        .filter(
            User.session_id == session_id,
            User.role == "PUBLIC",
        )
        .first()
    )

    if not user:
        return None

    if not user.session_expires_at:
        return None

    if user.session_expires_at <= now:
        return None

    return user