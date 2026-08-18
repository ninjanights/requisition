import json
import httpx

from app.core.config import settings
from sqlalchemy.orm import Session

from app.db.models import (
    Requisition,
    RequisitionItem,
    RequisitionStatus,
)
from app.schemas.requisition_import import ImportedRequisition


class RequisitionImportService:

    async def extract_requisition(
        self,
        text: str,
    ) -> dict:

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent"
        )

        prompt = f"""
You are a data extraction system for a procurement requisition application.

Convert the provided input into the exact JSON structure below.

Return ONLY valid JSON.
Do not return markdown.
Do not explain anything.

JSON structure:

{{
  "project_name": "string",
  "requested_by": 0,
  "department": "string",
  "items": [
    {{
      "description": "string",
      "quantity": 0,
      "unit": "string",
      "estimated_rate": 0
    }}
  ]
}}

Rules:

- Extract only information present in the input.
- Do not invent values.
- If a required value cannot be determined, use null.
- Preserve numerical values accurately.
- Every procurement item must become one item in the items array.

Input:

{text}
"""

        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        params = {"key": settings.GEMINI_API_KEY}

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                params=params,
                json=payload,
            )

        response.raise_for_status()

        data = response.json()

        result = data["candidates"][0]["content"]["parts"][0]["text"]

        return json.loads(result)

    # DATABASE INSERTION ---------------------------------------------------------
    def create_requisition(
        self,
        db: Session,
        data: ImportedRequisition,
        requisition_no: str,
    ) -> Requisition:

        requisition = Requisition(
            requisition_no=requisition_no,
            project_name=data.project_name,
            requested_by=data.requested_by,
            department=data.department,
            status=RequisitionStatus.DRAFT,
            is_embedded=False,
        )

        db.add(requisition)

        # Generate requisition.id before creating items
        db.flush()

        for item in data.items:

            requisition_item = RequisitionItem(
                requisition_id=requisition.id,
                description=item.description,
                quantity=item.quantity,
                unit=item.unit or "unit",
                estimated_rate=item.estimated_rate or 0,
            )

            db.add(requisition_item)

        db.commit()
        db.refresh(requisition)

        return requisition
