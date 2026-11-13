import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from schemas import CoffeeTable, CoffeeTableCreate, StatusUpdateRequest
from database import db
from middleware import require_role

router = APIRouter(prefix="/api/tables", tags=["tables"])

@router.get("", response_model=List[CoffeeTable])
def get_all_tables():
    return db.data.get("tables", [])

@router.get("/{table_id}", response_model=CoffeeTable)
def get_table_by_id(table_id: int):
    tables = db.data.get("tables", [])
    for t in tables:
        if t["id"] == table_id:
            return t
    raise HTTPException(status_code=404, detail="Table not found")

@router.get("/status/{status_val}", response_model=List[CoffeeTable])
def get_tables_by_status(status_val: str):
    tables = db.data.get("tables", [])
    return [t for t in tables if t.get("status", "").upper() == status_val.upper()]

@router.post("", response_model=CoffeeTable)
def create_table(table_data: CoffeeTableCreate, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    tables = db.data.get("tables", [])
    new_id = int(time.time() * 1000)
    new_table = {
        "id": new_id,
        "name": table_data.name,
        "seats": table_data.seats,
        "type": table_data.type,
        "status": table_data.status or "AVAILABLE",
        "isNearWindow": table_data.isNearWindow,
        "isOutdoor": table_data.isOutdoor,
        "hasSocket": table_data.hasSocket
    }
    tables.append(new_table)
    db.save()
    return new_table

@router.put("/{table_id}/status", response_model=CoffeeTable)
def update_table_status(
    table_id: int,
    status: Optional[str] = Query(None),
    body: Optional[StatusUpdateRequest] = None,
    current_user: dict = Depends(require_role("ROLE_MANAGER"))
):
    target_status = (body.status if body and body.status else status)
    if not target_status:
        raise HTTPException(status_code=400, detail="Thiếu trạng thái status")

    tables = db.data.get("tables", [])
    for t in tables:
        if t["id"] == table_id:
            t["status"] = target_status
            db.save()
            return t
    raise HTTPException(status_code=404, detail="Table not found")

@router.delete("/{table_id}")
def delete_table(table_id: int, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    tables = db.data.get("tables", [])
    initial_len = len(tables)
    db.data["tables"] = [t for t in tables if t["id"] != table_id]
    if len(db.data["tables"]) < initial_len:
        db.save()
        return {"message": "Table deleted successfully"}
    raise HTTPException(status_code=404, detail="Table not found")
