export type UserRole = 'renter' | 'owner' | 'admin';
export type KYCStatus = 'pending' | 'verified' | 'rejected' | 'needs_info' | 'unsubmitted';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  country: string;
  role: UserRole;
  kycStatus: KYCStatus;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  idHash?: string; // SHA-256 fingerprint of government ID
  deviceFingerprint?: string;
  riskScore: number; // 0 - 100
  joinedDate: string;
  rating: number;
  totalTrips: number;
  bio?: string;
}

export interface KYCSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  documentType: 'drivers_license' | 'passport' | 'national_id';
  documentNumberMasked: string;
  documentHash: string;
  frontPhotoUrl: string;
  backPhotoUrl?: string;
  selfieUrl: string;
  submittedAt: string;
  reviewedAt?: string;
  status: KYCStatus;
  rejectionReason?: string;
}

export interface DuplicateSignal {
  id: string;
  sourceUserId: string;
  sourceUserName: string;
  matchedUserId: string;
  matchedUserName: string;
  matchFields: ('phone' | 'email' | 'id_hash' | 'dob' | 'device_fp')[];
  similarityScore: number; // 0 - 100%
  status: 'flagged' | 'cleared' | 'confirmed_duplicate';
  detectedAt: string;
  notes: string;
}

export type VehicleCategory = 'SUV' | 'Sedan' | 'Electric' | 'Sports' | 'Luxury' | 'Van' | 'Compact';
export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Electric' | 'Hybrid' | 'Gasoline' | 'Diesel';

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerTripsCount: number;
  isSuperhost?: boolean;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: TransmissionType;
  seats: number;
  fuelType: FuelType;
  dailyPrice: number;
  location: {
    city: string;
    state: string;
    address: string;
    neighborhood: string;
    lat: number;
    lng: number;
  };
  photos: string[];
  description: string;
  rules: string[];
  features: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verificationDocs: {
    vin: string;
    registrationNumber: string;
    insuranceProvider: string;
    insuranceExpiry: string;
    inspectionStatus: 'passed' | 'pending' | 'failed';
  };
  isInstantBook: boolean;
  tripCount: number;
  availabilityBlocks: {
    startDate: string;
    endDate: string;
    reason?: string;
  }[];
  minDays: number;
  maxDays: number;
  fuelLevel?: string;
  mileageLimitPerDay?: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'disputed';

export interface Booking {
  id: string;
  vehicleId: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    photo: string;
    dailyPrice: number;
    locationCity: string;
    category: VehicleCategory;
  };
  renterId: string;
  renterName: string;
  renterAvatar: string;
  renterPhone: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  totalDays: number;
  rentalSubtotal: number;
  platformFee: number;
  taxes: number;
  securityDeposit: number;
  totalAmount: number;
  protectionPlan: 'standard' | 'premium' | 'minimum';
  protectionFee: number;
  status: BookingStatus;
  paymentMethod: string;
  paymentLast4: string;
  paymentStatus: 'paid' | 'refunded' | 'escrow_hold';
  unlockCode?: string;
  cancellationReason?: string;
  disputeDetails?: {
    openedBy: string;
    reason: string;
    requestedAmount?: number;
    status: 'open' | 'resolved_renter' | 'resolved_host';
    adminNotes?: string;
  };
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isAutomated?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  vehicleId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  targetType: 'vehicle' | 'renter' | 'host';
  rating: number;
  comment: string;
  date: string;
  categories: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    performance: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'kyc' | 'message' | 'payment' | 'security' | 'review';
  read: boolean;
  timestamp: string;
  actionType?: 'view_booking' | 'view_kyc' | 'view_chat' | 'view_dispute';
  actionId?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'user' | 'vehicle' | 'booking' | 'kyc' | 'dispute';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface Payout {
  id: string;
  ownerId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  payoutDate: string;
  bankAccountMask: string;
  bookingId: string;
  vehicleInfo: string;
}
