# EquipGrid Backend

FastAPI backend for the institutional resource & equipment sharing platform.

## Quick Start

```bash
# 1. Clone and navigate
cd backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
copy .env.example .env
# Edit .env — add your GEMINI_API_KEY

# 5. Seed the database with demo data
python seed_data.py

# 6. Start the server
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for the full interactive API documentation.

## Demo Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Student (Borrower) | student@equipgrid.demo | Demo@1234 |
| Lab Manager (Owner) | labmanager@equipgrid.demo | Demo@1234 |
| Admin | admin@equipgrid.demo | Demo@1234 |
| Researcher | researcher@equipgrid.demo | Demo@1234 |

Or use the Judge Demo Switcher endpoint for passwordless login:
`POST /api/auth/demo-login/student@equipgrid.demo`

## API Endpoints

| Group | Prefix | Owner |
|---|---|---|
| Auth | /api/auth | Farhan |
| Resources | /api/resources | Farhan |
| Bookings | /api/bookings | Farhan |
| Fair Allocation | /api/fairness | Shubham |
| Incidents | /api/incidents | Shubham |
| Audit Logs | /api/audit-logs | Shubham |
| AI (Gemini) | /api/ai | Shubham |
| Notifications | /api/notifications | All |

## Environment Variables

```
GEMINI_API_KEY=        # Get from Google AI Studio (free)
SECRET_KEY=            # Any random string for JWT signing
DATABASE_URL=          # sqlite:///./equipgrid.db (default)
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```
