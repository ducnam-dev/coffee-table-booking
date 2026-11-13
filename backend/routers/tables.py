import time
import re
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from schemas import CoffeeTable, CoffeeTableCreate, StatusUpdateRequest
from database import db
from middleware import require_role

router = APIRouter(prefix="/api/tables", tags=["tables"])

def _enrich_table(t: dict) -> dict:
    enriched = dict(t)
    if not enriched.get("tableNumber"):
        m = re.search(r'(\d+)', enriched.get("name", ""))
        num = int(m.group(1)) if m else enriched.get("id", 1)
        enriched["tableNumber"] = f"B{num:02d}"
    if not enriched.get("capacity"):
        enriched["capacity"] = enriched.get("seats", 4)
    if not enriched.get("area"):
        ttype = (enriched.get("type") or "").lower()
        if "sân vườn" in ttype or enriched.get("isOutdoor"):
            enriched["area"] = "OUTDOOR"
        elif "vip" in ttype:
            enriched["area"] = "VIP"
        elif "gác" in ttype or "cửa sổ" in ttype or "ban công" in ttype:
            enriched["area"] = "BALCONY"
        else:
            enriched["area"] = "INDOOR"
    if not enriched.get("description"):
        enriched["description"] = f"{enriched.get('name', 'Bàn quán')} - Không gian thoáng mát, ấm cúng"
    if enriched.get("hasPowerOutlet") is None:
        enriched["hasPowerOutlet"] = enriched.get("hasSocket", True)
    if enriched.get("isWindowView") is None:
        enriched["isWindowView"] = enriched.get("isNearWindow", False)
    return enriched

@router.get("", response_model=List[CoffeeTable])
def get_all_tables():
    tables = db.data.get("tables", [])
    return [_enrich_table(t) for t in tables]

@router.get("/{table_id}", response_model=CoffeeTable)
def get_table_by_id(table_id: int):
    tables = db.data.get("tables", [])
    for t in tables:
        if t["id"] == table_id:
            return _enrich_table(t)
    raise HTTPException(status_code=404, detail="Table not found")

@router.get("/status/{status_val}", response_model=List[CoffeeTable])
def get_tables_by_status(status_val: str):
    tables = db.data.get("tables", [])
    return [_enrich_table(t) for t in tables if t.get("status", "").upper() == status_val.upper()]

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
        "hasSocket": table_data.hasSocket,
        "tableNumber": table_data.tableNumber or f"B{len(tables)+1:02d}",
        "capacity": table_data.capacity or table_data.seats,
        "area": table_data.area or "INDOOR",
        "description": table_data.description or f"{table_data.name} - Không gian mới",
        "hasPowerOutlet": table_data.hasPowerOutlet if table_data.hasPowerOutlet is not None else table_data.hasSocket,
        "isWindowView": table_data.isWindowView if table_data.isWindowView is not None else table_data.isNearWindow
    }
    tables.append(new_table)
    db.save()
    return _enrich_table(new_table)

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
            return _enrich_table(t)
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
