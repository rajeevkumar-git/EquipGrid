# 🏆 48-HOUR HACKATHON MASTER PLAN & TEAM ROLES GUIDE
**Problem Statement:** Unlock Underused Equipment and Spaces  
**Project Working Title:** **EquipGrid** (Institutional Resource & Equipment Sharing Platform)  
**Hackathon Window:** 30 October 10:00 AM – 1 November 10:00 AM (48 Hours)  
**Submission Portal:** [Official Google Form](https://forms.gle/QTD1ZRuPX37Yef37A)  
**Team Lead:** Rajeev  
**Team Members:** Rajeev, Farhan, Shubham, Aman  

---

## 📌 Executive Summary

Colleges, research labs, makerspaces, and community organizations own valuable resources (3D printers, CNC routers, digital oscilloscopes, cleanroom labs, high-end cameras) that sit idle for hours or days. Simultaneously, students, researchers, and early-stage innovators cannot afford to purchase or commercially rent these tools.

**Our Solution (EquipGrid):**  
A trusted institutional sharing platform featuring:
1. **End-to-End Custody Lifecycle:** From listing, training verification, and booking requests to check-in inspection, return condition logging, and dispute tracking.
2. **Fair Allocation Engine:** Anti-monopolization quota limits and transparent waitlisting so high-demand equipment isn't hoarded by one group.
3. **Trust & Safety Controls:** Before-and-after photographic/checklist condition logs, AI-assisted damage reporting, and an immutable audit log.
4. **"Judge Demo Switcher":** A one-click role toggle (`Student Borrower` ↔ `Lab In-charge / Manager`) allowing judges to experience the full 10-step lifecycle in under 2 minutes.

---

## 👥 Team Member Roles & Detailed Task Breakdown

Every team member must submit individually. Below is each member's exact role, key responsibilities, and step-by-step task checklist.

---

### 1. RAJEEV — Team Lead, Full-Stack & System Architect

* **Official Hackathon Role:** `Team Lead & Full-Stack Architect (Frontend / UX / Integration)`
* **Core Mission:** Architect the application, build the user interface, integrate frontend with backend APIs, and guarantee a seamless, zero-friction experience for hackathon judges.

#### Detailed Action Items:
* **Phase 1 (Hours 0 – 6): Project Setup & Data Modeling**
  * Initialize the GitHub repository with branch protection and invite Farhan, Shubham, and Aman.
  * Define the unified Database Schema (Users, Resources, Slots, Bookings, ConditionLogs, AuditTrail).
  * Setup the Frontend framework (Next.js / React with Tailwind CSS and Lucide Icons).
* **Phase 2 (Hours 6 – 16): UI Shell & Component Library**
  * Build the Navigation Bar with the **"Judge Demo Switcher"** banner.
  * Build the **Resource Discovery Catalog**: Grid of equipment cards with search, filters (Department, Category, Availability), and status badges (`Available`, `In Use`, `Training Required`).
  * Build the **Resource Details Modal / Page**: Specifications, safety rules, supervisor in-charge, and booking time picker.
* **Phase 3 (Hours 16 – 28): Frontend-Backend Integration**
  * Connect Farhan's booking request APIs with frontend forms.
  * Build the **Student Dashboard**: "My Requests", "Active Check-ins", "Usage Quota Meter (e.g. 4/8 hrs used)".
  * Build the **Lab Manager Dashboard**: "Pending Approvals", "Active Borrowers", "Overdue Returns", and "Incident Queue".
* **Phase 4 (Hours 28 – 38): Condition Verification UI & Deployment**
  * Build the Check-in and Return modal with interactive checklist (e.g., *Lens undamaged*, *Power cables intact*, *Cleaned after use*) and mock image upload.
  * Deploy the Frontend to **Vercel** and verify communication with the deployed backend.
* **Phase 5 (Hours 38 – 48): Polish & Final Smoke Test**
  * Ensure every judge test journey operates smoothly without page reloads or broken states.

---

### 2. FARHAN — Backend & Core Business Logic Engineer

* **Official Hackathon Role:** `Backend Engineer (Python / FastAPI & Core Logic)`
* **Core Mission:** Build robust, clean REST APIs powering the entire 10-step equipment sharing lifecycle, authentication/role simulation, and scheduling conflicts.

#### Detailed Action Items:
* **Phase 1 (Hours 0 – 6): API Foundation & Models**
  * Initialize FastAPI app with CORS middleware and auto-documentation (`/docs`).
  * Implement SQLAlchemy / Pydantic models for `User`, `Resource`, and `Booking`.
  * Create mock authentication endpoints (allowing instant switching between pre-seeded users: `Student`, `Lab In-charge`, `Admin`).
* **Phase 2 (Hours 6 – 16): Resource & Booking Lifecycle Endpoints**
  * `GET /api/resources` — List resources with filtering by category and status.
  * `POST /api/resources` — Owner listing endpoint with usage conditions, security deposit requirement, and training tags.
  * `POST /api/bookings` — Create a booking request with validation against existing slot conflicts.
  * `PATCH /api/bookings/{id}/status` — Owner approval or rejection with reason text.
* **Phase 3 (Hours 16 – 28): Check-in, Return & Custody Endpoints**
  * `POST /api/bookings/{id}/checkin` — Record timestamp, user confirmation checklist, and initial condition status (`Good`, `Acceptable`, `Notes`).
  * `POST /api/bookings/{id}/return` — Record return timestamp, final condition status, and discrepancy check.
* **Phase 4 (Hours 28 – 38): Deployment & Edge-case Handling**
  * Deploy backend on **Render / Railway / Supabase**.
  * Add error handling for overlapping booking slots, double check-ins, and unauthorized state transitions.
* **Phase 5 (Hours 38 – 48): API Verification**
  * Support Aman during QA testing and resolve any backend bugs discovered.

---

### 3. SHUBHAM — AI/ML, Safety & Smart Allocation Engineer

* **Official Hackathon Role:** `Backend, AI/ML & Smart Allocation Engineer (Python)`
* **Core Mission:** Implement the anti-monopolization fair-sharing algorithms, the auditable activity history, and AI integrations (document verification & damage report summarizer).

#### Detailed Action Items:
* **Phase 1 (Hours 0 – 6): Audit Trail & Fairness Architecture**
  * Design the `AuditLog` table: `id`, `entity_type`, `entity_id`, `actor_name`, `action` (e.g. `REQUESTED`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `RETURNED`, `INCIDENT_FLAGGED`), `timestamp`, `details`.
  * Build an audit middleware or utility function to automatically log every state transition.
* **Phase 2 (Hours 6 – 16): Fair Allocation & Anti-Monopoly Engine**
  * Implement **Fair Usage Rules**:
    * Quota Limiter: Restrict individual users to maximum $X$ hours/week on high-demand equipment.
    * Cooldown Period: Prevents back-to-back blocking of prime slots by the same research group.
    * Dynamic Priority Queue / Waitlist: Automatically queue secondary requests when a slot is occupied.
  * `GET /api/fairness/user-quota/{user_id}` — Endpoint returning current quota consumption and remaining allowance.
* **Phase 3 (Hours 16 – 28): AI-Powered Features (Google Gemini API)**
  * **Feature A — Training & Eligibility Verifier:** Simple endpoint passing uploaded certificate/ID metadata to Gemini API to verify validity (e.g., "Certified for Laser Cutter Level 1").
  * **Feature B — Incident & Damage Summarizer:** Endpoint accepting initial vs return condition notes, generating a structured damage summary for the Lab Manager with recommended resolution.
* **Phase 4 (Hours 28 – 38): Audit History Endpoint**
  * `GET /api/audit-logs` — Returns full chronologically sorted activity log for judges to inspect transparency.
  * Connect Gemini API securely via environment variables.
* **Phase 5 (Hours 38 – 48): Metrics & Benchmarking**
  * Prepare test prompts demonstrating AI analysis to be included in the project documentation.

---

### 4. AMAN — Product QA, Documentation & Presentation Lead

* **Official Hackathon Role:** `Product / Research, QA Testing & Documentation Lead`
* **Core Mission:** Ensure the product is judge-ready, error-free, seeded with realistic data, and documented through a professional project submission PDF.

#### Detailed Action Items:
* **Phase 1 (Hours 0 – 6): Realistic Seed Data & Persona Creation**
  * Draft rich mock institutional assets (6–8 items):
    1. *Formlabs Form 3+ SLA 3D Printer* (Fab Lab, Training required)
    2. *Keysight InfiniiVision 4-Channel Oscilloscope* (EE Lab, Open access)
    3. *Cleanroom B4 Photolithography Bench* (Nano Lab, Supervisor required)
    4. *Sony Alpha 7S III 4K Cinema Kit* (Media Center, Security deposit required)
    5. *Universal Laser Systems VLS 3.5 Cutter* (Makerspace, Safety induction required)
    6. *NVIDIA RTX 4090 Deep Learning Workstation* (AI Lab, Max 4 hrs/day)
  * Format seed data into JSON/CSV for Farhan and Shubham to populate the database.
* **Phase 2 (Hours 6 – 16): Structure the Official Project PDF**
  * Setup the official document covering all mandatory submission sections:
    1. Problem Understanding & Selected Niche
    2. Target Personas (Borrower, Resource Owner, Lab Admin)
    3. Complete Solution Architecture & 10-Step Workflow
    4. Tech Stack & External Services
    5. Fairness, Trust & Accountability Measures
    6. Testing Notes & Judge Instructions
    7. Known Limitations & Future Roadmap
* **Phase 3 (Hours 16 – 28): Quality Assurance (QA) & Journey Validation**
  * Test every feature on local and staging environments.
  * Document any UI glitches, broken API calls, or confusing terminology and assign them back to Rajeev/Farhan.
  * Verify that error messages are clear and human-readable (e.g., "Request placed on waitlist: weekly quota reached").
* **Phase 4 (Hours 28 – 38): Judge Testing Guide & Credentials**
  * Write the step-by-step "Judge Walkthrough Script":
    * *Step 1: Open live URL.*
    * *Step 2: Select 'Student' from Demo Switcher -> Request 3D Printer.*
    * *Step 3: Switch to 'Lab Manager' -> Review & Approve.*
    * *Step 4: Switch back to 'Student' -> Perform Check-in with condition confirmation.*
    * *Step 5: Perform Return with condition confirmation -> Check Audit Log.*
* **Phase 5 (Hours 38 – 48): Submission Package Assembly**
  * Finalize the PDF with screenshots, system architecture diagrams, and team details.
  * Assist all members with filing their individual Google Forms before the deadline.

---

## ⏱️ 48-Hour Execution Roadmap

```
+-----------------------------------------------------------------------------------------+
|                                48-HOUR TIMELINE OVERVIEW                                |
+-----------------------+-------------------------+---------------------------------------+
| Window                | Primary Goal            | Milestones & Deliverables             |
+-----------------------+-------------------------+---------------------------------------+
| Oct 30, 10 AM - 4 PM  | Phase 1: Foundation     | Git repo, DB Schema, Seed Data Ready  |
| Oct 30, 4 PM - 2 AM   | Phase 2: Core Build     | REST APIs, UI Catalog, Quota Engine   |
| Oct 31, 2 AM - 2 PM   | Phase 3: Integration    | Full Lifecycle working, AI Features   |
| Oct 31, 2 PM - 12 AM  | Phase 4: Polish & Deploy| Live on Vercel/Render, Judge Switcher |
| Nov 01, 12 AM - 10 AM | Phase 5: Submission     | PDF Finalized, Form Submission Done   |
+-----------------------+-------------------------+---------------------------------------+
```

---

## 🎯 How We Win the 100 Points (Judging Criteria Alignment)

| Criteria | Pts | How Our Product Hits Maximum Score |
| :--- | :---: | :--- |
| **1. Understanding of Problem** | **15** | Specific focus on university/research lab equipment with realistic safety certifications, supervisor sign-offs, and clear pain-point definition in PDF. |
| **2. Strength of Solution** | **20** | Direct solution to the underutilization crisis: idle institutional machinery is unlocked for researchers while preserving custodian control. |
| **3. Working End-to-End Product** | **20** | **"Judge Demo Switcher"** guarantees that judges can complete all 10 stages (Listing to Return) in under 2 minutes without external assistance. |
| **4. Technical Depth & Reliability** | **15** | Modern full-stack architecture (FastAPI + React/Next.js) with robust DB relations, clean API error handling, and cloud deployment. |
| **5. Trust, Safety & Accountability** | **10** | Dual-stage condition checklist (Check-in vs Return), photo confirmation, incident reporting, and full audit logs. |
| **6. Fair Allocation & Accessibility** | **10** | Algorithmic usage limits (e.g. 6 hrs/week/student), cooldown timers, and transparent waitlist handling. |
| **7. Originality & Real-World Potential** | **10** | Moves beyond simple room booking by solving physical safety, equipment condition tracking, and multi-tier institutional approvals. |

---

## 📋 Individual Submission Form Snippets
*(For submission at https://forms.gle/QTD1ZRuPX37Yef37A)*

### Rajeev (Team Lead)
* **Role:** Team Lead, Full-Stack & UI/UX Architect
* **Personal Contribution:** Architected the entire EquipGrid system, designed the relational database schema, developed the modern Next.js frontend with Tailwind CSS, built the judge persona switcher, integrated all REST endpoints, and led deployment on Vercel.

### Farhan
* **Role:** Backend Engineer (Python / FastAPI)
* **Personal Contribution:** Developed the core FastAPI REST API microservices, implemented resource listing and slot booking logic with conflict prevention, built role-based access controllers, and engineered the check-in and return custody lifecycle endpoints.

### Shubham
* **Role:** AI/ML & Smart Allocation Engineer (Python)
* **Personal Contribution:** Engineered the Fair Allocation algorithm to prevent resource monopolization (quota and waitlist system), built the tamper-evident audit logging middleware, and integrated Google Gemini API for automated eligibility document validation and condition incident analysis.

### Aman
* **Role:** Product / Research, QA Testing & Documentation Lead
* **Personal Contribution:** Conducted problem research and defined target user personas, created comprehensive mock institutional seed data, executed end-to-end QA testing across all 10 product lifecycle steps, and authored the official project documentation PDF.
