from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import ProfileOut, ProfileUpdate
from services import auth_service, profile_service

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me", response_model=ProfileOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    profile = profile_service.get_or_create_profile(db, current_user.id)
    return profile


@router.put("/me", response_model=ProfileOut)
def update_my_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    profile = profile_service.update_profile(db, current_user.id, payload)
    return profile
