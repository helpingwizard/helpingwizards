from pydantic import BaseModel, validator
from typing import Optional, List
from enum import Enum
from datetime import datetime
import json

class ItemStatus(str, Enum):
    available = "available"
    pending = "pending"
    swapped = "swapped"
    rejected = "rejected"

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    size: Optional[str] = None
    condition: Optional[str] = None
    tags: Optional[str] = None
    images: Optional[List[str]] = None
    location: Optional[str] = None
    points: Optional[int] = None
    embeddings: Optional[List[float]] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    status: Optional[ItemStatus] = None

class ItemOut(ItemBase):
    id: int
    status: ItemStatus
    owner_id: int
    date_added: datetime
    images: Optional[List[str]] = None
    embeddings: Optional[List[float]] = None

    @validator('images', pre=True)
    def parse_images(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v) if v else []
            except json.JSONDecodeError:
                return []
        return v or []

    @validator('embeddings', pre=True)
    def parse_embeddings(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v) if v else None
            except json.JSONDecodeError:
                return None
        return v

    class Config:
        orm_mode = True