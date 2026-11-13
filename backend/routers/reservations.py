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
    customer_phone = res_data.phone or res_data.customerPhone or ""
    customer_email = res_data.email or res_data.customerEmail or ""
    guest_count = res_data.guestCount or res_data.guestNumber or 2
    note = res_data.specialRequests or res_data.note or ""
    table_id = res_data.tableId or (res_data.coffeeTable.get("id") if res_data.coffeeTable else None)

    # Update table status to RESERVED if table selected
    matched_table = None
    if table_id:
        for t in tables:
            if t["id"] == table_id:
                matched_table = t
                t["status"] = "RESERVED"
                break

    table_num = res_data.tableNumber or (matched_table.get("tableNumber") if matched_table else (f"B0{table_id}" if table_id else "B01"))
    today_str = time.strftime("%Y-%m-%d")
    res_date = res_data.reservationDate or today_str
    qr_code = res_data.qrCode or f"PAM-RES-{new_id % 10000:04d}"

    new_reservation = {
        "id": new_id,
        "customerName": res_data.customerName or "Khách hàng",
        "customerPhone": customer_phone,
        "phone": customer_phone,
        "customerEmail": customer_email,
        "email": customer_email,
        "userId": res_data.userId or 2,
        "tableId": table_id or 1,
        "tableNumber": table_num,
        "coffeeTable": matched_table or {"id": table_id, "name": f"Bàn {table_num}"},
        "reservationDate": res_date,
        "reservationTime": res_data.reservationTime or "09:00",
        "timeDisplay": f"{res_data.reservationTime or '09:00'} - {res_date}",
        "guestNumber": guest_count,
        "guestCount": guest_count,
        "note": note,
        "specialRequests": note,
        "status": res_data.status or "PENDING",
        "orderItems": res_data.orderItems or [],
        "totalAmount": res_data.totalAmount or 0,
        "depositAmount": res_data.depositAmount or 50000,
        "qrCode": qr_code,
        "createdAt": time.strftime("%Y-%m-%d %H:%M")
    }
    reservations.insert(0, new_reservation)
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
