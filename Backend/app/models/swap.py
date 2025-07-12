from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class SwapStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"

class Swap(Base):
    __tablename__ = "swaps"

    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id"))
    requested_item_id = Column(Integer, ForeignKey("items.id"))
    offered_item_id = Column(Integer, ForeignKey("items.id"))
    status = Column(Enum(SwapStatus), default=SwapStatus.pending)

    requester = relationship("User", backref="swap_requests")
    requested_item = relationship("Item", foreign_keys=[requested_item_id])
    offered_item = relationship("Item", foreign_keys=[offered_item_id])