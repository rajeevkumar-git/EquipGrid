import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=gen_uuid)
    resource_id = Column(String, nullable=False, index=True)
    borrower_id = Column(String, nullable=False, index=True)

    # Time window
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    actual_checkin_time = Column(DateTime, nullable=True)
    actual_checkout_time = Column(DateTime, nullable=True)

    # Purpose
    purpose_text = Column(Text, nullable=False)
    purpose_category = Column(String, nullable=True)    # Gemini-classified
    purpose_score = Column(Float, nullable=True)        # Gemini legitimacy 0.0-1.0

    # State machine
    # pending → verifying → pending_approval → approved|rejected|waitlisted
    # approved → checked_in → checked_out|overdue → completed|disputed
    status = Column(String, default="pending", nullable=False, index=True)

    # Waitlist
    waitlist_position = Column(Integer, nullable=True)
    waitlist_priority_score = Column(Float, nullable=True)

    # Decision tracking
    rejection_reason = Column(Text, nullable=True)
    ai_rejection_explanation = Column(Text, nullable=True)   # Gemini-generated
    cancellation_reason = Column(Text, nullable=True)

    # Reviewer
    approved_by = Column(String, nullable=True)    # user id
    reviewed_at = Column(DateTime, nullable=True)

    # Uploaded documents (training certs etc.)
    documents = Column(JSON, default=list)
    # [{name: str, url: str, type: str, uploaded_at: str}]

    # Verification results (per-requirement pass/fail)
    verification_results = Column(JSON, default=list)
    # [{requirement: str, passed: bool, reason: str}]

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    resource = relationship("Resource", back_populates="bookings", foreign_keys=[resource_id])
    borrower = relationship("User", back_populates="bookings", foreign_keys=[borrower_id])
    condition_records = relationship("ConditionRecord", back_populates="booking", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="booking")
