from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models.nfl_line import NFLLine

router = APIRouter(prefix="/lines", tags=["Lines"])

@router.get("/")
def get_lines(
    week: int = Query(None, description="NFL week number. Defaults to current week if not provided."),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """
    Retrieve all NFL lines for a specific week.
    If no week is provided, defaults to the current week.
    """
    # If no week specified, determine current week dynamically (placeholder logic)
    if week is None:
        raise HTTPException(status_code=400, detail="Missing Week argument")

    lines = db.query(NFLLine).filter(NFLLine.week_number == week).all()

    if not lines:
        raise HTTPException(status_code=404, detail=f"No lines found for week {week}")

    return lines
