from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.deps import get_db
from app.dependencies.admin import require_admin
from app.crud import admin as crud_admin
from app.models.item import ItemStatus
from app.schemas.item import ItemOut
from app.schemas.user import UserOut
from typing import List, Dict, Any

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats", response_model=Dict[str, Any])
def get_admin_stats(db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Get admin dashboard statistics"""
    return crud_admin.get_admin_stats(db)

@router.get("/items", response_model=List[ItemOut])
def get_all_items(db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Get all items for admin review"""
    return crud_admin.get_all_items(db)

@router.get("/items/pending", response_model=List[ItemOut])
def get_pending_items(db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Get items pending approval"""
    return crud_admin.get_pending_items(db)

@router.get("/items/status/{status}", response_model=List[ItemOut])
def get_items_by_status(status: ItemStatus, db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Get items by status"""
    return crud_admin.get_items_by_status(db, status)

@router.put("/items/{item_id}/approve", response_model=ItemOut)
def approve_item(item_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Approve an item listing"""
    item = crud_admin.update_item_status(db, item_id, ItemStatus.available)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/items/{item_id}/reject", response_model=ItemOut)
def reject_item(item_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Reject an item listing"""
    item = crud_admin.update_item_status(db, item_id, ItemStatus.rejected)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Delete an item completely"""
    result = crud_admin.delete_item(db, item_id)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}

@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), admin = Depends(require_admin)):
    """Get all users"""
    return crud_admin.get_all_users(db)