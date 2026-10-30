import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=gen_uuid)
    booking_id = Column(String, nullable=False, index=True)
    resource_id = Column(String, nullable=False, index=True)
    reported_by = Column(String, nullable=False)    # user id

    incident_type = Column(String, nullable=False)
    # damage | overdue | policy_violation | no_show | dispute | other

    severity = Column(String, nullable=True)
    # minor | moderate | severe | total_loss

    description = Column(Text, nullable=False)
    evidence_photos = Column(JSON, default=list)
    estimated_cost = Column(Float, nullable=True)

    # AI-generated summary
    ai_summary = Column(Text, nullable=True)
    ai_severity_assessment = Column(String, nullable=True)
    ai_recommended_steps = Column(JSON, default=list)

    status = Column(String, default="open")
    # open | under_review | resolved | escalated | closed

    resolved_by = Column(String, nullable=True)     # admin user id
    resolution_notes = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    # Filing deadline (e.g., checkout_time + 72 hours)
    filing_deadline = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="incidents", foreign_keys=[booking_id])
