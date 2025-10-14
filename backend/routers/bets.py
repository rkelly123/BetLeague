from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models.user_points import UserPoints
from models.bet import Bet
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

class BetCreate(BaseModel):
    line_id: int
    points_wagered: int
    week_number: int

router = APIRouter(prefix="/leagues/{league_id}/bet", tags=["Bets"])

@router.post("/place")
def place_bet(league_id: int, data: BetCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    line_id = data.line_id
    points_wagered = data.points_wagered
    week_number = data.week_number

    if points_wagered <= 0:
        raise HTTPException(status_code=400, detail="Points must be positive")

    # Fetch or create UserPoints
    user_points = db.query(UserPoints).filter_by(user_id=user.id, league_id=league_id, week_number=week_number).first()
    if not user_points:
        user_points = UserPoints(user_id=user.id, league_id=league_id, week_number=week_number)
        db.add(user_points)
        db.commit()
        db.refresh(user_points)

    if points_wagered > user_points.points_remaining:
        raise HTTPException(status_code=400, detail="Not enough points remaining for this week")

    # Create Bet
    bet = Bet(user_id=user.id, league_id=league_id, line_id=line_id, points_wagered=points_wagered, week_number=week_number)
    db.add(bet)

    # Deduct points
    user_points.points_remaining -= points_wagered
    db.commit()
    db.refresh(bet)
    return bet

@router.get("/list")
def get_my_bets(league_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    bets = db.query(Bet).filter(Bet.user_id == user.id, Bet.league_id == league_id).all()
    return bets
