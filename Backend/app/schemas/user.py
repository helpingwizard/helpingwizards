from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    points: int

    class Config:
        orm_mode = True

class UserProfileUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None
    points: Optional[int] = None