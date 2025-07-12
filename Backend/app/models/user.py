from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    avatar = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    points = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    swaps_completed = Column(Integer, default=0)
    items_listed = Column(Integer, default=0)
    impact_score = Column(Integer, default=0)
    join_date = Column(DateTime, default=func.now())
    location = Column(String)
    
    items = relationship("Item", back_populates="owner")