import time
from typing import List, Optional
from collections import Counter
from fastapi import APIRouter, HTTPException, Depends
from schemas import TrackingEvent, FavoriteItem, RecommendationResponse, ProductAnalytics
from database import db
from middleware import get_current_user, require_role

router = APIRouter(prefix="/api/tracking", tags=["tracking"])


# ── Event tracking ──────────────────────────────────────────────────────────

@router.post("/event")
def track_event(event: TrackingEvent):
    """Record a user behaviour event (view / order / favorite / unfavorite)."""
    if event.action not in ("view", "order", "favorite", "unfavorite"):
        raise HTTPException(status_code=400, detail="Action phải là: view, order, favorite, unfavorite")

    tracking = db.data.setdefault("user_tracking", [])
    entry = {
        "userId": event.userId,
        "menuItemId": event.menuItemId,
        "action": event.action,
        "timestamp": int(time.time() * 1000)
    }
    tracking.append(entry)

    # Auto-sync favorites list
    favorites = db.data.setdefault("user_favorites", [])
    if event.action == "favorite":
        already = any(
            f["userId"] == event.userId and f["menuItemId"] == event.menuItemId
            for f in favorites
        )
        if not already:
            favorites.append({
                "userId": event.userId,
                "menuItemId": event.menuItemId,
                "timestamp": int(time.time() * 1000)
            })
    elif event.action == "unfavorite":
        db.data["user_favorites"] = [
            f for f in favorites
            if not (f["userId"] == event.userId and f["menuItemId"] == event.menuItemId)
        ]

    db.save()
    return {"message": "Event tracked successfully", "event": entry}


# ── Favorites CRUD ──────────────────────────────────────────────────────────

@router.get("/favorites/{user_id}", response_model=List[FavoriteItem])
def get_favorites(user_id: int):
    favorites = db.data.get("user_favorites", [])
    return [f for f in favorites if f["userId"] == user_id]


@router.post("/favorites/{user_id}/{menu_item_id}")
def add_favorite(user_id: int, menu_item_id: int):
    favorites = db.data.setdefault("user_favorites", [])
    already = any(
        f["userId"] == user_id and f["menuItemId"] == menu_item_id
        for f in favorites
    )
    if already:
        raise HTTPException(status_code=400, detail="Đã có trong danh sách yêu thích")

    fav = {"userId": user_id, "menuItemId": menu_item_id, "timestamp": int(time.time() * 1000)}
    favorites.append(fav)

    # Also record tracking event
    db.data.setdefault("user_tracking", []).append({
        "userId": user_id,
        "menuItemId": menu_item_id,
        "action": "favorite",
        "timestamp": int(time.time() * 1000)
    })

    db.save()
    return {"message": "Added to favorites", "favorite": fav}


@router.delete("/favorites/{user_id}/{menu_item_id}")
def remove_favorite(user_id: int, menu_item_id: int):
    favorites = db.data.get("user_favorites", [])
    new_favs = [f for f in favorites if not (f["userId"] == user_id and f["menuItemId"] == menu_item_id)]
    if len(new_favs) == len(favorites):
        raise HTTPException(status_code=404, detail="Không tìm thấy trong danh sách yêu thích")
    db.data["user_favorites"] = new_favs

    # Also record tracking event
    db.data.setdefault("user_tracking", []).append({
        "userId": user_id,
        "menuItemId": menu_item_id,
        "action": "unfavorite",
        "timestamp": int(time.time() * 1000)
    })

    db.save()
    return {"message": "Removed from favorites"}


# ── Recommendations ─────────────────────────────────────────────────────────

def _get_menu_item(item_id: int) -> Optional[dict]:
    for m in db.data.get("menu", []):
        if m["id"] == item_id:
            return m
    return None


@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: int):
    tracking = db.data.get("user_tracking", [])
    menu = db.data.get("menu", [])
    available_menu = [m for m in menu if m.get("available", True)]

    user_events = [e for e in tracking if e["userId"] == user_id]

    # ── New user: no tracking data ──
    if not user_events:
        # Recommend most popular available items across all users
        all_order_counts = Counter(
            e["menuItemId"] for e in tracking if e["action"] == "order"
        )
        popular = sorted(available_menu, key=lambda m: all_order_counts.get(m["id"], 0), reverse=True)
        return {
            "personalRecommendations": popular[:5],
            "trendingItems": popular[:5],
            "reason": "Bạn là khách hàng mới – đây là các sản phẩm phổ biến nhất!"
        }

    # ── Personal: favourited / ordered most → same category ──
    fav_order_counts = Counter(
        e["menuItemId"] for e in user_events if e["action"] in ("favorite", "order")
    )
    top_item_ids = [item_id for item_id, _ in fav_order_counts.most_common(5)]
    top_categories = set()
    for item_id in top_item_ids:
        item = _get_menu_item(item_id)
        if item:
            top_categories.add(item["category"])

    personal = [
        m for m in available_menu
        if m["category"] in top_categories and m["id"] not in top_item_ids
    ][:10]

    # ── Trending: most ordered by everyone ──
    all_order_counts = Counter(
        e["menuItemId"] for e in tracking if e["action"] == "order"
    )
    trending_ids = [item_id for item_id, _ in all_order_counts.most_common(10)]
    trending = [m for m in available_menu if m["id"] in trending_ids]
    # Sort by order count descending
    trending.sort(key=lambda m: all_order_counts.get(m["id"], 0), reverse=True)
    trending = trending[:5]

    return {
        "personalRecommendations": personal,
        "trendingItems": trending,
        "reason": "Gợi ý dựa trên sản phẩm bạn yêu thích và xu hướng hiện tại"
    }


# ── Analytics (MANAGER only) ───────────────────────────────────────────────

@router.get("/analytics/products")
def product_analytics(current_user: dict = Depends(require_role("ROLE_MANAGER"))):
    tracking = db.data.get("user_tracking", [])

    fav_counts = Counter(e["menuItemId"] for e in tracking if e["action"] == "favorite")
    view_counts = Counter(e["menuItemId"] for e in tracking if e["action"] == "view")
    order_counts = Counter(e["menuItemId"] for e in tracking if e["action"] == "order")

    def _top_items(counter: Counter, limit: int = 10) -> list:
        result = []
        for item_id, count in counter.most_common(limit):
            item = _get_menu_item(item_id)
            if item:
                result.append({**item, "count": count})
        return result

    return {
        "mostFavorited": _top_items(fav_counts),
        "mostViewed": _top_items(view_counts),
        "mostOrdered": _top_items(order_counts),
        "totalEvents": len(tracking)
    }


@router.get("/analytics/users/{user_id}")
def user_analytics(user_id: int, current_user: dict = Depends(get_current_user)):
    """User can view own analytics; MANAGER can view anyone's."""
    if current_user.get("role") != "ROLE_MANAGER" and current_user.get("id") != user_id:
        raise HTTPException(status_code=403, detail="Bạn chỉ có thể xem thống kê của mình")

    tracking = db.data.get("user_tracking", [])
    user_events = [e for e in tracking if e["userId"] == user_id]
    favorites = db.data.get("user_favorites", [])
    user_favs = [f for f in favorites if f["userId"] == user_id]

    action_counts = Counter(e["action"] for e in user_events)
    top_items = Counter(e["menuItemId"] for e in user_events if e["action"] in ("order", "favorite"))

    top_items_detail = []
    for item_id, count in top_items.most_common(10):
        item = _get_menu_item(item_id)
        if item:
            top_items_detail.append({**item, "interactionCount": count})

    return {
        "userId": user_id,
        "totalEvents": len(user_events),
        "actionBreakdown": dict(action_counts),
        "totalFavorites": len(user_favs),
        "topItems": top_items_detail,
        "favoriteItems": [_get_menu_item(f["menuItemId"]) for f in user_favs if _get_menu_item(f["menuItemId"])]
    }
