from pydantic import BaseModel
from typing import Optional

class LeagueBase(BaseModel):
    name: str
    description: Optional[str] = None

class LeagueCreate(LeagueBase):
    pass

class LeagueOut(LeagueBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True
