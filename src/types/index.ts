export type UserRole = 'customer' | 'technician' | 'admin';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type KYCStatus = 'not_started' | 'pending_verification' | 'verified' | 'rejected';

export interface CountryCode {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  state?: string;
  address?: string;
  isGpsLocked?: boolean;
  accuracyMeters?: number;
}

export interface SecurityQuestionConfig {
  question1: string;
  answer1Hash: string;
  question2: string;
  answer2Hash: string;
}

export interface PasswordResetRequest {
  id: string;
  username: string;
  phone: string;
  status: 'pending' | 'resolved' | 'rejected';
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  temporaryPassword?: string;
  adminNotes?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  passwordHash?: string;
  name: string;
  mobile: string;
  countryCode: string;
  email?: string;
  role: UserRole;
  location?: UserLocation;
  avatarUrl?: string;
  createdAt: string;
  isTechnicianRegistered?: boolean;
  technicianId?: string;
  hasAgreedNotice?: boolean;
  noticeAgreedAt?: string;
  kyc_status?: KYCStatus;
  aadhaar_number?: string;
  aadhaar_front_url?: string;
  aadhaar_back_url?: string;
  full_name_aadhaar?: string;
  dob?: string;
  installationId?: string;
  securityPinHash?: string; // Encrypted/hashed 4-digit numeric PIN for instant password recovery
  searchRadiusKm?: number; // Service and search geofenced radius in KM (Default: 5 KM)
  securityQuestions?: SecurityQuestionConfig;
  isBlocked?: boolean;
  blockedReason?: string;
  blockedAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  hindiName?: string;
  icon: string; // Emoji
  lucideIconName: string;
  description: string;
  popularServices: string[];
  startingPrice?: number;
  badge?: string;
}

export interface TechnicianDocument {
  type: 'aadhaar' | 'trade_license' | 'certificate';
  name: string;
  documentNumber?: string;
  fileUrl: string;
  uploadedAt: string;
  verified?: boolean;
}

export interface TechnicianServiceItem {
  id?: string;
  name: string;
  price: number;
  description?: string;
  photoUrl?: string; // Photo of work / service item
  duration?: string;
}

export interface TechnicianProfile {
  id: string;
  technicianCode?: string; // Auto-generated unique ID e.g. "TECH-1001"
  userId: string;
  fullName: string;
  mobile: string;
  whatsappNumber: string;
  email?: string;
  companyName: string;
  ipAddress?: string; // Real IP address captured on entry
  deviceId?: string; // Unique Device Fingerprint captured on entry
  categoryId: string;
  categoryName: string;
  categoryIds?: string[];
  categoryNames?: string[];
  experienceYears: number;
  coverageRadiusKm: number;
  coverageAreaText: string;
  businessAddress: string;
  location: UserLocation;
  businessDescription: string;
  profilePhotoUrl: string;
  companyLogoUrl?: string;
  portfolioImages: string[];
  documents: {
    aadhaarNumber: string;
    aadhaarDocUrl: string;
    aadhaarBackDocUrl?: string;
    full_name_aadhaar?: string;
    dob?: string;
    kyc_status?: KYCStatus;
    tradeLicenseDocUrl?: string;
  };
  status: ApplicationStatus;
  isApproved?: boolean;
  isBlocked?: boolean; // One-click Block / Blacklist status
  blockedReason?: string;
  blockedAt?: string;
  rejectionReason?: string;
  suspensionReason?: string;
  isVerified: boolean;
  verifiedAt?: string;
  isOnline: boolean;
  rating: number;
  reviewCount: number;
  ratingCount?: number;
  startingPrice: number;
  priceUnit: string;
  inspectionFee?: number;
  hourlyRate?: number;
  rateCardNotes?: string;
  servicesOffered: TechnicianServiceItem[];
  workingHours: string;
  availableDays: string[];
  appliedAt: string;
  createdAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  totalBookings: number;
  profileViews: number;
  totalCalls: number;
  totalWhatsAppClicks: number;
}

export interface ServiceLead {
  id: string;
  technicianId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerLocation: UserLocation;
  serviceCategory: string;
  serviceTitle: string;
  description: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  status: 'new' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedPrice?: number;
  urgency: 'low' | 'medium' | 'urgent';
  address: string;
}

export interface Review {
  id: string;
  technicianId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceUsed: string;
  technicianReply?: string;
}

export interface ActivityLog {
  id: string;
  technicianId: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  type: 'call' | 'whatsapp' | 'view' | 'booking';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  technicianId: string;
  technicianName: string;
  action: 'approved' | 'rejected' | 'suspended' | 'reactivated';
  reason?: string;
  timestamp: string;
}

export interface CustomerRecord {
  id: string;
  customerId: string; // 'CUST-XXXX'
  name: string;
  phone?: string;
  ipAddress: string;
  deviceId: string;
  userAgent?: string;
  lastSeenAt: string;
  createdAt: string;
  isBlocked: boolean;
  blockedReason?: string;
  blockedAt?: string;
  blockedBy?: string;
}

export interface BlockedDeviceRecord {
  id: string;
  deviceId: string;
  ipAddress: string;
  targetType: 'customer' | 'technician';
  targetId?: string;
  uniqueId: string; // 'CUST-XXXX' or 'TECH-XXXX'
  targetName: string;
  targetPhone?: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
}

export interface DeviceSecurityStatus {
  isBlocked: boolean;
  reason?: string;
  blockedAt?: string;
  blockedBy?: string;
  uniqueId?: string;
  ip: string;
  deviceId: string;
}

