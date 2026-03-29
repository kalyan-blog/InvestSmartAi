from typing import Optional
from pydantic import BaseModel, field_validator, constr, ConfigDict


class ProfileBase(BaseModel):
    name: Optional[constr(strip_whitespace=True, min_length=1)] = None
    age: Optional[int] = None
    monthly_income: Optional[float] = None
    risk_level: Optional[str] = None
    investment_goal: Optional[str] = None

    @field_validator("age")
    @classmethod
    def age_positive(cls, v):
        if v is not None and v < 0:
            raise ValueError("Age must be positive")
        return v

    @field_validator("monthly_income")
    @classmethod
    def income_positive(cls, v):
        if v is not None and v < 0:
            raise ValueError("Monthly income must be positive")
        return v

    @field_validator("risk_level")
    @classmethod
    def valid_risk(cls, v):
        if v is not None and v.lower() not in {"low", "medium", "high"}:
            raise ValueError("Risk level must be Low, Medium, or High")
        return v.title() if v else v


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class ProfileOut(ProfileBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)
