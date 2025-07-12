from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.item import ItemCreate, ItemOut, ItemUpdate
from app.crud import item as crud_item
from app.dependencies.deps import get_db, get_current_user

router = APIRouter(prefix="/api/items", tags=["items"])

@router.post("/", response_model=ItemOut)
def create_item(item: ItemCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_item.create_item(db, item, current_user.id)

@router.get("/", response_model=List[ItemOut])
def list_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_item.get_all_items(db, skip, limit)

@router.get("/{item_id}", response_model=ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud_item.get_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.put("/{item_id}", response_model=ItemOut)
def update_item(item_id: int, updates: ItemUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_item = crud_item.get_item(db, item_id)
    if not db_item or db_item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this item")
    return crud_item.update_item(db, item_id, updates)

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_item = crud_item.get_item(db, item_id)
    if not db_item or db_item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")
    crud_item.delete_item(db, item_id)
    return {"message": "Item deleted successfully"}