from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.booking import Booking
from app.models.user import User
from app.schemas import QuotaStatus
from app.core.deps import get_current_user
from app.services.allocation import get_quota_status

router = APIRouter(prefix="/api/fairness", tags=["Fair Allocation"])


@router.get("/quota/{resource_id}", response_model=QuotaStatus)
def check_quota(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the current user's quota consumption for a specific resource."""
    result = get_quota_status(db, current_user.id, resource_id)
    return result


@router.get("/waitlist/{resource_id}")
def get_waitlist(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all waitlisted bookings for a resource, sorted by priority score (descending)."""
    waitlisted = (
        db.query(Booking)
        .filter(Booking.resource_id == resource_id, Booking.status == "waitlisted")
        .order_by(Booking.waitlist_priority_score.desc())
        .all()
    )

    result = []
    for i, b in enumerate(waitlisted, start=1):
        borrower = db.query(User).filter(User.id == b.borrower_id).first()
        result.append({
            "position": i,
            "booking_id": b.id,
            "borrower_name": borrower.full_name if borrower else "Unknown",
            "start_time": b.start_time,
            "end_time": b.end_time,
            "purpose_category": b.purpose_category,
            "priority_score": b.waitlist_priority_score,
            "requested_at": b.created_at,
        })

    return {
        "resource_id": resource_id,
        "total_waitlisted": len(result),
        "waitlist": result,
    }


@router.get("/my-usage")
def get_my_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all active and recent bookings for the current user with quota summaries."""
    from datetime import datetime, timedelta
    recent_bookings = (
        db.query(Booking)
        .filter(
            Booking.borrower_id == current_user.id,
            Booking.status.notin_(["cancelled", "rejected"]),
        )
        .order_by(Booking.created_at.desc())
        .limit(20)
        .all()
    )

    return {
        "user_id": current_user.id,
        "trust_score": current_user.trust_score,
        "incident_count": current_user.incident_count,
        "no_show_count": current_user.no_show_count,
        "recent_bookings": [
            {
                "booking_id": b.id,
                "resource_id": b.resource_id,
                "status": b.status,
                "start_time": b.start_time,
                "end_time": b.end_time,
            }
            for b in recent_bookings
        ],
    }
