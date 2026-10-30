# EquipGrid Frontend

React 18 + Vite + Tailwind CSS frontend for **EquipGrid** (Institutional Resource & Equipment Sharing Platform).

## Features

- 🌟 **Judge Evaluation Switcher**: One-click toggle between Student (`borrower`), Lab Manager (`owner`), and Admin (`admin`) personas.
- 🔍 **Interactive Catalog**: Filter by category (Equipment, Device, Lab), full-text search, and real-time status badges.
- 📋 **10-Step Custody Lifecycle**:
  - Request with automated quota and training certification checks
  - Manager approval/rejection queue
  - Check-in condition checklist sign-off (Step 7)
  - Return condition verification with automated AI discrepancy detection (Step 8)
- ⚖️ **Fair Usage Indicator**: Live weekly quota consumption bar to prevent monopolization.
- 📜 **Verifiable Audit Trail**: Real-time chronological immutable ledger of every transaction.

## Quick Start

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` and automatically proxies `/api` calls to the FastAPI backend running on `http://localhost:8000`.
