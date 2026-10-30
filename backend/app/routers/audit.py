from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.audit import AuditLog
from app.schemas import AuditLogOut
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/audit-logs", tags=["Audit"])


@router.get("/booking/{booking_id}", response_model=List[AuditLogOut])
def get_booking_audit_trail(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Full immutable activity history for a single booking — visible to both parties."""
    return (
        db.query(AuditLog)
        .filter(AuditLog.entity_id == booking_id, AuditLog.entity_type == "booking")
        .order_by(AuditLog.created_at.asc())
        .all()
    )


@router.get("", response_model=List[AuditLogOut])
def list_audit_logs(
    entity_type: Optional[str] = Query(None),
    entity_id: Optional[str] = Query(None),
    actor_id: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Admin-level filtered audit log search."""
    query = db.query(AuditLog)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)
    if entity_id:
        query = query.filter(AuditLog.entity_id == entity_id)
    if actor_id:
        query = query.filter(AuditLog.actor_id == actor_id)
    if action:
        query = query.filter(AuditLog.action == action)

    return query.order_by(AuditLog.created_at.desc()).limit(limit).all()
