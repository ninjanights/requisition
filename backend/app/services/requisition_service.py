from typing import Any


class RequisitionService:
    def __init__(self) -> None:
        self._items: list[dict[str, Any]] = []

    def list_requisitions(self) -> list[dict[str, Any]]:
        return self._items

    def create_requisition(self, data: dict[str, Any]) -> dict[str, Any]:
        item = {"id": len(self._items) + 1, **data}
        self._items.append(item)
        return item
