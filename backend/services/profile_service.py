from typing import Optional
from sqlalchemy.orm import Session

import models
from schemas import ProfileUpdate


def get_or_create_profile(db: Session, user_id: int) -> models.UserProfile:
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if profile:
        return profile
    profile = models.UserProfile(user_id=user_id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(db: Session, user_id: int, payload: ProfileUpdate) -> models.UserProfile:
    profile = get_or_create_profile(db, user_id)
    data = payload.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(profile, key, value)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
