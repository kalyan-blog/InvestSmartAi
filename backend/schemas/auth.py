from pydantic import BaseModel, EmailStr, constr, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=128)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=128)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
