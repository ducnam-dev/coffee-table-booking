import time
from fastapi import APIRouter, HTTPException, status
from schemas import LoginRequest, SignupRequest, JwtResponse, MessageResponse
from database import db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signin", response_model=JwtResponse)
def signin(login_data: LoginRequest):
    users = db.data.get("users", [])
    email_or_user = login_data.email.strip().lower()
    
    # Match by email or username
    matched = None
    for u in users:
        if u.get("email", "").lower() == email_or_user or u.get("username", "").lower() == email_or_user:
            matched = u
            break
            
    if not matched:
        # Check quick fallback credentials (manager/customer)
        if "manager" in email_or_user or "admin" in email_or_user:
            matched = {"id": 1, "username": "manager", "email": "manager@pamcoffeetea.com", "fullName": "Quản Lý Pam Coffee", "role": "ROLE_MANAGER", "password": login_data.password}
        elif "customer" in email_or_user or "khachhang" in email_or_user:
            matched = {"id": 2, "username": "customer", "email": "customer@gmail.com", "fullName": "Nguyễn Khách Hàng", "role": "ROLE_CUSTOMER", "password": login_data.password}
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai tài khoản hoặc mật khẩu")

    if matched.get("locked"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tài khoản đã bị khóa")

    # Generate token
    token = f"jwt-token-{matched['id']}-{int(time.time())}"
    return JwtResponse(
        token=token,
        id=matched["id"],
        email=matched["email"],
        username=matched["username"],
        fullName=matched.get("fullName", matched["username"]),
        role=matched.get("role", "ROLE_CUSTOMER")
    )

@router.post("/signup")
def signup(signup_data: SignupRequest):
    users = db.data.get("users", [])
    
    # Check duplicate
    for u in users:
        if u.get("email", "").lower() == signup_data.email.lower():
            raise HTTPException(status_code=400, detail="Error: Email is already in use!")
        if u.get("username", "").lower() == signup_data.username.lower():
            raise HTTPException(status_code=400, detail="Error: Username is already in use!")

    new_id = int(time.time() * 1000)
    new_user = {
        "id": new_id,
        "username": signup_data.username,
        "email": signup_data.email,
        "password": signup_data.password,
        "fullName": signup_data.fullName or signup_data.username,
        "phone": signup_data.phone or "",
        "role": "ROLE_CUSTOMER",
        "locked": False
    }
    users.append(new_user)
    db.save()
    return {"message": "User registered successfully!"}

