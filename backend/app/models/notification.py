import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, nullable=False, index=True)

    type = Column(String, nullable=False)
    # booking_approved | booking_rejected | booking_waitlisted | checkin_reminder
    # return_reminder | incident_filed | incident_resolved | overdue_warning

    title = Column(String, nullable=False)
    body = Column(Text, nullable=True)

    related_entity_type = Column(String, nullable=True)
    related_entity_id = Column(String, nullable=True)

    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications", foreign_keys=[user_id])
