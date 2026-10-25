export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'user' | 'donor' | 'admin';

export type AvailabilityStatus = 'available' | 'temporarily_unavailable' | 'needs_update';

export type RequestUrgency = 'emergency' | 'today' | 'tomorrow' | 'scheduled';

export type RequestStatus = 'open' | 'in_progress' | 'fulfilled' | 'closed' | 'under_review';

export type ReportReason =
  | 'ভুল তথ্য বা ভুয়া প্রোফাইল'
  | 'রক্তের জন্য টাকা দাবি'
  | 'হয়রানি বা অসদাচরণ'
  | 'ভুল রক্তদানের তথ্য'
  | 'ভুয়া জরুরি অনুরোধ'
  | 'অন্যান্য';

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  photoURL?: string;
  isSuspended?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DonorProfile {
  donorId: string;
  userId: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  district: string;
  upazila: string;
  area: string;
  address?: string;
  phone: string;
  isPhonePublic: boolean;
  lastDonationDate?: string;
  totalDonations: number;
  isDonationCountVerified: boolean;
  isAvailable: boolean;
  availabilityStatus: AvailabilityStatus;
  lastStatusUpdate: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  bio?: string;
  photoURL?: string;
  consentToPublish: boolean;
  averageRating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface EmergencyRequest {
  requestId: string;
  userId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  district: string;
  upazila: string;
  area?: string;
  requiredDate: string;
  urgency: RequestUrgency;
  contactPhone: string;
  notes?: string;
  status: RequestStatus;
  consentToPublish: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Rating {
  ratingId: string;
  donorId: string;
  raterUserId: string;
  raterName: string;
  rating: number; // 1 to 5
  review?: string;
  isModerated?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Report {
  reportId: string;
  reporterUserId: string;
  reporterEmail?: string;
  targetType: 'donor' | 'request';
  targetId: string;
  targetName?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  actionTaken?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Hospital {
  hospitalId: string;
  name: string;
  type: 'hospital' | 'clinic' | 'blood_bank' | 'red_crescent';
  address: string;
  upazila: string;
  district: string;
  phone: string;
  openingHours?: string;
  website?: string;
  mapUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  logId: string;
  adminUserId: string;
  adminEmail: string;
  actionType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface DeveloperSettings {
  developerName: string;
  developerPhoto?: string;
  developerBio?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  updatedAt?: string;
}
