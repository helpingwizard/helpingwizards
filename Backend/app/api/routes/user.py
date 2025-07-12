from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserOut, UserProfileUpdate
from app.schemas.dashboard import DashboardResponse
from app.dependencies.deps import get_db, get_current_user
from app.crud.user import update_user_profile
from app.models.item import Item

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/profile", response_model=UserOut)
def get_profile(current_user = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(updates: UserProfileUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return update_user_profile(db, current_user, updates)

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    user_items = db.query(Item).filter(Item.owner_id == current_user.id).all()
    return {
        "email": current_user.email,
        "points": current_user.points,
        "items": user_items
    }