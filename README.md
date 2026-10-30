# 🔬 EquipGrid — Institutional Resource & Equipment Sharing Platform
> **A trusted platform enabling colleges, research labs, and makerspaces to safely share underused high-end equipment, specialized labs, and tools with verified custody, fair allocation, and an immutable audit trail.**

[![Hackathon Project](https://img.shields.io/badge/Hackathon-48--Hour%20Sprint-blue.svg)](https://github.com/rajeevkumar-git/EquipGrid)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com)
[![AI Integration](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-8E75C2.svg)](https://ai.google.dev)

---

## 📌 Problem Statement Overview
Colleges, research laboratories, and makerspaces possess millions in specialized equipment (3D printers, CNC routers, optical oscilloscopes, cleanroom benches) that sit idle outside core hours. At the same time, students and early-stage researchers cannot afford to purchase or privately rent them. 

Ordinary calendar apps cannot solve this because they lack **trust verification, safety checklists, custody handovers, anti-monopoly quotas, and tamper-evident audit trails**.

**EquipGrid solves this with a complete 10-step lifecycle:**
1. **Owner Lists Resource** with training prerequisites, custody checklists, and fair quotas.
2. **Borrower Discovers Resource** with real-time eligibility status checks.
3. **Borrower Submits Request** with project purpose and certification IDs.
4. **Automated Verification Engine** checks weekly quotas and scheduling conflicts.
5. **Lab Manager Reviews** in a dedicated dashboard with AI qualification summaries.
6. **Request is Approved or Waitlisted** with explainable priority scores.
7. **Check-In Sign-off** with timestamped condition ratings and checklists.
8. **Return & AI Discrepancy Verification** using Gemini API to compare before/after condition.
9. **Incident Reporting & Quarantine** to protect valuable institutional property.
10. **Immutable Activity History** logged for full legal and institutional accountability.

---

## 👥 Team & Individual Contributions

| Member | Official Role | Key Contributions |
| :--- | :--- | :--- |
| **Rajeev (Lead)** | **Full-Stack & UX Architect** | Platform architecture, React/Next.js frontend, API integration, Judge Persona Switcher, cloud deployment. |
| **Farhan** | **Backend Engineer (Python)** | FastAPI REST services, relational DB models, booking/approval state machines, check-in/return endpoints. |
| **Shubham** | **AI/ML & Smart Allocation** | Fair Allocation anti-monopoly engine, immutable audit logging middleware, Gemini API condition/incident analysis. |
| **Aman** | **Product QA & Documentation** | Curated realistic institutional seed data, full 10-step QA validation, authored submission PDF & testing guide. |

---

## ⚡ Quick Start (Local Setup in 2 Minutes)

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload --port 8000
```
*API interactive documentation will be available at:* **http://localhost:8000/docs**

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Web application will be accessible at:* **http://localhost:5173**

---

## 👨‍⚖️ Judge Testing Guide ("Zero-Friction" Walkthrough)

EquipGrid features a persistent **"Judge Evaluation Mode"** bar at the top of every screen:

1. **Step 1:** Open `http://localhost:5173`. You start logged in as **Student (Aarav Singh)**.
2. **Step 2:** Explore the catalog and click **"Request Slot"** on the *Formlabs Form 3+ 3D Printer*.
3. **Step 3:** Select a time slot, enter a sample purpose (*e.g., Drone propeller prototyping*), and submit.
4. **Step 4:** In the top Judge Bar, click **"🔬 Lab In-charge"** (Dr. Priya Roy). You are switched instantly without logging out!
5. **Step 5:** Navigate to **"Lab Dashboard"** → See Aarav's pending request → Click **"Approve Slot"**.
6. **Step 6:** Click **"👨‍🎓 Student"** in the top Judge Bar → Go to **"My Bookings"**.
7. **Step 7 (Check-in):** Click **"Step 7: Check In"** → Complete the custody checklist → Confirm.
8. **Step 8 (Return):** Click **"Step 8: Return & AI Verify"** → Select final condition (try *'Fair'* or *'Damaged'*) → Watch the **AI Discrepancy Engine** analyze and log the condition drop!
9. **Step 9 (Audit History):** Click **"Audit Trail"** in the navigation bar to inspect the immutable ledger of every event.

---

## 🛡️ Fair Allocation & Anti-Monopoly System
- **Weekly Quota Limits:** Students have a capped weekly usage on high-demand equipment.
- **Cooldown Interval:** Enforces a mandatory cooling-off window between consecutive bookings.
- **Explainable Priority Queue:**
  $$\text{Priority Score} = 0.3 \times \text{Trust} + 0.3 \times \text{WaitTime} - 0.2 \times \text{RecentUsage} + 0.1 \times \text{Purpose} - 0.1 \times \text{Incidents}$$

---

## 📄 License & Integrity
Developed as original work during the official 48-hour hackathon window (Oct 30 – Nov 1). All mock equipment data and images are fictional or open-source assets.
