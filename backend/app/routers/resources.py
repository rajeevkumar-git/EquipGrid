from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.resource import Resource, AvailabilitySlot
from app.models.user import User
from app.schemas import ResourceCreate, ResourceOut, SlotCreate, SlotOut
from app.core.deps import get_current_user, require_role
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/resources", tags=["Resources"])


@router.get("", response_model=List[ResourceOut])
def list_resources(
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Public endpoint — list all active resources with optional filters."""
    query = db.query(Resource).filter(Resource.is_active == True)

    if category:
        query = query.filter(Resource.category == category)
    if status:
        query = query.filter(Resource.status == status)
    if location:
        query = query.filter(Resource.location.ilike(f"%{location}%"))
    if search:
        query = query.filter(
            Resource.name.ilike(f"%{search}%") |
            Resource.description.ilike(f"%{search}%")
        )

    return query.order_by(Resource.created_at.desc()).all()


@router.post("", response_model=ResourceOut, status_code=201)
def create_resource(
    payload: ResourceCreate,
    current_user: User = Depends(require_role("owner", "admin")),
    db: Session = Depends(get_db),
):
    """Owner lists a new resource."""
    resource = Resource(
        owner_id=current_user.id,
        name=payload.name,
        description=payload.description,
        category=payload.category,
        location=payload.location,
        images=payload.images,
        max_booking_hours=payload.max_booking_hours,
        max_bookings_per_user_per_month=payload.max_bookings_per_user_per_month,
        approval_mode=payload.approval_mode,
        requires_supervision=payload.requires_supervision,
        supervisor_contact=payload.supervisor_contact,
        requires_deposit=payload.requires_deposit,
        deposit_amount=payload.deposit_amount,
        baseline_condition=payload.baseline_condition,
        baseline_notes=payload.baseline_notes,
        condition_checklist=payload.condition_checklist,
        eligibility_requirements=payload.eligibility_requirements,
        usage_rules=payload.usage_rules,
        fair_usage_policy=payload.fair_usage_policy,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    log_action(
        db, entity_type="resource", entity_id=resource.id,
        action="RESOURCE_LISTED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        details={"name": resource.name, "category": resource.category, "location": resource.location},
    )

    return resource


@router.get("/{resource_id}", response_model=ResourceOut)
def get_resource(resource_id: str, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.get("/{resource_id}/eligibility")
def check_eligibility(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check the current user's eligibility for a specific resource."""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    requirements = resource.eligibility_requirements or []
    user_creds = [c.credential_name for c in current_user.credentials]

    results = []
    all_met = True

    for req in requirements:
        if req.get("type") in ("training", "certification"):
            met = req.get("name") in user_creds
        elif req.get("type") == "approval":
            met = False    # Always requires manual approval
        else:
            met = True

        if req.get("mandatory", True) and not met:
            all_met = False

        results.append({
            "requirement": req.get("name"),
            "type": req.get("type"),
            "mandatory": req.get("mandatory", True),
            "met": met,
            "description": req.get("description", ""),
        })

    status_label = "ELIGIBLE" if all_met else (
        "TRAINING_REQUIRED" if any(r["type"] in ("training", "certification") and not r["met"] for r in results)
        else "INELIGIBLE"
    )

    return {
        "resource_id": resource_id,
        "user_id": current_user.id,
        "eligibility_status": status_label,
        "all_requirements_met": all_met,
        "results": results,
        "supervisor_contact": resource.supervisor_contact if resource.requires_supervision else None,
    }


@router.put("/{resource_id}", response_model=ResourceOut)
def update_resource(
    resource_id: str,
    payload: ResourceCreate,
    current_user: User = Depends(require_role("owner", "admin")),
    db: Session = Depends(get_db),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    if resource.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your resource")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(resource, field, value)

    db.commit()
    db.refresh(resource)

    log_action(
        db, entity_type="resource", entity_id=resource.id,
        action="RESOURCE_UPDATED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
    )
    return resource


@router.get("/{resource_id}/slots", response_model=List[SlotOut])
def get_slots(resource_id: str, db: Session = Depends(get_db)):
    return db.query(AvailabilitySlot).filter(
        AvailabilitySlot.resource_id == resource_id,
        AvailabilitySlot.is_booked == False,
    ).order_by(AvailabilitySlot.start_time).all()


@router.post("/{resource_id}/slots", response_model=SlotOut, status_code=201)
def add_slot(
    resource_id: str,
    payload: SlotCreate,
    current_user: User = Depends(require_role("owner", "admin")),
    db: Session = Depends(get_db),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    if resource.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your resource")

    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")

    slot = AvailabilitySlot(
        resource_id=resource_id,
        start_time=payload.start_time,
        end_time=payload.end_time,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot
