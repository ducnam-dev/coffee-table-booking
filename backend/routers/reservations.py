import time
from typing import List
from fastapi import APIRouter, HTTPException, Query
from schemas import Reservation, ReservationCreate
from database import db

router = APIRouter(prefix="/api/reservations", tags=["reservations"])

@router.get("", response_model=List[Reservation])
def get_all_reservations():
    return db.data.get("reservations", [])

@router.get("/user/{user_id}", response_model=List[Reservation])
def get_reservations_by_user(user_id: int):
    reservations = db.data.get("reservations", [])
    # Return user's reservations or all if test user
    matched = [r for r in reservations if r.get("userId") == user_id]
    return matched if matched else reservations

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
def update_reservation_status(res_id: int, status: str = Query(...)):
    reservations = db.data.get("reservations", [])
    tables = db.data.get("tables", [])
    
    for r in reservations:
        if r["id"] == res_id:
            r["status"] = status
            
            # If confirmed or cancelled, reflect on table
            table_id = r.get("coffeeTable", {}).get("id")
            if table_id:
                for t in tables:
                    if t["id"] == table_id:
                        if status == "CANCELLED":
                            t["status"] = "AVAILABLE"
                        elif status == "CONFIRMED":
                            t["status"] = "OCCUPIED"
                        break
                        
            db.save()
            return r
            
    raise HTTPException(status_code=404, detail="Reservation not found")

