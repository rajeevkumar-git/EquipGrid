import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="borrower")
    # role: admin | owner | manager | borrower

    institutional_affiliation = Column(String, nullable=True)
    department = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    trust_score = Column(Float, default=1.0)      # 0.0 - 1.0
    no_show_count = Column(Integer, default=0)
    incident_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owned_resources = relationship("Resource", back_populates="owner", foreign_keys="Resource.owner_id")
    bookings = relationship("Booking", back_populates="borrower", foreign_keys="Booking.borrower_id")
    credentials = relationship("UserCredential", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class UserCredential(Base):
    __tablename__ = "user_credentials"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, nullable=False, index=True)
    credential_type = Column(String, nullable=False)
    # credential_type: training | certification | role | other

    credential_name = Column(String, nullable=False)
    issued_by = Column(String, nullable=True)
    issued_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    verified = Column(Boolean, default=False)
    verified_by = Column(String, nullable=True)   # admin user id
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="credentials", foreign_keys=[user_id])
