from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from database import db

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AIRecommendRequest(BaseModel):
    purpose: Optional[str] = "làm việc"  # làm việc, hẹn hò, học nhóm, gia đình, thư giãn
    guestCount: Optional[int] = 2
    preference: Optional[str] = "yên tĩnh"  # yên tĩnh, thoáng mát, gần cửa sổ, có ổ cắm
    budget: Optional[int] = 100000

class AIRecommendResponse(BaseModel):
    aiMessage: str
    recommendedTable: dict
    recommendedDrinks: List[dict]
    suitabilityScore: int

@router.post("/recommend", response_model=AIRecommendResponse)
def get_ai_recommendation(req: AIRecommendRequest):
    tables = db.data.get("tables", [])
    menu = db.data.get("menu", [])

    purpose = (req.purpose or "").lower()
    guest_count = req.guestCount or 2

    # AI Heuristic matching
    best_table = None
    if "làm việc" in purpose or "học" in purpose:
        # Find table with socket in cold room or mezzanine
        for t in tables:
            if t.get("hasSocket") and t.get("status") == "AVAILABLE":
                best_table = t
                break
        ai_message = (
            f"🤖 Pam AI gợi ý: Dựa trên nhu cầu '{req.purpose}' cho {guest_count} người, "
            f"tôi đã chọn bàn có ổ cắm điện đầy đủ và không gian điều hòa yên tĩnh để bạn tập trung làm việc hiệu quả nhất!"
        )
    elif "hẹn hò" in purpose or "cặp đôi" in purpose:
        for t in tables:
            if t.get("isNearWindow") and t.get("status") == "AVAILABLE":
                best_table = t
                break
        ai_message = (
            f"🤖 Pam AI gợi ý: Góc bàn cạnh cửa sổ kính lung linh ánh đèn là sự lựa chọn hoàn hảo "
            f"cho buổi hẹn lãng mạn của hai bạn!"
        )
    elif "sân vườn" in purpose or "thoáng" in purpose:
        for t in tables:
            if t.get("isOutdoor") and t.get("status") == "AVAILABLE":
                best_table = t
                break
        ai_message = (
            f"🤖 Pam AI gợi ý: Không gian sân vườn xanh mát ngoài trời giúp bạn thư giãn và hít thở không khí tự nhiên trong lành."
        )
    else:
        # Match by seats
        for t in tables:
            if t.get("seats", 2) >= guest_count and t.get("status") == "AVAILABLE":
                best_table = t
                break
        ai_message = f"🤖 Pam AI gợi ý: Vị trí bàn phù hợp nhất cho nhóm {guest_count} khách."

    if not best_table:
        best_table = tables[0] if tables else {"id": 1, "name": "Bàn 01 (Cửa sổ)", "seats": 2, "type": "Phòng lạnh"}

    # Recommend 2-3 signature drinks
    recommended_drinks = menu[:3] if len(menu) >= 3 else menu

    return AIRecommendResponse(
        aiMessage=ai_message,
        recommendedTable=best_table,
        recommendedDrinks=recommended_drinks,
        suitabilityScore=98
    )

