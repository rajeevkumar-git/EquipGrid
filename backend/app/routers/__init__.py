from app.routers.auth import router as auth_router
from app.routers.resources import router as resources_router
from app.routers.bookings import router as bookings_router
from app.routers.incidents import router as incidents_router
from app.routers.audit import router as audit_router
from app.routers.fairness import router as fairness_router
from app.routers.notifications import router as notifications_router
from app.routers.ai_routes import router as ai_router

__all__ = [
    "auth_router", "resources_router", "bookings_router",
    "incidents_router", "audit_router", "fairness_router",
    "notifications_router", "ai_router",
]
