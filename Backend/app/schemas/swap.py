from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class SwapStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"

class SwapBase(BaseModel):
    item_id: int
    requester_id: int
    owner_id: int
    message: Optional[str] = None

class SwapCreate(SwapBase):
    pass

class SwapUpdate(BaseModel):
    status: Optional[SwapStatus] = None
    message: Optional[str] = None

class SwapOut(SwapBase):
    id: int
    status: SwapStatus
    date_created: datetime

    class Config:
        orm_mode = True