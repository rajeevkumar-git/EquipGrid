import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=gen_uuid)
    resource_id = Column(String, ForeignKey("resources.id"), nullable=False, index=True)
    borrower_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)

    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    actual_checkin_time = Column(DateTime, nullable=True)
    actual_checkout_time = Column(DateTime, nullable=True)

    purpose_text = Column(Text, nullable=False)
    purpose_category = Column(String, nullable=True)
    purpose_score = Column(Float, nullable=True)

    status = Column(String, default="pending", nullable=False, index=True)

    waitlist_position = Column(Integer, nullable=True)
    waitlist_priority_score = Column(Float, nullable=True)

    rejection_reason = Column(Text, nullable=True)
    ai_rejection_explanation = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)

    approved_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    documents = Column(JSON, default=list)
    verification_results = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    resource = relationship("Resource", back_populates="bookings")
    borrower = relationship("User", back_populates="bookings")
    condition_records = relationship("ConditionRecord", back_populates="booking", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="booking")
