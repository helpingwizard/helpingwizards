from sqlalchemy.orm import Session
from app.models.swap import Swap, SwapStatus
from app.schemas.swap import SwapCreate, SwapUpdate
from app.crud.user import update_user_stats_on_swap_completion
from app.models.item import Item

def create_swap(db: Session, swap_data: SwapCreate):
    swap = Swap(
        item_id=swap_data.item_id,
        requester_id=swap_data.requester_id,
        owner_id=swap_data.owner_id,
        message=swap_data.message
    )
    db.add(swap)
    db.commit()
    db.refresh(swap)
    return swap

def get_user_swaps(db: Session, user_id: int):
    return db.query(Swap).filter(
        (Swap.requester_id == user_id) | (Swap.owner_id == user_id)
    ).all()

def get_swap_by_id(db: Session, swap_id: int):
    return db.query(Swap).filter(Swap.id == swap_id).first()

def update_swap(db: Session, swap_id: int, updates: SwapUpdate):
    swap = get_swap_by_id(db, swap_id)
    if not swap:
        return None
    
    # Store the old status to check if we're accepting a swap
    old_status = swap.status
    
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(swap, field, value)
    
    # If swap is being accepted, update user stats
    if old_status == SwapStatus.pending and swap.status == SwapStatus.accepted:
        # Get the item to determine points
        item = db.query(Item).filter(Item.id == swap.item_id).first()
        points_earned = item.points if item else 25  # Default points if item not found
        
        # Update stats for both users
        update_user_stats_on_swap_completion(db, swap.owner_id, points_earned)
        update_user_stats_on_swap_completion(db, swap.requester_id, points_earned)
    
    db.commit()
    db.refresh(swap)
    return swap

def get_swap_history(db: Session, user_id: int):
    return db.query(Swap).filter(
        (Swap.requester_id == user_id) | (Swap.owner_id == user_id),
        Swap.status != SwapStatus.pending
    ).all()