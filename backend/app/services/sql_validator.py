import sqlglot
from sqlglot import exp


class SQLValidationError(Exception):
    pass


class SQLValidator:

    ALLOWED_TABLES = {
        "users",
        "requisitions",
        "requisition_items",
    }

    FORBIDDEN_EXPRESSIONS = (
        exp.Insert,
        exp.Update,
        exp.Delete,
        exp.Drop,
        exp.Create,
        exp.Alter,
        exp.TruncateTable,
        exp.Merge,
    )

    @classmethod
    def validate(cls, sql: str) -> str:

        if not sql or not sql.strip():
            raise SQLValidationError("Generated SQL is empty.")

        sql = sql.strip()

        # Gemini must return exactly one query
        try:
            statements = sqlglot.parse(
                sql,
                read="postgres",
            )
        except Exception as exc:
            raise SQLValidationError("Generated SQL is invalid.") from exc

        if len(statements) != 1:
            raise SQLValidationError("Only one SQL statement is allowed.")

        statement = statements[0]

        # Only SELECT queries
        if not isinstance(statement, exp.Select):
            raise SQLValidationError("Only SELECT queries are allowed.")

        # Block dangerous SQL expressions
        for expression in statement.walk():
            if isinstance(
                expression,
                cls.FORBIDDEN_EXPRESSIONS,
            ):
                raise SQLValidationError("Only read-only SELECT queries are allowed.")

        # Validate tables
        for table in statement.find_all(exp.Table):

            table_name = table.name.lower()

            if table_name not in cls.ALLOWED_TABLES:
                raise SQLValidationError(f"Table '{table_name}' is not allowed.")

        return sql
