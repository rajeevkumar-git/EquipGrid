export const MOCK_RESOURCES = [
  {
    id: 'res-1',
    name: 'Formlabs Form 3+ SLA 3D Printer',
    institution: 'IIT Delhi Fab Lab',
    category: 'equipment',
    location: 'Fab Lab, Room 201, Block C',
    status: 'available',
    utilization_rate: 0.28,
    description: 'Industrial-grade stereolithography 3D printer for high-resolution resin prototypes. 25–300 micron layer height. Ideal for mechanical parts and functional prototypes.',
    images: ['https://images.unsplash.com/photo-1581092921461-39b9d08c0e82?w=800'],
    max_booking_hours: 6,
    max_bookings_per_user_per_month: 4,
    requires_deposit: true,
    deposit_amount: 500.0,
    requires_supervision: false,
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
    location: 'Central Instrumentation Facility, Room G-04',
    status: 'available',
    utilization_rate: 0.18,
    description: 'Ultra-high-resolution Schottky field emission scanning electron microscope. Magnification up to 2,000,000x with Oxford EDS detector for elemental mapping.',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 2,
    requires_deposit: true,
    deposit_amount: 1500.0,
    requires_supervision: true,
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
    location: 'Nanotechnology Building, Ground Floor',
    status: 'available',
    utilization_rate: 0.22,
    description: 'Certified ISO 7 cleanroom facility with wet-chemical bench, spin coater, UV mask aligner, and profilometer for MEMS and microfluidics research.',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
    max_booking_hours: 8,
    max_bookings_per_user_per_month: 3,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
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
    location: 'ECE Department, Microwave Engineering Lab',
    status: 'available',
    utilization_rate: 0.32,
    description: 'High-performance signal analyzer with real-time spectrum analysis up to 160 MHz bandwidth. Ideal for 5G, satellite, and radar testing.',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'],
    max_booking_hours: 4,
    max_bookings_per_user_per_month: 4,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
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
    location: 'Biotechnology Dept, Room 104',
    status: 'available',
    utilization_rate: 0.15,
    description: '100,000 RPM preparative ultracentrifuge generating over 802,000 x g. Essential for virus purification, nanoparticle fractionation, and organelle isolation.',
    images: ['https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800'],
    max_booking_hours: 5,
    max_bookings_per_user_per_month: 3,
    requires_deposit: true,
    deposit_amount: 1000.0,
    requires_supervision: false,
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
    location: 'Server Room 3, Computer Center',
    status: 'available',
    utilization_rate: 0.72,
    description: '8x NVIDIA H100 80GB SXM5 GPUs with 3.2Tbps InfiniBand networking. Reserved for deep learning training, LLM fine-tuning, and molecular dynamics.',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],
    max_booking_hours: 12,
    max_bookings_per_user_per_month: 2,
    requires_deposit: false,
    deposit_amount: 0.0,
    requires_supervision: false,
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
  { id: 'slot-1', start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 86400000 + 14400000).toISOString() },
  { id: 'slot-2', start_time: new Date(Date.now() + 86400000 + 18000000).toISOString(), end_time: new Date(Date.now() + 86400000 + 32400000).toISOString() },
  { id: 'slot-3', start_time: new Date(Date.now() + 172800000).toISOString(), end_time: new Date(Date.now() + 172800000 + 14400000).toISOString() }
];

export const MOCK_BOOKINGS = [
  {
    id: 'bkg-demo-1',
    resource_id: 'res-1',
    resource: MOCK_RESOURCES[0],
    status: 'in_custody',
    purpose: 'Fabricating microfluidic channel prototypes for masters dissertation project.',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() + 10800000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    borrower_name: 'Aarav Singh',
    borrower_institution: 'IIT Delhi',
    checkin_condition_rating: 'excellent',
    checkin_notes: 'Verified resin tank clean, zero debris.',
    discrepancy_detected: false,
    deposit_held: 500.0,
  },
  {
    id: 'bkg-demo-2',
    resource_id: 'res-2',
    resource: MOCK_RESOURCES[1],
    status: 'approved',
    purpose: 'Surface topography analysis of thin film sputtered titanium samples.',
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 100800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    borrower_name: 'Aarav Singh',
    borrower_institution: 'IIT Delhi',
    deposit_held: 1500.0,
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'aud-1',
    action: 'CUSTODY_CHECKIN_COMPLETED',
    entity_type: 'booking',
    entity_id: 'bkg-demo-1',
    actor_name: 'Aarav Singh',
    actor_role: 'borrower',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    details: { condition_rating: 'excellent', checklist_verified: true }
  },
  {
    id: 'aud-2',
    action: 'BOOKING_APPROVED_BY_FACULTY',
    entity_type: 'booking',
    entity_id: 'bkg-demo-2',
    actor_name: 'Dr. Priya Roy',
    actor_role: 'owner',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    details: { justification: 'Research alignment verified, credentials valid' }
  },
  {
    id: 'aud-3',
    action: 'AI_VERIFICATION_CERTIFICATE_VALIDATED',
    entity_type: 'credential',
    entity_id: 'cred-89',
    actor_name: 'EquipGrid AI Sentinel',
    actor_role: 'system',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    details: { cert_type: 'Laser Safety Level 1', confidence_score: 96 }
  }
];
