from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Association table: users <-> leagues (many‑to‑many)
league_members = Table(
    "league_members",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("league_id", Integer, ForeignKey("leagues.id")),
)

class League(Base):
    __tablename__ = "leagues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="owned_leagues")
    members = relationship("User", secondary=league_members, back_populates="leagues")
