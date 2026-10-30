from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.incident import Incident
from app.models.resource import Resource
from app.models.user import User
from app.schemas import IncidentCreate, IncidentOut, IncidentResolve
from app.core.deps import get_current_user, require_role
from app.services.audit_service import log_action
from app.services.gemini_service import summarize_incident

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])


@router.post("", response_model=IncidentOut, status_code=201)
def report_incident(
    payload: IncidentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # AI summarize the incident
    ai_data = summarize_incident(
        incident_type=payload.incident_type,
        description=payload.description,
        severity=payload.severity or "",
    )

    # Auto-quarantine the resource if damage/severe incident
    if payload.incident_type in ("damage", "policy_violation"):
        resource = db.query(Resource).filter(Resource.id == payload.resource_id).first()
        if resource:
            resource.status = "maintenance"
            db.commit()

    incident = Incident(
        booking_id=payload.booking_id,
        resource_id=payload.resource_id,
        reported_by=current_user.id,
        incident_type=payload.incident_type,
        severity=payload.severity,
        description=payload.description,
        evidence_photos=payload.evidence_photos,
        estimated_cost=payload.estimated_cost,
        ai_summary=ai_data.get("one_line_summary"),
        ai_severity_assessment=ai_data.get("severity_assessment"),
        ai_recommended_steps=ai_data.get("recommended_next_steps", []),
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # Update user incident count
    current_user.incident_count += 1
    current_user.trust_score = max(0.0, current_user.trust_score - 0.05)
    db.commit()

    log_action(
        db, entity_type="incident", entity_id=incident.id,
        action="INCIDENT_REPORTED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        details={
            "booking_id": payload.booking_id,
            "incident_type": payload.incident_type,
            "severity": payload.severity,
        },
    )

    return incident


@router.get("/booking/{booking_id}", response_model=List[IncidentOut])
def get_booking_incidents(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Incident).filter(Incident.booking_id == booking_id).all()


@router.get("", response_model=List[IncidentOut])
def list_incidents(
    current_user: User = Depends(require_role("admin", "owner")),
    db: Session = Depends(get_db),
):
    if current_user.role == "admin":
        return db.query(Incident).order_by(Incident.created_at.desc()).all()
    # Owner sees incidents for their resources
    owned_ids = [r.id for r in db.query(Resource).filter(Resource.owner_id == current_user.id).all()]
    return db.query(Incident).filter(Incident.resource_id.in_(owned_ids)).order_by(Incident.created_at.desc()).all()


@router.patch("/{incident_id}/resolve", response_model=IncidentOut)
def resolve_incident(
    incident_id: str,
    payload: IncidentResolve,
    current_user: User = Depends(require_role("admin", "owner")),
    db: Session = Depends(get_db),
):
    from datetime import datetime
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident.status = "resolved"
    incident.resolved_by = current_user.id
    incident.resolution_notes = payload.resolution_notes
    incident.resolved_at = datetime.utcnow()

    # Release the resource from quarantine
    resource = db.query(Resource).filter(Resource.id == incident.resource_id).first()
    if resource and resource.status == "maintenance":
        resource.status = "available"

    db.commit()
    db.refresh(incident)

    log_action(
        db, entity_type="incident", entity_id=incident_id,
        action="INCIDENT_RESOLVED",
        actor_id=current_user.id, actor_name=current_user.full_name, actor_role=current_user.role,
        details={"resolution": payload.resolution_notes},
    )

    return incident
