export const MOCK_RESOURCES = [
  {
    id: 'res-1',
    name: 'Formlabs Form 3+ SLA 3D Printer',
    institution: 'IIT Delhi Fab Lab',
    category: 'equipment',
    stream: 'Mechanical & Prototyping',
    lab_manager: 'Dr. Priya Roy (+91 98765 43210)',
    location: 'Fab Lab, Room 201, Block C',
    status: 'available',
    utilization_rate: 0.28,
    hourly_rate: 150.0,
    description: 'Industrial-grade stereolithography 3D printer for high-resolution resin prototypes. 25–300 micron layer height. Ideal for mechanical parts and functional prototypes.',
    images: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800'],
    max_booking_hours: 6,
    max_bookings_per_user_per_month: 4,
    requires_deposit: true,
    deposit_amount: 500.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. Priya Roy (priya.roy@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Resin tank full, build plate clean, all calibrations current.',
    condition_checklist: [
      'Resin tank is not contaminated',
      'Build plate is clean and level',
      'Print bed scraper is present',
      'Platform cleaned with IPA',
      'No resin spills on exterior'
    ],
    eligibility_requirements: [
      {
        type: 'certification',
        name: '3D Printing Operator',
        mandatory: true,
        description: 'Must hold a valid 3D Printing Operator certification.'
      }
    ]
  },
  {
    id: 'res-2',
    name: 'Keysight InfiniiVision 4-Channel Oscilloscope (1 GHz)',
    institution: 'Jamia Millia Research Centre',
    category: 'device',
    stream: 'Electronics & VLSI (ECE)',
    lab_manager: 'Prof. Tariq Mansoor (+91 98112 33445)',
    location: 'Electronics Lab, Room 105, Block A',
    status: 'available',
    utilization_rate: 0.15,
    hourly_rate: 0.0,
    description: 'High-performance digital oscilloscope with 1 GHz bandwidth, 4 GSa/s sample rate, and 4 channels. Equipped with serial decode and waveform generator.',
    images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 6,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. Tariq Mansoor (tariq.m@jmi.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'All 4 probes present, power adapter in drawer, calibration valid.',
    condition_checklist: [
      'All 4 probes present and undamaged',
      'BNC connectors free of debris',
      'Power cable secure',
      'Display screen unscratched'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-3',
    name: 'Universal Laser Systems VLS 3.5 CO2 Laser Cutter',
    institution: 'Delhi Community Makerspace',
    category: 'equipment',
    stream: 'Mechanical & Prototyping',
    lab_manager: 'Er. Vikram Batra (+91 99100 44556)',
    location: 'Makerspace, Room G-04, Block B',
    status: 'available',
    utilization_rate: 0.22,
    hourly_rate: 200.0,
    description: 'Professional 50W CO2 laser cutter/engraver with 24x18 inch bed. High-precision cutting for acrylic, wood, leather, and delrin.',
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1000.0,
    requires_supervision: true,
    supervisor_contact: 'Er. Vikram Batra (vikram@delhimakers.org)',
    baseline_condition: 'good',
    baseline_notes: 'Focal lens clean, exhaust flow verified.',
    condition_checklist: [
      'Lens is clean and unscratched',
      'Cutting bed free of debris',
      'Exhaust system operational',
      'Emergency stop button tested'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'Laser Safety Level 1',
        mandatory: true,
        description: 'Must complete institutional laser safety walkthrough.'
      }
    ]
  },
  {
    id: 'res-4',
    name: 'NVIDIA DGX H100 Deep Learning Workstation Node',
    institution: 'NSUT High Performance Computing Center',
    category: 'device',
    stream: 'Computer Science & AI (CSE)',
    lab_manager: 'Prof. Ramesh Kumar (+91 98444 55667)',
    location: 'Server Room 3, Computer Center',
    status: 'available',
    utilization_rate: 0.72,
    hourly_rate: 0.0,
    description: '8x NVIDIA H100 80GB SXM5 GPUs with 3.2Tbps InfiniBand networking. Subsidized by National Supercomputing Mission for university research.',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],
    max_booking_hours: 12,
    max_bookings_per_user_per_month: 2,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. Ramesh Kumar (ramesh.kumar@nsut.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'All 8 GPUs idle, thermals optimal at 38C.',
    condition_checklist: [
      'Scratch space cleared after jobs finish',
      'No zombie background processes left running',
      'Container images unmounted'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-5',
    name: 'Class 10,000 (ISO 7) Cleanroom Bay',
    institution: 'BITS Pilani Microfabrication Centre',
    category: 'lab',
    stream: 'Nanotechnology & Physics',
    lab_manager: 'Dr. Ananya Sen (+91 97222 33445)',
    location: 'Nanotechnology Building, Ground Floor',
    status: 'available',
    utilization_rate: 0.22,
    hourly_rate: 350.0,
    description: 'Certified ISO 7 cleanroom facility with wet-chemical bench, spin coater, UV mask aligner, and profilometer for MEMS and microfluidics research.',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 2000.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. Ananya Sen (ananya@pilani.bits-pilani.ac.in)',
    baseline_condition: 'good',
    baseline_notes: 'Positive pressure maintained, HEPA filters certified.',
    condition_checklist: [
      'Chemical bottles returned to acid/solvent cabinets',
      'Gowning area restored and suits stored',
      'Waste containers capped and labeled'
    ],
    eligibility_requirements: [
      {
        type: 'certification',
        name: 'Cleanroom Protocol & Chemical Safety',
        mandatory: true,
        description: 'Mandatory annual safety test + cleanroom protocol walkthrough.'
      }
    ]
  },
  {
    id: 'res-6',
    name: 'JEOL JSM-IT800 Field Emission SEM',
    institution: 'DTU Materials Characterization Lab',
    category: 'device',
    stream: 'Nanotechnology & Physics',
    lab_manager: 'Prof. S. K. Gupta (+91 98111 22334)',
    location: 'Central Instrumentation Facility, Room G-04',
    status: 'available',
    utilization_rate: 0.18,
    hourly_rate: 350.0,
    description: 'Ultra-high-resolution Schottky field emission scanning electron microscope. Magnification up to 2,000,000x with Oxford EDS detector for elemental mapping.',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 1500.0,
    requires_supervision: true,
    supervisor_contact: 'Prof. S. K. Gupta (skgupta@dtu.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Chamber vacuum 10^-5 Pa, electron column aligned.',
    condition_checklist: [
      'Specimen chamber vented and pumped down correctly',
      'Stage returned to exchange position',
      'EDS detector retracted',
      'Filament turned off before sample change'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'SEM Operation & Radiation Safety',
        mandatory: true,
        description: 'Requires completion of CIF SEM workshop.'
      }
    ]
  },
  {
    id: 'res-7',
    name: 'Keysight N9020B 10Hz–50GHz Spectrum Analyzer',
    institution: 'NIT Trichy RF & Microwave Lab',
    category: 'device',
    stream: 'Electronics & VLSI (ECE)',
    lab_manager: 'Prof. M. K. Venkat (+91 98333 44556)',
    location: 'ECE Department, Microwave Engineering Lab',
    status: 'available',
    utilization_rate: 0.32,
    hourly_rate: 100.0,
    description: 'High-performance signal analyzer with real-time spectrum analysis up to 160 MHz bandwidth. Ideal for 5G, satellite, and radar testing.',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 4,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. M. K. Venkat (venkat@nitt.edu)',
    baseline_condition: 'excellent',
    baseline_notes: 'Factory calibrated, all SMA attenuators accounted for.',
    condition_checklist: [
      'Input power was not exceeded (+30 dBm max)',
      'SMA torque wrench was used for connections',
      'Screen and keypad functional',
      'All RF cables returned to storage rack'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-8',
    name: 'Beckman Coulter Optima XPN-100 Ultracentrifuge',
    institution: 'IIT Delhi Biosafety Level-2 Lab',
    category: 'equipment',
    stream: 'Biotechnology & Life Sciences',
    lab_manager: 'Dr. Rajesh Sharma (+91 99333 44556)',
    location: 'Biotechnology Dept, Room 104',
    status: 'available',
    utilization_rate: 0.15,
    hourly_rate: 200.0,
    description: '100,000 RPM preparative ultracentrifuge generating over 802,000 x g. Essential for virus purification, nanoparticle fractionation, and organelle isolation.',
    images: ['https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800'],
    max_booking_hours: 5,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1000.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Vacuum system inspected, rotor pins lubricated.',
    condition_checklist: [
      'Rotor tubes balanced to within 0.1g before run',
      'Chamber wiped clean and dry after run',
      'Rotor pins inspected for corrosion',
      'Run logbook signed'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'Ultracentrifuge Safety & Rotor Balancing',
        mandatory: true,
        description: 'Mandatory balancing protocol training.'
      }
    ]
  },
  {
    id: 'res-9',
    name: 'Haas Mini Mill 3-Axis CNC Machining Center',
    institution: 'DTU Central Workshop',
    category: 'equipment',
    stream: 'Mechanical & Prototyping',
    lab_manager: 'Dr. R. K. Singhal (+91 98711 55667)',
    location: 'Central Workshop, Machine Shop Bay 2',
    status: 'available',
    utilization_rate: 0.25,
    hourly_rate: 250.0,
    description: 'High-precision industrial CNC vertical machining center with 10-pocket tool changer. Machining envelope of 406x305x254 mm for aluminum, brass, and engineering plastics.',
    images: ['https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800'],
    max_booking_hours: 6,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1500.0,
    requires_supervision: true,
    supervisor_contact: 'Dr. R. K. Singhal (rksinghal@dtu.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Spindle runout checked, coolant tank refilled with synthetic fluid.',
    condition_checklist: [
      'Chips cleared from enclosure and way covers',
      'Tools removed and returned to numbered rack',
      'Coolant level verified',
      'Emergency stop release checked'
    ],
    eligibility_requirements: [
      {
        type: 'certification',
        name: 'CNC Milling Specialist',
        mandatory: true,
        description: 'DTU Workshop CNC certification required.'
      }
    ]
  },
  {
    id: 'res-10',
    name: 'Bruker Dimension Icon Atomic Force Microscope (AFM)',
    institution: 'IIT Delhi Nano Centre',
    category: 'device',
    stream: 'Nanotechnology & Physics',
    lab_manager: 'Dr. Neha Verma (+91 98188 66778)',
    location: 'Nano Research Complex, Room 012',
    status: 'available',
    utilization_rate: 0.19,
    hourly_rate: 400.0,
    description: 'Atomic resolution nanoscale topography and electrical property mapping. Supports PeakForce Tapping, Kelvin Probe, and Magnetic Force Microscopy (MFM).',
    images: ['https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 2000.0,
    requires_supervision: true,
    supervisor_contact: 'Dr. Neha Verma (neha.verma@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Acoustic isolation hood operational, laser aligned to photodiode center.',
    condition_checklist: [
      'AFM cantilever holder inspected without bent pins',
      'Sample stage retracted before dismounting',
      'Acoustic hood latched gently',
      'Vibration isolation table floating evenly'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'AFM Nano-characterization Level 2',
        mandatory: true,
        description: 'Advanced AFM training from Nano Centre.'
      }
    ]
  },
  {
    id: 'res-11',
    name: 'Xilinx Zynq UltraScale+ RFSoC Development Cluster',
    institution: 'IIIT Delhi Autonomous Systems Lab',
    category: 'device',
    stream: 'Computer Science & AI (CSE)',
    lab_manager: 'Prof. Sujay Deb (+91 98101 77889)',
    location: 'Hardware Acceleration Lab, Old Academic Block',
    status: 'available',
    utilization_rate: 0.35,
    hourly_rate: 0.0,
    description: 'Heterogeneous computing cluster combining ARM Cortex-A53 multi-core with high-density FPGA fabric and direct RF data converters for SDR and edge AI prototyping.',
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 4,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. Sujay Deb (sdeb@iiitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Vivado 2023.2 toolchains loaded, JTAG programmer cables intact.',
    condition_checklist: [
      'FPGA bitstream wiped upon project exit',
      'No custom flash boots written to persistent eMMC',
      'Cooling fans functioning at normal RPM'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-12',
    name: 'Markforged Mark Two Carbon Fiber 3D Printer',
    institution: 'IIT Delhi Fab Lab',
    category: 'equipment',
    stream: 'Mechanical & Prototyping',
    lab_manager: 'Dr. Priya Roy (+91 98765 43210)',
    location: 'Fab Lab, Room 203, Block C',
    status: 'available',
    utilization_rate: 0.42,
    hourly_rate: 220.0,
    description: 'Continuous fiber reinforcement printer creating composite parts with the strength of 6061-T6 aluminum. Prints Onyx (micro-carbon nylon) with Kevlar, HSHT fiberglass, or carbon fiber.',
    images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1000.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. Priya Roy (priya.roy@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Drybox humidity at 12%, fiber routing tube clear.',
    condition_checklist: [
      'Drybox sealed securely after spooling',
      'Fiber cut cleanly without fraying nozzle tip',
      'Print bed leveled and adhesive layer removed'
    ],
    eligibility_requirements: [
      {
        type: 'certification',
        name: 'Composite Manufacturing Lab Operator',
        mandatory: true,
        description: 'Certification for high-performance composite additive equipment.'
      }
    ]
  },
  {
    id: 'res-13',
    name: 'Karl Suss MJB4 Mask Aligner & Photolithography Station',
    institution: 'IIT Delhi Nano Centre',
    category: 'equipment',
    stream: 'Electronics & VLSI (ECE)',
    lab_manager: 'Dr. Neha Verma (+91 98188 66778)',
    location: 'Cleanroom B4, Sub-level 1, Block E',
    status: 'available',
    utilization_rate: 0.30,
    hourly_rate: 350.0,
    description: 'Sub-micron UV contact mask aligner for wafer lithography up to 100mm wafers. Equipped with split-field microscope for front-to-back alignment in MEMS fabrication.',
    images: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 2000.0,
    requires_supervision: true,
    supervisor_contact: 'Dr. Neha Verma (neha.verma@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Mercury arc lamp hours: 140/500, vacuum chuck holding 25 inHg.',
    condition_checklist: [
      'Photomask removed from chuck and returned to case',
      'Lamp shutter closed after exposure',
      'Nitrogen purge valve left at baseline flow'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'Lithography Yellow Room Safety',
        mandatory: true,
        description: 'Required yellow room protocol validation.'
      }
    ]
  },
  {
    id: 'res-14',
    name: 'BD FACSAria III High-Speed Cell Sorter',
    institution: 'IIT Delhi Biosafety Level-2 Lab',
    category: 'device',
    stream: 'Biotechnology & Life Sciences',
    lab_manager: 'Dr. Rajesh Sharma (+91 99333 44556)',
    location: 'Biotech Building, Room 208',
    status: 'available',
    utilization_rate: 0.24,
    hourly_rate: 300.0,
    description: 'High-speed multi-laser flow cytometer and fluorescence-activated cell sorter with 4 lasers (405nm, 488nm, 561nm, 633nm) and 18-color detection for sterile population sorting.',
    images: ['https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 1500.0,
    requires_supervision: true,
    supervisor_contact: 'Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Fluidics lines bleached and rinsed with DI water.',
    condition_checklist: [
      'Sheath fluid tank filled to operational level',
      'Waste tank emptied and bleached',
      'Nozzle flushed and sonicated if required'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'BSL-2 Biohazard Containment & Sorter Protocol',
        mandatory: true,
        description: 'Mandatory BSL-2 certification.'
      }
    ]
  },
  {
    id: 'res-15',
    name: 'Rohde & Schwarz ZNB40 Vector Network Analyzer (40 GHz)',
    institution: 'NIT Trichy RF & Microwave Lab',
    category: 'device',
    stream: 'Electronics & VLSI (ECE)',
    lab_manager: 'Prof. M. K. Venkat (+91 98333 44556)',
    location: 'Microwave Engineering Lab, Room 204',
    status: 'available',
    utilization_rate: 0.33,
    hourly_rate: 200.0,
    description: '4-port vector network analyzer covering 100 kHz to 40 GHz with dynamic range up to 140 dB. Ideal for high-speed differential S-parameter measurements and antenna array tuning.',
    images: ['https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800'],
    max_booking_hours: 6,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1000.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. M. K. Venkat (venkat@nitt.edu)',
    baseline_condition: 'excellent',
    baseline_notes: 'Precision 2.92mm calibration kit present and intact.',
    condition_checklist: [
      'Cal kit standards returned to cushioned wooden box',
      'Test port cables hung without sharp radius bends',
      'Instrument powered down properly through OS shutdown'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-16',
    name: 'Autonomous Drone & Robotics Flight Arena',
    institution: 'IIIT Delhi Autonomous Systems Lab',
    category: 'lab',
    stream: 'Computer Science & AI (CSE)',
    lab_manager: 'Dr. P. B. Sujit (+91 98109 88776)',
    location: 'Indoor Flight Bay, Research Building',
    status: 'available',
    utilization_rate: 0.40,
    hourly_rate: 150.0,
    description: '12x8x5 meter netted indoor flight arena equipped with 16 Vicon motion-capture infrared cameras for millimeter-accurate 6-DOF ground-truth tracking of quadcopters and rovers.',
    images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 4,
    requires_deposit: true,
    deposit_amount: 500.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. P. B. Sujit (sujit@iiitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Vicon optical calibration wand returned, floor netting taut.',
    condition_checklist: [
      'Perimeter safety netting inspected for holes or tears',
      'Crash foam mats returned to center landing pad',
      'LiPo charging safety bunker checked'
    ],
    eligibility_requirements: [
      {
        type: 'certification',
        name: 'Indoor UAV Flight Safety Pilot',
        mandatory: true,
        description: 'Pass flight arena safety test.'
      }
    ]
  },
  {
    id: 'res-17',
    name: 'Rigaku SmartLab 9kW Rotating Anode XRD',
    institution: 'DTU Materials Characterization Lab',
    category: 'device',
    stream: 'Nanotechnology & Physics',
    lab_manager: 'Prof. S. K. Gupta (+91 98111 22334)',
    location: 'XRD Facility, Block 4',
    status: 'available',
    utilization_rate: 0.28,
    hourly_rate: 300.0,
    description: 'High-power 9kW rotating anode X-ray diffractometer with Hypix-3000 multi-dimensional detector. Capable of powder diffraction, thin film grazing incidence, and in-plane rocking curves.',
    images: ['https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 1500.0,
    requires_supervision: true,
    supervisor_contact: 'Prof. S. K. Gupta (skgupta@dtu.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Cooling chiller temperature stable at 18C, X-ray tube vacuum normal.',
    condition_checklist: [
      'X-ray shutter confirmed closed before door opening',
      'Sample stage zeroed to home coordinates',
      'Radiation interlocks tested'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'Radiation Safety Level 2',
        mandatory: true,
        description: 'Certified institutional radiation badge holder.'
      }
    ]
  },
  {
    id: 'res-18',
    name: 'Instron 5982 100kN Floor Model Universal Testing Machine',
    institution: 'DTU Central Workshop',
    category: 'equipment',
    stream: 'Mechanical & Prototyping',
    lab_manager: 'Dr. R. K. Singhal (+91 98711 55667)',
    location: 'Strength of Materials Lab, Room 102',
    status: 'available',
    utilization_rate: 0.21,
    hourly_rate: 180.0,
    description: 'Dual-column 100 kN electromechanical test frame for tension, compression, bend, and peel testing of aerospace alloys, composites, and structural specimens with digital extensometers.',
    images: ['https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800'],
    max_booking_hours: 5,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1000.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. R. K. Singhal (rksinghal@dtu.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: '100 kN load cell calibrated, hydraulic wedge grips pressurized.',
    condition_checklist: [
      'Fractured specimen fragments removed from lower crosshead',
      'Load cell zero verified before experiment',
      'Safety shield returned to front enclosure'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-19',
    name: 'Illumina NextSeq 2000 Next-Generation DNA Sequencer',
    institution: 'IIT Delhi Biosafety Level-2 Lab',
    category: 'device',
    stream: 'Biotechnology & Life Sciences',
    lab_manager: 'Dr. Rajesh Sharma (+91 99333 44556)',
    location: 'Genomics Core Facility, Room 302',
    status: 'available',
    utilization_rate: 0.16,
    hourly_rate: 450.0,
    description: 'Benchtop next-generation sequencing system delivering up to 360 Gb output. Ideal for whole exome sequencing, single-cell RNA-seq, and metagenomics projects.',
    images: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 2500.0,
    requires_supervision: true,
    supervisor_contact: 'Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Wash cartridge run complete, optics laser diagnostics green.',
    condition_checklist: [
      'Flow cell clamp release operated smoothly',
      'Maintenance wash protocol executed after run',
      'Reagent cartridge safely unmounted and discarded'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'Genomics Library Prep & NGS Certification',
        mandatory: true,
        description: 'Advanced molecular genetics training.'
      }
    ]
  },
  {
    id: 'res-20',
    name: 'Quantum Computing & Cryogenic Testbench',
    institution: 'NSUT High Performance Computing Center',
    category: 'lab',
    stream: 'Computer Science & AI (CSE)',
    lab_manager: 'Prof. Ramesh Kumar (+91 98444 55667)',
    location: 'Quantum Information Lab, Block F',
    status: 'available',
    utilization_rate: 0.12,
    hourly_rate: 0.0,
    description: 'BlueFors dilution refrigerator simulator and superconducting qubit pulse controller rack with Qiskit and Pennylane API remote queue execution.',
    images: ['https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 2,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. Ramesh Kumar (ramesh.kumar@nsut.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Cryostat vacuum jacket tested, pulse AWG channels synchronized.',
    condition_checklist: [
      'Qubit pulse calibration profile saved to cloud store',
      'No raw microwave drives exceeding -10 dBm injected',
      'Remote SSH tunnel closed upon test finish'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-21',
    name: 'Automated Surface Mount PCB Pick & Place Line',
    institution: 'Delhi Community Makerspace',
    category: 'equipment',
    stream: 'Electronics & VLSI (ECE)',
    lab_manager: 'Er. Vikram Batra (+91 99100 44556)',
    location: 'SMT Fabrication Bay, Room 108',
    status: 'available',
    utilization_rate: 0.38,
    hourly_rate: 150.0,
    description: 'Vision-guided automated PCB pick-and-place machine with 24 feeder reels and 4-zone convection reflow oven. Handles component packages down to 0201 and fine-pitch QFN/BGA.',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
    max_booking_hours: 5,
    max_bookings_per_user_per_month: 4,
    requires_deposit: true,
    deposit_amount: 500.0,
    requires_supervision: false,
    supervisor_contact: 'Er. Vikram Batra (vikram@delhimakers.org)',
    baseline_condition: 'good',
    baseline_notes: 'Nozzle calibration completed, solder paste stencil clean.',
    condition_checklist: [
      'Vacuum pick nozzles inspected for solder paste contamination',
      'Component tape feeders reeled in and locked',
      'Reflow oven cooldown cycle completed'
    ],
    eligibility_requirements: [
      {
        type: 'certification',
        name: 'SMT Assembly & Soldering Safety',
        mandatory: true,
        description: 'Complete SMT line briefing.'
      }
    ]
  },
  {
    id: 'res-22',
    name: 'Automated Environmental Triaxial Soil Testing System',
    institution: 'DTU Materials Characterization Lab',
    category: 'device',
    stream: 'Civil & Environmental Engineering',
    lab_manager: 'Prof. Amit Srivastava (+91 98119 55443)',
    location: 'Geotechnical Engineering Lab, Room G-02',
    status: 'available',
    utilization_rate: 0.17,
    hourly_rate: 120.0,
    description: 'Computer-controlled stress-path triaxial cell for consolidated-undrained and consolidated-drained testing of soil, embankment cores, and stabilized geo-materials.',
    images: ['https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 500.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. Amit Srivastava (asrivastava@dtu.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'De-aired water tank filled, pore pressure transducers calibrated.',
    condition_checklist: [
      'Perspex cell chamber drained and rinsed of soil slurry',
      'Pore pressure valves closed',
      'LVDT displacement sensors docked'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-23',
    name: 'Total Station Robotic Laser Surveying & LiDAR Suite',
    institution: 'Jamia Millia Research Centre',
    category: 'equipment',
    stream: 'Civil & Environmental Engineering',
    lab_manager: 'Dr. M. A. Farooqi (+91 98108 44332)',
    location: 'Civil Survey Stores, Ground Floor',
    status: 'available',
    utilization_rate: 0.31,
    hourly_rate: 140.0,
    description: 'High-precision 1-second angular accuracy robotic total station with integrated terrestrial LiDAR scanner. Long-range prism-free distance measurement up to 1000m.',
    images: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1000.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. M. A. Farooqi (mfarooqi@jmi.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Tribrach leveled, optical plummet clean, batteries charged.',
    condition_checklist: [
      'Telescope lens caps secured before packing',
      'Tripod locking clamps tightened',
      'Prism pole and controller stowed in Pelican hard case'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-24',
    name: 'Leica TCS SP8 Confocal Laser Scanning Microscope',
    institution: 'IIT Delhi Biosafety Level-2 Lab',
    category: 'device',
    stream: 'Biotechnology & Life Sciences',
    lab_manager: 'Dr. Rajesh Sharma (+91 99333 44556)',
    location: 'Advanced Bio-Imaging Suite, Room 115',
    status: 'available',
    utilization_rate: 0.29,
    hourly_rate: 350.0,
    description: 'Inverted confocal microscope with spectral detection and white light laser (470-670nm). Optical sectioning for live cell 3D reconstruction and FRET/FRAP imaging.',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 1500.0,
    requires_supervision: true,
    supervisor_contact: 'Dr. Rajesh Sharma (rajesh.sharma@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Laser alignment checked, immersion oil objective cleaned with lens paper.',
    condition_checklist: [
      'Oil immersion lens cleaned immediately with spectrophotometric ethanol',
      'Argon / Diode lasers allowed 10-minute cooling cycle before power off',
      'Incubation chamber turned off'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'Confocal Microscopy Operations Level 1',
        mandatory: true,
        description: 'Mandatory optics training.'
      }
    ]
  },
  {
    id: 'res-25',
    name: 'Cyber-Physical IoT Sensor Network Testbed',
    institution: 'IIIT Delhi Autonomous Systems Lab',
    category: 'lab',
    stream: 'Computer Science & AI (CSE)',
    lab_manager: 'Prof. Sujay Deb (+91 98101 77889)',
    location: 'Smart City Living Lab, Academic Wing',
    status: 'available',
    utilization_rate: 0.20,
    hourly_rate: 0.0,
    description: 'Over 60 deployed LoRaWAN, BLE mesh, and Zigbee sensor nodes across campus building testbed with real-time telemetry ingestion and edge gateway nodes.',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'],
    max_booking_hours: 12,
    max_bookings_per_user_per_month: 4,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. Sujay Deb (sdeb@iiitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'All 60 nodes pinging gateway, battery health telemetry at 95%.',
    condition_checklist: [
      'MQTT topic subscriptions unregistered at end of session',
      'Custom firmware reverted to baseline telemetry daemon',
      'No elevated credentials left on gateway bridges'
    ],
    eligibility_requirements: []
  },
  {
    id: 'res-26',
    name: 'Oxford Instruments Plasma Deposition Sputtering Chamber',
    institution: 'IIT Delhi Nano Centre',
    category: 'equipment',
    stream: 'Nanotechnology & Physics',
    lab_manager: 'Dr. Neha Verma (+91 98188 66778)',
    location: 'Thin Films Laboratory, Room B-08',
    status: 'available',
    utilization_rate: 0.26,
    hourly_rate: 400.0,
    description: 'Multi-target magnetron sputtering system for metal (Au, Ti, Pt, Al) and dielectric (SiO2, Al2O3) thin-film deposition with RF and DC power supplies and substrate heating up to 500C.',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 2500.0,
    requires_supervision: true,
    supervisor_contact: 'Dr. Neha Verma (neha.verma@iitd.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'Base vacuum at 4x10^-7 Torr, argon gas cylinder at 80 bar.',
    condition_checklist: [
      'Substrate heater turned off and cooled below 50C before venting',
      'Target shutter closed before stopping RF power',
      'Roughing pump valve sequence verified'
    ],
    eligibility_requirements: [
      {
        type: 'training',
        name: 'Vacuum Systems & Sputtering Safety',
        mandatory: true,
        description: 'High-vacuum thin film safety training.'
      }
    ]
  }
];

export const MOCK_SLOTS = [
  { id: 'slot-1', start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 86400000 + 7200000).toISOString() }, // 2 hours
  { id: 'slot-2', start_time: new Date(Date.now() + 86400000 + 14400000).toISOString(), end_time: new Date(Date.now() + 86400000 + 25200000).toISOString() }, // 3 hours
  { id: 'slot-3', start_time: new Date(Date.now() + 172800000).toISOString(), end_time: new Date(Date.now() + 172800000 + 14400000).toISOString() }
];

export const MOCK_BOOKINGS = [
  {
    id: 'bkg-demo-1',
    resource_id: 'res-1',
    resource: MOCK_RESOURCES[0],
    resource_name: 'Formlabs Form 3+ SLA 3D Printer',
    status: 'checked_in',
    purpose_text: 'Fabricating microfluidic channel prototypes for masters dissertation project.',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() + 7200000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    borrower_name: 'Aarav Singh',
    borrower_institution: 'IIT Delhi',
    hourly_rate: 150.0,
    total_fee: 300.0,
    deposit_held: 0.0,
    deposit_status: 'waived_reputation',
    checkin_condition_rating: 'excellent',
    condition_checklist_responses: {
      'Resin tank is not contaminated': true,
      'Build plate is clean and level': true,
      'Print bed scraper is present': true,
      'Platform cleaned with IPA': true,
      'No resin spills on exterior': true
    }
  },
  {
    id: 'bkg-demo-2',
    resource_id: 'res-4',
    resource: MOCK_RESOURCES[3],
    resource_name: 'NVIDIA DGX H100 Deep Learning Workstation Node',
    status: 'completed',
    purpose_text: 'Fine-tuning multimodal diffusion model for biomedical imaging.',
    start_time: new Date(Date.now() - 172800000).toISOString(),
    end_time: new Date(Date.now() - 165600000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    borrower_name: 'Aarav Singh',
    borrower_institution: 'IIT Delhi',
    hourly_rate: 0.0,
    total_fee: 0.0,
    deposit_held: 0.0,
    deposit_status: 'refunded_upi',
    checkin_condition_rating: 'excellent',
    return_condition_rating: 'excellent',
    has_feedback: true,
    feedback_rating: 5,
    tokens_awarded: 25
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'log-1',
    event_type: 'CHECK_IN_VERIFIED',
    resource_id: 'res-1',
    resource_name: 'Formlabs Form 3+ SLA 3D Printer',
    actor_id: 'usr-student',
    actor_name: 'Aarav Singh (Student)',
    institution: 'IIT Delhi',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    details: 'Digital signoff completed. Checklist: 5/5 verified. Caution deposit status: Waived via Trust Score 98%.'
  },
  {
    id: 'log-2',
    event_type: 'RESERVATION_APPROVED',
    resource_id: 'res-1',
    resource_name: 'Formlabs Form 3+ SLA 3D Printer',
    actor_id: 'usr-faculty',
    actor_name: 'Dr. Priya Roy (Lab In-charge)',
    institution: 'IIT Delhi',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    details: 'Institutional slot approved for research dissertation. Quota checked: 2.0/16.0 hrs used.'
  },
  {
    id: 'log-3',
    event_type: 'RETURN_CLEARED_REFUND_TRIGGERED',
    resource_id: 'res-4',
    resource_name: 'NVIDIA DGX H100 Deep Learning Workstation Node',
    actor_id: 'usr-faculty-ramesh',
    actor_name: 'Prof. Ramesh Kumar (Faculty In-charge)',
    institution: 'NSUT High Performance Computing Center',
    timestamp: new Date(Date.now() - 165600000).toISOString(),
    hash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    details: 'Equipment returned in pristine condition. Zero damage detected. 100% UPI caution refund released.'
  }
];

export const MOCK_INCIDENTS = [];
