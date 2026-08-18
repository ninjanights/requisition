from sqlalchemy.orm import Session

from app.db.models import (
    Requisition,
    RequisitionEmbedding,
)


class SearchService:

    def __init__(self, db: Session):
        self.db = db

    def search(
        self,
        query_embedding: list[float],
        limit: int = 5,
    ):
        return (
            self.db.query(RequisitionEmbedding)
            .join(
                Requisition,
                Requisition.id == RequisitionEmbedding.requisition_id,
            )
            .filter(
                Requisition.is_embedded == True,
            )
            .order_by(RequisitionEmbedding.embedding.cosine_distance(query_embedding))
            .limit(limit)
            .all()
        )
