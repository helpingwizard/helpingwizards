from sqlalchemy.orm import Session
from app.models.item import Item, ItemStatus
from app.models.user import User

def get_pending_items(db: Session):
    return db.query(Item).filter(Item.status == ItemStatus.pending).all()

def update_item_status(db: Session, item_id: int, new_status: ItemStatus):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        return None
    item.status = new_status
    db.commit()
    db.refresh(item)
    return item

def get_all_users(db: Session):
    return db.query(User).all()