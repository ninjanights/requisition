"""add requisition status enum

Revision ID: 8f48e9e2ee33
Revises: b3f805cecbce
Create Date: 2026-08-16 14:57:39.857534

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "8f48e9e2ee33"
down_revision: Union[str, Sequence[str], None] = "b3f805cecbce"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


requisition_status_enum = postgresql.ENUM(
    "Draft",
    "Submitted",
    "Approved",
    "Rejected",
    name="requisition_status",
)


def upgrade() -> None:
    # Create the PostgreSQL enum type
    requisition_status_enum.create(
        op.get_bind(),
        checkfirst=True,
    )

    # Convert the existing VARCHAR column to the enum
    op.alter_column(
        "requisitions",
        "status",
        existing_type=sa.VARCHAR(length=20),
        type_=requisition_status_enum,
        existing_nullable=False,
        postgresql_using="status::requisition_status",
    )


def downgrade() -> None:
    # Convert enum back to VARCHAR
    op.alter_column(
        "requisitions",
        "status",
        existing_type=requisition_status_enum,
        type_=sa.VARCHAR(length=20),
        existing_nullable=False,
        postgresql_using="status::text",
    )

    # Remove the PostgreSQL enum type
    requisition_status_enum.drop(
        op.get_bind(),
        checkfirst=True,
    )
