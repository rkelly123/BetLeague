from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class UserPoints(Base):
    __tablename__ = "user_points"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    league_id = Column(Integer, ForeignKey("leagues.id"), nullable=False)
    week_number = Column(Integer, nullable=False)
    total_points = Column(Integer, default=1000)
    points_remaining = Column(Integer, default=1000)

    user = relationship("User", back_populates="points")
    league = relationship("League", back_populates="points")
