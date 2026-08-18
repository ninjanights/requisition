from sqlalchemy import (
    Column,
    Boolean,
    Text,
    Integer,
    String,
    ForeignKey,
    Numeric,
    DateTime,
    Enum as SQLEnum,
)

from pgvector.sqlalchemy import Vector


from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base
from enum import Enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Numeric,
    DateTime,
    Enum as SQLEnum,
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(20), nullable=False, default="PUBLIC")

    session_id = Column(
        String(64),
        unique=True,
        nullable=True,
    )
    session_expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )
    requisitions = relationship("Requisition", back_populates="requester")


class RequisitionStatus(str, Enum):
    DRAFT = "Draft"
    SUBMITTED = "Submitted"
    APPROVED = "Approved"
    REJECTED = "Rejected"


class Requisition(Base):
    __tablename__ = "requisitions"

    id = Column(Integer, primary_key=True)
    requisition_no = Column(String(50), unique=True, nullable=False)
    project_name = Column(String(255), nullable=False)
    requested_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    department = Column(String(100), nullable=False)
    status = Column(
        SQLEnum(
            RequisitionStatus,
            name="requisition_status",
            values_callable=lambda enum: [item.value for item in enum],
        ),
        nullable=False,
        default=RequisitionStatus.DRAFT,
    )

    is_embedded = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    requester = relationship("User", back_populates="requisitions")

    items = relationship(
        "RequisitionItem", back_populates="requisition", cascade="all, delete-orphan"
    )
    embedding = relationship(
        "RequisitionEmbedding",
        back_populates="requisition",
        uselist=False,
        cascade="all, delete-orphan",
    )


class RequisitionItem(Base):
    __tablename__ = "requisition_items"

    id = Column(Integer, primary_key=True)
    requisition_id = Column(Integer, ForeignKey("requisitions.id"), nullable=False)
    description = Column(String(500), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False)
    unit = Column(String(50), nullable=False)
    estimated_rate = Column(Numeric(12, 2), nullable=False)

    requisition = relationship("Requisition", back_populates="items")


# embeddings table
class RequisitionEmbedding(Base):
    __tablename__ = "requisition_embeddings"

    id = Column(Integer, primary_key=True)

    requisition_id = Column(
        Integer,
        ForeignKey("requisitions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    content = Column(Text, nullable=False)

    embedding = Column(Vector(1024), nullable=False)

    embedding_model = Column(
        String(100),
        nullable=False,
        default="jina-embeddings-v3",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    requisition = relationship(
        "Requisition",
        back_populates="embedding",
    )
