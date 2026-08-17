from fastapi import APIRouter, Depends, HTTPException, Query, status, Response

from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Optional

from app.core.auth import get_current_user_or_session
from app.core.session import get_or_create_session_user, refresh_session
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
    RequisitionListResponse,
    RequisitionDetailResponse,
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

# create requisition - | POST /api/requisitions
def create_requisition(
    request: RequisitionCreate,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_or_create_session_user),
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

        # Only after the requisition has been created successfully

        db.commit()
        db.refresh(requisition)
        if current_user.role == "PUBLIC":
            refresh_session(
                response=response,
                user=current_user,
            )
        return requisition

    except Exception:
        db.rollback()
        raise


#  get list of requisition | GET /api/requisitions
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
    current_user: User = Depends(get_current_user_or_session),
):
    query = db.query(Requisition)

    # PUBLIC → only their own requisitions
    if current_user.role == "PUBLIC":
        query = query.filter(Requisition.requested_by == current_user.id)

    # ADMIN → no requested_by filter
    # therefore admin sees everything
    if status_filter:
        query = query.filter(Requisition.status == status_filter)

    return query.order_by(Requisition.created_at.desc()).all()


# by <id> | calls SQL func. | GET /api/requisitions/{requisition_id}
# GET /api/requisitions/{requisition_id}
@router.get(
    "/{requisition_id}",
    response_model=RequisitionDetailResponse,
)
def get_requisition(
    requisition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_or_session),
):
    requisition = db.query(Requisition).filter(Requisition.id == requisition_id).first()

    if requisition is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requisition not found",
        )

    # PUBLIC users can only access their own requisitions.
    if current_user.role == "PUBLIC" and requisition.requested_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this requisition",
        )

    # ADMIN can access any requisition.
    result = db.execute(
        text("SELECT public.usp_get_requisition(:requisition_id)"),
        {"requisition_id": requisition_id},
    ).scalar_one_or_none()

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requisition not found",
        )

    return result


# change status of a requisition (submits only / later on appscript to make it up to approved by 30 sec gaps) | POST /api/requisitions/{requisition_id}/submit
# POST /api/requisitions/{requisition_id}/submit
@router.post(
    "/{requisition_id}/submit",
    response_model=RequisitionResponse,
)
def submit_requisition(
    requisition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_or_session),
):
    requisition = db.query(Requisition).filter(Requisition.id == requisition_id).first()

    if requisition is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requisition not found",
        )

    # PUBLIC users can only submit their own requisitions.
    if current_user.role == "PUBLIC" and requisition.requested_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this requisition",
        )

    # Only DRAFT requisitions can be submitted.
    if requisition.status != RequisitionStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft requisitions can be submitted",
        )

    requisition.status = RequisitionStatus.SUBMITTED

    db.commit()
    db.refresh(requisition)

    return requisition
