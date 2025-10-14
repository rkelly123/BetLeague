from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models import Base
from .league import league_members

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    owned_leagues = relationship("League", back_populates="owner")
    leagues = relationship("League", secondary=league_members, back_populates="members")
    points = relationship("UserPoints", back_populates="user")
    bets = relationship("Bet", back_populates="user")