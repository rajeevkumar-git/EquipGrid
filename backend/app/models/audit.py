from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from app.database import Base


class AuditLog(Base):
    """
    IMMUTABLE append-only table. Never UPDATE or DELETE records here.
    Every state change across the entire platform is recorded here.
    """
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # What entity was affected
    entity_type = Column(String, nullable=False, index=True)
    # booking | resource | incident | user | system

    entity_id = Column(String, nullable=False, index=True)

    # What happened
    action = Column(String, nullable=False)
    # RESOURCE_LISTED | BOOKING_REQUESTED | BOOKING_APPROVED | BOOKING_REJECTED
    # BOOKING_WAITLISTED | BOOKING_CANCELLED | CHECKED_IN | CHECKED_OUT
    # INCIDENT_REPORTED | INCIDENT_RESOLVED | OVERDUE_FLAGGED | USER_REGISTERED

    # Who did it
    actor_id = Column(String, nullable=True, index=True)
    actor_name = Column(String, nullable=True)
    actor_role = Column(String, nullable=True)

    # Extra context (flexible JSON — different per action type)
    details = Column(JSON, default=dict)

    reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
