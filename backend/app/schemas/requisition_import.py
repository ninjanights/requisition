from typing import Optional
from pydantic import BaseModel


class ImportedRequisitionItem(BaseModel):
    description: str
    quantity: int
    unit: Optional[str] = None
    estimated_rate: Optional[float] = None


class ImportedRequisition(BaseModel):
    project_name: Optional[str] = None
    requested_by: Optional[int] = None
    department: Optional[str] = None
    items: list[ImportedRequisitionItem]