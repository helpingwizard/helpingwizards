from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class ItemStatus(str, enum.Enum):
    available = "available"
    pending = "pending"
    swapped = "swapped"
    rejected = "rejected"

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)
    type = Column(String)
    size = Column(String)
    condition = Column(String)
    tags = Column(String)
    images = Column(Text)  # JSON string of image URLs
    location = Column(String)
    points = Column(Integer, default=0)
    status = Column(Enum(ItemStatus), default=ItemStatus.available)
    date_added = Column(DateTime, default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")