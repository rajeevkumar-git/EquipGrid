from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "equipgrid.db").replace("\\", "/")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL or DATABASE_URL == "sqlite:///./equipgrid.db":
    DATABASE_URL = f"sqlite:///{DEFAULT_DB_PATH}"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables on startup and safely add any missing columns."""
    from app.models import user, resource, booking, condition, incident, audit, notification  # noqa
    Base.metadata.create_all(bind=engine)

    # Safely migrate new columns across SQLite and PostgreSQL
    with engine.connect() as conn:
        for col, col_type in [
            ("stream", "VARCHAR DEFAULT 'Mechanical & Prototyping'"),
            ("hourly_rate", "FLOAT DEFAULT 150.0"),
            ("lab_manager", "VARCHAR"),
            ("deposit_amount", "FLOAT DEFAULT 1000.0"),
            ("requires_deposit", "BOOLEAN DEFAULT TRUE"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE resources ADD COLUMN {col} {col_type}"))
                conn.commit()
            except Exception:
                # Column already exists
                pass
