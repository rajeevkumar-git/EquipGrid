from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth ─────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "borrower"          # borrower | owner | admin
    institutional_affiliation: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    full_name: str


# ── User ─────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    institutional_affiliation: Optional[str]
    department: Optional[str]
    trust_score: float
    no_show_count: int
    incident_count: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Resource ──────────────────────────────────────────────────────────────────

class ResourceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str = "equipment"
    institution: Optional[str] = "IIT Delhi"
    utilization_rate: Optional[float] = 0.20
    location: Optional[str] = None
    images: list = []
    max_booking_hours: int = 8
    max_bookings_per_user_per_month: int = 5
    approval_mode: str = "manual"
    requires_supervision: bool = False
    supervisor_contact: Optional[str] = None
    requires_deposit: bool = False
    deposit_amount: float = 0.0
    baseline_condition: str = "excellent"
    baseline_notes: Optional[str] = None
    condition_checklist: list = []
    eligibility_requirements: list = []
    usage_rules: list = []
    fair_usage_policy: dict = {}


class ResourceOut(BaseModel):
    id: str
    owner_id: str
    name: str
    description: Optional[str]
    category: str
    institution: Optional[str]
    utilization_rate: Optional[float]
    location: Optional[str]
    images: list
    status: str
    max_booking_hours: int
    max_bookings_per_user_per_month: int
    approval_mode: str
    requires_supervision: bool
    supervisor_contact: Optional[str]
    requires_deposit: bool
    deposit_amount: float
    baseline_condition: str
    baseline_notes: Optional[str]
    condition_checklist: list
    eligibility_requirements: list
    usage_rules: list
    fair_usage_policy: dict
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SlotCreate(BaseModel):
    start_time: datetime
    end_time: datetime


class SlotOut(BaseModel):
    id: str
    resource_id: str
    start_time: datetime
    end_time: datetime
    is_booked: bool

    class Config:
        from_attributes = True


# ── Booking ───────────────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    resource_id: str
    start_time: datetime
    end_time: datetime
    purpose_text: str
    documents: list = []


class BookingOut(BaseModel):
    id: str
    resource_id: str
    borrower_id: str
    start_time: datetime
    end_time: datetime
    actual_checkin_time: Optional[datetime]
    actual_checkout_time: Optional[datetime]
    purpose_text: str
    purpose_category: Optional[str]
    status: str
    waitlist_position: Optional[int]
    waitlist_priority_score: Optional[float]
    rejection_reason: Optional[str]
    ai_rejection_explanation: Optional[str]
    documents: list
    verification_results: list
    approved_by: Optional[str]
    reviewed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class BookingDecision(BaseModel):
    reason: Optional[str] = None


class CancelRequest(BaseModel):
    reason: Optional[str] = None


# ── Condition Record ──────────────────────────────────────────────────────────

class ConditionRecordCreate(BaseModel):
    condition_rating: str           # excellent | good | fair | damaged
    checklist_responses: dict = {}
    notes: Optional[str] = None
    photos: list = []


class ConditionRecordOut(BaseModel):
    id: str
    booking_id: str
    record_type: str
    condition_rating: str
    checklist_responses: dict
    notes: Optional[str]
    photos: list
    ai_damage_detected: Optional[bool]
    ai_damage_description: Optional[str]
    ai_damage_severity: Optional[str]
    ai_confidence: Optional[float]
    ai_recommended_action: Optional[str]
    recorded_by: str
    recorded_at: datetime

    class Config:
        from_attributes = True


# ── Incident ──────────────────────────────────────────────────────────────────

class IncidentCreate(BaseModel):
    booking_id: str
    resource_id: str
    incident_type: str      # damage | delay | policy_violation | no_show | dispute | other
    severity: Optional[str] = None
    description: str
    evidence_photos: list = []
    estimated_cost: Optional[float] = None


class IncidentOut(BaseModel):
    id: str
    booking_id: str
    resource_id: str
    reported_by: str
    incident_type: str
    severity: Optional[str]
    description: str
    evidence_photos: list
    estimated_cost: Optional[float]
    ai_summary: Optional[str]
    ai_severity_assessment: Optional[str]
    ai_recommended_steps: list
    status: str
    resolved_by: Optional[str]
    resolution_notes: Optional[str]
    resolved_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class IncidentResolve(BaseModel):
    resolution_notes: str


# ── Audit ─────────────────────────────────────────────────────────────────────

class AuditLogOut(BaseModel):
    id: int
    entity_type: str
    entity_id: str
    action: str
    actor_id: Optional[str]
    actor_name: Optional[str]
    actor_role: Optional[str]
    details: dict
    reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Notification ──────────────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    body: Optional[str]
    related_entity_type: Optional[str]
    related_entity_id: Optional[str]
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Fairness ──────────────────────────────────────────────────────────────────

class QuotaStatus(BaseModel):
    user_id: str
    resource_id: str
    hours_used_this_week: float
    max_hours_per_week: int
    hours_remaining: float
    bookings_this_month: int
    max_bookings_per_month: int
    is_quota_exceeded: bool
    cooldown_active: bool
    cooldown_ends_at: Optional[datetime]
