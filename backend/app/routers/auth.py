from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.user import User
from app.schemas import RegisterRequest, LoginRequest, TokenResponse, UserOut
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_current_user
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()

    # Strict case-insensitive duplicate user check
    if db.query(User).filter(func.lower(User.email) == clean_email).first():
        raise HTTPException(
            status_code=400,
            detail="An account with this email address already exists. Please sign in instead."
        )

    allowed_roles = {"borrower", "owner", "admin"}
    if payload.role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {allowed_roles}")

    try:
        user = User(
            email=clean_email,
            password_hash=hash_password(payload.password),
            full_name=payload.full_name.strip(),
            role=payload.role,
            institutional_affiliation=payload.institutional_affiliation,
            department=payload.department,
            phone=payload.phone,
            is_verified=(payload.role == "admin"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="An account with this email address already exists. Please sign in instead."
        )

    log_action(
        db, entity_type="user", entity_id=user.id,
        action="USER_REGISTERED",
        actor_id=user.id, actor_name=user.full_name, actor_role=user.role,
        details={"email": user.email, "role": user.role},
    )

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user_id=user.id, role=user.role, full_name=user.full_name)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user_id=user.id, role=user.role, full_name=user.full_name)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """
    Returns pre-seeded demo user credentials for the Judge Demo Switcher.
    These are the 4 roles judges can instantly switch between.
    """
    users = db.query(User).filter(User.email.in_([
        "student@equipgrid.demo",
        "labmanager@equipgrid.demo",
        "admin@equipgrid.demo",
        "researcher@equipgrid.demo",
    ])).all()

    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role,
            "label": {
                "borrower": "Student (Aarav Singh)",
                "owner": "Lab Manager (Dr. Priya Roy)",
                "admin": "Admin (Institute Head)",
            }.get(u.role, u.role),
        }
        for u in users
    ]


@router.post("/demo-login/{user_email}")
def demo_login(user_email: str, db: Session = Depends(get_db)):
    """One-click login for Judge Demo Switcher — no password needed for demo users."""
    demo_emails = [
        "student@equipgrid.demo",
        "labmanager@equipgrid.demo",
        "admin@equipgrid.demo",
        "researcher@equipgrid.demo",
    ]
    clean_email = user_email.strip().lower()
    if clean_email not in demo_emails:
        raise HTTPException(status_code=403, detail="Only demo accounts allow passwordless login")

    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found — run seed_data.py first")

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user_id=user.id, role=user.role, full_name=user.full_name)
