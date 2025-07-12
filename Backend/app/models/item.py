from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
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
    status = Column(Enum(ItemStatus), default=ItemStatus.available)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")