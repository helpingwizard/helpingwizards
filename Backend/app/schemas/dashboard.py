from pydantic import BaseModel
from typing import List
from app.schemas.item import ItemOut  # Make sure you’ve already defined this

class DashboardResponse(BaseModel):
    email: str
    points: int
    items: List[ItemOut]

    class Config:
        orm_mode = True