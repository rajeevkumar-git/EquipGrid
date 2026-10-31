import os
import sys
from datetime import datetime, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

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
                issued_at=datetime(2024, 1, 15),
                verified=True,
            ),
            UserCredential(
                user_id=student.id,
                credential_type="certification",
                credential_name="3D Printing Operator",
                issued_by="IIT Delhi Fab Lab",
                issued_at=datetime(2024, 2, 1),
                verified=True,
            ),
            UserCredential(
                user_id=student.id,
                credential_type="training",
                credential_name="Cleanroom Protocol Certification",
                issued_by="Nano Fab Centre",
                issued_at=datetime(2024, 1, 10),
                verified=True,
            ),
        ]
        db.add_all(creds)
        db.commit()
        print(f"  [created] Credentials for {student.full_name}")

    # ── 26 High-Value Institutional Resources Across Streams ─────────────────

    owner = db.query(User).filter(User.email == "labmanager@equipgrid.demo").first()

    resources_data = [
        # 1. Mechanical
        {
            "name": "Formlabs Form 3+ SLA 3D Printer",
            "institution": "IIT Delhi Fab Lab",
            "stream": "Mechanical & Prototyping",
            "category": "equipment",
            "hourly_rate": 150.0,
            "deposit_amount": 500.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. Priya Roy (+91 98765 43210)",
            "supervisor_contact": "Dr. Priya Roy (priya.roy@iitd.ac.in)",
            "utilization_rate": 0.28,
            "location": "Fab Lab, Room 201, Block C",
            "description": "Industrial-grade stereolithography 3D printer for high-resolution resin prototypes. 25–300 micron layer height. Ideal for mechanical parts and functional prototypes.",
            "images": ["https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800"],
            "max_booking_hours": 6,
            "max_bookings_per_user_per_month": 4,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Resin tank is not contaminated",
                "Build plate is clean and level",
                "Print bed scraper is present",
                "Platform cleaned with IPA",
                "No resin spills on exterior"
            ],
            "eligibility_requirements": [
                {"type": "certification", "name": "3D Printing Operator", "mandatory": True, "description": "Valid 3D Printing Operator certification."}
            ]
        },
        # 2. ECE
        {
            "name": "Keysight InfiniiVision 4-Channel Oscilloscope (1 GHz)",
            "institution": "Jamia Millia Research Centre",
            "stream": "Electronics & VLSI (ECE)",
            "category": "device",
            "hourly_rate": 220.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. Tariq Mansoor (+91 98112 33445)",
            "supervisor_contact": "Prof. Tariq Mansoor (tariq.m@jmi.ac.in)",
            "utilization_rate": 0.15,
            "location": "Electronics Lab, Room 105, Block A",
            "description": "High-performance digital oscilloscope with 1 GHz bandwidth, 4 GSa/s sample rate, and 4 channels. Equipped with serial decode and waveform generator.",
            "images": ["https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 6,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "All 4 probes present and undamaged",
                "BNC connectors free of debris",
                "Power cable secure",
                "Display screen unscratched"
            ],
            "eligibility_requirements": []
        },
        # 3. Mechanical
        {
            "name": "Universal Laser Systems VLS 3.5 CO2 Laser Cutter",
            "institution": "Delhi Community Makerspace",
            "stream": "Mechanical & Prototyping",
            "category": "equipment",
            "hourly_rate": 200.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Er. Vikram Batra (+91 99100 44556)",
            "supervisor_contact": "Er. Vikram Batra (vikram@delhimakers.org)",
            "utilization_rate": 0.22,
            "location": "Makerspace, Room G-04, Block B",
            "description": "Professional 50W CO2 laser cutter/engraver with 24x18 inch bed. High-precision cutting for acrylic, wood, leather, and delrin.",
            "images": ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "good",
            "condition_checklist": [
                "Lens is clean and unscratched",
                "Cutting bed free of debris",
                "Exhaust system operational",
                "Emergency stop button tested"
            ],
            "eligibility_requirements": [
                {"type": "training", "name": "Laser Safety Level 1", "mandatory": True, "description": "Laser safety walkthrough required."}
            ]
        },
        # 4. CSE
        {
            "name": "NVIDIA DGX H100 Deep Learning Workstation Node",
            "institution": "NSUT High Performance Computing Center",
            "stream": "Computer Science & AI (CSE)",
            "category": "device",
            "hourly_rate": 650.0,
            "deposit_amount": 3500.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. Ramesh Kumar (+91 98444 55667)",
            "supervisor_contact": "Prof. Ramesh Kumar (ramesh.kumar@nsut.ac.in)",
            "utilization_rate": 0.72,
            "location": "Server Room 3, Computer Center",
            "description": "8x NVIDIA H100 80GB SXM5 GPUs with 3.2Tbps InfiniBand networking. Subsidized by National Supercomputing Mission for university research.",
            "images": ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"],
            "max_booking_hours": 12,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Scratch space cleared after jobs finish",
                "No zombie background processes left running",
                "Container images unmounted"
            ],
            "eligibility_requirements": []
        },
        # 5. Nanotech
        {
            "name": "Class 10,000 (ISO 7) Cleanroom Bay",
            "institution": "BITS Pilani Microfabrication Centre",
            "stream": "Nanotechnology & Physics",
            "category": "lab",
            "hourly_rate": 350.0,
            "deposit_amount": 2000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. Ananya Sen (+91 97222 33445)",
            "supervisor_contact": "Dr. Ananya Sen (ananya@pilani.bits-pilani.ac.in)",
            "utilization_rate": 0.22,
            "location": "Nanotechnology Building, Ground Floor",
            "description": "Certified ISO 7 cleanroom facility with wet-chemical bench, spin coater, UV mask aligner, and profilometer for MEMS and microfluidics research.",
            "images": ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "good",
            "condition_checklist": [
                "Chemical bottles returned to acid/solvent cabinets",
                "Gowning area restored and suits stored",
                "Waste containers capped and labeled"
            ],
            "eligibility_requirements": [
                {"type": "certification", "name": "Cleanroom Protocol Certification", "mandatory": True, "description": "Mandatory cleanroom protocol training."}
            ]
        },
        # 6. Nanotech
        {
            "name": "JEOL JSM-IT800 Field Emission SEM",
            "institution": "DTU Materials Characterization Lab",
            "stream": "Nanotechnology & Physics",
            "category": "device",
            "hourly_rate": 350.0,
            "deposit_amount": 1500.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Prof. S. K. Gupta (+91 98111 22334)",
            "supervisor_contact": "Prof. S. K. Gupta (skgupta@dtu.ac.in)",
            "utilization_rate": 0.18,
            "location": "Central Instrumentation Facility, Room G-04",
            "description": "Ultra-high-resolution Schottky field emission scanning electron microscope. Magnification up to 2,000,000x with Oxford EDS detector for elemental mapping.",
            "images": ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Specimen chamber vented and pumped down correctly",
                "Stage returned to exchange position",
                "EDS detector retracted",
                "Filament turned off before sample change"
            ],
            "eligibility_requirements": []
        },
        # 7. ECE
        {
            "name": "Keysight N9020B 10Hz–50GHz Spectrum Analyzer",
            "institution": "NIT Trichy RF & Microwave Lab",
            "stream": "Electronics & VLSI (ECE)",
            "category": "device",
            "hourly_rate": 350.0,
            "deposit_amount": 1800.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. M. K. Venkat (+91 98333 44556)",
            "supervisor_contact": "Prof. M. K. Venkat (venkat@nitt.edu)",
            "utilization_rate": 0.32,
            "location": "ECE Department, Microwave Engineering Lab",
            "description": "High-performance signal analyzer with real-time spectrum analysis up to 160 MHz bandwidth. Ideal for 5G, satellite, and radar testing.",
            "images": ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 4,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Input power was not exceeded (+30 dBm max)",
                "SMA torque wrench was used for connections",
                "Screen and keypad functional",
                "All RF cables returned to storage rack"
            ],
            "eligibility_requirements": []
        },
        # 8. Biotech
        {
            "name": "Beckman Coulter Optima XPN-100 Ultracentrifuge",
            "institution": "IIT Delhi Biosafety Level-2 Lab",
            "stream": "Biotechnology & Life Sciences",
            "category": "equipment",
            "hourly_rate": 200.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. Rajesh Sharma (+91 99333 44556)",
            "supervisor_contact": "Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)",
            "utilization_rate": 0.15,
            "location": "Biotechnology Dept, Room 104",
            "description": "100,000 RPM preparative ultracentrifuge generating over 802,000 x g. Essential for virus purification, nanoparticle fractionation, and organelle isolation.",
            "images": ["https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800"],
            "max_booking_hours": 5,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Rotor tubes balanced to within 0.1g before run",
                "Chamber wiped clean and dry after run",
                "Rotor pins inspected for corrosion",
                "Run logbook signed"
            ],
            "eligibility_requirements": []
        },
        # 9. Mechanical
        {
            "name": "Haas Mini Mill 3-Axis CNC Machining Center",
            "institution": "DTU Central Workshop",
            "stream": "Mechanical & Prototyping",
            "category": "equipment",
            "hourly_rate": 250.0,
            "deposit_amount": 1500.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. R. K. Singhal (+91 98711 55667)",
            "supervisor_contact": "Dr. R. K. Singhal (rksinghal@dtu.ac.in)",
            "utilization_rate": 0.25,
            "location": "Central Workshop, Machine Shop Bay 2",
            "description": "High-precision industrial CNC vertical machining center with 10-pocket tool changer. Machining envelope of 406x305x254 mm for aluminum, brass, and engineering plastics.",
            "images": ["https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800"],
            "max_booking_hours": 6,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Chips cleared from enclosure and way covers",
                "Tools removed and returned to numbered rack",
                "Coolant level verified",
                "Emergency stop release checked"
            ],
            "eligibility_requirements": []
        },
        # 10. Nanotech
        {
            "name": "Bruker Dimension Icon Atomic Force Microscope (AFM)",
            "institution": "IIT Delhi Nano Centre",
            "stream": "Nanotechnology & Physics",
            "category": "device",
            "hourly_rate": 400.0,
            "deposit_amount": 2000.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. Neha Verma (+91 98188 66778)",
            "supervisor_contact": "Dr. Neha Verma (neha.verma@iitd.ac.in)",
            "utilization_rate": 0.19,
            "location": "Nano Research Complex, Room 012",
            "description": "Atomic resolution nanoscale topography and electrical property mapping. Supports PeakForce Tapping, Kelvin Probe, and Magnetic Force Microscopy (MFM).",
            "images": ["https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "AFM cantilever holder inspected without bent pins",
                "Sample stage retracted before dismounting",
                "Acoustic hood latched gently",
                "Vibration isolation table floating evenly"
            ],
            "eligibility_requirements": []
        },
        # 11. CSE
        {
            "name": "Xilinx Zynq UltraScale+ RFSoC Development Cluster",
            "institution": "IIIT Delhi Autonomous Systems Lab",
            "stream": "Computer Science & AI (CSE)",
            "category": "device",
            "hourly_rate": 650.0,
            "deposit_amount": 3500.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. Sujay Deb (+91 98101 77889)",
            "supervisor_contact": "Prof. Sujay Deb (sdeb@iiitd.ac.in)",
            "utilization_rate": 0.35,
            "location": "Hardware Acceleration Lab, Old Academic Block",
            "description": "Heterogeneous computing cluster combining ARM Cortex-A53 multi-core with high-density FPGA fabric and direct RF data converters for SDR and edge AI prototyping.",
            "images": ["https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 4,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "FPGA bitstream wiped upon project exit",
                "No custom flash boots written to persistent eMMC",
                "Cooling fans functioning at normal RPM"
            ],
            "eligibility_requirements": []
        },
        # 12. Mechanical
        {
            "name": "Markforged Mark Two Carbon Fiber 3D Printer",
            "institution": "IIT Delhi Fab Lab",
            "stream": "Mechanical & Prototyping",
            "category": "equipment",
            "hourly_rate": 220.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. Priya Roy (+91 98765 43210)",
            "supervisor_contact": "Dr. Priya Roy (priya.roy@iitd.ac.in)",
            "utilization_rate": 0.42,
            "location": "Fab Lab, Room 203, Block C",
            "description": "Continuous fiber reinforcement printer creating composite parts with the strength of 6061-T6 aluminum. Prints Onyx (micro-carbon nylon) with Kevlar, HSHT fiberglass, or carbon fiber.",
            "images": ["https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Drybox sealed securely after spooling",
                "Fiber cut cleanly without fraying nozzle tip",
                "Print bed leveled and adhesive layer removed"
            ],
            "eligibility_requirements": []
        },
        # 13. ECE
        {
            "name": "Karl Suss MJB4 Mask Aligner & Photolithography Station",
            "institution": "IIT Delhi Nano Centre",
            "stream": "Electronics & VLSI (ECE)",
            "category": "equipment",
            "hourly_rate": 350.0,
            "deposit_amount": 2000.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. Neha Verma (+91 98188 66778)",
            "supervisor_contact": "Dr. Neha Verma (neha.verma@iitd.ac.in)",
            "utilization_rate": 0.30,
            "location": "Cleanroom B4, Sub-level 1, Block E",
            "description": "Sub-micron UV contact mask aligner for wafer lithography up to 100mm wafers. Equipped with split-field microscope for front-to-back alignment in MEMS fabrication.",
            "images": ["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Photomask removed from chuck and returned to case",
                "Lamp shutter closed after exposure",
                "Nitrogen purge valve left at baseline flow"
            ],
            "eligibility_requirements": []
        },
        # 14. Biotech
        {
            "name": "BD FACSAria III High-Speed Cell Sorter",
            "institution": "IIT Delhi Biosafety Level-2 Lab",
            "stream": "Biotechnology & Life Sciences",
            "category": "device",
            "hourly_rate": 300.0,
            "deposit_amount": 1500.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. Rajesh Sharma (+91 99333 44556)",
            "supervisor_contact": "Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)",
            "utilization_rate": 0.24,
            "location": "Biotech Building, Room 208",
            "description": "High-speed multi-laser flow cytometer and fluorescence-activated cell sorter with 4 lasers (405nm, 488nm, 561nm, 633nm) and 18-color detection for sterile population sorting.",
            "images": ["https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Sheath fluid tank filled to operational level",
                "Waste tank emptied and bleached",
                "Nozzle flushed and sonicated if required"
            ],
            "eligibility_requirements": []
        },
        # 15. ECE
        {
            "name": "Rohde & Schwarz ZNB40 Vector Network Analyzer (40 GHz)",
            "institution": "NIT Trichy RF & Microwave Lab",
            "stream": "Electronics & VLSI (ECE)",
            "category": "device",
            "hourly_rate": 200.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. M. K. Venkat (+91 98333 44556)",
            "supervisor_contact": "Prof. M. K. Venkat (venkat@nitt.edu)",
            "utilization_rate": 0.33,
            "location": "Microwave Engineering Lab, Room 204",
            "description": "4-port vector network analyzer covering 100 kHz to 40 GHz with dynamic range up to 140 dB. Ideal for high-speed differential S-parameter measurements and antenna array tuning.",
            "images": ["https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800"],
            "max_booking_hours": 6,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Cal kit standards returned to cushioned wooden box",
                "Test port cables hung without sharp radius bends",
                "Instrument powered down properly through OS shutdown"
            ],
            "eligibility_requirements": []
        },
        # 16. CSE
        {
            "name": "Autonomous Drone & Robotics Flight Arena",
            "institution": "IIIT Delhi Autonomous Systems Lab",
            "stream": "Computer Science & AI (CSE)",
            "category": "lab",
            "hourly_rate": 150.0,
            "deposit_amount": 500.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. P. B. Sujit (+91 98109 88776)",
            "supervisor_contact": "Dr. P. B. Sujit (sujit@iiitd.ac.in)",
            "utilization_rate": 0.40,
            "location": "Indoor Flight Bay, Research Building",
            "description": "12x8x5 meter netted indoor flight arena equipped with 16 Vicon motion-capture infrared cameras for millimeter-accurate 6-DOF ground-truth tracking of quadcopters and rovers.",
            "images": ["https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 4,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Perimeter safety netting inspected for holes or tears",
                "Crash foam mats returned to center landing pad",
                "LiPo charging safety bunker checked"
            ],
            "eligibility_requirements": []
        },
        # 17. Nanotech
        {
            "name": "Rigaku SmartLab 9kW Rotating Anode XRD",
            "institution": "DTU Materials Characterization Lab",
            "stream": "Nanotechnology & Physics",
            "category": "device",
            "hourly_rate": 300.0,
            "deposit_amount": 1500.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Prof. S. K. Gupta (+91 98111 22334)",
            "supervisor_contact": "Prof. S. K. Gupta (skgupta@dtu.ac.in)",
            "utilization_rate": 0.28,
            "location": "XRD Facility, Block 4",
            "description": "High-power 9kW rotating anode X-ray diffractometer with Hypix-3000 multi-dimensional detector. Capable of powder diffraction, thin film grazing incidence, and in-plane rocking curves.",
            "images": ["https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "X-ray shutter confirmed closed before door opening",
                "Sample stage zeroed to home coordinates",
                "Radiation interlocks tested"
            ],
            "eligibility_requirements": []
        },
        # 18. Mechanical
        {
            "name": "Instron 5982 100kN Floor Model Universal Testing Machine",
            "institution": "DTU Central Workshop",
            "stream": "Mechanical & Prototyping",
            "category": "equipment",
            "hourly_rate": 180.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. R. K. Singhal (+91 98711 55667)",
            "supervisor_contact": "Dr. R. K. Singhal (rksinghal@dtu.ac.in)",
            "utilization_rate": 0.21,
            "location": "Strength of Materials Lab, Room 102",
            "description": "Dual-column 100 kN electromechanical test frame for tension, compression, bend, and peel testing of aerospace alloys, composites, and structural specimens with digital extensometers.",
            "images": ["https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800"],
            "max_booking_hours": 5,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Fractured specimen fragments removed from lower crosshead",
                "Load cell zero verified before experiment",
                "Safety shield returned to front enclosure"
            ],
            "eligibility_requirements": []
        },
        # 19. Biotech
        {
            "name": "Illumina NextSeq 2000 Next-Generation DNA Sequencer",
            "institution": "IIT Delhi Biosafety Level-2 Lab",
            "stream": "Biotechnology & Life Sciences",
            "category": "device",
            "hourly_rate": 450.0,
            "deposit_amount": 2500.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. Rajesh Sharma (+91 99333 44556)",
            "supervisor_contact": "Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)",
            "utilization_rate": 0.16,
            "location": "Genomics Core Facility, Room 302",
            "description": "Benchtop next-generation sequencing system delivering up to 360 Gb output. Ideal for whole exome sequencing, single-cell RNA-seq, and metagenomics projects.",
            "images": ["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Flow cell clamp release operated smoothly",
                "Maintenance wash protocol executed after run",
                "Reagent cartridge safely unmounted and discarded"
            ],
            "eligibility_requirements": []
        },
        # 20. CSE
        {
            "name": "Quantum Computing & Cryogenic Testbench",
            "institution": "NSUT High Performance Computing Center",
            "stream": "Computer Science & AI (CSE)",
            "category": "lab",
            "hourly_rate": 350.0,
            "deposit_amount": 1800.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. Ramesh Kumar (+91 98444 55667)",
            "supervisor_contact": "Prof. Ramesh Kumar (ramesh.kumar@nsut.ac.in)",
            "utilization_rate": 0.12,
            "location": "Quantum Information Lab, Block F",
            "description": "BlueFors dilution refrigerator simulator and superconducting qubit pulse controller rack with Qiskit and Pennylane API remote queue execution.",
            "images": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Qubit pulse calibration profile saved to cloud store",
                "No raw microwave drives exceeding -10 dBm injected",
                "Remote SSH tunnel closed upon test finish"
            ],
            "eligibility_requirements": []
        },
        # 21. ECE
        {
            "name": "Automated Surface Mount PCB Pick & Place Line",
            "institution": "Delhi Community Makerspace",
            "stream": "Electronics & VLSI (ECE)",
            "category": "equipment",
            "hourly_rate": 150.0,
            "deposit_amount": 500.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Er. Vikram Batra (+91 99100 44556)",
            "supervisor_contact": "Er. Vikram Batra (vikram@delhimakers.org)",
            "utilization_rate": 0.38,
            "location": "SMT Fabrication Bay, Room 108",
            "description": "Vision-guided automated PCB pick-and-place machine with 24 feeder reels and 4-zone convection reflow oven. Handles component packages down to 0201 and fine-pitch QFN/BGA.",
            "images": ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"],
            "max_booking_hours": 5,
            "max_bookings_per_user_per_month": 4,
            "baseline_condition": "good",
            "condition_checklist": [
                "Vacuum pick nozzles inspected for solder paste contamination",
                "Component tape feeders reeled in and locked",
                "Reflow oven cooldown cycle completed"
            ],
            "eligibility_requirements": []
        },
        # 22. Civil
        {
            "name": "Automated Environmental Triaxial Soil Testing System",
            "institution": "DTU Materials Characterization Lab",
            "stream": "Civil & Environmental Engineering",
            "category": "device",
            "hourly_rate": 120.0,
            "deposit_amount": 500.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. Amit Srivastava (+91 98119 55443)",
            "supervisor_contact": "Prof. Amit Srivastava (asrivastava@dtu.ac.in)",
            "utilization_rate": 0.17,
            "location": "Geotechnical Engineering Lab, Room G-02",
            "description": "Computer-controlled stress-path triaxial cell for consolidated-undrained and consolidated-drained testing of soil, embankment cores, and stabilized geo-materials.",
            "images": ["https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Perspex cell chamber drained and rinsed of soil slurry",
                "Pore pressure valves closed",
                "LVDT displacement sensors docked"
            ],
            "eligibility_requirements": []
        },
        # 23. Civil
        {
            "name": "Total Station Robotic Laser Surveying & LiDAR Suite",
            "institution": "Jamia Millia Research Centre",
            "stream": "Civil & Environmental Engineering",
            "category": "equipment",
            "hourly_rate": 140.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. M. A. Farooqi (+91 98108 44332)",
            "supervisor_contact": "Dr. M. A. Farooqi (mfarooqi@jmi.ac.in)",
            "utilization_rate": 0.31,
            "location": "Civil Survey Stores, Ground Floor",
            "description": "High-precision 1-second angular accuracy robotic total station with integrated terrestrial LiDAR scanner. Long-range prism-free distance measurement up to 1000m.",
            "images": ["https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Telescope lens caps secured before packing",
                "Tripod locking clamps tightened",
                "Prism pole and controller stowed in Pelican hard case"
            ],
            "eligibility_requirements": []
        },
        # 24. Biotech
        {
            "name": "Leica TCS SP8 Confocal Laser Scanning Microscope",
            "institution": "IIT Delhi Biosafety Level-2 Lab",
            "stream": "Biotechnology & Life Sciences",
            "category": "device",
            "hourly_rate": 350.0,
            "deposit_amount": 1500.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. Rajesh Sharma (+91 99333 44556)",
            "supervisor_contact": "Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)",
            "utilization_rate": 0.29,
            "location": "Advanced Bio-Imaging Suite, Room 115",
            "description": "Inverted confocal microscope with spectral detection and white light laser (470-670nm). Optical sectioning for live cell 3D reconstruction and FRET/FRAP imaging.",
            "images": ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Oil immersion lens cleaned immediately with spectrophotometric ethanol",
                "Argon / Diode lasers allowed 10-minute cooling cycle before power off",
                "Incubation chamber turned off"
            ],
            "eligibility_requirements": []
        },
        # 25. CSE
        {
            "name": "Cyber-Physical IoT Sensor Network Testbed",
            "institution": "IIIT Delhi Autonomous Systems Lab",
            "stream": "Computer Science & AI (CSE)",
            "category": "lab",
            "hourly_rate": 280.0,
            "deposit_amount": 1200.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. Sujay Deb (+91 98101 77889)",
            "supervisor_contact": "Prof. Sujay Deb (sdeb@iiitd.ac.in)",
            "utilization_rate": 0.20,
            "location": "Smart City Living Lab, Academic Wing",
            "description": "Over 60 deployed LoRaWAN, BLE mesh, and Zigbee sensor nodes across campus building testbed with real-time telemetry ingestion and edge gateway nodes.",
            "images": ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800"],
            "max_booking_hours": 12,
            "max_bookings_per_user_per_month": 4,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "MQTT topic subscriptions unregistered at end of session",
                "Custom firmware reverted to baseline telemetry daemon",
                "No elevated credentials left on gateway bridges"
            ],
            "eligibility_requirements": []
        },
        # 26. Nanotech
        {
            "name": "Oxford Instruments Plasma Deposition Sputtering Chamber",
            "institution": "IIT Delhi Nano Centre",
            "stream": "Nanotechnology & Physics",
            "category": "equipment",
            "hourly_rate": 400.0,
            "deposit_amount": 2500.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. Neha Verma (+91 98188 66778)",
            "supervisor_contact": "Dr. Neha Verma (neha.verma@iitd.ac.in)",
            "utilization_rate": 0.26,
            "location": "Thin Films Laboratory, Room B-08",
            "description": "Multi-target magnetron sputtering system for metal (Au, Ti, Pt, Al) and dielectric (SiO2, Al2O3) thin-film deposition with RF and DC power supplies and substrate heating up to 500C.",
            "images": ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 2,
            "baseline_condition": "excellent",
            "condition_checklist": [
                "Substrate heater turned off and cooled below 50C before venting",
                "Target shutter closed before stopping RF power",
                "Roughing pump valve sequence verified"
            ],
            "eligibility_requirements": []
        },
        # 27. Media / CS
        {
            "name": "Sony Alpha 7S III 4K Cinema Camera Kit",
            "institution": "NSUT Media Innovation Hub",
            "stream": "Computer Science & AI (CSE)",
            "category": "device",
            "hourly_rate": 150.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. Alok Nath (+91 98111 66554)",
            "supervisor_contact": "Dr. Alok Nath (alok.nath@nsut.ac.in)",
            "utilization_rate": 0.30,
            "location": "Media Center, Room 301, Admin Block",
            "description": "Full-frame mirrorless cinema camera system ideal for computer vision datasets, high-speed motion analysis, and research documentation.",
            "images": ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": ["Camera body unscratched", "Both lens caps on", "Sensor dust-free", "Batteries returned to charging bay"],
            "eligibility_requirements": []
        },
        # 28. CS AI
        {
            "name": "NVIDIA RTX 4090 Dual GPU Workstation",
            "institution": "DTU Supercomputing Cluster",
            "stream": "Computer Science & AI (CSE)",
            "category": "device",
            "hourly_rate": 250.0,
            "deposit_amount": 1500.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Prof. S. K. Gupta (+91 98111 22334)",
            "supervisor_contact": "Prof. S. K. Gupta (skgupta@dtu.ac.in)",
            "utilization_rate": 0.45,
            "location": "AI Lab, Room 402, Block D",
            "description": "Dual NVIDIA RTX 4090 24GB GPUs (48GB VRAM total), AMD Threadripper 32-Core, 128GB RAM. Configured with PyTorch, CUDA 12.3, and Ollama local LLM execution.",
            "images": ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"],
            "max_booking_hours": 8,
            "max_bookings_per_user_per_month": 4,
            "baseline_condition": "excellent",
            "condition_checklist": ["No background daemon jobs left running", "User checkpoints moved to personal storage", "Environment active flags cleared"],
            "eligibility_requirements": []
        },
        # 29. Cleanroom
        {
            "name": "Cleanroom B4 — Photolithography Bench",
            "institution": "IIT Delhi Nano Centre",
            "stream": "Nanotechnology & Physics",
            "category": "lab",
            "hourly_rate": 350.0,
            "deposit_amount": 2000.0,
            "requires_deposit": True,
            "requires_supervision": True,
            "lab_manager": "Dr. Neha Verma (+91 98188 66778)",
            "supervisor_contact": "Dr. Neha Verma (neha.verma@iitd.ac.in)",
            "utilization_rate": 0.35,
            "location": "Nano Fabrication Centre, Sub-level 1, Block E",
            "description": "ISO Class 5 cleanroom workstation for photolithography, thin-film deposition prep, and wafer processing. Gowning required.",
            "images": ["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800"],
            "max_booking_hours": 4,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": ["Cleanroom gowning returned to rack", "Spin coater chuck cleaned with acetone/IPA", "Chemical containers sealed and wiped"],
            "eligibility_requirements": [{"type": "certification", "name": "Cleanroom Protocol Certification", "mandatory": True, "description": "Mandatory cleanroom protocol certification."}]
        },
        # 30. Bioreactor
        {
            "name": "Eppendorf BioFlo 120 Fermentation Bioreactor System",
            "institution": "IIT Delhi Biosafety Level-2 Lab",
            "stream": "Biotechnology & Life Sciences",
            "category": "equipment",
            "hourly_rate": 220.0,
            "deposit_amount": 1000.0,
            "requires_deposit": True,
            "requires_supervision": False,
            "lab_manager": "Dr. Rajesh Sharma (+91 99333 44556)",
            "supervisor_contact": "Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)",
            "utilization_rate": 0.25,
            "location": "Biotechnology Dept, Room 106",
            "description": "Benchtop autoclavable glass bioreactor system (3L vessel) with automated pH, dissolved oxygen (DO), temperature, and agitation cascade control for microbial fermentation and cell culture.",
            "images": ["https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800"],
            "max_booking_hours": 6,
            "max_bookings_per_user_per_month": 3,
            "baseline_condition": "excellent",
            "condition_checklist": ["Vessel autoclaved and sanitized after harvest", "Sensors stored in 3M KCl electrolyte", "Gas sparge filters checked"],
            "eligibility_requirements": []
        }
    ]

    for rd in resources_data:
        existing = db.query(Resource).filter(Resource.name == rd["name"]).first()
        if existing:
            # Update existing resource with stream, rates, and manager info
            for k, v in rd.items():
                setattr(existing, k, v)
            existing.owner_id = owner.id
            db.commit()
            db.refresh(existing)
            resource = existing
            print(f"  [updated] Resource: {rd['name']} (Stream: {rd['stream']})")
        else:
            resource = Resource(
                owner_id=owner.id,
                **rd,
            )
            db.add(resource)
            db.commit()
            db.refresh(resource)
            print(f"  [created] Resource: {resource.name} (Stream: {resource.stream})")

        # Add availability slots for the next 5 days
        _add_slots(db, resource.id)

    db.close()
    print("\n[SUCCESS] Seed data complete! 30 realistic academic resources populated.")
    print(f"\nDemo Login Credentials (password: {DEMO_PASSWORD}):")
    print("  Student:     student@equipgrid.demo")
    print("  Lab Manager: labmanager@equipgrid.demo")
    print("  Admin:       admin@equipgrid.demo")
    print("  Researcher:  researcher@equipgrid.demo")


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
