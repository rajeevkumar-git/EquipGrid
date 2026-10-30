import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class ConditionRecord(Base):
    __tablename__ = "condition_records"

    id = Column(String, primary_key=True, default=gen_uuid)
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False, index=True)

    record_type = Column(String, nullable=False)
    condition_rating = Column(String, nullable=False)
    checklist_responses = Column(JSON, default=dict)
    notes = Column(Text, nullable=True)
    photos = Column(JSON, default=list)

    ai_damage_detected = Column(Boolean, nullable=True)
    ai_damage_description = Column(Text, nullable=True)
    ai_damage_severity = Column(String, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    ai_recommended_action = Column(Text, nullable=True)

    recorded_by = Column(String, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="condition_records")
