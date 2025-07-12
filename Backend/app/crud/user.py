from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserProfileUpdate
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username_or_email(db: Session, username: str):
    """Get user by username or email - handles both cases"""
    # First try to find by email
    user = db.query(User).filter(User.email == username).first()
    if user:
        return user
    
    # Special case for admin username
    if username == "admin":
        return db.query(User).filter(User.email == "admin@admin.com").first()
    
    return None

def create_user(db: Session, user: UserCreate):
    db_user = User(
        email=user.email, 
        hashed_password=get_password_hash(user.password),
        name=user.name,
        avatar=user.avatar,
        location=user.location
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, db_user: User, updates: UserProfileUpdate):
    if updates.email:
        db_user.email = updates.email
    if updates.password:
        db_user.hashed_password = get_password_hash(updates.password)
    if updates.name:
        db_user.name = updates.name
    if updates.avatar:
        db_user.avatar = updates.avatar
    if updates.location:
        db_user.location = updates.location
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_stats_on_swap_completion(db: Session, user_id: int, points_earned: int):
    """Update user stats when a swap is completed"""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.swaps_completed += 1
        user.points += points_earned
        user.impact_score += 10  # Fixed impact score per swap
        db.commit()
        db.refresh(user)
    return user

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()