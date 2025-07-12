from sqlalchemy.orm import Session
from app.models.item import Item, ItemStatus
from app.models.user import User
from typing import Dict, Any

def get_pending_items(db: Session):
    return db.query(Item).filter(Item.status == ItemStatus.pending).all()

def get_all_items(db: Session):
    return db.query(Item).all()

def get_items_by_status(db: Session, status: ItemStatus):
    return db.query(Item).filter(Item.status == status).all()

def update_item_status(db: Session, item_id: int, new_status: ItemStatus):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        return None
    item.status = new_status
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, item_id: int):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        return None
    db.delete(item)
    db.commit()
    return True

def get_all_users(db: Session):
    return db.query(User).all()

def get_admin_stats(db: Session) -> Dict[str, Any]:
    total_items = db.query(Item).count()
    pending_items = db.query(Item).filter(Item.status == ItemStatus.pending).count()
    approved_items = db.query(Item).filter(Item.status == ItemStatus.available).count()
    rejected_items = db.query(Item).filter(Item.status == ItemStatus.rejected).count()
    total_users = db.query(User).count()
    admin_users = db.query(User).filter(User.is_admin == True).count()
    
    return {
        "total_items": total_items,
        "pending_items": pending_items,
        "approved_items": approved_items,
        "rejected_items": rejected_items,
        "total_users": total_users,
        "admin_users": admin_users
    }