from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.booking import Booking
from app.models.resource import Resource


def compute_priority_score(
    db: Session,
    user_id: str,
    resource_id: str,
    user_trust_score: float,
    user_incident_count: int,
    purpose_score: float,
    request_created_at: datetime,
) -> float:
    """
    Composite priority score for waitlist ordering.
    Higher = higher priority.

      score = (0.3 × trust_score)
            + (0.3 × wait_time_ratio)          ← aging, prevents starvation
            - (0.2 × recent_usage_ratio)        ← anti-hoarding penalty
            + (0.1 × purpose_legitimacy)        ← Gemini AI score
            - (0.1 × incident_penalty)          ← trust penalty
    """
    # 1. Trust component
    trust_component = 0.3 * user_trust_score

    # 2. Wait-time aging (assume max wait = 7 days)
    wait_hours = (datetime.utcnow() - request_created_at).total_seconds() / 3600
    wait_ratio = min(wait_hours / (7 * 24), 1.0)
    wait_component = 0.3 * wait_ratio

    # 3. Anti-hoarding — bookings in last 30 days on this resource
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_bookings = db.query(func.count(Booking.id)).filter(
        Booking.resource_id == resource_id,
        Booking.borrower_id == user_id,
        Booking.created_at >= thirty_days_ago,
        Booking.status.in_(["completed", "checked_out", "approved", "checked_in"]),
    ).scalar() or 0

    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    quota_max = resource.max_bookings_per_user_per_month if resource else 5
    usage_ratio = min(recent_bookings / quota_max, 1.0)
    hoarding_penalty = 0.2 * usage_ratio

    # 4. AI purpose legitimacy (0.0 – 1.0)
    purpose_component = 0.1 * (purpose_score or 0.5)

    # 5. Incident penalty
    incident_penalty = 0.1 * min(user_incident_count / 5, 1.0)

    score = trust_component + wait_component - hoarding_penalty + purpose_component - incident_penalty
    return round(max(score, 0.0), 4)


def get_quota_status(db: Session, user_id: str, resource_id: str) -> dict:
    """Return current quota consumption for a user on a specific resource."""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        return {}

    policy = resource.fair_usage_policy or {}
    max_hours_per_week = policy.get("max_hours_per_week", 999)
    cooldown_hours = policy.get("cooldown_hours", 0)
    max_per_month = resource.max_bookings_per_user_per_month

    # Hours used this week
    week_start = datetime.utcnow() - timedelta(days=7)
    recent_bookings = db.query(Booking).filter(
        Booking.resource_id == resource_id,
        Booking.borrower_id == user_id,
        Booking.created_at >= week_start,
        Booking.status.in_(["approved", "checked_in", "completed", "checked_out"]),
    ).all()

    hours_used = sum(
        (b.end_time - b.start_time).total_seconds() / 3600
        for b in recent_bookings
    )

    # Bookings this month
    month_start = datetime.utcnow() - timedelta(days=30)
    monthly_count = db.query(func.count(Booking.id)).filter(
        Booking.resource_id == resource_id,
        Booking.borrower_id == user_id,
        Booking.created_at >= month_start,
        Booking.status.notin_(["cancelled", "rejected"]),
    ).scalar() or 0

    # Cooldown check — find last completed booking
    last_booking = db.query(Booking).filter(
        Booking.resource_id == resource_id,
        Booking.borrower_id == user_id,
        Booking.status.in_(["completed", "checked_out"]),
        Booking.actual_checkout_time.isnot(None),
    ).order_by(Booking.actual_checkout_time.desc()).first()

    cooldown_active = False
    cooldown_ends_at = None
    if last_booking and last_booking.actual_checkout_time and cooldown_hours > 0:
        cooldown_end = last_booking.actual_checkout_time + timedelta(hours=cooldown_hours)
        if datetime.utcnow() < cooldown_end:
            cooldown_active = True
            cooldown_ends_at = cooldown_end

    return {
        "user_id": user_id,
        "resource_id": resource_id,
        "hours_used_this_week": round(hours_used, 2),
        "max_hours_per_week": max_hours_per_week,
        "hours_remaining": max(round(max_hours_per_week - hours_used, 2), 0),
        "bookings_this_month": monthly_count,
        "max_bookings_per_month": max_per_month,
        "is_quota_exceeded": hours_used >= max_hours_per_week,
        "cooldown_active": cooldown_active,
        "cooldown_ends_at": cooldown_ends_at,
    }


def promote_waitlist(db: Session, resource_id: str, start_time, end_time):
    """
    After a booking is cancelled or rejected, promote the top-priority
    waitlisted booking for the same slot to APPROVED.
    Returns the promoted booking or None.
    """
    from app.models.booking import Booking
    waitlisted = db.query(Booking).filter(
        Booking.resource_id == resource_id,
        Booking.status == "waitlisted",
        Booking.start_time == start_time,
        Booking.end_time == end_time,
    ).order_by(Booking.waitlist_priority_score.desc()).first()

    if waitlisted:
        waitlisted.status = "pending_approval"
        waitlisted.waitlist_position = None
        db.commit()
        db.refresh(waitlisted)

    return waitlisted


def check_slot_conflict(db: Session, resource_id: str, start_time, end_time, exclude_booking_id: str = None) -> bool:
    """Return True if there is a conflicting approved/checked-in booking."""
    query = db.query(Booking).filter(
        Booking.resource_id == resource_id,
        Booking.status.in_(["approved", "pending_approval", "checked_in"]),
        Booking.start_time < end_time,
        Booking.end_time > start_time,
    )
    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)
    return query.first() is not None
