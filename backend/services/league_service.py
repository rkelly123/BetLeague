from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.league import League
from models.user import User
from schemas.league import LeagueCreate

def create_league(db: Session, league_in: LeagueCreate, owner: User) -> League:
    league = League(**league_in.dict(), owner=owner)
    league.members.append(owner)  # owner automatically joins
    db.add(league)
    db.commit()
    db.refresh(league)
    return league

def get_leagues_for_user(db: Session, user: User):
    return user.leagues

def join_league(db: Session, league_id: int, user: User):
    league = db.query(League).filter(League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")

    if user in league.members:
        raise HTTPException(status_code=400, detail="User already in league")

    league.members.append(user)
    db.commit()
    return {"message": "Joined league successfully"}


def leave_league(db: Session, league_id: int, user: User):
    league = db.query(League).filter(League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")

    if league.owner_id == user.id:
        raise HTTPException(status_code=400, detail="Owner cannot leave their own league")

    if user not in league.members:
        raise HTTPException(status_code=400, detail="User not a member of league")

    league.members.remove(user)
    db.commit()
    return {"message": "Left league successfully"}


def delete_league(db: Session, league_id: int, user: User):
    league = db.query(League).filter(League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")

    if league.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the owner can delete the league")

    db.delete(league)
    db.commit()
    return {"message": "League deleted successfully"}
