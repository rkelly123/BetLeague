from pydantic import BaseModel
from typing import Optional, List
from schemas.user import UserSchema 

class LeagueBase(BaseModel):
    name: str
    description: Optional[str] = None

class LeagueCreate(LeagueBase):
    pass

class LeagueOut(BaseModel):
    id: int
    name: str
    description: str
    owner: UserSchema
    members: List[UserSchema]

    class Config:
        orm_mode = True
