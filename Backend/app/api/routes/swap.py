from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.swap import SwapCreate, SwapOut, SwapUpdate, SwapStatus
from app.crud import swap as crud_swap
from app.dependencies.deps import get_db, get_current_user
from typing import List

router = APIRouter(prefix="/api/swaps", tags=["swaps"])

@router.post("/", response_model=SwapOut)
def create_swap(swap: SwapCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.create_swap(db, swap)

@router.get("/", response_model=List[SwapOut])
def get_user_swaps(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.get_user_swaps(db, current_user.id)

@router.get("/{swap_id}", response_model=SwapOut)
def get_swap(swap_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    swap = crud_swap.get_swap_by_id(db, swap_id)
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    # Check if user is involved in the swap
    if swap.requester_id != current_user.id and swap.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this swap")
    return swap

@router.put("/{swap_id}", response_model=SwapOut)
def update_swap(swap_id: int, updates: SwapUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    swap = crud_swap.get_swap_by_id(db, swap_id)
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    # Only owner can accept/reject, requester can cancel
    if swap.owner_id != current_user.id and swap.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this swap")
    return crud_swap.update_swap(db, swap_id, updates)

@router.get("/history", response_model=List[SwapOut])
def swap_history(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.get_swap_history(db, current_user.id)