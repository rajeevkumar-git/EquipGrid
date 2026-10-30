import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True, default=gen_uuid)
    owner_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False, default="equipment")
    # category: lab | equipment | space | device | vehicle | other

    location = Column(String, nullable=True)
    images = Column(JSON, default=list)             # list of image URLs

    status = Column(String, default="available")
    # status: available | reserved | in_use | maintenance | retired

    # Booking policies
    max_booking_hours = Column(Integer, default=8)
    max_bookings_per_user_per_month = Column(Integer, default=5)
    approval_mode = Column(String, default="manual")   # auto | manual

    # Safety & trust
    requires_supervision = Column(Boolean, default=False)
    supervisor_contact = Column(String, nullable=True)
    requires_deposit = Column(Boolean, default=False)
    deposit_amount = Column(Float, default=0.0)

    # Condition baseline
    baseline_condition = Column(String, default="excellent")
    # excellent | good | fair | damaged
    baseline_notes = Column(Text, nullable=True)

    # Condition checklist (custom per resource)
    condition_checklist = Column(JSON, default=list)
    # e.g. ["All lenses clean", "Power cable intact", "Cleaned after use"]

    # Eligibility requirements stored as structured JSON
    # [{type: training|certification|role|approval, name: str, mandatory: bool, description: str}]
    eligibility_requirements = Column(JSON, default=list)

    # Human-readable usage rules
    usage_rules = Column(JSON, default=list)

    # Fair usage policy
    fair_usage_policy = Column(JSON, default=dict)
    # {max_hours_per_week: 6, cooldown_hours: 4, max_concurrent: 2}

    # AI-extracted searchable tags
    ai_description_tags = Column(JSON, default=list)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="owned_resources", foreign_keys=[owner_id])
    availability_slots = relationship("AvailabilitySlot", back_populates="resource", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="resource")


class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id = Column(String, primary_key=True, default=gen_uuid)
    resource_id = Column(String, nullable=False, index=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_booked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resource = relationship("Resource", back_populates="availability_slots")
