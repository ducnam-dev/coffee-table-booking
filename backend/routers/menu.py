import time
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from schemas import MenuItem, MenuItemCreate
from database import db
from middleware import require_role

router = APIRouter(prefix="/api/menu", tags=["menu"])

@router.get("", response_model=List[MenuItem])
def get_all_menu():
    return db.data.get("menu", [])

@router.get("/available", response_model=List[MenuItem])
def get_available_menu():
    menu = db.data.get("menu", [])
    return [m for m in menu if m.get("available", True)]

@router.get("/category/{cat_name}", response_model=List[MenuItem])
def get_menu_by_category(cat_name: str):
    menu = db.data.get("menu", [])
    return [m for m in menu if m.get("category", "").lower() == cat_name.lower()]

@router.post("", response_model=MenuItem)
def create_menu_item(item_data: MenuItemCreate, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    menu = db.data.get("menu", [])
    new_id = int(time.time() * 1000)
    new_item = {
        "id": new_id,
        "name": item_data.name,
        "category": item_data.category,
        "price": item_data.price,
        "description": item_data.description or "",
        "available": item_data.available
    }
    menu.append(new_item)
    db.save()
    return new_item

@router.put("/{item_id}", response_model=MenuItem)
def update_menu_item(item_id: int, item_data: MenuItemCreate, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    menu = db.data.get("menu", [])
    for m in menu:
        if m["id"] == item_id:
            m["name"] = item_data.name
            m["category"] = item_data.category
            m["price"] = item_data.price
            m["description"] = item_data.description or ""
            m["available"] = item_data.available
            db.save()
            return m
    raise HTTPException(status_code=404, detail="Menu item not found")

@router.delete("/{item_id}")
def delete_menu_item(item_id: int, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    menu = db.data.get("menu", [])
    initial_len = len(menu)
    db.data["menu"] = [m for m in menu if m["id"] != item_id]
    if len(db.data["menu"]) < initial_len:
        db.save()
        return {"message": "Menu item deleted successfully"}
    raise HTTPException(status_code=404, detail="Menu item not found")
