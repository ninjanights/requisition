"""add requisition embeddings

Revision ID: 5701ab38fdc6
Revises: f87a8dfa50a1
Create Date: 2026-08-18 05:49:43.356569

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision: str = "5701ab38fdc6"
down_revision: Union[str, Sequence[str], None] = "f87a8dfa50a1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Enable PostgreSQL pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Create requisition_embeddings table
    op.create_table(
        "requisition_embeddings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "requisition_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "content",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "embedding",
            Vector(1024),
            nullable=False,
        ),
        sa.Column(
            "embedding_model",
            sa.String(length=100),
            nullable=False,
            server_default="jina-embeddings-v3",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["requisition_id"],
            ["requisitions.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("requisition_id"),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_table("requisition_embeddings")