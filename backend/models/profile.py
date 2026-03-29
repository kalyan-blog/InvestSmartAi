from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, func
from sqlalchemy.orm import relationship

from database import Base


class UserProfile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    monthly_income = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)
    investment_goal = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="profile")
