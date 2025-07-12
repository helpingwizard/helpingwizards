from fastapi import Depends, HTTPException, status
from app.dependencies.deps import get_current_user

def require_admin(current_user = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user