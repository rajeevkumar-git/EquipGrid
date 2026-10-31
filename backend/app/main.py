from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import auth, resources, bookings, incidents, audit, fairness, notifications, ai_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create all DB tables
    init_db()
    # Auto-seed demo data if brand new database or missing updated catalog items
    try:
        from app.database import SessionLocal
        from app.models.user import User
        from app.models.resource import Resource
        db = SessionLocal()
        user_count = db.query(User).count()
        resource_count = db.query(Resource).count()
        if user_count == 0 or resource_count < 30:
            print(f"[INFO] Auto-seed triggered (users: {user_count}, resources: {resource_count}). Populating 30 verified items...")
            try:
                import seed_data
                seed_data.seed()
                print("[INFO] Auto-seeding completed successfully!")
            except Exception as se:
                print(f"[WARN] Auto-seed failed: {se}")
        db.close()
    except Exception as e:
        print(f"[WARN] DB check during startup failed: {e}")
    yield
    # Shutdown (nothing needed)


app = FastAPI(
    title="EquipGrid API",
    description=(
        "A trusted institutional equipment and space sharing platform. "
        "Supports the complete 10-step custody lifecycle: "
        "List → Discover → Request → Verify → Approve → Check-in → Return → Audit."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(resources.router)
app.include_router(bookings.router)
app.include_router(incidents.router)
app.include_router(audit.router)
app.include_router(fairness.router)
app.include_router(notifications.router)
app.include_router(ai_routes.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "project": "EquipGrid",
        "status": "running",
        "docs": "/docs",
        "version": "1.0.0",
        "hackathon": "Unlock Underused Equipment and Spaces",
        "team": ["Rajeev (Lead)", "Farhan (Backend)", "Shubham (AI/ML)", "Aman (QA/Docs)"],
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
