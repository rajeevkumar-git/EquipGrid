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
        description: 'Requires completion of the 2-day CIF SEM workshop.'
      }
    ]
  },
  {
    id: 'res-3',
    name: 'Class 10,000 (ISO 7) Cleanroom Bay',
    institution: 'BITS Pilani Microfabrication Centre',
    category: 'lab',
    stream: 'Electronics & VLSI (ECE)',
    lab_manager: 'Dr. Ananya Sen (+91 97222 33445)',
    location: 'Nanotechnology Building, Ground Floor',
    status: 'available',
    utilization_rate: 0.22,
    hourly_rate: 0.0,
    description: 'Certified ISO 7 cleanroom facility with wet-chemical bench, spin coater, UV mask aligner, and profilometer for MEMS and microfluidics research (Institute Subsidized).',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 3,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Dr. Ananya Sen (ananya@pilani.bits-pilani.ac.in)',
    baseline_condition: 'good',
    baseline_notes: 'Positive pressure maintained, HEPA filters certified.',
    condition_checklist: [
      'Bunsen burner / hotplates off',
      'Chemical bottles returned to acid/solvent cabinets',
      'Gowning area restored and bunny suits discarded',
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
    id: 'res-4',
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
    id: 'res-5',
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
    id: 'res-6',
    name: 'NVIDIA DGX H100 AI Workstation Node',
    institution: 'NSUT High Performance Computing Center',
    category: 'device',
    stream: 'Computer Science & AI (CSE)',
    lab_manager: 'Prof. Ramesh Kumar (+91 98444 55667)',
    location: 'Server Room 3, Computer Center',
    status: 'available',
    utilization_rate: 0.72,
    hourly_rate: 0.0,
    description: '8x NVIDIA H100 80GB SXM5 GPUs with 3.2Tbps InfiniBand networking. Fully subsidized by National Supercomputing Mission for university research.',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],
    max_booking_hours: 12,
    max_bookings_per_user_per_month: 2,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
    supervisor_contact: 'Prof. Ramesh Kumar (ramesh.kumar@nsut.ac.in)',
    baseline_condition: 'excellent',
    baseline_notes: 'All 8 GPUs idle, thermals optimal at 38°C.',
    condition_checklist: [
      'Scratch space cleared after jobs finish',
      'No zombie background processes left running',
      'Container images unmounted',
      'SSH keys revoked after session'
    ],
    eligibility_requirements: []
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
    resource_name: 'Keysight N9020B 10Hz–50GHz Spectrum Analyzer',
    status: 'completed',
    purpose_text: 'Characterization of Ku-band microstrip patch antenna array.',
    start_time: new Date(Date.now() - 172800000).toISOString(),
    end_time: new Date(Date.now() - 165600000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    borrower_name: 'Aarav Singh',
    borrower_institution: 'IIT Delhi',
    hourly_rate: 100.0,
    total_fee: 200.0,
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
    resource_name: 'Keysight N9020B Spectrum Analyzer',
    actor_id: 'usr-faculty-venkat',
    actor_name: 'Prof. M. K. Venkat (Faculty In-charge)',
    institution: 'NIT Trichy',
    timestamp: new Date(Date.now() - 165600000).toISOString(),
    hash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    details: 'Equipment returned in pristine condition. Zero damage detected. 100% UPI caution refund released.'
  }
];

export const MOCK_INCIDENTS = [];
