import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from schemas import User, UserCreate
from database import db
from middleware import require_role

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("", response_model=List[User])
def get_all_users(
    search: Optional[str] = None,
    role: Optional[str] = None,
    locked: Optional[bool] = None,
    current_user: dict = Depends(require_role("ROLE_MANAGER"))
):
    users = db.data.get("users", [])
    result = users

    if search:
        q = search.lower()
        result = [
            u for u in result
            if (u.get("fullName") and q in u["fullName"].lower()) or
               (u.get("username") and q in u["username"].lower()) or
               (u.get("email") and q in u["email"].lower())
        ]

    if role:
        result = [u for u in result if u.get("role", "").lower() == role.lower()]

    if locked is not None:
        result = [u for u in result if u.get("locked") == locked]

    return result

@router.post("", response_model=User)
def create_user(user_data: UserCreate):
    users = db.data.get("users", [])

    for u in users:
        if u.get("email", "").lower() == user_data.email.lower():
            raise HTTPException(status_code=400, detail="Error: Email is already in use!")
        if u.get("username", "").lower() == user_data.username.lower():
            raise HTTPException(status_code=400, detail="Error: Username is already in use!")

    new_id = int(time.time() * 1000)
    new_user = {
        "id": new_id,
        "username": user_data.username,
        "email": user_data.email,
        "password": user_data.password or "123456",
        "fullName": user_data.fullName or user_data.username,
        "phone": user_data.phone or "",
        "role": user_data.role or "ROLE_CUSTOMER",
        "locked": user_data.locked
    }
    users.insert(0, new_user)
    db.save()
    return new_user

@router.put("/{user_id}/lock", response_model=User)
def lock_unlock_user(user_id: int, lock: bool = Query(...), current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    users = db.data.get("users", [])
    for u in users:
        if u["id"] == user_id:
            u["locked"] = lock
            db.save()
            return u
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/{user_id}/role", response_model=User)
def update_user_role(user_id: int, role: str = Query(...), current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    """MANAGER changes another user's role."""
    if role not in ("ROLE_MANAGER", "ROLE_CUSTOMER"):
        raise HTTPException(status_code=400, detail="Role không hợp lệ. Chỉ chấp nhận ROLE_MANAGER hoặc ROLE_CUSTOMER")
    users = db.data.get("users", [])
    for u in users:
        if u["id"] == user_id:
            u["role"] = role
            db.save()
            return u
    raise HTTPException(status_code=404, detail="User not found")

@router.delete("/{user_id}")
def delete_user(user_id: int, current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    """MANAGER deletes a user."""
    users = db.data.get("users", [])
    initial_len = len(users)
    db.data["users"] = [u for u in users if u["id"] != user_id]
    if len(db.data["users"]) < initial_len:
        db.save()
        return {"message": "User deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")
