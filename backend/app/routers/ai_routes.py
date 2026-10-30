from fastapi import APIRouter, UploadFile, File, Depends
from app.core.deps import get_current_user
from app.models.user import User
from app.services.gemini_service import (
    verify_training_certificate,
    analyze_condition_discrepancy,
    summarize_incident,
    classify_purpose,
)
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/ai", tags=["AI (Gemini)"])


class VerifyDocRequest(BaseModel):
    document_text: str = ""


class ConditionCompareRequest(BaseModel):
    resource_name: str = "equipment"
    checkin_rating: str
    checkin_notes: Optional[str] = ""
    checkin_checklist: dict = {}
    return_rating: str
    return_notes: Optional[str] = ""
    return_checklist: dict = {}


class IncidentSummaryRequest(BaseModel):
    incident_type: str
    description: str
    severity: Optional[str] = ""


class PurposeClassifyRequest(BaseModel):
    purpose_text: str
    resource_type: str = "equipment"


@router.post("/verify-document")
async def verify_document(
    payload: VerifyDocRequest,
    current_user: User = Depends(get_current_user),
):
    """Verify a training certificate using Gemini AI."""
    return verify_training_certificate(document_text=payload.document_text)


@router.post("/verify-document-image")
async def verify_document_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Verify a training certificate by uploading an image."""
    image_bytes = await file.read()
    return verify_training_certificate(image_bytes=image_bytes)


@router.post("/analyze-condition")
def analyze_condition(
    payload: ConditionCompareRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Compare check-in vs return condition using Gemini AI.
    This is the DEMO SHOWSTOPPER — the feature that wins the hackathon.
    """
    return analyze_condition_discrepancy(
        checkin_rating=payload.checkin_rating,
        checkin_notes=payload.checkin_notes or "",
        checkin_checklist=payload.checkin_checklist,
        return_rating=payload.return_rating,
        return_notes=payload.return_notes or "",
        return_checklist=payload.return_checklist,
        resource_name=payload.resource_name,
    )


@router.post("/summarize-incident")
def summarize_incident_report(
    payload: IncidentSummaryRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate a structured incident summary for admins using Gemini AI."""
    return summarize_incident(
        incident_type=payload.incident_type,
        description=payload.description,
        severity=payload.severity,
    )


@router.post("/classify-purpose")
def classify_booking_purpose(
    payload: PurposeClassifyRequest,
    current_user: User = Depends(get_current_user),
):
    """Classify a booking purpose and score its legitimacy (feeds waitlist priority)."""
    return classify_purpose(payload.purpose_text, payload.resource_type)
