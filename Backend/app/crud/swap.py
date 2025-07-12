from sqlalchemy.orm import Session
from app.models.swap import Swap, SwapStatus
from app.schemas.swap import SwapCreate

def create_swap(db: Session, user_id: int, swap_data: SwapCreate):
    swap = Swap(
        requester_id=user_id,
        requested_item_id=swap_data.requested_item_id,
        offered_item_id=swap_data.offered_item_id
    )
    db.add(swap)
    db.commit()
    db.refresh(swap)
    return swap

def get_user_swaps(db: Session, user_id: int):
    return db.query(Swap).filter(Swap.requester_id == user_id).all()

def get_swap_by_id(db: Session, swap_id: int):
    return db.query(Swap).filter(Swap.id == swap_id).first()

def update_swap_status(db: Session, swap_id: int, status: SwapStatus):
    swap = get_swap_by_id(db, swap_id)
    if not swap:
        return None
    swap.status = status
    db.commit()
    db.refresh(swap)
    return swap

def get_swap_history(db: Session, user_id: int):
    return db.query(Swap).filter(
        Swap.requester_id == user_id,
        Swap.status != SwapStatus.pending
    ).all()