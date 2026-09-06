import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Vehicle,
  Booking,
  Message,
  Review,
  Notification,
  DuplicateSignal,
  AuditLog,
  Payout,
  KYCSubmission,
  UserRole,
  BookingStatus,
  KYCStatus
} from '../types';
import {
  CountryCurrencyConfig,
  getCurrencyForCountry,
  formatCurrency as formatCurrencyUtil,
  formatDailyRate as formatDailyRateUtil,
  convertUSD
} from '../utils/currency';
import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DUPLICATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_PAYOUTS,
  INITIAL_KYC_SUBMISSIONS
} from '../data/initialData';

export type DeviceFrameType = 'iphone' | 'pixel' | 'fluid';
export type NetworkStatusType = 'online' | 'slow-3g' | 'offline';

interface ToastState {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  desc?: string;
}

interface AppContextType {
  // User & Mode
  currentUser: User;
  allUsers: User[];
  activeMode: 'renter' | 'owner';
  setActiveMode: (mode: 'renter' | 'owner') => void;
  switchUser: (userId: string) => void;
  registerUser: (formData: Partial<User>) => Promise<boolean>;
  signUpWithGoogle: (options?: { email?: string; name?: string; country?: string; role?: 'renter' | 'owner' }) => Promise<User>;
  signUpWithEmail: (data: { name: string; email: string; password?: string; country?: string; role?: 'renter' | 'owner' }) => Promise<User>;
  signInWithEmail: (email: string) => Promise<boolean>;

  // Country & Currency
  currentCountry: string;
  setCountry: (country: string) => void;
  currency: CountryCurrencyConfig;
  formatCurrency: (amountInUSD: number, options?: { showCode?: boolean; decimals?: number; forceDecimals?: boolean }) => string;
  formatDailyRate: (dailyPriceUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;

  // Selections
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  selectedBooking: Booking | null;
  setSelectedBooking: (b: Booking | null) => void;
  activeChatBooking: Booking | null;
  setActiveChatBooking: (b: Booking | null) => void;

  // Entities
  vehicles: Vehicle[];
  bookings: Booking[];
  messages: Message[];
  reviews: Review[];
  notifications: Notification[];
  duplicateSignals: DuplicateSignal[];
  auditLogs: AuditLog[];
  payouts: Payout[];
  kycSubmissions: KYCSubmission[];
  savedVehicleIds: string[];

  // Device & Network Simulators
  deviceFrame: DeviceFrameType;
  setDeviceFrame: (frame: DeviceFrameType) => void;
  networkStatus: NetworkStatusType;
  setNetworkStatus: (status: NetworkStatusType) => void;
  toast: ToastState | null;
  showToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  clearToast: () => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'success' | 'warning') => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  filterDates: { start: string; end: string };
  setFilterDates: (dates: { start: string; end: string }) => void;

  // Actions
  submitKYC: (data: { docType: 'drivers_license' | 'passport' | 'national_id'; docNumber: string; frontPhoto: string; backPhoto?: string; selfie: string }) => Promise<void>;
  approveKYC: (submissionId: string, userId: string) => void;
  rejectKYC: (submissionId: string, userId: string, reason: string) => void;
  createVehicle: (vehicleData: Partial<Vehicle>) => Promise<void>;
  approveVehicle: (vehicleId: string) => void;
  rejectVehicle: (vehicleId: string, reason: string) => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string, reason: string) => void;
  openDispute: (bookingId: string, reason: string, requestedAmount?: number) => void;
  resolveDispute: (bookingId: string, resolution: 'resolved_renter' | 'resolved_host', notes: string) => void;
  sendMessage: (bookingId: string, text: string) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
  toggleSavedVehicle: (vehicleId: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  requestPayout: (amount: number) => void;
  clearDuplicateSignal: (signalId: string) => void;
  confirmDuplicateAccount: (signalId: string, suspendTarget: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage caching if available
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vd_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return allUsers[0];
  });

  const [currentCountry, setCurrentCountryState] = useState<string>(() => {
    const saved = localStorage.getItem('vd_country');
    return saved || allUsers[0]?.country || 'United States';
  });

  const currency = getCurrencyForCountry(currentCountry);

  const setCountry = (country: string) => {
    setCurrentCountryState(country);
    localStorage.setItem('vd_country', country);
    setCurrentUser(prev => ({ ...prev, country }));
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, country } : u));
    const cfg = getCurrencyForCountry(country);
    showToast(`Currency: ${cfg.code} (${cfg.symbol})`, `Active country set to ${cfg.flag} ${cfg.country}`, 'success');
  };

  const formatCurrency = (amountInUSD: number, options?: { showCode?: boolean; decimals?: number; forceDecimals?: boolean }) => {
    return formatCurrencyUtil(amountInUSD, currentCountry, options);
  };

  const formatDailyRate = (dailyPriceUSD: number) => {
    return formatDailyRateUtil(dailyPriceUSD, currentCountry);
  };

  const convertPrice = (amountInUSD: number) => {
    return convertUSD(amountInUSD, currentCountry);
  };

  const [activeMode, setActiveModeState] = useState<'renter' | 'owner'>('renter');
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeChatBooking, setActiveChatBooking] = useState<Booking | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('vd_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('vd_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('vd_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('vd_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('vd_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [duplicateSignals, setDuplicateSignals] = useState<DuplicateSignal[]>(() => {
    const saved = localStorage.getItem('vd_duplicates');
    return saved ? JSON.parse(saved) : INITIAL_DUPLICATES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('vd_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [payouts, setPayouts] = useState<Payout[]>(() => {
    const saved = localStorage.getItem('vd_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [kycSubmissions, setKycSubmissions] = useState<KYCSubmission[]>(() => {
    const saved = localStorage.getItem('vd_kyc_subs');
    return saved ? JSON.parse(saved) : INITIAL_KYC_SUBMISSIONS;
  });

  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>(['veh_taycan', 'veh_m4']);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameType>('iphone');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatusType>('online');
  const [toast, setToast] = useState<ToastState | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState<string>('Los Angeles, CA');
  const [filterDates, setFilterDates] = useState<{ start: string; end: string }>({
    start: '2026-09-10',
    end: '2026-09-13'
  });

  // Persist key collections
  useEffect(() => {
    try {
      localStorage.setItem('vd_users', JSON.stringify(allUsers));
      localStorage.setItem('vd_vehicles', JSON.stringify(vehicles));
      localStorage.setItem('vd_bookings', JSON.stringify(bookings));
      localStorage.setItem('vd_messages', JSON.stringify(messages));
      localStorage.setItem('vd_reviews', JSON.stringify(reviews));
      localStorage.setItem('vd_notifications', JSON.stringify(notifications));
      localStorage.setItem('vd_duplicates', JSON.stringify(duplicateSignals));
      localStorage.setItem('vd_audit_logs', JSON.stringify(auditLogs));
      localStorage.setItem('vd_payouts', JSON.stringify(payouts));
      localStorage.setItem('vd_kyc_subs', JSON.stringify(kycSubmissions));
    } catch {
      // ignore storage quota issues
    }
  }, [allUsers, vehicles, bookings, messages, reviews, notifications, duplicateSignals, auditLogs, payouts, kycSubmissions]);

  // Haptic feedback function using Web Vibration API where supported
  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' = 'light') => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate(25);
      else if (type === 'success') navigator.vibrate([15, 30, 20]);
      else if (type === 'warning') navigator.vibrate([50, 40, 50]);
    }
  };

  const showToast = (title: string, desc?: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, title, desc, type });
    triggerHaptic(type === 'error' ? 'warning' : 'light');
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const clearToast = () => setToast(null);

  const setActiveMode = (mode: 'renter' | 'owner') => {
    setActiveModeState(mode);
    setActiveTab(mode === 'renter' ? 'explore' : 'dashboard');
    triggerHaptic('medium');
    showToast(`Switched to ${mode === 'renter' ? 'Renter' : 'Host / Car Owner'} Mode`, undefined, 'info');
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.country) {
        setCurrentCountryState(user.country);
        localStorage.setItem('vd_country', user.country);
      }
      if (user.role === 'admin') {
        setActiveModal('admin');
      } else if (user.role === 'owner') {
        setActiveModeState('owner');
        setActiveTab('dashboard');
      } else {
        setActiveModeState('renter');
        setActiveTab('explore');
      }
      const userCurr = getCurrencyForCountry(user.country || 'United States');
      showToast(`Logged in as ${user.name}`, `${userCurr.flag} ${user.country} • Currency: ${userCurr.code} (${userCurr.symbol})`, 'info');
    }
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    triggerHaptic('light');
  };

  const closeModal = () => {
    setActiveModal(null);
    triggerHaptic('light');
  };

  // Anti-fraud duplicate detector (One Person = One Account)
  const checkForDuplicates = (candidate: { email: string; phone: string; idHash?: string; dob: string; deviceFp: string; name: string }): DuplicateSignal[] => {
    const signals: DuplicateSignal[] = [];
    const normalizedPhone = candidate.phone.replace(/\D/g, '');

    allUsers.forEach(existing => {
      if (existing.email.toLowerCase() === candidate.email.toLowerCase()) return; // Same email handled by auth unique constraint
      
      const matchedFields: ('phone' | 'email' | 'id_hash' | 'dob' | 'device_fp')[] = [];
      const existingPhoneNorm = existing.phone.replace(/\D/g, '');

      if (normalizedPhone && existingPhoneNorm && normalizedPhone === existingPhoneNorm) {
        matchedFields.push('phone');
      }
      if (candidate.idHash && existing.idHash && candidate.idHash === existing.idHash) {
        matchedFields.push('id_hash');
      }
      if (candidate.dob && existing.dateOfBirth === candidate.dob) {
        matchedFields.push('dob');
      }
      if (candidate.deviceFp && existing.deviceFingerprint === candidate.deviceFp) {
        matchedFields.push('device_fp');
      }

      if (matchedFields.length >= 2 || matchedFields.includes('id_hash')) {
        let score = 50;
        if (matchedFields.includes('id_hash')) score += 35;
        if (matchedFields.includes('phone')) score += 20;
        if (matchedFields.includes('dob')) score += 15;
        if (matchedFields.includes('device_fp')) score += 10;
        score = Math.min(score, 99);

        signals.push({
          id: `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sourceUserId: 'temp_new_user',
          sourceUserName: candidate.name,
          matchedUserId: existing.id,
          matchedUserName: existing.name,
          matchFields: matchedFields,
          similarityScore: score,
          status: 'flagged',
          detectedAt: new Date().toISOString(),
          notes: `Potential duplicate identity flagged on ${matchedFields.join(', ')}. Pending human moderation review.`
        });
      }
    });

    return signals;
  };

  const registerUser = async (formData: Partial<User>): Promise<boolean> => {
    const rawIdHash = formData.idHash || `id_hash_${Math.random().toString(36).substring(2, 10)}`;
    const candidateDeviceFp = `dfp_${navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;

    // Run duplicate identity screening
    const duplicates = checkForDuplicates({
      email: formData.email || '',
      phone: formData.phone || '',
      idHash: rawIdHash,
      dob: formData.dateOfBirth || '',
      deviceFp: candidateDeviceFp,
      name: formData.name || 'New Member'
    });

    const isFlagged = duplicates.length > 0;
    const newUserId = `usr_${Date.now().toString(36)}`;

    const newUser: User = {
      id: newUserId,
      name: formData.name || 'New User',
      email: formData.email || '',
      phone: formData.phone || '',
      avatar: formData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      dateOfBirth: formData.dateOfBirth || '2000-01-01',
      country: formData.country || 'United States',
      role: 'renter',
      kycStatus: 'unsubmitted',
      isPhoneVerified: true,
      isEmailVerified: true,
      idHash: rawIdHash,
      deviceFingerprint: candidateDeviceFp,
      riskScore: isFlagged ? 75 : 8,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      totalTrips: 0,
      bio: formData.bio || 'New VeloDrive community member'
    };

    if (isFlagged) {
      const updatedSignals = duplicates.map(sig => ({
        ...sig,
        sourceUserId: newUserId
      }));
      setDuplicateSignals(prev => [...updatedSignals, ...prev]);

      // Add audit log
      const newAudit: AuditLog = {
        id: `aud_${Date.now()}`,
        adminId: 'sys_fraud_engine',
        adminName: 'One-Person=One-Account System',
        action: 'DUPLICATE_SUSPICION_FLAGGED',
        targetType: 'user',
        targetId: newUserId,
        details: `Account registration flagged with similarity score ${duplicates[0].similarityScore}%. Flagged for admin review.`,
        timestamp: new Date().toISOString()
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast('Account Created!', isFlagged ? 'Account flagged for identity review due to matching attributes.' : 'Welcome to VeloDrive. Complete KYC to begin booking.', isFlagged ? 'error' : 'success');
    return true;
  };

  const signUpWithGoogle = async (options?: { email?: string; name?: string; country?: string; role?: 'renter' | 'owner' }): Promise<User> => {
    const email = options?.email || 'laoluoyelude@gmail.com';
    const name = options?.name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Google Driver';
    const country = options?.country || currentCountry || 'United States';
    const role = options?.role || activeMode || 'renter';

    // Check if an existing account matches this email
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      if (existing.country) {
        setCountry(existing.country);
      }
      setActiveMode(existing.role === 'owner' ? 'owner' : 'renter');
      localStorage.setItem('vd_signed_up', 'true');
      showToast(`Welcome back, ${existing.name}!`, `Signed in with Google (${email})`, 'success');
      return existing;
    }

    const newUserId = `usr_g_${Date.now().toString(36)}`;
    const googleUser: User = {
      id: newUserId,
      name,
      email,
      phone: '+1 (555) 234-5678',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      dateOfBirth: '1996-05-14',
      country,
      role,
      kycStatus: 'unsubmitted',
      isPhoneVerified: true,
      isEmailVerified: true,
      riskScore: 5,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      totalTrips: 0,
      bio: `Verified Google member • ${country}`
    };

    setAllUsers(prev => [googleUser, ...prev]);
    setCurrentUser(googleUser);
    setCountry(country);
    setActiveMode(role);
    localStorage.setItem('vd_signed_up', 'true');
    showToast(`Account Created!`, `Welcome to VeloDrive, ${name}! Signed in via Google.`, 'success');
    return googleUser;
  };

  const signUpWithEmail = async (data: { name: string; email: string; password?: string; country?: string; role?: 'renter' | 'owner' }): Promise<User> => {
    const existing = allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      if (existing.country) {
        setCountry(existing.country);
      }
      setActiveMode(existing.role === 'owner' ? 'owner' : 'renter');
      localStorage.setItem('vd_signed_up', 'true');
      showToast(`Welcome back, ${existing.name}!`, `Signed in with ${data.email}`, 'success');
      return existing;
    }

    const country = data.country || currentCountry || 'United States';
    const role = data.role || 'renter';
    const newUserId = `usr_e_${Date.now().toString(36)}`;
    const newUser: User = {
      id: newUserId,
      name: data.name,
      email: data.email,
      phone: '+1 (555) 987-6543',
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80`,
      dateOfBirth: '1998-03-21',
      country,
      role,
      kycStatus: 'unsubmitted',
      isPhoneVerified: false,
      isEmailVerified: true,
      riskScore: 10,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      totalTrips: 0,
      bio: `New VeloDrive community driver • ${country}`
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCountry(country);
    setActiveMode(role);
    localStorage.setItem('vd_signed_up', 'true');
    showToast(`Welcome, ${data.name}!`, `Your account has been created. Next step: complete KYC to start booking cars.`, 'success');
    return newUser;
  };

  const signInWithEmail = async (email: string): Promise<boolean> => {
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      if (existing.country) {
        setCountry(existing.country);
      }
      setActiveMode(existing.role === 'owner' ? 'owner' : 'renter');
      localStorage.setItem('vd_signed_up', 'true');
      showToast(`Welcome back, ${existing.name}!`, 'Signed in successfully.', 'success');
      return true;
    }
    showToast('User Not Found', `No account found with ${email}. Please create one.`, 'warning');
    return false;
  };

  const submitKYC = async (data: { docType: 'drivers_license' | 'passport' | 'national_id'; docNumber: string; frontPhoto: string; backPhoto?: string; selfie: string }) => {
    // Generate secure hash (simulate SHA-256 for duplicate check)
    const docHash = `hash_${data.docType}_${data.docNumber.replace(/\s+/g, '').toUpperCase()}`;
    const masked = `${data.docNumber.slice(0, 2)}••••••••${data.docNumber.slice(-3)}`;

    const newSubmission: KYCSubmission = {
      id: `kyc_sub_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      documentType: data.docType,
      documentNumberMasked: masked,
      documentHash: docHash,
      frontPhotoUrl: data.frontPhoto,
      backPhotoUrl: data.backPhoto,
      selfieUrl: data.selfie,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setKycSubmissions(prev => [newSubmission, ...prev]);

    // Update user KYC status
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, kycStatus: 'pending', idHash: docHash } : u));
    setCurrentUser(prev => ({ ...prev, kycStatus: 'pending', idHash: docHash }));

    // Send notification
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'KYC Documents Received',
      body: 'Your identity verification documents are under review. Expected response within 15 minutes.',
      type: 'kyc',
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('KYC Submitted!', 'Documents uploaded securely. Verification is processing.', 'success');
  };

  const approveKYC = (submissionId: string, userId: string) => {
    setKycSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'verified', reviewedAt: new Date().toISOString() } : s));
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: 'verified', riskScore: Math.max(0, u.riskScore - 30) } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, kycStatus: 'verified', riskScore: Math.max(0, prev.riskScore - 30) }));
    }

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: 'usr_admin',
      adminName: 'Sarah Connor',
      action: 'KYC_APPROVED',
      targetType: 'kyc',
      targetId: userId,
      details: 'Identity and driver license passed visual, format, and biometric facial check.',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Notification to user
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title: 'Identity Verified 🎉',
      body: 'Your driver profile is approved! You can now book cars and list vehicles on VeloDrive.',
      type: 'kyc',
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('KYC Approved', `User ${userId} is now verified.`, 'success');
  };

  const rejectKYC = (submissionId: string, userId: string, reason: string) => {
    setKycSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'rejected', rejectionReason: reason, reviewedAt: new Date().toISOString() } : s));
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: 'rejected' } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, kycStatus: 'rejected' }));
    }

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: 'usr_admin',
      adminName: 'Sarah Connor',
      action: 'KYC_REJECTED',
      targetType: 'kyc',
      targetId: userId,
      details: `KYC submission rejected. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title: 'Verification Update Needed',
      body: `Your identity document could not be verified: ${reason}. Please resubmit with clear photos.`,
      type: 'kyc',
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('KYC Rejected', reason, 'error');
  };

  const createVehicle = async (vehicleData: Partial<Vehicle>) => {
    const newVeh: Vehicle = {
      id: `veh_${Date.now().toString(36)}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerRating: currentUser.rating || 5.0,
      ownerTripsCount: currentUser.totalTrips || 0,
      isSuperhost: (currentUser.totalTrips || 0) > 20,
      make: vehicleData.make || 'Custom',
      model: vehicleData.model || 'Model',
      year: vehicleData.year || 2024,
      category: vehicleData.category || 'Sedan',
      transmission: vehicleData.transmission || 'Automatic',
      seats: vehicleData.seats || 5,
      fuelType: vehicleData.fuelType || 'Gasoline',
      dailyPrice: vehicleData.dailyPrice || 100,
      location: vehicleData.location || {
        city: 'Los Angeles',
        state: 'CA',
        address: '100 Main St',
        neighborhood: 'Downtown',
        lat: 34.0522,
        lng: -118.2437
      },
      photos: vehicleData.photos?.length ? vehicleData.photos : [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
      ],
      description: vehicleData.description || 'Clean, well-maintained vehicle ready for rent.',
      rules: vehicleData.rules?.length ? vehicleData.rules : ['No smoking', 'Return clean with same fuel level'],
      features: vehicleData.features || ['Bluetooth', 'Backup Camera', 'Apple CarPlay'],
      rating: 5.0,
      reviewsCount: 0,
      isVerified: false,
      verificationStatus: 'pending',
      verificationDocs: vehicleData.verificationDocs || {
        vin: '1HGCR2F83HA019284',
        registrationNumber: 'REG-PENDING-99',
        insuranceProvider: 'Commercial P2P Shield',
        insuranceExpiry: '2026-12-31',
        inspectionStatus: 'pending'
      },
      isInstantBook: vehicleData.isInstantBook ?? true,
      tripCount: 0,
      availabilityBlocks: [],
      minDays: vehicleData.minDays || 1,
      maxDays: vehicleData.maxDays || 14,
      fuelLevel: 'Full Tank',
      mileageLimitPerDay: 200
    };

    setVehicles(prev => [newVeh, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'VEHICLE_LISTED',
      targetType: 'vehicle',
      targetId: newVeh.id,
      details: `New vehicle listed: ${newVeh.year} ${newVeh.make} ${newVeh.model}. In queue for verification.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast('Vehicle Listed!', 'Submitted for quick inspection & compliance review.', 'success');
  };

  const approveVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, isVerified: true, verificationStatus: 'verified' } : v));
    const veh = vehicles.find(v => v.id === vehicleId);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: 'usr_admin',
      adminName: 'Sarah Connor',
      action: 'VEHICLE_APPROVED',
      targetType: 'vehicle',
      targetId: vehicleId,
      details: `Vehicle ${veh?.make} ${veh?.model} approved for public marketplace bookings.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    if (veh) {
      const notif: Notification = {
        id: `notif_${Date.now()}`,
        userId: veh.ownerId,
        title: 'Vehicle Approved for Rentals! 🚗',
        body: `Your ${veh.year} ${veh.make} ${veh.model} has been verified and is live for bookings.`,
        type: 'booking',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }

    showToast('Vehicle Approved', 'Vehicle is now live on marketplace.', 'success');
  };

  const rejectVehicle = (vehicleId: string, reason: string) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, isVerified: false, verificationStatus: 'rejected' } : v));
    const veh = vehicles.find(v => v.id === vehicleId);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: 'usr_admin',
      adminName: 'Sarah Connor',
      action: 'VEHICLE_REJECTED',
      targetType: 'vehicle',
      targetId: vehicleId,
      details: `Vehicle ${veh?.make} ${veh?.model} rejected. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast('Vehicle Rejected', reason, 'error');
  };

  // Double booking prevention check
  const isVehicleAvailable = (vehicleId: string, start: string, end: string): boolean => {
    const existingActiveBookings = bookings.filter(b => 
      b.vehicleId === vehicleId && 
      (b.status === 'confirmed' || b.status === 'active' || b.status === 'pending')
    );

    const requestedStart = new Date(start).getTime();
    const requestedEnd = new Date(end).getTime();

    for (const bk of existingActiveBookings) {
      const bkStart = new Date(bk.startDate).getTime();
      const bkEnd = new Date(bk.endDate).getTime();
      if (requestedStart <= bkEnd && requestedEnd >= bkStart) {
        return false;
      }
    }

    const veh = vehicles.find(v => v.id === vehicleId);
    if (veh?.availabilityBlocks) {
      for (const blk of veh.availabilityBlocks) {
        const blkStart = new Date(blk.startDate).getTime();
        const blkEnd = new Date(blk.endDate).getTime();
        if (requestedStart <= blkEnd && requestedEnd >= blkStart) {
          return false;
        }
      }
    }

    return true;
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    // Check KYC status first
    if (currentUser.kycStatus !== 'verified') {
      showToast('KYC Required', 'You must pass identity verification before renting vehicles.', 'error');
      openModal('kyc_wizard');
      throw new Error('KYC verification required');
    }

    // Check availability (double booking prevention)
    if (!isVehicleAvailable(bookingData.vehicleId, bookingData.startDate, bookingData.endDate)) {
      showToast('Unavailable Dates', 'These dates were just reserved by another renter.', 'error');
      throw new Error('Vehicle unavailable for selected dates');
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `bk_${Date.now().toString(36)}`,
      renterId: currentUser.id,
      renterName: currentUser.name,
      renterAvatar: currentUser.avatar,
      renterPhone: currentUser.phone,
      unlockCode: `${Math.floor(1000 + Math.random() * 9000)}-${bookingData.vehicle.make.slice(0, 2).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send confirmation message in booking chat channel
    const autoMsg: Message = {
      id: `msg_${Date.now()}`,
      bookingId: newBooking.id,
      senderId: 'sys_bot',
      senderName: 'VeloDrive Security',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      receiverId: newBooking.ownerId,
      text: `🎉 Booking Confirmed! Trip dates: ${newBooking.startDate} to ${newBooking.endDate}. Digital unlock code generated: ${newBooking.unlockCode}.`,
      timestamp: new Date().toISOString(),
      isAutomated: true
    };
    setMessages(prev => [...prev, autoMsg]);

    // Notifications
    const renterNotif: Notification = {
      id: `notif_${Date.now()}_renter`,
      userId: currentUser.id,
      title: 'Booking Confirmed!',
      body: `Your rental for ${newBooking.vehicle.make} ${newBooking.vehicle.model} is booked. Pickup code: ${newBooking.unlockCode}`,
      type: 'booking',
      read: false,
      timestamp: new Date().toISOString(),
      actionType: 'view_booking',
      actionId: newBooking.id
    };

    const hostNotif: Notification = {
      id: `notif_${Date.now()}_host`,
      userId: newBooking.ownerId,
      title: 'New Trip Booked! 🚗',
      body: `${currentUser.name} booked your ${newBooking.vehicle.make} ${newBooking.vehicle.model} ($${newBooking.rentalSubtotal.toFixed(0)})`,
      type: 'booking',
      read: false,
      timestamp: new Date().toISOString(),
      actionType: 'view_booking',
      actionId: newBooking.id
    };

    setNotifications(prev => [renterNotif, hostNotif, ...prev]);
    showToast('Reservation Complete!', 'Your trip is booked and protected by VeloDrive Shield.', 'success');
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    const bk = bookings.find(b => b.id === bookingId);
    if (bk) {
      const notif: Notification = {
        id: `notif_${Date.now()}`,
        userId: bk.renterId,
        title: `Trip Status: ${status.toUpperCase()}`,
        body: `Your trip for ${bk.vehicle.make} ${bk.vehicle.model} status is now ${status}.`,
        type: 'booking',
        read: false,
        timestamp: new Date().toISOString(),
        actionType: 'view_booking',
        actionId: bookingId
      };
      setNotifications(prev => [notif, ...prev]);
    }
    showToast('Status Updated', `Booking is now marked as ${status}.`, 'info');
  };

  const cancelBooking = (bookingId: string, reason: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled', cancellationReason: reason, paymentStatus: 'refunded' } : b));
    const bk = bookings.find(b => b.id === bookingId);
    if (bk) {
      const notif: Notification = {
        id: `notif_${Date.now()}`,
        userId: bk.ownerId,
        title: 'Booking Cancelled',
        body: `${bk.renterName} cancelled trip for ${bk.vehicle.make} ${bk.vehicle.model}. Reason: ${reason}`,
        type: 'booking',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }
    showToast('Booking Cancelled', 'Refund processed according to cancellation policy.', 'info');
  };

  const openDispute = (bookingId: string, reason: string, requestedAmount?: number) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: 'disputed',
      disputeDetails: {
        openedBy: currentUser.id,
        reason,
        requestedAmount: requestedAmount || 100,
        status: 'open'
      }
    } : b));

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'DISPUTE_FILED',
      targetType: 'dispute',
      targetId: bookingId,
      details: `Dispute opened: ${reason}. Amount: $${requestedAmount || 0}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast('Dispute Submitted', 'Support and Trust & Safety team notified.', 'warning');
  };

  const resolveDispute = (bookingId: string, resolution: 'resolved_renter' | 'resolved_host', notes: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: 'completed',
      disputeDetails: b.disputeDetails ? { ...b.disputeDetails, status: resolution, adminNotes: notes } : undefined
    } : b));

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: 'usr_admin',
      adminName: 'Sarah Connor',
      action: 'DISPUTE_RESOLVED',
      targetType: 'dispute',
      targetId: bookingId,
      details: `Dispute resolution: ${resolution}. Notes: ${notes}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast('Dispute Resolved', `Resolution: ${resolution}`, 'success');
  };

  const sendMessage = (bookingId: string, text: string) => {
    // Privacy and anti-spam filter: mask raw phone numbers and emails
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

    let sanitizedText = text;
    let hadMask = false;

    if (phoneRegex.test(sanitizedText) || emailRegex.test(sanitizedText)) {
      sanitizedText = sanitizedText
        .replace(phoneRegex, '[Protected Contact Information]')
        .replace(emailRegex, '[Protected Email]');
      hadMask = true;
    }

    const bk = bookings.find(b => b.id === bookingId);
    const receiverId = bk ? (bk.renterId === currentUser.id ? bk.ownerId : bk.renterId) : 'usr_elena';

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId,
      text: sanitizedText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    triggerHaptic('light');

    if (hadMask) {
      showToast('Contact Info Masked', 'Personal phone/email masked for security. Communicate in-app.', 'info');
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);

    // Update vehicle or user rating
    if (reviewData.targetType === 'vehicle') {
      setVehicles(prev => prev.map(v => {
        if (v.id === reviewData.vehicleId) {
          const count = v.reviewsCount + 1;
          const newRating = Number(((v.rating * v.reviewsCount + reviewData.rating) / count).toFixed(2));
          return { ...v, rating: newRating, reviewsCount: count };
        }
        return v;
      }));
    }

    showToast('Review Published', 'Thank you for building trust in the community!', 'success');
  };

  const toggleSavedVehicle = (vehicleId: string) => {
    triggerHaptic('light');
    setSavedVehicleIds(prev => {
      const isSaved = prev.includes(vehicleId);
      if (isSaved) {
        showToast('Removed from Wishlist', undefined, 'info');
        return prev.filter(id => id !== vehicleId);
      } else {
        showToast('Saved to Wishlist ❤️', undefined, 'success');
        return [...prev, vehicleId];
      }
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Marked Read', undefined, 'info');
  };

  const requestPayout = (amount: number) => {
    const newPayout: Payout = {
      id: `pay_${Date.now()}`,
      ownerId: currentUser.id,
      amount,
      status: 'processing',
      payoutDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      bankAccountMask: 'Verified Checking (...5519)',
      bookingId: 'Aggregated Balance',
      vehicleInfo: 'Marketplace Earnings'
    };
    setPayouts(prev => [newPayout, ...prev]);
    showToast('Payout Initiated', `$${amount.toFixed(2)} dispatched via Stripe Connect.`, 'success');
  };

  const clearDuplicateSignal = (signalId: string) => {
    setDuplicateSignals(prev => prev.map(s => s.id === signalId ? { ...s, status: 'cleared' } : s));
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: 'usr_admin',
      adminName: 'Sarah Connor',
      action: 'DUPLICATE_FLAG_CLEARED',
      targetType: 'user',
      targetId: signalId,
      details: 'Admin verified identity authenticity. Flag cleared.',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast('Flag Cleared', 'Identity cleared by administrator.', 'info');
  };

  const confirmDuplicateAccount = (signalId: string, suspendTarget: boolean) => {
    setDuplicateSignals(prev => prev.map(s => s.id === signalId ? { ...s, status: 'confirmed_duplicate' } : s));
    const sig = duplicateSignals.find(s => s.id === signalId);

    if (suspendTarget && sig) {
      setAllUsers(prev => prev.map(u => u.id === sig.sourceUserId ? { ...u, kycStatus: 'rejected', riskScore: 99 } : u));
    }

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      adminId: 'usr_admin',
      adminName: 'Sarah Connor',
      action: 'DUPLICATE_CONFIRMED',
      targetType: 'user',
      targetId: sig?.sourceUserId || 'unknown',
      details: `One-Person=One-Account policy enforced. Target account ${suspendTarget ? 'suspended' : 'flagged'}.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast('Duplicate Enforced', suspendTarget ? 'Duplicate account suspended.' : 'Marked as duplicate.', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        activeMode,
        setActiveMode,
        switchUser,
        registerUser,
        signUpWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        currentCountry,
        setCountry,
        currency,
        formatCurrency,
        formatDailyRate,
        convertPrice,
        activeTab,
        setActiveTab,
        activeModal,
        openModal,
        closeModal,
        selectedVehicle,
        setSelectedVehicle,
        selectedBooking,
        setSelectedBooking,
        activeChatBooking,
        setActiveChatBooking,
        vehicles,
        bookings,
        messages,
        reviews,
        notifications,
        duplicateSignals,
        auditLogs,
        payouts,
        kycSubmissions,
        savedVehicleIds,
        deviceFrame,
        setDeviceFrame,
        networkStatus,
        setNetworkStatus,
        toast,
        showToast,
        clearToast,
        triggerHaptic,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filterLocation,
        setFilterLocation,
        filterDates,
        setFilterDates,
        submitKYC,
        approveKYC,
        rejectKYC,
        createVehicle,
        approveVehicle,
        rejectVehicle,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        openDispute,
        resolveDispute,
        sendMessage,
        addReview,
        toggleSavedVehicle,
        markNotificationRead,
        clearAllNotifications,
        requestPayout,
        clearDuplicateSignal,
        confirmDuplicateAccount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
