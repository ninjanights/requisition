from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_optional_admin
from app.db.database import get_db
from app.db.models import User
from app.schemas.auth import LoginRequest
from app.core.session import get_current_session_user
router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.get("/me")
def get_me(
    admin: User | None = Depends(get_optional_admin),
    public_user: User | None = Depends(get_current_session_user),
):
    # ADMIN
    if admin:
        return {
            "authenticated": True,
            "user": {
                "id": admin.id,
                "email": admin.email,
                "role": "ADMIN",
            },
        }

    # PUBLIC
    if public_user:
        return {
            "authenticated": True,
            "user": {
                "id": public_user.id,
                "email": None,
                "role": "PUBLIC",
            },
        }

    # NOT AUTHENTICATED
    return {
        "authenticated": False,
        "user": None,
    }


@router.post("/login")
def login(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required",
        )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        samesite="none",
        secure=settings.ENVIRONMENT == "production",  # True in production with HTTPS
    )

    return {
        "message": "Login successful",
        "user": user.email,
        "role": user.role,
    }


# Log Out | only handled by the backend : reason is cookie to delete
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="none",
        secure=settings.ENVIRONMENT == "production",
    )

    # # for public to get out of the session | can be used in delete a/c with CRON job.
    # response.delete_cookie(
    #     key="requisition_session",
    #     httponly=True,
    #     samesite="lax",
    #     secure=False,
    # )

    return {"message": "Logged out successfully"}
