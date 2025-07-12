from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.swap import SwapCreate, SwapOut, SwapStatus
from app.crud import swap as crud_swap
from app.dependencies.deps import get_db, get_current_user
from typing import List

router = APIRouter(prefix="/api/swaps", tags=["swaps"])

@router.post("/request", response_model=SwapOut)
def create_swap(swap: SwapCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.create_swap(db, current_user.id, swap)

@router.get("/my-requests", response_model=List[SwapOut])
def my_swap_requests(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.get_user_swaps(db, current_user.id)

@router.put("/{swap_id}/accept", response_model=SwapOut)
def accept_swap(swap_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.update_swap_status(db, swap_id, SwapStatus.accepted)

@router.put("/{swap_id}/decline", response_model=SwapOut)
def decline_swap(swap_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.update_swap_status(db, swap_id, SwapStatus.declined)

@router.get("/history", response_model=List[SwapOut])
def swap_history(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_swap.get_swap_history(db, current_user.id)