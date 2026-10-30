from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.booking import Booking
from app.models.resource import Resource, AvailabilitySlot
from app.models.condition import ConditionRecord
from app.models.notification import Notification
from app.models.user import User
from app.schemas import (
    BookingCreate, BookingOut, BookingDecision, CancelRequest,
    ConditionRecordCreate, ConditionRecordOut,
)
from app.core.deps import get_current_user, require_role
from app.services.audit_service import log_action
from app.services.allocation import (
    compute_priority_score, get_quota_status,
    check_slot_conflict, promote_waitlist,
)
from app.services.gemini_service import (
    analyze_condition_discrepancy, generate_rejection_explanation, classify_purpose,
)

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


def _send_notification(db: Session, user_id: str, ntype: str, title: str, body: str, entity_id: str):
    notif = Notification(
        user_id=user_id, type=ntype, title=title, body=body,
        related_entity_type="booking", related_entity_id=entity_id,
    )
    db.add(notif)
    db.commit()


# ── Create Booking Request ──────────────────────────────────────────────────

@router.post("", response_model=BookingOut, status_code=201)
def create_booking(
    payload: BookingCreate,
    bg: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resource = db.query(Resource).filter(Resource.id == payload.resource_id, Resource.is_active == True).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found or inactive")

    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")

    # Duration validation
    duration_hours = (payload.end_time - payload.start_time).total_seconds() / 3600
    if duration_hours > resource.max_booking_hours:
        raise HTTPException(
            status_code=400,
            detail=f"Booking exceeds maximum duration of {resource.max_booking_hours} hours",
        )

    # Quota check
    quota = get_quota_status(db, current_user.id, payload.resource_id)
    policy = resource.fair_usage_policy or {}
    max_hours = policy.get("max_hours_per_week", 999)

    if quota.get("is_quota_exceeded"):
        raise HTTPException(
            status_code=400,
            detail=f"Weekly quota exceeded ({quota['hours_used_this_week']}/{max_hours} hrs used). Try next week.",
        )
    if quota.get("cooldown_active"):
        raise HTTPException(
            status_code=400,
            detail=f"Cooldown period active until {quota['cooldown_ends_at']}. Please wait before re-booking.",
        )

    # Slot conflict check — is this slot already approved/in-use?
    has_conflict = check_slot_conflict(db, payload.resource_id, payload.start_time, payload.end_time)

    # AI purpose classification (non-blocking)
    purpose_data = classify_purpose(payload.purpose_text, resource.category)
    purpose_score = purpose_data.get("score", 0.5)
    purpose_category = purpose_data.get("category", "general")

    # Compute waitlist priority score
    priority_score = compute_priority_score(
        db=db,
        user_id=current_user.id,
        resource_id=payload.resource_id,
        user_trust_score=current_user.trust_score,
        user_incident_count=current_user.incident_count,
        purpose_score=purpose_score,
        request_created_at=datetime.utcnow(),
    )

    # Determine initial status
    if has_conflict:
        initial_status = "waitlisted"
        # Calculate waitlist position
        existing_waitlisted = db.query(Booking).filter(
            Booking.resource_id == payload.resource_id,
            Booking.status == "waitlisted",
            Booking.start_time == payload.start_time,
        ).count()
        waitlist_position = existing_waitlisted + 1
    else:
        initial_status = "pending_approval" if resource.approval_mode == "manual" else "approved"
        waitlist_position = None

    booking = Booking(
        resource_id=payload.resource_id,
        borrower_id=current_user.id,
        start_time=payload.start_time,
        end_time=payload.end_time,
        purpose_text=payload.purpose_text,
        purpose_category=purpose_category,
        purpose_score=purpose_score,
        status=initial_status,
        waitlist_position=waitlist_position,
        waitlist_priority_score=priority_score,
        documents=payload.documents,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Mark slot as booked if approved
    if initial_status == "approved":
        slot = db.query(AvailabilitySlot).filter(
            AvailabilitySlot.resource_id == payload.resource_id,
            AvailabilitySlot.start_time == payload.start_time,
        ).first()
        if slot:
            slot.is_booked = True
            db.commit()

    log_action(
        db, entity_type="booking", entity_id=booking.id,
        action="BOOKING_REQUESTED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        details={
            "resource_id": payload.resource_id,
            "resource_name": resource.name,
            "start_time": str(payload.start_time),
            "end_time": str(payload.end_time),
            "status": initial_status,
            "priority_score": priority_score,
        },
    )

    # Notify owner
    bg.add_task(
        _send_notification, db, resource.owner_id, "new_booking_request",
        f"New booking request: {resource.name}",
        f"{current_user.full_name} has requested {resource.name} from {payload.start_time.strftime('%b %d %H:%M')}.",
        booking.id,
    )

    return booking


# ── List Bookings (role-filtered) ───────────────────────────────────────────

@router.get("", response_model=List[BookingOut])
def list_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == "admin":
        return db.query(Booking).order_by(Booking.created_at.desc()).all()
    elif current_user.role in ("owner", "manager"):
        # Show bookings for resources owned by this user
        owned_ids = [r.id for r in db.query(Resource).filter(Resource.owner_id == current_user.id).all()]
        return db.query(Booking).filter(Booking.resource_id.in_(owned_ids)).order_by(Booking.created_at.desc()).all()
    else:
        return db.query(Booking).filter(Booking.borrower_id == current_user.id).order_by(Booking.created_at.desc()).all()


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    resource = db.query(Resource).filter(Resource.id == booking.resource_id).first()
    is_owner = resource and resource.owner_id == current_user.id
    is_borrower = booking.borrower_id == current_user.id
    is_admin = current_user.role == "admin"

    if not (is_owner or is_borrower or is_admin):
        raise HTTPException(status_code=403, detail="Access denied")
    return booking


# ── Approve ─────────────────────────────────────────────────────────────────

@router.patch("/{booking_id}/approve", response_model=BookingOut)
def approve_booking(
    booking_id: str,
    payload: BookingDecision,
    bg: BackgroundTasks,
    current_user: User = Depends(require_role("owner", "manager", "admin")),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status not in ("pending_approval", "waitlisted"):
        raise HTTPException(status_code=400, detail=f"Cannot approve a booking in status '{booking.status}'")

    booking.status = "approved"
    booking.approved_by = current_user.id
    booking.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(booking)

    log_action(
        db, entity_type="booking", entity_id=booking_id,
        action="BOOKING_APPROVED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        reason=payload.reason,
        details={"resource_id": booking.resource_id},
    )

    bg.add_task(
        _send_notification, db, booking.borrower_id, "booking_approved",
        "Your booking has been approved! ✅",
        f"Your request has been approved. Please check in at the scheduled time.",
        booking_id,
    )

    return booking


# ── Reject ──────────────────────────────────────────────────────────────────

@router.patch("/{booking_id}/reject", response_model=BookingOut)
def reject_booking(
    booking_id: str,
    payload: BookingDecision,
    bg: BackgroundTasks,
    current_user: User = Depends(require_role("owner", "manager", "admin")),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status not in ("pending_approval", "waitlisted"):
        raise HTTPException(status_code=400, detail=f"Cannot reject a booking in status '{booking.status}'")

    # Generate AI-friendly rejection message
    failed = [payload.reason] if payload.reason else ["eligibility requirements not met"]
    resource = db.query(Resource).filter(Resource.id == booking.resource_id).first()
    ai_explanation = generate_rejection_explanation(
        resource_name=resource.name if resource else "this resource",
        failed_requirements=failed,
    )

    booking.status = "rejected"
    booking.rejection_reason = payload.reason
    booking.ai_rejection_explanation = ai_explanation
    booking.reviewed_at = datetime.utcnow()
    booking.approved_by = current_user.id
    db.commit()
    db.refresh(booking)

    # Promote waitlisted booking if applicable
    promote_waitlist(db, booking.resource_id, booking.start_time, booking.end_time)

    log_action(
        db, entity_type="booking", entity_id=booking_id,
        action="BOOKING_REJECTED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        reason=payload.reason,
        details={"resource_id": booking.resource_id},
    )

    bg.add_task(
        _send_notification, db, booking.borrower_id, "booking_rejected",
        "Booking request not approved",
        ai_explanation,
        booking_id,
    )

    return booking


# ── Cancel ──────────────────────────────────────────────────────────────────

@router.patch("/{booking_id}/cancel", response_model=BookingOut)
def cancel_booking(
    booking_id: str,
    payload: CancelRequest,
    bg: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    resource = db.query(Resource).filter(Resource.id == booking.resource_id).first()
    is_owner = resource and resource.owner_id == current_user.id
    is_borrower = booking.borrower_id == current_user.id
    is_admin = current_user.role == "admin"

    if not (is_owner or is_borrower or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
    if booking.status in ("cancelled", "completed", "returned"):
        raise HTTPException(status_code=400, detail="Booking already in terminal state")

    booking.status = "cancelled"
    booking.cancellation_reason = payload.reason
    db.commit()
    db.refresh(booking)

    promote_waitlist(db, booking.resource_id, booking.start_time, booking.end_time)

    log_action(
        db, entity_type="booking", entity_id=booking_id,
        action="BOOKING_CANCELLED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        reason=payload.reason,
    )

    return booking


# ── Check-in ────────────────────────────────────────────────────────────────

@router.post("/{booking_id}/checkin", response_model=ConditionRecordOut)
def checkin(
    booking_id: str,
    payload: ConditionRecordCreate,
    bg: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.borrower_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the borrower can check in")
    if booking.status != "approved":
        raise HTTPException(status_code=400, detail=f"Booking must be 'approved' to check in. Current: {booking.status}")

    record = ConditionRecord(
        booking_id=booking_id,
        record_type="checkin",
        condition_rating=payload.condition_rating,
        checklist_responses=payload.checklist_responses,
        notes=payload.notes,
        photos=payload.photos,
        recorded_by=current_user.id,
    )
    db.add(record)

    booking.status = "checked_in"
    booking.actual_checkin_time = datetime.utcnow()

    resource = db.query(Resource).filter(Resource.id == booking.resource_id).first()
    if resource:
        resource.status = "in_use"

    db.commit()
    db.refresh(record)

    log_action(
        db, entity_type="booking", entity_id=booking_id,
        action="CHECKED_IN",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        details={
            "condition_rating": payload.condition_rating,
            "resource_id": booking.resource_id,
            "resource_name": resource.name if resource else "",
        },
    )

    return record


# ── Return / Check-out ───────────────────────────────────────────────────────

@router.post("/{booking_id}/return", response_model=ConditionRecordOut)
def return_booking(
    booking_id: str,
    payload: ConditionRecordCreate,
    bg: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.borrower_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the borrower can return")
    if booking.status != "checked_in":
        raise HTTPException(status_code=400, detail=f"Booking must be 'checked_in' to return. Current: {booking.status}")

    # Get check-in record for AI comparison
    checkin_record = db.query(ConditionRecord).filter(
        ConditionRecord.booking_id == booking_id,
        ConditionRecord.record_type == "checkin",
    ).first()

    # AI condition discrepancy analysis (the DEMO SHOWSTOPPER)
    ai_result = {}
    if checkin_record:
        ai_result = analyze_condition_discrepancy(
            checkin_rating=checkin_record.condition_rating,
            checkin_notes=checkin_record.notes or "",
            checkin_checklist=checkin_record.checklist_responses or {},
            return_rating=payload.condition_rating,
            return_notes=payload.notes or "",
            return_checklist=payload.checklist_responses or {},
        )

    record = ConditionRecord(
        booking_id=booking_id,
        record_type="checkout",
        condition_rating=payload.condition_rating,
        checklist_responses=payload.checklist_responses,
        notes=payload.notes,
        photos=payload.photos,
        ai_damage_detected=ai_result.get("damage_detected"),
        ai_damage_description=ai_result.get("description"),
        ai_damage_severity=ai_result.get("severity"),
        ai_confidence=ai_result.get("confidence"),
        ai_recommended_action=ai_result.get("recommended_action"),
        recorded_by=current_user.id,
    )
    db.add(record)

    booking.status = "completed"
    booking.actual_checkout_time = datetime.utcnow()

    resource = db.query(Resource).filter(Resource.id == booking.resource_id).first()
    if resource:
        # If AI detected damage → quarantine; else release
        resource.status = "maintenance" if ai_result.get("damage_detected") else "available"

    db.commit()
    db.refresh(record)

    action_label = "RETURNED_WITH_DAMAGE_FLAG" if ai_result.get("damage_detected") else "RETURNED"
    log_action(
        db, entity_type="booking", entity_id=booking_id,
        action=action_label,
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        details={
            "return_condition": payload.condition_rating,
            "ai_damage_detected": ai_result.get("damage_detected"),
            "ai_severity": ai_result.get("severity"),
        },
    )

    # Alert owner if damage detected
    if ai_result.get("damage_detected") and resource:
        bg.add_task(
            _send_notification, db, resource.owner_id, "damage_detected",
            f"⚠️ Damage detected on return: {resource.name}",
            f"AI analysis flagged {ai_result.get('severity', 'possible')} damage. Please review the return condition report.",
            booking_id,
        )

    return record
