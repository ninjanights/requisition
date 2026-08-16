"""add requisition json function

Revision ID: 21f745d04ceb
Revises: 8f48e9e2ee33
Create Date: 2026-08-16 15:54:25.657850

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "21f745d04ceb"
down_revision: Union[str, Sequence[str], None] = "8f48e9e2ee33"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
    CREATE OR REPLACE FUNCTION usp_get_requisition(
        p_requisition_id INTEGER
    )
    RETURNS JSON
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN (
            SELECT json_build_object(
                'requisitionNo', r.requisition_no,
                'project', r.project_name,
                'requestedBy', r.requested_by,
                'department', r.department,
                'status', r.status,
                'createdDate', r.created_at,
                'items',
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'description', ri.description,
                                'qty', ri.quantity,
                                'unit', ri.unit,
                                'rate', ri.estimated_rate,
                                'total',
                                    ri.quantity * ri.estimated_rate
                            )
                        )
                        FROM requisition_items ri
                        WHERE ri.requisition_id = r.id
                    ),
                    '[]'::json
                )
            )
            FROM requisitions r
            WHERE r.id = p_requisition_id
        );
    END;
    $$;
    """)


def downgrade() -> None:
    op.execute("""
        DROP FUNCTION IF EXISTS usp_get_requisition(INTEGER);
    """)
