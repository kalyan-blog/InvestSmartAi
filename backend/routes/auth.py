from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import UserCreate, UserLogin, UserOut, Token
from services import auth_service, profile_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = auth_service.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = auth_service.create_user(db, user_in)
    # ensure a profile exists for the user
    profile_service.get_or_create_profile(db, user.id)

    access_token = auth_service.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(hours=auth_service.ACCESS_TOKEN_EXPIRE_HOURS),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = auth_service.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(hours=auth_service.ACCESS_TOKEN_EXPIRE_HOURS),
    )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def me(current_user: models.User = Depends(auth_service.get_current_user)):
    return current_user
