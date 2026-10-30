from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import auth, resources, bookings, incidents, audit, fairness, notifications, ai_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create all DB tables
    init_db()
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
