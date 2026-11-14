from typing import List, Optional, Any, Dict
from pydantic import BaseModel

# Auth Schemas
class LoginRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    fullName: Optional[str] = None
    phone: Optional[str] = None

class JwtResponse(BaseModel):
    token: str
    type: str = "Bearer"
    id: int
    email: str
    username: str
    fullName: str
    role: str

class MessageResponse(BaseModel):
    message: str

class StatusUpdateRequest(BaseModel):
    status: str

# Coffee Table Schemas
class CoffeeTableBase(BaseModel):
    name: str
    seats: int = 2
    type: str = "Phòng lạnh"
    status: str = "AVAILABLE"  # AVAILABLE, RESERVED, OCCUPIED
    isNearWindow: bool = False
    isOutdoor: bool = False
    hasSocket: bool = True
    tableNumber: Optional[str] = None
    capacity: Optional[int] = None
    area: Optional[str] = None
    description: Optional[str] = None
    hasPowerOutlet: Optional[bool] = None
    isWindowView: Optional[bool] = None

class CoffeeTableCreate(CoffeeTableBase):
    pass

class CoffeeTable(CoffeeTableBase):
    id: int

# Menu Item Schemas
class MenuItemBase(BaseModel):
    name: str
    category: str = "Trà Sữa"
    price: int = 20000
    description: Optional[str] = ""
    available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int

# Reservation Schemas
class OrderItem(BaseModel):
    menuItem: Optional[MenuItem] = None
    quantity: int = 1

class ReservationBase(BaseModel):
    customerName: Optional[str] = None
    customerPhone: Optional[str] = None
    phone: Optional[str] = None
    customerEmail: Optional[str] = None
    email: Optional[str] = None
    userId: Optional[int] = None
    coffeeTable: Optional[dict] = None
    tableId: Optional[int] = None
    tableNumber: Optional[str] = None
    reservationDate: Optional[str] = None
    reservationTime: Optional[str] = None
    timeDisplay: Optional[str] = None
    guestNumber: Optional[int] = 2
    guestCount: Optional[int] = 2
    note: Optional[str] = ""
    specialRequests: Optional[str] = ""
    status: str = "PENDING"  # PENDING, CONFIRMED, CANCELLED
    orderItems: Optional[List[dict]] = []
    totalAmount: Optional[int] = 0
    depositAmount: Optional[int] = 50000
    qrCode: Optional[str] = None
    createdAt: Optional[str] = None

class ReservationCreate(ReservationBase):
    pass

class Reservation(ReservationBase):
    id: int

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    fullName: Optional[str] = None
    phone: Optional[str] = None
    role: str = "ROLE_CUSTOMER"
    locked: bool = False

class UserCreate(UserBase):
    password: Optional[str] = "123456"

class User(UserBase):
    id: int

# ── Tracking & Favorites Schemas ────────────────────────────────────────────

class TrackingEvent(BaseModel):
    userId: int
    menuItemId: int
    action: str  # "view", "order", "favorite", "unfavorite"

class FavoriteItem(BaseModel):
    userId: int
    menuItemId: int
    timestamp: Optional[int] = None

class RecommendationResponse(BaseModel):
    personalRecommendations: List[Dict[str, Any]] = []
    trendingItems: List[Dict[str, Any]] = []
    reason: str = ""

class ProductAnalytics(BaseModel):
    mostFavorited: List[Dict[str, Any]] = []
    mostViewed: List[Dict[str, Any]] = []
    mostOrdered: List[Dict[str, Any]] = []
    totalEvents: int = 0

# Promotion Schemas
class PromotionBase(BaseModel):
    code: str
    title: str
    description: Optional[str] = ""
    discountPercent: int = 10
    maxDiscount: Optional[int] = 50000
    minOrderValue: Optional[int] = 0
    validUntil: Optional[str] = "2026-12-31"
    isActive: bool = True

class PromotionCreate(PromotionBase):
    pass

class Promotion(PromotionBase):
    id: int
