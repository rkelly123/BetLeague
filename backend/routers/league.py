from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.league import LeagueCreate, LeagueOut
import services.league_service as league_service
from dependencies import get_current_user

router = APIRouter(prefix="/leagues", tags=["Leagues"])

@router.post("/", response_model=LeagueOut, status_code=status.HTTP_201_CREATED)
def create_new_league(
    league_in: LeagueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return league_service.create_league(db, league_in, current_user)

@router.get("/", response_model=list[LeagueOut])
def list_my_leagues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return league_service.get_leagues_for_user(db, current_user)

@router.get("/{league_id}", response_model=LeagueOut)
def read_league(league_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    league = league_service.get_league_by_id(db, league_id)
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="League not found")
    return league

@router.post("/{league_id}/join")
def join_league(league_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return league_service.join_league(db, league_id, current_user)

@router.post("/{league_id}/leave")
def leave_league(league_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return league_service.leave_league(db, league_id, current_user)

@router.delete("/{league_id}")
def delete_league(league_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return league_service.delete_league(db, league_id, current_user)
