from sqlalchemy.orm import Session
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate

def create_item(db: Session, item: ItemCreate, owner_id: int):
    db_item = Item(**item.dict(), owner_id=owner_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def get_all_items(db: Session, skip=0, limit=10):
    return db.query(Item).offset(skip).limit(limit).all()

def update_item(db: Session, item_id: int, updates: ItemUpdate):
    db_item = get_item(db, item_id)
    if not db_item:
        return None
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int):
    db_item = get_item(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False