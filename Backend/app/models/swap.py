from sqlalchemy import Column, Integer, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class SwapStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"

class Swap(Base):
    __tablename__ = "swaps"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))  # The item being requested
    requester_id = Column(Integer, ForeignKey("users.id"))  # Who wants the item
    owner_id = Column(Integer, ForeignKey("users.id"))  # Who owns the item
    status = Column(Enum(SwapStatus), default=SwapStatus.pending)
    message = Column(Text)
    date_created = Column(DateTime, default=func.now())

    item = relationship("Item", foreign_keys=[item_id])
    requester = relationship("User", foreign_keys=[requester_id], backref="initiated_swaps")
    owner = relationship("User", foreign_keys=[owner_id], backref="received_swaps")