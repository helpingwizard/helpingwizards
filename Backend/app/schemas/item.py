from pydantic import BaseModel
from typing import Optional
from enum import Enum

class ItemStatus(str, Enum):
    available = "available"
    pending = "pending"
    swapped = "swapped"

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    size: Optional[str] = None
    condition: Optional[str] = None
    tags: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    status: Optional[ItemStatus] = None

class ItemOut(ItemBase):
    id: int
    status: ItemStatus
    owner_id: int

    class Config:
        orm_mode = True