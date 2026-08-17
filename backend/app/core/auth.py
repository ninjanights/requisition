from fastapi import Cookie, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.core.session import get_or_create_session_user
from app.db.database import get_db
from app.db.models import User


def get_current_user_or_session(
    response: Response,
    access_token: str | None = Cookie(
        default=None,
        alias="access_token",
    ),
    session_id: str | None = Cookie(
        default=None,
        alias="requisition_session",
    ),
    db: Session = Depends(get_db),
) -> User:

    # 1. Try ADMIN JWT cookie ---------------------------------------------------------
    if access_token:

        payload = decode_access_token(access_token)

        if payload:
            user_id = payload.get("sub")

            if user_id:
                user = (
                    db.query(User)
                    .filter(
                        User.id == int(user_id),
                        User.role == "ADMIN",
                    )
                    .first()
                )

                if user:
                    return user

    # 2. Try PUBLIC browser session ---------------------------------------------------------
    if session_id:
        user = (
            db.query(User)
            .filter(
                User.session_id == session_id,
                User.role == "PUBLIC",
            )
            .first()
        )

        if user and user.session_expires_at:
            return get_or_create_session_user(
                response=response,
                session_id=session_id,
                db=db,
            )

    # 3. No valid identity ---------------------------------------------------------
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required",
    )
