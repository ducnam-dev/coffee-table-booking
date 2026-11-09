import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from schemas import Reservation, ReservationCreate, StatusUpdateRequest
from database import db
from middleware import get_current_user, require_role

router = APIRouter(prefix="/api/reservations", tags=["reservations"])

@router.get("", response_model=List[Reservation])
def get_all_reservations(current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    return db.data.get("reservations", [])

@router.get("/user/{user_id}", response_model=List[Reservation])
def get_reservations_by_user(user_id: int, current_user: dict = Depends(get_current_user)):
    """User can only view their own reservations; MANAGER can view any user's."""
    if current_user.get("role") != "ROLE_MANAGER" and current_user.get("id") != user_id:
        raise HTTPException(status_code=403, detail="Bạn chỉ có thể xem đơn đặt bàn của mình")
    reservations = db.data.get("reservations", [])
    return [r for r in reservations if r.get("userId") == user_id]

@router.post("", response_model=Reservation)
def create_reservation(res_data: ReservationCreate):
    reservations = db.data.get("reservations", [])
    tables = db.data.get("tables", [])

    new_id = int(time.time() * 1000)
    new_reservation = {
        "id": new_id,
        "customerName": res_data.customerName or "Khách hàng",
        "customerPhone": res_data.customerPhone or "",
        "customerEmail": res_data.customerEmail or "",
        "userId": res_data.userId or 2,
        "coffeeTable": res_data.coffeeTable or {},
        "reservationTime": res_data.reservationTime,
        "timeDisplay": res_data.timeDisplay or "Hôm nay",
        "guestNumber": res_data.guestNumber,
        "note": res_data.note or "",
        "status": res_data.status or "PENDING",
        "orderItems": res_data.orderItems or []
    }
    reservations.insert(0, new_reservation)

    # Update table status to RESERVED if table selected
    table_id = res_data.coffeeTable.get("id") if res_data.coffeeTable else None
    if table_id:
        for t in tables:
            if t["id"] == table_id:
                t["status"] = "RESERVED"
                break

    db.save()
    return new_reservation

@router.put("/{res_id}/status", response_model=Reservation)
def update_reservation_status(
    res_id: int,
    status: Optional[str] = Query(None),
    body: Optional[StatusUpdateRequest] = None,
    current_user: dict = Depends(require_role("ROLE_MANAGER"))
):
    target_status = (body.status if body and body.status else status)
    if not target_status:
        raise HTTPException(status_code=400, detail="Thiếu trạng thái status")

    reservations = db.data.get("reservations", [])
    tables = db.data.get("tables", [])

    for r in reservations:
        if r["id"] == res_id:
            r["status"] = target_status

            # If confirmed or cancelled, reflect on table
            table_id = r.get("coffeeTable", {}).get("id")
            if table_id:
                for t in tables:
                    if t["id"] == table_id:
                        if target_status == "CANCELLED":
                            t["status"] = "AVAILABLE"
                        elif target_status == "CONFIRMED":
                            t["status"] = "OCCUPIED"
                        break

            db.save()
            return r

    raise HTTPException(status_code=404, detail="Reservation not found")
