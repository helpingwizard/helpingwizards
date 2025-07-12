#!/usr/bin/env python3
"""
Script to create admin user with credentials admin/admin
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.item import Item  # Import Item model to fix relationship
from app.models.swap import Swap  # Import Swap model to fix relationship
from app.core.security import get_password_hash

def create_admin_user():
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == "admin@admin.com").first()
        
        if admin_user:
            print("Admin user already exists!")
            return
        
        # Create admin user
        admin_user = User(
            email="admin@admin.com",
            hashed_password=get_password_hash("admin"),
            name="Admin",
            is_admin=True,
            is_active=True,
            points=0,
            rating=0.0,
            swaps_completed=0,
            items_listed=0,
            impact_score=0,
            location="Admin Location"
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("Admin user created successfully!")
        print(f"Email: admin@admin.com")
        print(f"Password: admin")
        print(f"User ID: {admin_user.id}")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user() 