from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from app.db.models import RequisitionStatus


class RequisitionItemCreate(BaseModel):
    description: str = Field(
        min_length=10,
        max_length=500,
    )

    quantity: int = Field(
        gt=0,
    )

    unit: str = Field(
        min_length=1,
        max_length=50,
    )

    estimated_rate: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

# id from jwt
class RequisitionCreate(BaseModel):
    project_name: str = Field(
        min_length=1,
        max_length=200,
    )

    department: str = Field(
        min_length=1,
        max_length=100,
    )

    items: list[RequisitionItemCreate] = Field(
        min_length=1,
    )



class RequisitionItemResponse(BaseModel):
    id: int
    description: str
    quantity: Decimal
    unit: str
    estimated_rate: Decimal

    model_config = ConfigDict(from_attributes=True)


class RequisitionResponse(BaseModel):
    id: int
    requisition_no: str
    project_name: str
    requested_by: int
    department: str
    status: RequisitionStatus
    created_at: datetime
    items: list[RequisitionItemResponse]

    model_config = ConfigDict(from_attributes=True)
   
    
class RequisitionListResponse(BaseModel):
    id: int
    requisition_no: str
    project_name: str
    requested_by: int
    department: str
    status: RequisitionStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)