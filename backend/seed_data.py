"""
EquipGrid — Seed Data
Run this ONCE after setting up the database:
    cd backend
    python seed_data.py

Creates 4 demo users + 6 institutional equipment listings + availability slots.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from app.database import SessionLocal, init_db
from app.models.user import User, UserCredential
from app.models.resource import Resource, AvailabilitySlot
from app.core.security import hash_password

DEMO_PASSWORD = "Demo@1234"


def seed():
    init_db()
    db = SessionLocal()

    # ── Demo Users ──────────────────────────────────────────────────────────

    users_data = [
        {
            "email": "student@equipgrid.demo",
            "full_name": "Aarav Singh",
            "role": "borrower",
            "institutional_affiliation": "IIT Delhi",
            "department": "Electronics & Communication",
            "trust_score": 0.95,
            "is_verified": True,
        },
        {
            "email": "labmanager@equipgrid.demo",
            "full_name": "Dr. Priya Roy",
            "role": "owner",
            "institutional_affiliation": "IIT Delhi",
            "department": "Advanced Fabrication Lab",
            "trust_score": 1.0,
            "is_verified": True,
        },
        {
            "email": "admin@equipgrid.demo",
            "full_name": "Prof. Ramesh Kumar",
            "role": "admin",
            "institutional_affiliation": "IIT Delhi",
            "department": "Dean of Research",
            "trust_score": 1.0,
            "is_verified": True,
        },
        {
            "email": "researcher@equipgrid.demo",
            "full_name": "Mehak Sharma",
            "role": "borrower",
            "institutional_affiliation": "IIT Delhi",
            "department": "Materials Science",
            "trust_score": 0.88,
            "is_verified": True,
        },
    ]

    created_users = {}
    for ud in users_data:
        existing = db.query(User).filter(User.email == ud["email"]).first()
        if existing:
            print(f"  [skip] User already exists: {ud['email']}")
            created_users[ud["role"]] = existing
            continue

        user = User(
            email=ud["email"],
            password_hash=hash_password(DEMO_PASSWORD),
            full_name=ud["full_name"],
            role=ud["role"],
            institutional_affiliation=ud.get("institutional_affiliation"),
            department=ud.get("department"),
            trust_score=ud.get("trust_score", 1.0),
            is_verified=ud.get("is_verified", False),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        created_users[ud["role"]] = user
        print(f"  [created] User: {user.full_name} ({user.role})")

    # Add credentials to student
    student = db.query(User).filter(User.email == "student@equipgrid.demo").first()
    if student and not student.credentials:
        creds = [
            UserCredential(
                user_id=student.id,
                credential_type="training",
                credential_name="Laser Safety Level 1",
                issued_by="IIT Delhi Safety Office",
                issued_at=datetime(2024, 3, 15),
                expires_at=datetime(2026, 3, 15),
                verified=True,
            ),
            UserCredential(
                user_id=student.id,
                credential_type="certification",
                credential_name="3D Printing Operator",
                issued_by="Fab Lab IIT Delhi",
                issued_at=datetime(2024, 1, 10),
                verified=True,
            ),
        ]
        db.add_all(creds)
        db.commit()
        print(f"  [created] Credentials for {student.full_name}")

    # ── Resources ────────────────────────────────────────────────────────────

    owner = db.query(User).filter(User.email == "labmanager@equipgrid.demo").first()

    resources_data = [
        {
            "name": "Formlabs Form 3+ SLA 3D Printer",
            "description": (
                "Industrial-grade stereolithography 3D printer for high-resolution resin prototypes. "
                "Capable of printing at 25–300 micron layer height. Ideal for mechanical parts, "
                "dental models, and functional prototypes."
            ),
            "category": "equipment",
            "location": "Fab Lab, Room 201, Block C",
            "images": [
                "https://images.unsplash.com/photo-1581092921461-39b9d08c0e82?w=800",
                "https://images.unsplash.com/photo-1612198790700-07c12f2c5389?w=800",
            ],
            "max_booking_hours": 6,
            "max_bookings_per_user_per_month": 4,
            "approval_mode": "manual",
            "requires_supervision": False,
            "requires_deposit": True,
            "deposit_amount": 500.0,
            "baseline_condition": "excellent",
            "baseline_notes": "Resin tank full, build plate clean, all calibrations current.",
            "condition_checklist": [
                "Resin tank is not contaminated",
                "Build plate is clean and level",
                "Print bed scraper is present",
                "Resin bottle sealed after use",
                "Platform cleaned with IPA",
                "No resin spills on exterior",
            ],
            "eligibility_requirements": [
                {
                    "type": "certification",
                    "name": "3D Printing Operator",
                    "mandatory": True,
                    "description": "Must hold a valid 3D Printing Operator certification from Fab Lab IIT Delhi.",
                }
            ],
            "usage_rules": [
                "Maximum 500ml resin per session.",
                "Clean build plate before leaving.",
                "Do not modify print settings without supervisor approval.",
                "Report any failed prints immediately.",
            ],
            "fair_usage_policy": {
                "max_hours_per_week": 6,
                "cooldown_hours": 2,
                "max_concurrent": 1,
            },
        },
        {
            "name": "Keysight InfiniiVision 4-Channel Oscilloscope (1 GHz)",
            "description": (
                "High-performance digital oscilloscope with 1 GHz bandwidth, 4 GSa/s sample rate, "
                "and 4 channels. Equipped with serial decode, power analysis, and waveform generator. "
                "Essential for PCB debugging, signal integrity testing, and embedded systems work."
            ),
            "category": "device",
            "location": "Electronics Lab, Room 105, Block A",
            "images": [
                "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800",
            ],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 6,
            "approval_mode": "auto",
            "requires_supervision": False,
            "requires_deposit": False,
            "deposit_amount": 0.0,
            "baseline_condition": "excellent",
            "baseline_notes": "All 4 probes present, power adapter in drawer, calibration valid until Dec 2025.",
            "condition_checklist": [
                "All 4 probes present and undamaged",
                "BNC connectors free of debris",
                "Power cable secure",
                "Display screen unscratched",
                "All probe hooks intact",
            ],
            "eligibility_requirements": [],
            "usage_rules": [
                "Return all 4 probes after use.",
                "Do not exceed 400V input (CAT I).",
                "Power off when not in use.",
            ],
            "fair_usage_policy": {
                "max_hours_per_week": 16,
                "cooldown_hours": 1,
                "max_concurrent": 1,
            },
        },
        {
            "name": "Universal Laser Systems VLS 3.5 CO2 Laser Cutter",
            "description": (
                "Professional laser cutter/engraver with a 24×18 inch cutting area. "
                "Supports wood, acrylic, leather, fabric, paper, and anodized metals. "
                "50W CO2 laser with autofocus. Supervised use mandatory."
            ),
            "category": "equipment",
            "location": "Makerspace, Room G-04, Block B",
            "images": [
                "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
            ],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 3,
            "approval_mode": "manual",
            "requires_supervision": True,
            "supervisor_contact": "makerspace@iitd.ac.in | Dr. Priya Roy: +91-98765-43210",
            "requires_deposit": True,
            "deposit_amount": 1000.0,
            "baseline_condition": "good",
            "baseline_notes": "Lens cleaned last week. Exhaust filter at 70% capacity.",
            "condition_checklist": [
                "Lens is clean and unscratched",
                "Cutting bed free of debris",
                "Exhaust system operational",
                "Emergency stop button tested",
                "All scrap material removed",
                "Ventilation running during entire session",
            ],
            "eligibility_requirements": [
                {
                    "type": "training",
                    "name": "Laser Safety Level 1",
                    "mandatory": True,
                    "description": "Must hold valid Laser Safety Level 1 certificate from IIT Delhi Safety Office.",
                },
                {
                    "type": "approval",
                    "name": "Supervisor Approval",
                    "mandatory": True,
                    "description": "Supervisor must be physically present during the entire session.",
                },
            ],
            "usage_rules": [
                "Never leave the machine unattended while cutting.",
                "Only approved materials allowed — no PVC, polycarbonate.",
                "Fire extinguisher must be accessible.",
                "Log all materials used in the session logbook.",
            ],
            "fair_usage_policy": {
                "max_hours_per_week": 4,
                "cooldown_hours": 4,
                "max_concurrent": 1,
            },
        },
        {
            "name": "Sony Alpha 7S III 4K Cinema Camera Kit",
            "description": (
                "Full-frame mirrorless cinema camera system ideal for research documentation, "
                "high-speed imaging, and low-light recording. Kit includes: body, 24-70mm f/2.8 lens, "
                "35mm f/1.4 lens, 2× CFexpress cards, cage rig, and Rode Wireless GO II."
            ),
            "category": "device",
            "location": "Media Center, Room 301, Admin Block",
            "images": [
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
            ],
            "max_booking_hours": 12,
            "max_bookings_per_user_per_month": 2,
            "approval_mode": "manual",
            "requires_supervision": False,
            "requires_deposit": True,
            "deposit_amount": 2000.0,
            "baseline_condition": "excellent",
            "baseline_notes": "Body, both lenses, all accessories in case. Sensor clean. Batteries fully charged.",
            "condition_checklist": [
                "Camera body unscratched",
                "Both lenses present and caps on",
                "Sensor dust-free (check before return)",
                "Both CFexpress cards present",
                "Cage rig and screws complete",
                "Rode mic present and charged",
                "All batteries returned",
                "Case zippers functional",
            ],
            "eligibility_requirements": [
                {
                    "type": "role",
                    "name": "IIT Delhi Faculty or Research Scholar",
                    "mandatory": True,
                    "description": "Equipment available only to faculty, PhD scholars, and registered project teams.",
                }
            ],
            "usage_rules": [
                "Do not remove camera from campus without prior written approval.",
                "Format cards after copying footage (do not delete individual files).",
                "Report any accidental drops immediately — do not attempt repairs.",
            ],
            "fair_usage_policy": {
                "max_hours_per_week": 12,
                "cooldown_hours": 8,
                "max_concurrent": 1,
            },
        },
        {
            "name": "NVIDIA RTX 4090 Deep Learning Workstation",
            "description": (
                "High-performance AI/ML compute workstation with dual NVIDIA RTX 4090 GPUs (96GB VRAM), "
                "AMD Threadripper 64-core CPU, 256GB ECC RAM, and 20TB NVMe storage. "
                "Configured with CUDA 12.3, PyTorch, TensorFlow, and JupyterHub."
            ),
            "category": "device",
            "location": "AI Lab, Room 402, Block D (Remote SSH available)",
            "images": [
                "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800",
            ],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 5,
            "approval_mode": "auto",
            "requires_supervision": False,
            "requires_deposit": False,
            "deposit_amount": 0.0,
            "baseline_condition": "excellent",
            "baseline_notes": "GPU temps nominal. Storage at 40% capacity. All frameworks up to date.",
            "condition_checklist": [
                "No runaway processes left running",
                "User data moved to personal storage (not local disk)",
                "GPU memory fully released",
                "No unauthorized software installed",
                "Environment files cleaned up",
            ],
            "eligibility_requirements": [
                {
                    "type": "role",
                    "name": "IIT Delhi Faculty or Research Scholar",
                    "mandatory": True,
                    "description": "Only registered IIT Delhi researchers may access this workstation.",
                }
            ],
            "usage_rules": [
                "Maximum 8 hours per session. Must release promptly at end time.",
                "Do not store sensitive research data on local disk.",
                "All compute jobs must be logged in the usage journal.",
                "GPU utilization below 80% for 30+ minutes triggers an automatic release warning.",
            ],
            "fair_usage_policy": {
                "max_hours_per_week": 24,
                "cooldown_hours": 2,
                "max_concurrent": 1,
            },
        },
        {
            "name": "Cleanroom B4 — Photolithography Bench",
            "description": (
                "ISO Class 5 cleanroom workstation for photolithography, thin-film deposition preparation, "
                "and semiconductor fabrication research. Includes spin coater, UV exposure unit, "
                "wet chemistry station, and optical microscope. Gowning required."
            ),
            "category": "lab",
            "location": "Nano Fabrication Centre, Sub-level 1, Block E",
            "images": [
                "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
            ],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 3,
            "approval_mode": "manual",
            "requires_supervision": True,
            "supervisor_contact": "nanofab@iitd.ac.in | Dr. Priya Roy: +91-98765-43210",
            "requires_deposit": True,
            "deposit_amount": 3000.0,
            "baseline_condition": "excellent",
            "baseline_notes": "Spin coater calibrated. UV lamp hours: 320/1000. All chemicals within expiry.",
            "condition_checklist": [
                "Cleanroom gowning removed and stored",
                "Spin coater chuck cleaned",
                "Chemical bottles sealed and labeled",
                "Waste chemicals disposed per SOP",
                "Optical microscope covered",
                "UV exposure lamp powered off",
                "Bench surface wiped clean",
                "Particle count checked (< 100/m³)",
            ],
            "eligibility_requirements": [
                {
                    "type": "training",
                    "name": "Laser Safety Level 1",
                    "mandatory": True,
                    "description": "UV laser safety training required.",
                },
                {
                    "type": "training",
                    "name": "Cleanroom Protocol Certification",
                    "mandatory": True,
                    "description": "Must have completed Nano Fab Centre cleanroom induction and protocol training.",
                },
                {
                    "type": "approval",
                    "name": "Supervisor Approval",
                    "mandatory": True,
                    "description": "Nano Fab Centre supervisor must be present during the entire session.",
                },
            ],
            "usage_rules": [
                "Always follow the full gowning procedure — no exceptions.",
                "Never bring food, drinks, or personal electronics into the cleanroom.",
                "Log all chemicals used in the chemical usage registry.",
                "Emergency shower location: outside cleanroom exit, right side.",
            ],
            "fair_usage_policy": {
                "max_hours_per_week": 4,
                "cooldown_hours": 6,
                "max_concurrent": 1,
            },
        },
    ]

    for rd in resources_data:
        existing = db.query(Resource).filter(Resource.name == rd["name"]).first()
        if existing:
            print(f"  [skip] Resource already exists: {rd['name']}")
            resource = existing
        else:
            resource = Resource(
                owner_id=owner.id,
                **rd,
            )
            db.add(resource)
            db.commit()
            db.refresh(resource)
            print(f"  [created] Resource: {resource.name}")

        # Add availability slots for the next 7 days
        _add_slots(db, resource.id)

    db.close()
    print("\n[SUCCESS] Seed data complete!")
    print(f"\nDemo Login Credentials (password: {DEMO_PASSWORD}):")
    print("  Student:     student@equipgrid.demo")
    print("  Lab Manager: labmanager@equipgrid.demo")
    print("  Admin:       admin@equipgrid.demo")
    print("  Researcher:  researcher@equipgrid.demo")
    print("\n  OR use /api/auth/demo-login/{email} for passwordless demo login (Judge Switcher)")


def _add_slots(db, resource_id: str):
    """Add one morning + one afternoon slot for each of the next 5 days."""
    base = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    slots_added = 0
    for day_offset in range(1, 6):
        day = base + timedelta(days=day_offset)
        for start_hour, end_hour in [(9, 13), (14, 18)]:
            start = day.replace(hour=start_hour)
            end = day.replace(hour=end_hour)
            exists = db.query(AvailabilitySlot).filter(
                AvailabilitySlot.resource_id == resource_id,
                AvailabilitySlot.start_time == start,
            ).first()
            if not exists:
                db.add(AvailabilitySlot(resource_id=resource_id, start_time=start, end_time=end))
                slots_added += 1
    if slots_added:
        db.commit()


if __name__ == "__main__":
    print("[INFO] Seeding EquipGrid database...")
    seed()
