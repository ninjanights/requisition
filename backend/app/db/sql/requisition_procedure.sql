CREATE OR REPLACE FUNCTION usp_get_requisition(p_requisition_id INTEGER)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
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
    INTO result
    FROM requisitions r
    WHERE r.id = p_requisition_id;

    RETURN result;
END;
$$;