import { User, Vehicle, Booking, Message, Review, Notification, DuplicateSignal, AuditLog, Payout, KYCSubmission } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (310) 555-0182',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '1992-06-15',
    country: 'United States',
    role: 'owner',
    kycStatus: 'verified',
    isPhoneVerified: true,
    isEmailVerified: true,
    idHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    deviceFingerprint: 'dfp_ios_safari_a16_9934',
    riskScore: 4,
    joinedDate: '2023-04-12',
    rating: 4.95,
    totalTrips: 38,
    bio: 'Tech entrepreneur & car enthusiast in Santa Monica. I keep all my vehicles sanitized and fully charged/fueled!'
  },
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (786) 555-0144',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '1989-11-22',
    country: 'United Kingdom',
    role: 'owner',
    kycStatus: 'verified',
    isPhoneVerified: true,
    isEmailVerified: true,
    idHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    deviceFingerprint: 'dfp_pixel_chrome_p8_7721',
    riskScore: 2,
    joinedDate: '2022-09-08',
    rating: 4.98,
    totalTrips: 74,
    bio: 'London & Miami Superhost with 4 years experience. Airport handoffs and remote contactless lockbox pickup available 24/7.'
  },
  {
    id: 'usr_marcus',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    phone: '+1 (415) 555-0199',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '1996-03-30',
    country: 'Canada',
    role: 'renter',
    kycStatus: 'pending',
    isPhoneVerified: true,
    isEmailVerified: true,
    idHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    deviceFingerprint: 'dfp_mac_safari_2241',
    riskScore: 18,
    joinedDate: '2024-02-18',
    rating: 5.0,
    totalTrips: 0,
    bio: 'Product manager visiting from Toronto. Excited to try out peer-to-peer EV rentals.'
  },
  {
    id: 'usr_olumide',
    name: 'Olumide Adeyemi',
    email: 'olumide.adeyemi@example.com',
    phone: '+234 802 555 0192',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '1991-04-18',
    country: 'Nigeria',
    role: 'owner',
    kycStatus: 'verified',
    isPhoneVerified: true,
    isEmailVerified: true,
    idHash: '7a12b4898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542dd',
    deviceFingerprint: 'dfp_android_s23_4411',
    riskScore: 3,
    joinedDate: '2023-08-10',
    rating: 4.97,
    totalTrips: 42,
    bio: 'Tech entrepreneur & luxury SUV host. Seamless contactless check-ins.'
  },
  {
    id: 'usr_suspect',
    name: 'M. Alex River',
    email: 'alex.rivera.backup99@gmail.com',
    phone: '+1 (310) 555-0182', // Identical phone
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '1992-06-15', // Identical DoB
    country: 'United States',
    role: 'renter',
    kycStatus: 'needs_info',
    isPhoneVerified: false,
    isEmailVerified: true,
    idHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // Identical ID Hash
    deviceFingerprint: 'dfp_ios_safari_a16_9934', // Same device
    riskScore: 88,
    joinedDate: '2024-03-01',
    rating: 0,
    totalTrips: 0,
    bio: 'Looking to rent sports cars.'
  },
  {
    id: 'usr_admin',
    name: 'Sarah Connor',
    email: 'admin.moderation@velodrive.io',
    phone: '+1 (800) 555-0100',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '1985-08-14',
    country: 'Germany',
    role: 'admin',
    kycStatus: 'verified',
    isPhoneVerified: true,
    isEmailVerified: true,
    idHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    deviceFingerprint: 'dfp_admin_secure_001',
    riskScore: 0,
    joinedDate: '2022-01-01',
    rating: 5.0,
    totalTrips: 120,
    bio: 'Platform Trust & Safety Lead at VeloDrive.'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_taycan',
    ownerId: 'usr_alex',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerTripsCount: 38,
    isSuperhost: true,
    make: 'Porsche',
    model: 'Taycan 4S',
    year: 2024,
    category: 'Electric',
    transmission: 'Automatic',
    seats: 4,
    fuelType: 'Electric',
    dailyPrice: 185,
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '1420 Ocean Ave, Santa Monica',
      neighborhood: 'Santa Monica Beach',
      lat: 34.0125,
      lng: -118.495
    },
    photos: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Breathtaking 2024 Porsche Taycan 4S with Performance Battery Plus (290 mile range). Equipped with Burmester High-End 3D Surround Sound, Panoramic Glass Roof, and Sport Chrono Package. Instant contactless unlock available.',
    rules: [
      'No smoking or vaping ($250 cleaning fee)',
      'No track or drag strip usage (monitored via telematics)',
      'Return with at least 70% charge or prepay EV recharge',
      'Pets allowed only in crated carrier'
    ],
    features: ['Contactless Unlock', 'Apple CarPlay', 'Blind Spot Monitor', 'Heated Seats', 'Navigation', 'Bluetooth Audio', 'Fast DC Charging'],
    rating: 4.97,
    reviewsCount: 29,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDocs: {
      vin: 'WP0AB2Y15PSA98214',
      registrationNumber: 'CAL-8TRK992',
      insuranceProvider: 'Geico Commercial Fleet',
      insuranceExpiry: '2026-11-30',
      inspectionStatus: 'passed'
    },
    isInstantBook: true,
    tripCount: 31,
    availabilityBlocks: [
      { startDate: '2026-09-12', endDate: '2026-09-15', reason: 'Scheduled Maintenance' }
    ],
    minDays: 1,
    maxDays: 14,
    fuelLevel: '95% Battery',
    mileageLimitPerDay: 200
  },
  {
    id: 'veh_m4',
    ownerId: 'usr_elena',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    ownerRating: 4.98,
    ownerTripsCount: 74,
    isSuperhost: true,
    make: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    category: 'Sports',
    transmission: 'Automatic',
    seats: 4,
    fuelType: 'Gasoline',
    dailyPrice: 195,
    location: {
      city: 'Miami',
      state: 'FL',
      address: '1100 Biscayne Blvd, Downtown',
      neighborhood: 'Downtown Miami',
      lat: 25.7865,
      lng: -80.188
    },
    photos: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=900&auto=format&fit=crop&q=80'
    ],
    description: '503 horsepower TwinPower Turbo inline-6 beast in Isle of Man Green. Carbon bucket seats, Harman Kardon audio, M Head-Up Display, and laser headlights. Perfect for cruising South Beach or Biscayne.',
    rules: [
      'Premium 93 octane fuel only (receipt required upon checkout)',
      'Strictly no smoking or e-cigarettes',
      'Minimum renter age: 25 years old',
      'No out-of-state travel without prior written consent'
    ],
    features: ['M Sport Exhaust', 'Carbon Fiber Roof', 'Wireless Charging', 'Surround 360 Camera', 'Heated Steering Wheel', 'Keyless Entry'],
    rating: 4.99,
    reviewsCount: 42,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDocs: {
      vin: 'WBS43AY02PFP55420',
      registrationNumber: 'FL-M4SPD9',
      insuranceProvider: 'State Farm Premier',
      insuranceExpiry: '2027-01-15',
      inspectionStatus: 'passed'
    },
    isInstantBook: true,
    tripCount: 46,
    availabilityBlocks: [],
    minDays: 2,
    maxDays: 7,
    fuelLevel: 'Full Tank (93 Octane)',
    mileageLimitPerDay: 150
  },
  {
    id: 'veh_model_y',
    ownerId: 'usr_alex',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerTripsCount: 38,
    isSuperhost: true,
    make: 'Tesla',
    model: 'Model Y Long Range',
    year: 2024,
    category: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Electric',
    dailyPrice: 89,
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '2101 Wilshire Blvd',
      neighborhood: 'Santa Monica',
      lat: 34.032,
      lng: -118.479
    },
    photos: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'The ultimate California family and road-trip cruiser. All-Wheel Drive, 330-mile range, Supercharging access, premium audio, and full self-driving computer hardware included.',
    rules: [
      'Supercharging billed automatically at end of trip',
      'No smoking or vaping',
      'Toll charges invoiced at exact state cost'
    ],
    features: ['All-Wheel Drive', 'Glass Roof', 'Supercharger Access', 'Camp Mode', 'Autopilot', 'Heated Rear Seats'],
    rating: 4.92,
    reviewsCount: 19,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDocs: {
      vin: '7SAYGDEE9PF892110',
      registrationNumber: 'CAL-9TESLA1',
      insuranceProvider: 'Tesla Insurance Co.',
      insuranceExpiry: '2026-10-10',
      inspectionStatus: 'passed'
    },
    isInstantBook: true,
    tripCount: 22,
    availabilityBlocks: [],
    minDays: 1,
    maxDays: 30,
    fuelLevel: '90% Battery',
    mileageLimitPerDay: 250
  },
  {
    id: 'veh_range_rover',
    ownerId: 'usr_elena',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    ownerRating: 4.98,
    ownerTripsCount: 74,
    isSuperhost: true,
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2023,
    category: 'Luxury',
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Hybrid',
    dailyPrice: 210,
    location: {
      city: 'Miami',
      state: 'FL',
      address: '4401 Collins Ave, South Beach',
      neighborhood: 'Mid Beach',
      lat: 25.819,
      lng: -80.122
    },
    photos: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Dynamic SE Plug-In Hybrid in Santorini Black. Meridian 3D Surround, Massage front seats, air suspension for floating ride quality, and panoramic sun shade.',
    rules: [
      'No off-roading',
      'No smoking or pets',
      'Valet parking only at verified hotels'
    ],
    features: ['Air Suspension', 'Massage Seats', 'Wireless CarPlay', 'Heated & Cooled Seats', 'Soft Close Doors'],
    rating: 4.96,
    reviewsCount: 31,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDocs: {
      vin: 'SALWR2V44PA918231',
      registrationNumber: 'FL-RRV82',
      insuranceProvider: 'Chubb Prestige',
      insuranceExpiry: '2026-12-31',
      inspectionStatus: 'passed'
    },
    isInstantBook: false,
    tripCount: 35,
    availabilityBlocks: [],
    minDays: 2,
    maxDays: 10,
    fuelLevel: 'Full Tank',
    mileageLimitPerDay: 175
  },
  {
    id: 'veh_c8_corvette',
    ownerId: 'usr_alex',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerTripsCount: 38,
    isSuperhost: true,
    make: 'Chevrolet',
    model: 'Corvette Stingray C8',
    year: 2023,
    category: 'Sports',
    transmission: 'Automatic',
    seats: 2,
    fuelType: 'Gasoline',
    dailyPrice: 160,
    location: {
      city: 'San Francisco',
      state: 'CA',
      address: '750 Beach St, Fisherman Wharf',
      neighborhood: 'Marina District',
      lat: 37.807,
      lng: -122.417
    },
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Mid-engine American exotic in Torch Red with removable Targa hardtop. 495 horsepower 6.2L V8 soundtrack through performance dual-mode exhaust.',
    rules: [
      '91+ Premium fuel only',
      'Strictly 25+ age requirement',
      'No burnout / reckless driving telematics alarms'
    ],
    features: ['Removable Hardtop', 'Bose 14-Speaker Audio', 'Performance Data Recorder', 'Launch Control'],
    rating: 4.94,
    reviewsCount: 18,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDocs: {
      vin: '1G1YB2D41P5108842',
      registrationNumber: 'CAL-C8FAST',
      insuranceProvider: 'Hagerty Specialty',
      insuranceExpiry: '2026-08-15',
      inspectionStatus: 'passed'
    },
    isInstantBook: true,
    tripCount: 20,
    availabilityBlocks: [],
    minDays: 1,
    maxDays: 5,
    fuelLevel: 'Full Tank',
    mileageLimitPerDay: 150
  },
  {
    id: 'veh_bronco',
    ownerId: 'usr_elena',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    ownerRating: 4.98,
    ownerTripsCount: 74,
    isSuperhost: true,
    make: 'Ford',
    model: 'Bronco Badlands Sasquatch',
    year: 2024,
    category: 'SUV',
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Gasoline',
    dailyPrice: 125,
    location: {
      city: 'Austin',
      state: 'TX',
      address: '1600 S Congress Ave',
      neighborhood: 'South Congress',
      lat: 30.248,
      lng: -97.75
    },
    photos: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Adventure-ready 4x4 with 35-inch factory tires, Bilstein position-sensitive dampers, and removable roof panels for open-air cruising in the Hill Country.',
    rules: [
      'No rock-crawling damage',
      'Keep interior dry if rain forecasted while roof off',
      'Wash exterior if heavily muddy before return'
    ],
    features: ['4x4 Terrain Management', 'Apple CarPlay', 'Removable Doors/Roof', 'Tow Hitch', 'B&O Sound'],
    rating: 4.88,
    reviewsCount: 14,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDocs: {
      vin: '1FMEE5DP7PLA78229',
      registrationNumber: 'TX-BRNC4X4',
      insuranceProvider: 'Progressive Direct',
      insuranceExpiry: '2027-02-28',
      inspectionStatus: 'passed'
    },
    isInstantBook: true,
    tripCount: 16,
    availabilityBlocks: [],
    minDays: 2,
    maxDays: 14,
    fuelLevel: 'Full Tank',
    mileageLimitPerDay: 200
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk_active_901',
    vehicleId: 'veh_taycan',
    vehicle: {
      make: 'Porsche',
      model: 'Taycan 4S',
      year: 2024,
      photo: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=900&auto=format&fit=crop&q=80',
      dailyPrice: 185,
      locationCity: 'Los Angeles, CA',
      category: 'Electric'
    },
    renterId: 'usr_alex',
    renterName: 'Alex Rivera',
    renterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    renterPhone: '+1 (310) 555-0182',
    ownerId: 'usr_elena',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    startDate: '2026-09-04',
    endDate: '2026-09-07',
    pickupTime: '10:00 AM',
    returnTime: '06:00 PM',
    totalDays: 3,
    rentalSubtotal: 555,
    platformFee: 66.6,
    taxes: 47.18,
    securityDeposit: 250,
    protectionPlan: 'standard',
    protectionFee: 54,
    totalAmount: 972.78,
    status: 'active',
    paymentMethod: 'Apple Pay',
    paymentLast4: '4242',
    paymentStatus: 'paid',
    unlockCode: '8492-TA',
    createdAt: '2026-09-02T14:22:00Z'
  },
  {
    id: 'bk_conf_902',
    vehicleId: 'veh_m4',
    vehicle: {
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      photo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=80',
      dailyPrice: 195,
      locationCity: 'Miami, FL',
      category: 'Sports'
    },
    renterId: 'usr_alex',
    renterName: 'Alex Rivera',
    renterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    renterPhone: '+1 (310) 555-0182',
    ownerId: 'usr_elena',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    startDate: '2026-09-18',
    endDate: '2026-09-21',
    pickupTime: '01:00 PM',
    returnTime: '01:00 PM',
    totalDays: 3,
    rentalSubtotal: 585,
    platformFee: 70.2,
    taxes: 49.73,
    securityDeposit: 250,
    protectionPlan: 'premium',
    protectionFee: 87,
    totalAmount: 1041.93,
    status: 'confirmed',
    paymentMethod: 'Visa',
    paymentLast4: '8819',
    paymentStatus: 'paid',
    unlockCode: '9102-BM',
    createdAt: '2026-09-03T09:15:00Z'
  },
  {
    id: 'bk_comp_903',
    vehicleId: 'veh_model_y',
    vehicle: {
      make: 'Tesla',
      model: 'Model Y Long Range',
      year: 2024,
      photo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&auto=format&fit=crop&q=80',
      dailyPrice: 89,
      locationCity: 'Los Angeles, CA',
      category: 'Electric'
    },
    renterId: 'usr_marcus',
    renterName: 'Marcus Chen',
    renterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    renterPhone: '+1 (415) 555-0199',
    ownerId: 'usr_alex',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    startDate: '2026-08-20',
    endDate: '2026-08-24',
    pickupTime: '09:00 AM',
    returnTime: '11:00 AM',
    totalDays: 4,
    rentalSubtotal: 356,
    platformFee: 42.72,
    taxes: 30.26,
    securityDeposit: 250,
    protectionPlan: 'standard',
    protectionFee: 72,
    totalAmount: 750.98,
    status: 'completed',
    paymentMethod: 'Google Pay',
    paymentLast4: '1092',
    paymentStatus: 'paid',
    createdAt: '2026-08-15T18:00:00Z'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_01',
    bookingId: 'bk_active_901',
    senderId: 'usr_elena',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    receiverId: 'usr_alex',
    text: 'Hi Alex! The Taycan is parked in stall #14 at the Ocean Ave Garage. Keycard is inside the lockbox on the driver-side window.',
    timestamp: '2026-09-04T09:40:00Z'
  },
  {
    id: 'msg_02',
    bookingId: 'bk_active_901',
    senderId: 'usr_alex',
    senderName: 'Alex Rivera',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    receiverId: 'usr_elena',
    text: 'Awesome! Got the lockbox open with code 8492-TA. Car is in pristine condition. Heading out now.',
    timestamp: '2026-09-04T09:55:00Z'
  },
  {
    id: 'msg_03',
    bookingId: 'bk_active_901',
    senderId: 'usr_elena',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    receiverId: 'usr_alex',
    text: 'Great to hear! Feel free to ping me anytime if you have questions about the charging stations along Highway 1.',
    timestamp: '2026-09-04T09:58:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_01',
    bookingId: 'bk_comp_903',
    vehicleId: 'veh_model_y',
    reviewerId: 'usr_marcus',
    reviewerName: 'Marcus Chen',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    targetType: 'vehicle',
    rating: 5,
    comment: 'Alex was an incredible host! Car was spotless, at 95% charge, and seamless contactless pickup. Will definitely rent again whenever I am in California.',
    date: '2026-08-25',
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      performance: 5
    }
  },
  {
    id: 'rev_02',
    bookingId: 'bk_comp_903',
    vehicleId: 'veh_model_y',
    reviewerId: 'usr_alex',
    reviewerName: 'Alex Rivera',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    targetType: 'renter',
    rating: 5,
    comment: 'Marcus took great care of my Model Y. Returned on time with full charge and immaculate interior. 10/10 guest!',
    date: '2026-08-25',
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      performance: 5
    }
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    userId: 'usr_alex',
    title: 'Trip in Progress',
    body: 'Your Porsche Taycan trip with Elena is active! Return scheduled for Sept 7, 06:00 PM.',
    type: 'booking',
    read: false,
    timestamp: '2026-09-04T10:00:00Z',
    actionType: 'view_booking',
    actionId: 'bk_active_901'
  },
  {
    id: 'notif_02',
    userId: 'usr_alex',
    title: 'Booking Confirmed',
    body: 'Your upcoming rental for BMW M4 Competition has been confirmed by host Elena.',
    type: 'payment',
    read: true,
    timestamp: '2026-09-03T09:16:00Z',
    actionType: 'view_booking',
    actionId: 'bk_conf_902'
  },
  {
    id: 'notif_03',
    userId: 'usr_alex',
    title: 'Payout Dispatched',
    body: '$284.80 payout for Model Y rental has been processed to your linked Chase account.',
    type: 'payment',
    read: true,
    timestamp: '2026-08-26T12:00:00Z'
  },
  {
    id: 'notif_04',
    userId: 'usr_marcus',
    title: 'KYC Action Required',
    body: 'Please complete driver verification to unlock instant vehicle reservations.',
    type: 'kyc',
    read: false,
    timestamp: '2026-09-04T08:00:00Z',
    actionType: 'view_kyc'
  }
];

export const INITIAL_DUPLICATES: DuplicateSignal[] = [
  {
    id: 'dup_sig_01',
    sourceUserId: 'usr_suspect',
    sourceUserName: 'M. Alex River',
    matchedUserId: 'usr_alex',
    matchedUserName: 'Alex Rivera',
    matchFields: ['phone', 'id_hash', 'dob', 'device_fp'],
    similarityScore: 94,
    status: 'flagged',
    detectedAt: '2026-09-04T02:12:00Z',
    notes: 'Same phone number +1(310)555-0182, identical date of birth (1992-06-15), matching driver license biometric hash. Flagged automatically by One-Person=One-Account engine.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_01',
    adminId: 'usr_admin',
    adminName: 'Sarah Connor',
    action: 'VEHICLE_VERIFIED',
    targetType: 'vehicle',
    targetId: 'veh_taycan',
    details: 'VIN WP0AB2Y15PSA98214 passed state registration and valid commercial insurance verified.',
    timestamp: '2026-08-01T15:30:00Z'
  },
  {
    id: 'aud_02',
    adminId: 'usr_admin',
    adminName: 'Sarah Connor',
    action: 'KYC_APPROVED',
    targetType: 'kyc',
    targetId: 'usr_elena',
    details: 'Identity confirmed via US Passport and biometric facial match (confidence 99.4%).',
    timestamp: '2026-08-10T11:20:00Z'
  },
  {
    id: 'aud_03',
    adminId: 'usr_admin',
    adminName: 'Sarah Connor',
    action: 'DUPLICATE_FLAG_LOGGED',
    targetType: 'user',
    targetId: 'usr_suspect',
    details: 'System flagged possible duplicate identity matching usr_alex with 94% confidence score.',
    timestamp: '2026-09-04T02:12:05Z'
  }
];

export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay_01',
    ownerId: 'usr_alex',
    amount: 284.80,
    status: 'completed',
    payoutDate: '2026-08-26',
    bankAccountMask: 'Chase Bank (...4920)',
    bookingId: 'bk_comp_903',
    vehicleInfo: 'Tesla Model Y Long Range'
  },
  {
    id: 'pay_02',
    ownerId: 'usr_elena',
    amount: 494.00,
    status: 'processing',
    payoutDate: '2026-09-08',
    bankAccountMask: 'Bank of America (...7712)',
    bookingId: 'bk_active_901',
    vehicleInfo: 'Porsche Taycan 4S'
  }
];

export const INITIAL_KYC_SUBMISSIONS: KYCSubmission[] = [
  {
    id: 'kyc_sub_01',
    userId: 'usr_marcus',
    userName: 'Marcus Chen',
    userEmail: 'marcus.chen@example.com',
    documentType: 'drivers_license',
    documentNumberMasked: 'D••••••••821',
    documentHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    frontPhotoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    backPhotoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    submittedAt: '2026-09-04T07:45:00Z',
    status: 'pending'
  }
];
