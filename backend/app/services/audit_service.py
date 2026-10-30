from sqlalchemy.orm import Session
from app.models.audit import AuditLog


def log_action(
    db: Session,
    entity_type: str,
    entity_id: str,
    action: str,
    actor_id: str = None,
    actor_name: str = None,
    actor_role: str = None,
    details: dict = None,
    reason: str = None,
):
    """
    Append an immutable record to the audit log.
    Call this after EVERY state change in the system.
    """
    entry = AuditLog(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        actor_id=actor_id,
        actor_name=actor_name,
        actor_role=actor_role,
        details=details or {},
        reason=reason,
    )
    db.add(entry)
    db.commit()
    return entry
