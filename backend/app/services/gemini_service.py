import os
import json
import base64
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

try:
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    _model = genai.GenerativeModel("gemini-1.5-flash")
    GEMINI_AVAILABLE = bool(GEMINI_API_KEY)
except Exception:
    GEMINI_AVAILABLE = False
    _model = None


def _safe_json(text: str) -> dict:
    """Extract JSON from Gemini's markdown-wrapped response."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1])
    try:
        return json.loads(text)
    except Exception:
        return {"raw": text}


def verify_training_certificate(document_text: str = "", image_bytes: bytes = None) -> dict:
    """
    Use Gemini to verify a training/qualification certificate.
    Returns structured result with validity, cert_type, holder_name, expired, confidence.
    """
    if not GEMINI_AVAILABLE:
        return {
            "valid": True,
            "cert_type": "Safety Training (Simulated)",
            "holder_name": "Demo User",
            "expired": False,
            "confidence": 85,
            "notes": "Gemini API not configured — using simulated verification.",
        }

    prompt = f"""
Analyze this training/qualification certificate document.

Document content: {document_text or "(image provided)"}

Determine:
1. Is this a valid training or qualification certificate?
2. What type of certification is it? (e.g. "Laser Safety Level 1", "CNC Operator Certification")
3. What is the certificate holder's name?
4. Is it expired? (check visible dates)
5. Confidence score from 0 to 100.

Return ONLY valid JSON, no markdown:
{{"valid": true_or_false, "cert_type": "string", "holder_name": "string", "expired": true_or_false, "confidence": integer, "notes": "string"}}
"""
    try:
        if image_bytes:
            import google.generativeai as genai
            image_part = {"mime_type": "image/jpeg", "data": base64.b64encode(image_bytes).decode()}
            response = _model.generate_content([prompt, image_part])
        else:
            response = _model.generate_content(prompt)
        return _safe_json(response.text)
    except Exception as e:
        return {"valid": False, "error": str(e), "confidence": 0}


def analyze_condition_discrepancy(
    checkin_rating: str,
    checkin_notes: str,
    checkin_checklist: dict,
    return_rating: str,
    return_notes: str,
    return_checklist: dict,
    resource_name: str = "equipment",
) -> dict:
    """
    Compare check-in vs. return condition using Gemini.
    Returns damage assessment with severity and recommended action.
    This is the DEMO SHOWSTOPPER feature.
    """
    if not GEMINI_AVAILABLE:
        # Simulate result based on rating drop
        ratings = {"excellent": 4, "good": 3, "fair": 2, "damaged": 1}
        checkin_val = ratings.get(checkin_rating, 3)
        return_val = ratings.get(return_rating, 3)
        delta = checkin_val - return_val
        severity_map = {0: "none", 1: "minor", 2: "moderate", 3: "severe"}
        severity = severity_map.get(min(delta, 3), "none")
        return {
            "damage_detected": delta > 0,
            "description": f"Condition dropped from {checkin_rating} to {return_rating}." if delta > 0 else "No significant changes detected.",
            "severity": severity,
            "confidence": 0.82,
            "recommended_action": "File incident report and notify owner." if delta > 1 else ("Owner review recommended." if delta == 1 else "No action required."),
            "note": "Gemini API not configured — using rule-based simulation.",
        }

    prompt = f"""
You are an equipment condition assessment expert for {resource_name}.

CHECK-IN CONDITION:
- Rating: {checkin_rating}
- Notes: "{checkin_notes or 'None'}"
- Checklist responses: {json.dumps(checkin_checklist)}

RETURN CONDITION:
- Rating: {return_rating}
- Notes: "{return_notes or 'None'}"
- Checklist responses: {json.dumps(return_checklist)}

Compare the two records and identify:
1. Whether any new damage, wear, or deterioration occurred during this booking.
2. Severity of the change: none, minor, moderate, or severe.
3. Recommended action for the resource owner.

Return ONLY valid JSON, no markdown:
{{"damage_detected": true_or_false, "description": "string", "severity": "none|minor|moderate|severe", "confidence": 0.0_to_1.0, "recommended_action": "string"}}
"""
    try:
        response = _model.generate_content(prompt)
        return _safe_json(response.text)
    except Exception as e:
        return {"damage_detected": False, "error": str(e)}


def summarize_incident(incident_type: str, description: str, severity: str = "") -> dict:
    """
    Generate a structured admin-facing incident summary using Gemini.
    """
    if not GEMINI_AVAILABLE:
        return {
            "one_line_summary": f"{incident_type.title()} incident reported.",
            "severity_assessment": severity or "moderate",
            "recommended_next_steps": [
                "Review evidence photos.",
                "Contact both parties within 48 hours.",
                "Determine liability and resolution.",
            ],
        }

    prompt = f"""
Summarize this equipment incident report for an institutional administrator.

Incident Type: {incident_type}
Severity: {severity or "not specified"}
Description: "{description}"

Generate a concise, professional response as valid JSON, no markdown:
{{"one_line_summary": "string", "severity_assessment": "string", "recommended_next_steps": ["step1", "step2", "step3"]}}
"""
    try:
        response = _model.generate_content(prompt)
        return _safe_json(response.text)
    except Exception as e:
        return {"one_line_summary": description[:100], "error": str(e)}


def generate_rejection_explanation(resource_name: str, failed_requirements: list) -> str:
    """Generate a friendly, actionable rejection explanation for the user."""
    if not GEMINI_AVAILABLE:
        reqs = ", ".join(failed_requirements) if failed_requirements else "eligibility requirements"
        return (
            f"Your request for '{resource_name}' could not be approved because you have not met "
            f"the following requirements: {reqs}. "
            f"Please complete the necessary training or certification and reapply."
        )

    prompt = f"""
A user's booking request for "{resource_name}" was rejected because they did not meet these requirements:
{json.dumps(failed_requirements)}

Write a friendly, constructive 2-sentence explanation telling them exactly what they need to do to qualify in the future.
Do not use technical jargon. Be encouraging and specific.
Return only the explanation text, no JSON.
"""
    try:
        response = _model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return f"Your request was rejected because you did not meet the eligibility requirements: {', '.join(failed_requirements)}. Please complete the required training and try again."


def classify_purpose(purpose_text: str, resource_type: str) -> dict:
    """Classify the booking purpose and score its legitimacy (0.0–1.0)."""
    if not GEMINI_AVAILABLE:
        return {"score": 0.75, "category": "academic_research", "red_flags": []}

    prompt = f"""
Rate the legitimacy of this booking purpose for a {resource_type} on a scale of 0.0 to 1.0.

Purpose: "{purpose_text}"

Consider: Is this a legitimate academic, research, or professional use? Are there any red flags?

Return ONLY valid JSON, no markdown:
{{"score": 0.0_to_1.0, "category": "string", "reasoning": "string", "red_flags": []}}
"""
    try:
        response = _model.generate_content(prompt)
        return _safe_json(response.text)
    except Exception:
        return {"score": 0.5, "category": "unknown", "red_flags": []}
