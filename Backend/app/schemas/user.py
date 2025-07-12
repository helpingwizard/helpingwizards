from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    avatar: Optional[str] = None
    location: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    is_admin: bool
    points: int
    rating: float
    swaps_completed: int
    items_listed: int
    impact_score: int
    join_date: datetime
    location: Optional[str] = None

    class Config:
        orm_mode = True

class UserProfileUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    name: Optional[str] = None
    avatar: Optional[str] = None
    location: Optional[str] = None