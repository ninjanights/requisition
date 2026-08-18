from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Requisition
from app.services.jina_service import JinaEmbeddingService
from app.core.security import get_current_admin
from app.db.models import User
from app.db.models import RequisitionEmbedding

router = APIRouter(
    prefix="/api/embeddings",
    tags=["Embeddings"],
)


# 1. embedd all


# embed all
@router.post("/rebuild-all")
async def rebuild_all_embeddings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    # Get every requisition
    requisitions = db.query(Requisition).all()

    if not requisitions:
        return {
            "message": "No requisitions found",
            "total": 0,
            "embedded": 0,
        }

    jina = JinaEmbeddingService()

    embedded_count = 0

    for requisition in requisitions:

        # Build the complete text representation
        content = f"""
Requisition Number: {requisition.requisition_no}
Project: {requisition.project_name}
Department: {requisition.department}
Status: {requisition.status.value}

Items:
"""

        for item in requisition.items:
            content += f"""
- Description: {item.description}
  Quantity: {item.quantity}
  Unit: {item.unit}
  Estimated Rate: {item.estimated_rate}
"""

        # Generate fresh embedding
        embedding_vector = await jina.generate_embedding(content)

        # Update existing embedding
        if requisition.embedding:

            requisition.embedding.content = content
            requisition.embedding.embedding = embedding_vector
            requisition.embedding.embedding_model = "jina-embeddings-v3"

        # Create embedding if it doesn't exist
        else:

            embedding = RequisitionEmbedding(
                requisition_id=requisition.id,
                content=content,
                embedding=embedding_vector,
                embedding_model="jina-embeddings-v3",
            )

            db.add(embedding)

        # Mark as embedded
        requisition.is_embedded = True

        embedded_count += 1

    db.commit()

    return {
        "message": "All requisitions embedded successfully",
        "total": len(requisitions),
        "embedded": embedded_count,
    }


# embed with requisition id
@router.post("/{requisition_id}")
async def generate_embedding(
    requisition_id: int,
    db: Session = Depends(get_db),
):
    # 1. Get requisition
    requisition = db.query(Requisition).filter(Requisition.id == requisition_id).first()

    if not requisition:
        raise HTTPException(
            status_code=404,
            detail="Requisition not found",
        )

    # 2. Build text that will be embedded
    content = f"""
Requisition Number: {requisition.requisition_no}
Project: {requisition.project_name}
Department: {requisition.department}
Status: {requisition.status.value}

Items:
"""

    for item in requisition.items:
        content += f"""
- Description: {item.description}
  Quantity: {item.quantity}
  Unit: {item.unit}
  Estimated Rate: {item.estimated_rate}
"""

    # 3. Generate embedding using Jina
    jina = JinaEmbeddingService()

    embedding_vector = await jina.generate_embedding(content)

    # 4. Save / update embedding
    if requisition.embedding:
        requisition.embedding.content = content
        requisition.embedding.embedding = embedding_vector
        requisition.embedding.embedding_model = "jina-embeddings-v3"
    else:
        from app.db.models import RequisitionEmbedding

        embedding = RequisitionEmbedding(
            requisition_id=requisition.id,
            content=content,
            embedding=embedding_vector,
            embedding_model="jina-embeddings-v3",
        )

        db.add(embedding)

    # 5. Mark requisition as embedded
    requisition.is_embedded = True

    db.commit()

    return {
        "message": "Requisition embedded successfully",
        "requisition_id": requisition.id,
        "is_embedded": requisition.is_embedded,
    }
