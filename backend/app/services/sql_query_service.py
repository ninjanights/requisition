from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.sql_validator import SQLValidator


class SQLQueryService:

    def __init__(self, db: Session):
        self.db = db

    def execute(self, sql: str):

        validated_sql = SQLValidator.validate(sql)

        result = self.db.execute(text(validated_sql))

        return [dict(row._mapping) for row in result]
