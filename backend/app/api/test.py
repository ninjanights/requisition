from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.models import User


router = APIRouter(
    prefix="/api/test",
    tags=["Test"],
)


@router.get("/protected")
def protected_route(
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "You are authenticated",
        "user": current_user.email,
        "role": current_user.role,
    }