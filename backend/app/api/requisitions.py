from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session
from typing import Optional

from app.core.security import get_current_user
from app.db.database import get_db
from app.db.models import (
    Requisition,
    RequisitionItem,
    RequisitionStatus,
    User,
)
from app.schemas.requisition import (
    RequisitionCreate,
    RequisitionResponse,
    RequisitionListResponse
)

router = APIRouter(
    prefix="/api/requisitions",
    tags=["Requisitions"],
)


@router.post(
    "",
    response_model=RequisitionResponse,
    status_code=status.HTTP_201_CREATED,
)

# create req
def create_requisition(
    request: RequisitionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        requisition = Requisition(
            requisition_no="TEST",
            project_name=request.project_name,
            requested_by=current_user.id,
            department=request.department,
            status=RequisitionStatus.DRAFT,
        )

        db.add(requisition)

        # We need the generated requisition ID
        db.flush()

        # Generate the actual requisition number
        requisition.requisition_no = f"PR-{requisition.id:06d}"

        for item in request.items:
            requisition_item = RequisitionItem(
                requisition_id=requisition.id,
                description=item.description,
                quantity=item.quantity,
                unit=item.unit,
                estimated_rate=item.estimated_rate,
            )

            db.add(requisition_item)

        db.commit()

        db.refresh(requisition)

        return requisition

    except Exception:
        db.rollback()
        raise


#  get list of req
@router.get(
    "",
    response_model=list[RequisitionListResponse],
)
def get_requisitions(
    status_filter: Optional[RequisitionStatus] = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Requisition)

    if status_filter:
        query = query.filter(
            Requisition.status == status_filter
        )

    return (
        query
        .order_by(Requisition.created_at.desc())
        .all()
    )