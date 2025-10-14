from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy.orm import relationship
from database import Base

class NFLLine(Base):
    __tablename__ = "nfl_lines"

    id = Column(Integer, primary_key=True, index=True)
    week_number = Column(Integer, nullable=False)
    line_type = Column(String, nullable=False)  # money_line, spread, over_under, player_prop, player_td
    description = Column(String, nullable=False)
    odds = Column(Float, nullable=False)
    resolved = Column(Boolean, default=False)
    result = Column(String, nullable=True)  # 'hit', 'miss', 'push'

    bets = relationship("Bet", back_populates="line")
