from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from math import ceil
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
    RequisitionDetailResponse,
    RequisitionPaginatedResponse,
)
from app.services.requisition_import_service import (
    RequisitionImportService,
)
from app.schemas.requisition_import import ImportedRequisition

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
                unit=item.unit or "unit",
                estimated_rate=item.estimated_rate or 0,
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

# now with pagination
# get list of requisition | GET /api/requisitions
@router.get(
    "",
    response_model=RequisitionPaginatedResponse,
)
def get_requisitions(
page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
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

    
    # Total number of records after ownership/status filtering
    total = query.count()

    # Calculate how many records to skip
    offset = (page - 1) * page_size

    # Fetch only the records required for this page
    requisitions = (
        query
        .order_by(Requisition.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # Calculate total number of pages
    total_pages = ceil(total / page_size) if total else 0

    return {
        "items": requisitions,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
    }

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


# import Requisition | validate -> db | for all
# import Requisition | Gemini -> validate -> PostgreSQL
# POST /api/requisitions/import
@router.post(
    "/import",
    response_model=RequisitionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def import_requisition(
    text: str,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_or_session),
):
    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty",
        )

    service = RequisitionImportService()

    try:
        # 1. Send raw input to Gemini
        extracted_data = await service.extract_requisition(text)

        # 2. Validate Gemini's response
        requisition_data = ImportedRequisition(**extracted_data)

        # 3. Create requisition
        requisition = Requisition(
            requisition_no="TEMP",
            project_name=requisition_data.project_name,
            requested_by=current_user.id,
            department=requisition_data.department,
            status=RequisitionStatus.DRAFT,
            is_embedded=False,
        )

        db.add(requisition)

        # 4. Generate database ID
        db.flush()

        # 5. Generate actual requisition number
        requisition.requisition_no = f"PR-{requisition.id:06d}"

        # 6. Insert requisition items
        for item in requisition_data.items:
            requisition_item = RequisitionItem(
                requisition_id=requisition.id,
                description=item.description,
                quantity=item.quantity,
                unit=item.unit or "unit",
                estimated_rate=item.estimated_rate or 0,
            )

            db.add(requisition_item)

        # 7. Commit everything
        db.commit()
        db.refresh(requisition)

        # Refresh public session if necessary
        if current_user.role == "PUBLIC":
            refresh_session(
                response=response,
                user=current_user,
            )

        return requisition

    except Exception as e:
        db.rollback()
        print("IMPORT ERROR:", repr(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to import requisition: {str(e)}",
        )
