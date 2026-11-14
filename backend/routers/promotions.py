import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from schemas import Promotion, PromotionCreate
from database import db
from middleware import require_role

router = APIRouter(prefix="/api/promotions", tags=["promotions"])

@router.get("", response_model=List[Promotion])
def get_all_promotions():
    return db.data.get("promotions", [])

@router.get("/active", response_model=List[Promotion])
def get_active_promotions():
    promos = db.data.get("promotions", [])
    return [p for p in promos if p.get("isActive", True)]

@router.post("", response_model=Promotion)
def create_promotion(data: PromotionCreate, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    promos = db.data.setdefault("promotions", [])
    code = data.code.strip().upper()
    for p in promos:
        if p.get("code", "").upper() == code:
            raise HTTPException(status_code=400, detail="Mã khuyến mãi đã tồn tại!")

    new_id = int(time.time() * 1000)
    new_promo = {
        "id": new_id,
        "code": code,
        "title": data.title,
        "description": data.description or "",
        "discountPercent": data.discountPercent,
        "maxDiscount": data.maxDiscount,
        "minOrderValue": data.minOrderValue,
        "validUntil": data.validUntil or "2026-12-31",
        "isActive": data.isActive
    }
    promos.insert(0, new_promo)
    db.save()
    return new_promo

@router.put("/{promo_id}", response_model=Promotion)
def update_promotion(promo_id: int, data: PromotionCreate, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    promos = db.data.setdefault("promotions", [])
    for p in promos:
        if p["id"] == promo_id:
            p["code"] = data.code.strip().upper()
            p["title"] = data.title
            p["description"] = data.description or ""
            p["discountPercent"] = data.discountPercent
            p["maxDiscount"] = data.maxDiscount
            p["minOrderValue"] = data.minOrderValue
            p["validUntil"] = data.validUntil or p.get("validUntil", "2026-12-31")
            p["isActive"] = data.isActive
            db.save()
            return p
    raise HTTPException(status_code=404, detail="Promotion not found")

@router.put("/{promo_id}/toggle", response_model=Promotion)
def toggle_promotion(promo_id: int, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    promos = db.data.setdefault("promotions", [])
    for p in promos:
        if p["id"] == promo_id:
            p["isActive"] = not p.get("isActive", True)
            db.save()
            return p
    raise HTTPException(status_code=404, detail="Promotion not found")

@router.delete("/{promo_id}")
def delete_promotion(promo_id: int, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    promos = db.data.setdefault("promotions", [])
    initial_len = len(promos)
    db.data["promotions"] = [p for p in promos if p["id"] != promo_id]
    if len(db.data["promotions"]) < initial_len:
        db.save()
        return {"message": "Xóa khuyến mãi thành công"}
    raise HTTPException(status_code=404, detail="Promotion not found")
