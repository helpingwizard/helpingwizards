from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.deps import get_db
from app.dependencies.admin import require_admin
from app.crud import admin as crud_admin
from app.models.item import ItemStatus
from app.schemas.item import ItemOut
from app.schemas.user import UserOut
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/items/pending", response_model=List[ItemOut])
def get_pending_items(db: Session = Depends(get_db), admin = Depends(require_admin)):
    return crud_admin.get_pending_items(db)

@router.put("/items/{item_id}/approve", response_model=ItemOut)
def approve_item(item_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    item = crud_admin.update_item_status(db, item_id, ItemStatus.available)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/items/{item_id}/reject", response_model=ItemOut)
def reject_item(item_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    item = crud_admin.update_item_status(db, item_id, ItemStatus.rejected)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), admin = Depends(require_admin)):
    return crud_admin.get_all_users(db)