import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=gen_uuid)
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False, index=True)
    resource_id = Column(String, ForeignKey("resources.id"), nullable=False, index=True)
    reported_by = Column(String, nullable=False)

    incident_type = Column(String, nullable=False)
    severity = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    evidence_photos = Column(JSON, default=list)
    estimated_cost = Column(Float, nullable=True)

    ai_summary = Column(Text, nullable=True)
    ai_severity_assessment = Column(String, nullable=True)
    ai_recommended_steps = Column(JSON, default=list)

    status = Column(String, default="open")
    resolved_by = Column(String, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    filing_deadline = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="incidents")
