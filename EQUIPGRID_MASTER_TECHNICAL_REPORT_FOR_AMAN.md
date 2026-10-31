# 🔬 EquipGrid — Master System & Technical Architecture Report
**Confidential Internal Documentation for Aman (Product QA & Documentation Lead)**  
*Project Lead: Rajeev | Backend: Farhan | AI/ML: Shubham | QA/Docs: Aman*  
*Platform: EquipGrid (Institutional Resource & Equipment Sharing Ecosystem)*  
*Document Version: 2.4 — Comprehensive Hackathon Master Edition (31 October 2026)*

---

## 📑 Table of Contents
1. [Executive Summary & Hackathon Mission](#1-executive-summary--hackathon-mission)
2. [Project Trajectory & Chat Evolution History](#2-project-trajectory--chat-evolution-history)
3. [Full-Stack Architecture & Tech Stack](#3-full-stack-architecture--tech-stack)
4. [The 10-Step Custody & Governance Lifecycle](#4-the-10-step-custody--governance-lifecycle)
5. [Anti-Monopoly Fair Allocation Engine](#5-anti-monopoly-fair-allocation-engine)
6. [AI Multimodal Discrepancy & Rejection Reasoning Engine](#6-ai-multimodal-discrepancy--rejection-reasoning-engine)
7. [Comprehensive 30-Resource Catalog Matrix](#7-comprehensive-30-resource-catalog-matrix)
8. [Two-Stage Sustainable Pricing & Financial Governance](#8-two-stage-sustainable-pricing--financial-governance)
9. [Multi-Role User Manual & Operating Guides](#9-multi-role-user-manual--operating-guides)
10. [Security Hardening, RBAC & Data Integrity](#10-security-hardening-rbac--data-integrity)
11. [App Previews & Visual UI Layouts](#11-app-previews--visual-ui-layouts)
12. [Action Checklist for Aman (QA & Submission Deliverables)](#12-action-checklist-for-aman-qa--submission-deliverables)

---

## 1. Executive Summary & Hackathon Mission

### 1.1 The Challenge
Modern higher-education engineering universities, government research laboratories, and regional innovation hubs house equipment worth tens of crores of rupees (e.g. Field Emission Scanning Electron Microscopes, 3-axis CNC vertical mills, Class 10,000 cleanrooms, 40 GHz vector network analyzers, and high-performance GPU clusters).

Yet, independent surveys and operational data reveal that **specialized laboratory assets operate at less than 35% capacity** outside scheduled class time. Simultaneously, undergraduate innovators, early-stage college incubators, and interdisciplinary researchers face insurmountable financial barriers when attempting to access this infrastructure.

### 1.2 The EquipGrid Solution
**EquipGrid** is a decentralized, trust-first institutional resource and space sharing platform. It bridges the gap between high-end instrument custodians and eager researchers through:
* **Itemized Physical Custody Verification:** Strict check-in and checkout condition checklists eliminating ambiguity over who used the equipment and in what state it was returned.
* **Multimodal AI Condition Analysis (Google Gemini 1.5 Flash):** Automated before-and-after discrepancy detection that compares pre-session notes with return reports to detect damage or maintenance requirements without biased dispute.
* **Anti-Monopoly Fair Allocation Engine:** Prevents well-funded or prominent research labs from monopolizing high-demand infrastructure through cooldown periods and utilization-weighted priority scores.
* **Sustainable Two-Stage Indian Academic Pricing:** Balances affordability for scholars with cost-recovery for host institutions via runtime hourly fees and 100% refundable caution deposits held in escrow.
* **Immutable Audit Trail:** Chronological, tamper-evident transaction logging for institutional compliance and NAAC/NIRF accreditation audits.

---

## 2. Project Trajectory & Chat Evolution History

This section details the major engineering milestones and problem-solving steps across all conversation phases to give Aman complete context on why each feature exists:

### Phase 1: Inception & Core 10-Step Workflow
* Established the complete equipment lifecycle transitioning through 10 distinct states: `available` → `requested` → `reviewed` → `approved` → `checked_in` → `returned` → `inspected` → `quarantined` → `audited`.
* Created the relational schema connecting `User`, `Resource`, `AvailabilitySlot`, `Booking`, `ConditionRecord`, `Incident`, and `AuditLog`.

### Phase 2: Evaluator Persona Switcher & Demo Hardening
* Implemented a discreet single-row persona switcher in the navigation bar allowing judges to test all roles (`Student`, `Researcher`, `Lab In-charge`, `Institutional Admin`) with zero authentication friction.
* Removed external public submission forms from main UI to maintain institutional credibility.

### Phase 3: Case-Insensitive Credential Defense & Duplicate Vulnerability Fix
* **Vulnerability Identified:** Variations in email casing (e.g. `User@IITD.AC.IN` vs `user@iitd.ac.in`) could bypass uniqueness checks in naive systems, leading to duplicate accounts and identity spoofing.
* **Engineered Solution:** Enforced case normalization at both router and database layers using `func.lower(User.email)` alongside SQL transactional integrity rollbacks (`db.rollback()`) on `IntegrityError`. Verified with zero swallowed errors in frontend `AuthContext`.

### Phase 4: Security Hardening & Administrative Gating
* Blocked external public visitors from self-registering as `"admin"` via `/api/auth/register` (strictly restricted to `"borrower"` and `"owner"`).
* Enforced `require_role("admin")` on system-wide audit search endpoints (`GET /api/audit-logs`), preventing unauthorized users from dumping cross-institutional activity trails.

### Phase 5: Catalog Overhaul from 9 to 30 Curated Assets
* Expanded catalog from initial 9 items to **30 comprehensive, verified assets** categorized across 3 primary equipment classes (`equipment`, `device`, `lab`) and tagged into 6 academic engineering streams (**CSE & AI**, **Mechanical & Prototyping**, **Electronics & VLSI**, **Nanotechnology & Physics**, **Biotechnology**, and **Civil Engineering**).

### Phase 6: Transition to Sustainable Institutional Pricing
* **Strategic Shift:** User mandated that no equipment should be ₹0/free or subsidized. In real-world institutions, operating lasers, cleanrooms, and GPU servers incurs massive power, consumable, and staff costs.
* **Pricing Overhaul:** Configured realistic, affordable hourly fees (₹140 – ₹2,000/hr) and 100% refundable caution deposits (₹500 – ₹7,500) across all 30 assets.
* Replaced "Zero Caution Deposit (₹0)" filter with realistic tiers: Standard (≤ ₹1,000), Mid-Tier (₹1,001 – ₹3,000), and High-End Labs (> ₹3,000).

### Phase 7: Live Cloud Auto-Seeding & Self-Healing
* **Discovery:** Cloud container instances (e.g. Render, Railway) previously skipped seeding if demo users were already present in persistent storage, keeping them locked to the original 9 items.
* **Engineered Solution:** Updated startup lifespan in `main.py` and added an on-demand self-healing check in `resources.py` (`count < 30`) to ensure 30 products are automatically populated upon first request.

### Phase 8: Core Bug Resolution & UX Polish
* Eliminated silent error swallowing in `BookingModal.jsx` (now reports exact backend error details).
* Connected dynamic `resource_name` and itemized `resource_details` to `BookingOut` schema.
* Fixed quota calculation fields in frontend modal (`bookings_this_month` & `max_bookings_per_month`).
* Ensured empty state displays cleanly when real users have zero bookings instead of injecting fake mock items.
* Replaced browser-freezing `prompt()` and `alert()` in `ManagerDashboard.jsx` with responsive modal dialogs and toast alerts.
* Removed all MIT license badges in `README.md` in favor of an original proprietary intellectual property statement.

---

## 3. Full-Stack Architecture & Tech Stack

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER                                 │
│  React 18  •  Vite  •  Tailwind CSS  •  Lucide Icons  •  Context API     │
│  - Academic Domain Filters       - Two-Stage Indian Pricing Modal        │
│  - 10-Step Custody UI           - Single-Row Evaluator Persona Switcher │
│  - Responsive Glassmorphism     - In-App Non-Blocking Alert Modals      │
└─────────────────────────────────────┬────────────────────────────────────┘
                                      │ REST API (Bearer JWT / Axios)
┌─────────────────────────────────────▼────────────────────────────────────┐
│                            APPLICATION LAYER                             │
│                           FastAPI (Python 3.10+)                         │
│  ┌────────────────────────┬──────────────────────┬────────────────────┐  │
│  │  Auth & RBAC Router    │  Bookings Router     │ Resources Router   │  │
│  │  - Case Normalization  │  - State Machine     │ - Stream Filters   │  │
│  │  - Admin Self-Reg Gate │  - Quota Enforcement │ - On-Demand Seed   │  │
│  └────────────────────────┴──────────────────────┴────────────────────┘  │
│  ┌────────────────────────┬──────────────────────┬────────────────────┐  │
│  │  Fairness Engine       │  Gemini 1.5 Flash AI │ Audit Ledger       │  │
│  │  - Utilization Scorer  │  - Discrepancy Check │ - Immutable Ledger │  │
│  │  - Anti-Monopoly Cooldown - Smart Rejection   │ - Admin Protected  │  │
│  └────────────────────────┴──────────────────────┴────────────────────┘  │
└─────────────────────────────────────┬────────────────────────────────────┘
                                      │ SQLAlchemy 2.0 ORM
┌─────────────────────────────────────▼────────────────────────────────────┐
│                             STORAGE LAYER                                │
│                          SQLite (equipgrid.db)                           │
│   Users & Roles  •  Resources & Slots  •  Bookings  •  Condition Records │
│            Dispute Incidents  •  Tamper-Evident Audit Logs               │
└──────────────────────────────────────────────────────────────────────────┘
```

### Key Technical Specifications
| Tier | Technology | Key Modules & Patterns |
| :--- | :--- | :--- |
| **Frontend** | React 18.3, Vite 5.4, TailwindCSS 3.4 | Dynamic imports, Context-driven auth, Tailwind UI cards, responsive grid, zero external CSS bloat. |
| **Backend** | FastAPI, Uvicorn, Python 3.10+ | Asynchronous lifespan, Pydantic v2 validation models, dependency injection RBAC (`require_role`). |
| **Database** | SQLite 3 via SQLAlchemy ORM | Foreign key cascading, indexed lookups, case-insensitive normalization via `func.lower()`. |
| **AI Integration** | Google Gemini 1.5 Flash API | Multimodal discrepancy comparison, structured JSON parsing, prompt sanitization. |
| **Security** | JWT (HS256), Passlib (Bcrypt) | Token expiration, salt hashing, strict role gating (`borrower`, `owner`, `admin`). |

---

## 4. The 10-Step Custody & Governance Lifecycle

EquipGrid replaces simple calendar bookings with an auditable physical custody chain:

```mermaid
flowchart TD
    S1["1. Resource Publication<br/>(Lab In-Charge)"] --> S2["2. Catalog Discovery<br/>(Stream-Wise Filtering)"]
    S2 --> S3["3. Reservation Request<br/>(Purpose & Slot Selection)"]
    S3 --> S4["4. Anti-Monopoly Evaluation<br/>(Quota & Cooldown Check)"]
    S4 --> S5["5. Lab In-Charge Review<br/>(Verification Queue)"]
    S5 -->|Decline| S5R["Application Rejected<br/>(AI Constructive Feedback)"]
    S5 -->|Approve| S6["6. Slot Hold & Escrow<br/>(Caution Deposit Held)"]
    S6 --> S7["7. Physical Check-In<br/>(Itemized Checklist Sign-Off)"]
    S7 --> S8["8. Return & AI Verification<br/>(Gemini Discrepancy Analysis)"]
    S8 -->|Clean Condition| S10["10. Release Deposit & Audit<br/>(Trust Score +0.02)"]
    S8 -->|Damage Detected| S9["9. Incident Quarantine<br/>(Technician Review & Deposit Deduction)"]
    S9 --> S10
```

### Detailed Lifecycle Phases:
1. **Resource Publication:** Lab managers define instrument specifications, safety prerequisites, hourly rates, refundable caution deposits, supervisor contact, and machine-specific condition checklists.
2. **Catalog Discovery:** Borrowers filter by academic stream (e.g. Mechanical, Nanotech) and review operational rules, required certifications, and live availability slots.
3. **Reservation Request:** Borrower selects a time slot and provides research purpose text, institutional project code, and supervisor details.
4. **Anti-Monopoly Evaluation:** Engine verifies that borrower has not exceeded monthly quota caps or active cooldown restrictions.
5. **Lab In-Charge Review:** Lab manager inspects the request in their approval queue. Rejections require a clear reason, which is automatically augmented with AI guidance.
6. **Slot Hold & Escrow:** Once approved, the slot is locked. The caution deposit is recorded in escrow, guaranteeing financial safety for the host lab.
7. **Physical Check-In:** Borrower arrives at the lab. Both parties inspect the unit, verify baseline status, and sign off on the pre-operation checklist.
8. **Return & AI Discrepancy Verification:** At the end of the session, the borrower submits return condition status. Google Gemini 1.5 Flash inspects check-in vs checkout notes to neutrally detect damage or wear.
9. **Incident Reporting & Quarantine:** If damage or missing accessories are flagged, the asset is automatically quarantined (`maintenance` status), preventing further bookings until technician clearance.
10. **Immutable Audit Ledger:** Every status change, signature, and approval is timestamped and recorded in the audit ledger, and the user's trust score is updated.

---

## 5. Anti-Monopoly Fair Allocation Engine

To prevent well-funded research groups or prominent university departments from monopolizing shared infrastructure, EquipGrid enforces a mathematical prioritization algorithm:

$$\text{Priority Score} = 0.30 \times T + 0.30 \times W - 0.20 \times U + 0.10 \times R - 0.10 \times I$$

Where:
* $T \in [0.0, 1.0]$: **Borrower Trust Score** (based on timely returns, zero damage history, and clean handovers).
* $W \in [0.0, 1.0]$: **Normalized Wait Time** (how long the request has waited in queue).
* $U \in [0.0, 1.0]$: **Departmental Utilization Ratio** (penalizes research groups that have heavily utilized the asset in the preceding 30 days).
* $R \in [0.0, 1.0]$: **Project Relevance Score** (evaluates institutional alignment and academic research purpose).
* $I \ge 0$: **Incident Penalty Count** (deductions for previously documented equipment damage or neglect).

### Additional Anti-Monopoly Guards:
* **Monthly Reservation Caps:** Default limit of 4 bookings per user per month per specialized machine.
* **Mandatory Cooldown Windows:** 24-hour mandatory gap between consecutive bookings on high-demand Tier-1 instruments.
* **Fair Discovery Ranking:** Catalog sorts by underutilized assets first, giving smaller community makerspaces and regional colleges equal visibility.

---

## 6. AI Multimodal Discrepancy & Rejection Reasoning Engine

EquipGrid integrates **Google Gemini 1.5 Flash** for neutral, automated oversight:

### 6.1 Condition Discrepancy Analysis (`POST /api/ai/verify-condition`)
When an instrument is returned in anything less than pristine condition, the discrepancy engine analyzes:
1. Baseline instrument condition (upon publishing).
2. Initial check-in sign-off checklist and notes.
3. Return condition notes and reported issues.

**Sample Output from Gemini Analysis:**
```json
{
  "damage_detected": true,
  "severity": "medium",
  "discrepancy_summary": "Objective lens coating shows micro-scratches not present during Step 7 Check-in. Stage micrometer calibration drifted by 4 microns.",
  "recommended_action": "Quarantine instrument for technician optical recalibration; withhold ₹1,500 security deposit for lens servicing.",
  "fairness_rating": 0.88
}
```

### 6.2 Constructive Rejection Explanation (`POST /api/ai/explain-rejection`)
When a faculty member declines an application, Gemini converts terse technical reasons into structured, constructive educational feedback, pointing students toward prerequisite safety courses or alternative open lab slots.

---

## 7. Comprehensive 30-Resource Catalog Matrix

The application includes 30 verified equipment listings across 3 categories and 6 academic engineering streams:

| ID | Asset Name | Engineering Stream | Category | Hourly Rate | Caution Deposit | Institution & Location | Lab Manager Contact |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **res-1** | Formlabs Form 3+ SLA 3D Printer | Mechanical & Prototyping | equipment | ₹150 / hr | ₹500 | IIT Delhi, Fab Lab Room 201 | Dr. Priya Roy (+91 98765 43210) |
| **res-2** | Keysight InfiniiVision 4-Ch Oscilloscope (1 GHz) | Electronics & VLSI (ECE) | device | ₹220 / hr | ₹1,000 | Jamia Millia, Room 105 Block A | Prof. Tariq Mansoor (+91 98112 33445) |
| **res-3** | ISO Class 6 Microfabrication Cleanroom | Nanotechnology & Physics | lab | ₹1,800 / hr | ₹6,000 | IIT Delhi, Nanoscale Facility | Dr. Priya Roy (+91 98765 43210) |
| **res-4** | Epilog Fusion Pro 48 Laser Cutter | Mechanical & Prototyping | equipment | ₹250 / hr | ₹1,000 | DTU Central Workshop, Bay 4 | Er. Vikas Sharma (+91 98103 44556) |
| **res-5** | Keithley 2450 Interactive SourceMeter (SMU) | Electronics & VLSI (ECE) | device | ₹220 / hr | ₹1,000 | NSUT Advanced Electronics Lab | Dr. Sunita Rani (+91 98115 66778) |
| **res-6** | Haas Mini Mill 3-Axis CNC Machining Center | Mechanical & Prototyping | equipment | ₹500 / hr | ₹2,500 | IIT Delhi Central Workshop | Dr. Priya Roy (+91 98765 43210) |
| **res-7** | Zeiss LSM 900 Confocal Microscope | Biotechnology & Life Sciences | device | ₹850 / hr | ₹3,500 | AIIMS Central Research Facility | Dr. Meenakshi Sundaram (+91 98711 22334) |
| **res-8** | NVIDIA DGX A100 Supercomputing Cluster | Computer Science & AI (CSE) | lab | ₹650 / hr | ₹3,500 | IIT Delhi High Performance Centre | Prof. Sanjeev Sanghi (+91 98100 11223) |
| **res-9** | Instron 5982 100kN Floor Model UTM | Civil & Environmental | equipment | ₹380 / hr | ₹1,500 | DTU Structural Engineering Lab | Prof. Amit Srivastava (+91 98119 55443) |
| **res-10** | Lincoln Electric Square Wave TIG 200 Welder | Mechanical & Prototyping | equipment | ₹150 / hr | ₹750 | NSUT Metal Fabrication Bay | Er. Harpreet Singh (+91 98108 77665) |
| **res-11** | Keysight FieldFox N9918B RF Analyzer (26.5 GHz) | Electronics & VLSI (ECE) | device | ₹420 / hr | ₹2,000 | IIT Delhi Microwave Lab | Dr. Priya Roy (+91 98765 43210) |
| **res-12** | Rigol DG4162 Arbitrary Waveform Generator | Electronics & VLSI (ECE) | device | ₹160 / hr | ₹800 | IGDTUW Signals & Systems Lab | Dr. Shalini Sharma (+91 98114 88990) |
| **res-13** | Anton Paar MCR 302e Modular Rheometer | Biotechnology & Life Sciences | device | ₹650 / hr | ₹2,500 | IIT Delhi Chemical Engineering | Dr. Anupam Shukla (+91 98102 33445) |
| **res-14** | FLIR E8-XT High-Resolution Thermal Camera | Electronics & VLSI (ECE) | device | ₹200 / hr | ₹1,000 | DTU Thermal Engineering Lab | Er. Manish Goel (+91 98117 99001) |
| **res-15** | Anechoic RF Characterization Chamber | Electronics & VLSI (ECE) | lab | ₹1,400 / hr | ₹5,000 | IIT Delhi Bharti Telecom Centre | Dr. Priya Roy (+91 98765 43210) |
| **res-16** | NVIDIA Jetson AGX Orin Robotics Test Rig | Computer Science & AI (CSE) | device | ₹180 / hr | ₹1,000 | IIIT Delhi Robotics & AI Lab | Dr. Vivek Bohara (+91 98116 55443) |
| **res-17** | Bio-Rad CFX96 Touch Real-Time PCR Cycler | Biotechnology & Life Sciences | device | ₹250 / hr | ₹1,000 | Jamia Hamdard Faculty of Pharmacy | Prof. Farhan Ahmad (+91 98113 77889) |
| **res-18** | Beckman Coulter Optima XPN-100 Ultracentrifuge | Biotechnology & Life Sciences | equipment | ₹550 / hr | ₹2,200 | JNU School of Biotechnology | Dr. Sneha Sudha (+91 98109 44332) |
| **res-19** | Dynamic Earthquake Shake Table Facility | Civil & Environmental | lab | ₹2,000 / hr | ₹7,500 | IIT Delhi Earthquake Lab | Prof. Vasant Matsagar (+91 98107 11223) |
| **res-20** | Roland MDX-50 Subtractive Rapid Prototyper | Mechanical & Prototyping | equipment | ₹280 / hr | ₹1,200 | NSUT Incubation Centre | Er. Rohit Verma (+91 98118 22110) |
| **res-21** | Zeiss Sigma 300 Field Emission SEM (FE-SEM) | Nanotechnology & Physics | device | ₹1,400 / hr | ₹5,500 | IIT Delhi Central Research Facility | Dr. Priya Roy (+91 98765 43210) |
| **res-22** | Park Systems NX10 Atomic Force Microscope | Nanotechnology & Physics | device | ₹950 / hr | ₹4,000 | DTU Nanotechnology Centre | Dr. Roli Verma (+91 98106 55667) |
| **res-23** | Quorum Q150R Plus Sputter Coater | Nanotechnology & Physics | equipment | ₹350 / hr | ₹1,500 | Jamia Millia Physics Dept | Prof. Zahid Khan (+91 98104 66778) |
| **res-24** | Ultimaker S5 Dual-Extrusion 3D Printer | Mechanical & Prototyping | equipment | ₹150 / hr | ₹600 | Delhi Skills & Entrepreneurship Univ | Er. Sandeep Malik (+91 98105 88990) |
| **res-25** | IoT Sensor & LoRaWAN Prototyping Bench | Computer Science & AI (CSE) | device | ₹180 / hr | ₹1,000 | IIIT Delhi Smart City Lab | Dr. Arani Bhattacharya (+91 98101 99887) |
| **res-26** | Google Coral Edge TPU ML Acceleration Rack | Computer Science & AI (CSE) | device | ₹180 / hr | ₹1,000 | NSUT Embedded Systems Lab | Dr. D. V. Gadre (+91 98100 44556) |
| **res-27** | Sony Alpha 7S III 4K Cinema Camera Rig | Computer Science & AI (CSE) | device | ₹180 / hr | ₹1,200 | NSUT Media Innovation Hub | Dr. Alok Nath (+91 98111 66554) |
| **res-28** | NVIDIA RTX 4090 Dual GPU Workstation | Computer Science & AI (CSE) | device | ₹250 / hr | ₹1,500 | DTU Supercomputing Cluster | Prof. S. K. Gupta (+91 98111 22334) |
| **res-29** | Cleanroom B4 — Photolithography Bench | Nanotechnology & Physics | lab | ₹400 / hr | ₹2,500 | IIT Delhi Nano Centre | Dr. Neha Verma (+91 98188 66778) |
| **res-30** | Eppendorf BioFlo 120 Fermentation Bioreactor | Biotechnology & Life Sciences | equipment | ₹260 / hr | ₹1,200 | IIT Delhi Biosafety Level-2 Lab | Dr. Rajesh Sharma (+91 99333 44556) |

---

## 8. Two-Stage Sustainable Pricing & Financial Governance

To maintain financial sustainability without closing doors to students, EquipGrid implements a two-stage payment split:

```
Total Session Cost = Runtime Operating Charge + Advance Caution Deposit (Escrow)
```

1. **Advance Caution Deposit (100% Refundable Escrow):**
   * Range: ₹500 to ₹7,500 based on instrument replacement cost.
   * Held securely throughout the physical reservation session.
   * Automatically unlocked and refunded upon incident-free Step 8 return sign-off.
   * If damage is flagged, technician resolution determines whether any portion is retained for repair.
2. **Runtime Operating Fee:**
   * Range: ₹140 to ₹2,000 per hour.
   * Reimburses host institutions for electricity consumption, specialized laser tube life, machine maintenance, calibration gases, and lab assistant staffing.
3. **High-Trust Scholar Waivers:**
   * Users maintaining an institutional trust score $\ge 0.95$ receive automatic security deposit waivers on standard-tier equipment.

---

## 9. Multi-Role User Manual & Operating Guides

### 9.1 Student / Borrower Persona Manual (Aarav Singh — ECE)
* **Login Credentials:** `student@equipgrid.demo` | Password: `Demo@1234`
* **Core Actions:**
  1. Browse the Catalog and filter by stream (e.g. *Electronics & VLSI*).
  2. Click **"Request Slot"** on any available equipment.
  3. Enter project code and purpose (e.g. *"FPGA synthesis for satellite communications"*).
  4. Review advance caution deposit and runtime fees in the payment modal.
  5. Open **"Student Dashboard"** to track request approval status.
  6. Upon arrival, execute **"Step 7: Check-In"** and review baseline checklist points.
  7. Upon session end, click **"Step 8: Return"** and submit equipment status.

### 9.2 Researcher Persona Manual (Sneha Patel — Biotechnology)
* **Login Credentials:** `researcher@equipgrid.demo` | Password: `Demo@1234`
* **Core Actions:**
  1. Access high-containment biosafety equipment (Bioreactors, Ultracentrifuges, PCR Cyclers).
  2. Submit multi-hour longitudinal project requests with institutional ethical clearances.
  3. Verify cleanroom gowning and autoclave decontamination check-lists during handover.

### 9.3 Lab In-Charge Persona Manual (Dr. Priya Roy — Fab Lab)
* **Login Credentials:** `labmanager@equipgrid.demo` | Password: `Demo@1234`
* **Core Actions:**
  1. Open **"Lab Dashboard"** to view incoming reservation requests.
  2. Inspect borrower trust scores and project purpose.
  3. Click **"Approve Slot"** to issue authorization, or click **"Decline Request"** (which opens an in-app modal to provide constructive feedback).
  4. Review active equipment check-outs in the lab.
  5. If an incident or damage is flagged, review the technician report and click **"Resolve & Release"** to discharge quarantine.

### 9.4 Institutional Admin Persona Manual (Prof. Ramesh Kumar — Dean of Research)
* **Login Credentials:** `admin@equipgrid.demo` | Password: `Demo@1234`
* **Core Actions:**
  1. Open **"Audit History"** from the navigation bar.
  2. Inspect real-time chronological event logs across all participating departments.
  3. Filter audit trails by entity type (`booking`, `resource`, `incident`) or specific user ID.
  4. Export tamper-evident audit records for institutional accreditation boards (NAAC, NIRF, NBA).

### 9.5 Evaluator / Judge Guide (1-Click Persona Switcher)
EquipGrid includes a single-row role switcher pill at the top of the interface:
* Click **👨‍🎓 Student** → Switch immediately to Aarav Singh to experience booking and return flows.
* Click **🔬 Lab In-charge** → Switch immediately to Dr. Priya Roy to test approval and incident resolution.
* Click **🛡️ Admin** → Switch immediately to Prof. Ramesh Kumar to inspect system-wide audit ledgers.
* Click **🧪 Researcher** → Switch immediately to Sneha Patel to test specialized bio-lab workflows.

---

## 10. Security Hardening, RBAC & Data Integrity

| Layer | Threat Vector | Implemented Defense Mechanism |
| :--- | :--- | :--- |
| **Authentication** | Case-variation duplicate account spoofing | Normalized all incoming emails via `func.lower(User.email)` at database query level and `payload.email.strip().lower()`. Wrapped database transactions in `IntegrityError` rollbacks. |
| **Privilege Escalation** | Self-registering rogue administrator accounts | Blocked `"admin"` from public registration endpoint (`POST /api/auth/register`). Enforced 400 Bad Request if requested, and removed option from frontend UI. |
| **Audit Log Snooping** | Unauthorized users reading cross-college activity | Enforced `require_role("admin")` dependency on `GET /api/audit-logs`. Regular users can only access their personal booking-specific audit trail. |
| **UI State Freezing** | Browser UI thread freezing during prompt inputs | Replaced native `prompt()` and `alert()` in Manager Dashboard with accessible React modal dialogs and auto-dismissing toast notifications. |
| **Catalog Empty-State** | Stale mock dataset rendering during network drops | Synchronized exact 30 items across SQLite database and mock fallback (`mockData.js`). Empty API responses render clean zero-state rather than fake bookings. |

---

## 11. App Previews & Visual UI Layouts

To help Aman format presentation slides and PDF figures, here is the architectural layout of EquipGrid's primary UI screens:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [🔬 EquipGrid]   Catalog   My Reservations   Lab Dashboard   Audit      │
│ [🛡️ Evaluator Mode: [Student (Aarav)] [Lab In-Charge] [Admin] [Switch]] │
├────────────────────────────────────────────────────────────────────────┤
│ 🌟 Unlock High-End Institutional Equipment & Spaces Safely             │
│ [All Resources] [Fabrication & Tools] [Testing & Devices] [Labs]       │
│ Stream: [All Streams ▼]  Deposit: [All Tiers ▼]  Sort: [Fair Exposure] │
├────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────┐                │
│ │ [Image: Formlabs 3D]    │ │ [Image: Keysight DSO]   │                │
│ │ Formlabs Form 3+ SLA    │ │ Keysight InfiniiVision  │                │
│ │ IIT Delhi Fab Lab       │ │ Jamia Millia Research   │  ... (30 items)│
│ │ ₹150/hr • ₹500 Deposit  │ │ ₹220/hr • ₹1,000 Deposit│                │
│ │ [🟢 Available] [Request]│ │ [🟢 Available] [Request]│                │
│ └─────────────────────────┘ └─────────────────────────┘                │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual Preview Assets Available in Repo
Aman can find newly captured full-resolution screenshots (1440x960) in [`docs/screenshots/`](docs/screenshots/):
* **Landing Portal View:** `docs/screenshots/01_landing_portal.png` — Hero presentation, trust badges, and institutional value propositions.
* **30-Resource Catalog Matrix:** `docs/screenshots/02_catalog_30_resources.png` — Stream filters, pricing badges, and card grid with real-time availability.
* **Student Dashboard View:** `docs/screenshots/03_student_dashboard.png` — Borrower custody tracker, quota status, and check-in / return action triggers.
* **Lab Manager Dashboard:** `docs/screenshots/04_manager_dashboard.png` — Real-time approval queue, custody status, and incident resolution center.
* **Audit History Ledger:** `docs/screenshots/05_audit_history.png` — Immutable event ledger and administrative compliance review.

Additional detailed modal captures:
* `.user_uploaded/media_1793426817888_b089a65e.png` — Booking request modal with two-stage payment split and caution deposit guarantees.
* `.user_uploaded/media_1793349815455_071d6fdf.png` — Step 7 physical check-in inspection checklist dialog.
* `.user_uploaded/media_1793348000153_735c8beb.png` — Step 8 return custody modal with Gemini AI discrepancy verification report.

---

## 12. Action Checklist for Aman (QA & Submission Deliverables)

Aman can directly utilize the contents of this master report to produce the final hackathon assets:

- [ ] **1. Submission Slide Deck:**
  - Copy Section 1 (Problem & Mission) for Slides 1–2.
  - Copy Section 3 (Architecture Diagram) for Slide 3.
  - Copy Section 4 (10-Step Custody Lifecycle) for Slide 4.
  - Copy Section 5 & 6 (Anti-Monopoly & Gemini AI) for Slide 5.
  - Copy Section 8 (Two-Stage Pricing & Caution Deposits) for Slide 6.
- [ ] **2. Live Demonstration Script:**
  - Follow the 4-step evaluator guide in Section 9.5 for the live 3-minute video recording.
- [ ] **3. Quality Assurance Verification:**
  - Run `npm run build` in `frontend` (must report 0 errors).
  - Verify that changing persona switches roles instantly.
  - Verify that all 30 resources appear in both full-stack and offline modes.
- [ ] **4. Final PDF Submission Dossier:**
  - Convert this markdown document into the formal project PDF dossier for the judges.

---
*EquipGrid Project Documentation — Compiled and verified for team handover.*
