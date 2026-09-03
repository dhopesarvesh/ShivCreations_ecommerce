from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserProfileUpdate
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def current_user(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }


@router.put("/me")
def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    email = payload.email.lower()
    duplicate = db.query(User).filter(User.email == email, User.id != current_user.id).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Email is already in use")
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty")
    if payload.new_password:
        if not payload.current_password or not verify_password(payload.current_password, current_user.password_hash):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        current_user.password_hash = get_password_hash(payload.new_password)

    current_user.name = payload.name.strip()
    current_user.email = email
    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }
