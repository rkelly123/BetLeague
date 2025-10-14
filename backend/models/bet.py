from sqlalchemy import Column, Integer, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from database import Base

class Bet(Base):
    __tablename__ = "bets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    league_id = Column(Integer, ForeignKey("leagues.id"), nullable=False)
    line_id = Column(Integer, ForeignKey("nfl_lines.id"), nullable=False)
    points_wagered = Column(Integer, nullable=False)
    week_number = Column(Integer, nullable=False)
    resolved = Column(Boolean, default=False)
    points_returned = Column(Float, default=0.0)

    user = relationship("User", back_populates="bets")
    league = relationship("League", back_populates="bets")
    line = relationship("NFLLine", back_populates="bets")
