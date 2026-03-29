import os
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

import models
from schemas import UserCreate
from database import get_db

SECRET_KEY = os.environ.get("f8f88b3d3d15274a307d2b299f02aff89d109d926db4a97638b9754174b40523", "super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Use bcrypt_sha256 to avoid the 72-byte bcrypt limit while still verifying any legacy bcrypt hashes.
pwd_context = CryptContext(schemes=["bcrypt_sha256", "bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    key: str = str(SECRET_KEY) if SECRET_KEY else "super-secret-key"
    encoded_jwt = jwt.encode(to_encode, key, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_in: UserCreate) -> models.User:
    hashed_password = get_password_hash(user_in.password)
    db_user = models.User(email=user_in.email, hashed_password=hashed_password, full_name=getattr(user_in, 'full_name', None)) # type: ignore
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        key: str = str(SECRET_KEY) if SECRET_KEY else "super-secret-key"
        payload = jwt.decode(token, key, algorithms=[ALGORITHM])
        email: str = str(payload.get("sub"))
        if not payload.get("sub"):
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user
