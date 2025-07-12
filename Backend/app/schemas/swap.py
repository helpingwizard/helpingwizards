from pydantic import BaseModel
from enum import Enum
from typing import Optional

class SwapStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"

class SwapCreate(BaseModel):
    requested_item_id: int
    offered_item_id: int

class SwapOut(BaseModel):
    id: int
    requested_item_id: int
    offered_item_id: int
    status: SwapStatus
    requester_id: int

    class Config:
        orm_mode = True