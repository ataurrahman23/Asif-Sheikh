import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  DonorProfile,
  EmergencyRequest,
  Rating,
  Report,
  Hospital,
  AuditLog,
  DeveloperSettings,
  BloodGroup,
  AvailabilityStatus,
  RequestStatus,
  ReportReason
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_EMERGENCY_REQUESTS,
  INITIAL_HOSPITALS,
  INITIAL_RATINGS,
  INITIAL_DEVELOPER_SETTINGS
} from '../data/initialData';

interface AppContextType {
  currentUser: UserProfile | null;
  donors: DonorProfile[];
  emergencyRequests: EmergencyRequest[];
  ratings: Rating[];
  reports: Report[];
  hospitals: Hospital[];
  auditLogs: AuditLog[];
  developerSettings: DeveloperSettings;
  isSafetyWarningVisible: boolean;
  dismissSafetyWarning: () => void;
  // Auth methods
  loginAsGoogle: (customEmail?: string, customName?: string) => void;
  loginWithEmail: (email: string, name?: string, role?: 'user' | 'donor' | 'admin') => void;
  logout: () => void;
  // Donor actions
  registerDonor: (data: Omit<DonorProfile, 'donorId' | 'userId' | 'isVerified' | 'createdAt' | 'updatedAt' | 'lastStatusUpdate'>) => Promise<boolean>;
  updateDonorProfile: (donorId: string, updates: Partial<DonorProfile>) => Promise<boolean>;
  verifyDonor: (donorId: string, isVerified: boolean, reason?: string) => Promise<boolean>;
  // Emergency requests
  createEmergencyRequest: (data: Omit<EmergencyRequest, 'requestId' | 'userId' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEmergencyStatus: (requestId: string, status: RequestStatus) => Promise<boolean>;
  deleteEmergencyRequest: (requestId: string) => Promise<boolean>;
  // Ratings & Reports
  submitRating: (donorId: string, rating: number, review?: string) => Promise<boolean>;
  submitReport: (targetType: 'donor' | 'request', targetId: string, targetName: string, reason: ReportReason, description?: string) => Promise<boolean>;
  resolveReport: (reportId: string, actionTaken: string, status: 'resolved' | 'dismissed') => Promise<boolean>;
  // Hospitals
  addHospital: (hospital: Omit<Hospital, 'hospitalId' | 'createdAt'>) => Promise<boolean>;
  updateHospital: (hospitalId: string, updates: Partial<Hospital>) => Promise<boolean>;
  deleteHospital: (hospitalId: string) => Promise<boolean>;
  // Developer settings
  updateDeveloperSettings: (settings: Partial<DeveloperSettings>) => Promise<boolean>;
  // Reset for testing
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_EMAIL = 'asifjony2022@gmail.com';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent state from localStorage with fallback to initial data
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tarail_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [donors, setDonors] = useState<DonorProfile[]>(() => {
    const saved = localStorage.getItem('tarail_donors');
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(() => {
    const saved = localStorage.getItem('tarail_emergencyRequests');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_REQUESTS;
  });

  const [ratings, setRatings] = useState<Rating[]>(() => {
    const saved = localStorage.getItem('tarail_ratings');
    return saved ? JSON.parse(saved) : INITIAL_RATINGS;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('tarail_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('tarail_hospitals');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('tarail_auditLogs');
    return saved ? JSON.parse(saved) : [
      {
        logId: 'audit-init',
        adminUserId: 'system',
        adminEmail: ADMIN_EMAIL,
        actionType: 'SYSTEM_BOOTSTRAP',
        targetId: 'system',
        details: 'Initial Tarail Blood Bank database bootstrapped with verified safety rules.',
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [developerSettings, setDeveloperSettings] = useState<DeveloperSettings>(() => {
    const saved = localStorage.getItem('tarail_developerSettings');
    return saved ? JSON.parse(saved) : INITIAL_DEVELOPER_SETTINGS;
  });

  // Session-scoped warning modal: checks sessionStorage
  const [isSafetyWarningVisible, setIsSafetyWarningVisible] = useState<boolean>(() => {
    return sessionStorage.getItem('tarail_safety_acknowledged') !== 'true';
  });

  // Save changes to localStorage for persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tarail_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tarail_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tarail_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('tarail_emergencyRequests', JSON.stringify(emergencyRequests));
  }, [emergencyRequests]);

  useEffect(() => {
    localStorage.setItem('tarail_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('tarail_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('tarail_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('tarail_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('tarail_developerSettings', JSON.stringify(developerSettings));
  }, [developerSettings]);

  const dismissSafetyWarning = () => {
    sessionStorage.setItem('tarail_safety_acknowledged', 'true');
    setIsSafetyWarningVisible(false);
  };

  // Auth: Google Sign-in simulation / real auth
  const loginAsGoogle = (customEmail?: string, customName?: string) => {
    const email = (customEmail || ADMIN_EMAIL).trim().toLowerCase();
    const isAdmin = email === ADMIN_EMAIL.toLowerCase();
    const user: UserProfile = {
      userId: 'usr-' + Date.now(),
      email,
      name: customName || (isAdmin ? 'অ্যাডমিন (Asif)' : 'Google রক্তদাতা ব্যবহারকারী'),
      role: isAdmin ? 'admin' : 'donor',
      photoURL: isAdmin
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'
        : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
  };

  const loginWithEmail = (email: string, name?: string, role: 'user' | 'donor' | 'admin' = 'user') => {
    const trimmedEmail = email.trim().toLowerCase();
    const isAdmin = trimmedEmail === ADMIN_EMAIL.toLowerCase() || role === 'admin';
    const user: UserProfile = {
      userId: 'usr-' + Date.now(),
      email: trimmedEmail,
      name: name || (isAdmin ? 'প্রধান প্রশাসক' : 'স্বেচ্ছাসেবক ব্যবহারকারী'),
      role: isAdmin ? 'admin' : role,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Donor Registration (Strict: requires auth, defaults isVerified=false)
  const registerDonor = async (
    data: Omit<DonorProfile, 'donorId' | 'userId' | 'isVerified' | 'createdAt' | 'updatedAt' | 'lastStatusUpdate'>
  ): Promise<boolean> => {
    if (!currentUser) return false;

    const newDonor: DonorProfile = {
      ...data,
      donorId: 'donor-' + Date.now(),
      userId: currentUser.userId,
      isVerified: false, // New donors never automatically get verified badge
      availabilityStatus: data.availabilityStatus || 'available',
      lastStatusUpdate: new Date().toISOString().split('T')[0],
      isDonationCountVerified: false, // Self reported initially
      averageRating: 0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDonors(prev => [newDonor, ...prev]);

    // Update user role to donor if was user
    if (currentUser.role === 'user') {
      setCurrentUser({ ...currentUser, role: 'donor' });
    }

    return true;
  };

  // Donor profile update: only owner can edit permitted fields; admin can edit any
  const updateDonorProfile = async (donorId: string, updates: Partial<DonorProfile>): Promise<boolean> => {
    if (!currentUser) return false;

    const targetDonor = donors.find(d => d.donorId === donorId);
    if (!targetDonor) return false;

    const isOwner = targetDonor.userId === currentUser.userId;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) return false;

    // Filter updates: regular donor cannot modify isVerified or verifiedBy
    const sanitizedUpdates: Partial<DonorProfile> = { ...updates };
    if (!isAdmin) {
      delete sanitizedUpdates.isVerified;
      delete sanitizedUpdates.verifiedAt;
      delete sanitizedUpdates.verifiedBy;
      delete sanitizedUpdates.isDonationCountVerified;
    }

    // If availability updated, refresh lastStatusUpdate
    if (sanitizedUpdates.availabilityStatus || sanitizedUpdates.isAvailable !== undefined) {
      sanitizedUpdates.lastStatusUpdate = new Date().toISOString().split('T')[0];
    }

    sanitizedUpdates.updatedAt = new Date().toISOString();

    setDonors(prev => prev.map(d => (d.donorId === donorId ? { ...d, ...sanitizedUpdates } : d)));
    return true;
  };

  // Admin Donor Verification
  const verifyDonor = async (donorId: string, isVerified: boolean, reason?: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;

    const donor = donors.find(d => d.donorId === donorId);
    if (!donor) return false;

    const now = new Date().toISOString();
    setDonors(prev =>
      prev.map(d =>
        d.donorId === donorId
          ? {
              ...d,
              isVerified,
              verifiedAt: isVerified ? now : undefined,
              verifiedBy: isVerified ? currentUser.email : undefined,
              updatedAt: now
            }
          : d
      )
    );

    // Write audit log
    const log: AuditLog = {
      logId: 'audit-' + Date.now(),
      adminUserId: currentUser.userId,
      adminEmail: currentUser.email,
      actionType: isVerified ? 'VERIFY_DONOR' : 'REVOKE_DONOR_VERIFICATION',
      targetId: donorId,
      details: `Admin ${currentUser.email} ${isVerified ? 'verified' : 'revoked verification for'} donor: ${donor.name} (${donor.bloodGroup}). Note: ${reason || 'Identity and contact reviewed.'}`,
      timestamp: now
    };
    setAuditLogs(prev => [log, ...prev]);

    return true;
  };

  // Emergency blood requests
  const createEmergencyRequest = async (
    data: Omit<EmergencyRequest, 'requestId' | 'userId' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    const requestId = 'req-' + Date.now();
    const newRequest: EmergencyRequest = {
      ...data,
      requestId,
      userId: currentUser?.userId || 'guest-req-' + Date.now(),
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEmergencyRequests(prev => [newRequest, ...prev]);
    return true;
  };

  const updateEmergencyStatus = async (requestId: string, status: RequestStatus): Promise<boolean> => {
    if (!currentUser) return false;
    const req = emergencyRequests.find(r => r.requestId === requestId);
    if (!req) return false;

    const isOwner = req.userId === currentUser.userId;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) return false;

    setEmergencyRequests(prev =>
      prev.map(r => (r.requestId === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );
    return true;
  };

  const deleteEmergencyRequest = async (requestId: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    setEmergencyRequests(prev => prev.filter(r => r.requestId !== requestId));
    return true;
  };

  // Ratings
  const submitRating = async (donorId: string, ratingValue: number, review?: string): Promise<boolean> => {
    if (!currentUser) return false;

    const targetDonor = donors.find(d => d.donorId === donorId);
    if (!targetDonor || targetDonor.userId === currentUser.userId) {
      // Cannot rate self
      return false;
    }

    const newRating: Rating = {
      ratingId: 'rate-' + Date.now(),
      donorId,
      raterUserId: currentUser.userId,
      raterName: currentUser.name,
      rating: Math.max(1, Math.min(5, ratingValue)),
      review: review?.trim() || '',
      isModerated: false,
      createdAt: new Date().toISOString()
    };

    const updatedRatings = [...ratings.filter(r => !(r.donorId === donorId && r.raterUserId === currentUser.userId)), newRating];
    setRatings(updatedRatings);

    // Recalculate average rating for donor
    const donorRatings = updatedRatings.filter(r => r.donorId === donorId);
    const avg = donorRatings.reduce((sum, r) => sum + r.rating, 0) / donorRatings.length;

    setDonors(prev =>
      prev.map(d =>
        d.donorId === donorId
          ? {
              ...d,
              averageRating: Number(avg.toFixed(1)),
              ratingCount: donorRatings.length
            }
          : d
      )
    );

    return true;
  };

  // Reports
  const submitReport = async (
    targetType: 'donor' | 'request',
    targetId: string,
    targetName: string,
    reason: ReportReason,
    description?: string
  ): Promise<boolean> => {
    if (!currentUser) return false;

    const newReport: Report = {
      reportId: 'rep-' + Date.now(),
      reporterUserId: currentUser.userId,
      reporterEmail: currentUser.email,
      targetType,
      targetId,
      targetName,
      reason,
      description: description?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);
    return true;
  };

  const resolveReport = async (reportId: string, actionTaken: string, status: 'resolved' | 'dismissed'): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;

    const now = new Date().toISOString();
    setReports(prev =>
      prev.map(r =>
        r.reportId === reportId
          ? {
              ...r,
              status,
              actionTaken,
              resolvedAt: now,
              resolvedBy: currentUser.email
            }
          : r
      )
    );

    // Log admin action
    const log: AuditLog = {
      logId: 'audit-' + Date.now(),
      adminUserId: currentUser.userId,
      adminEmail: currentUser.email,
      actionType: 'RESOLVE_REPORT',
      targetId: reportId,
      details: `Admin ${currentUser.email} ${status} report ${reportId}. Action: ${actionTaken}`,
      timestamp: now
    };
    setAuditLogs(prev => [log, ...prev]);

    return true;
  };

  // Hospitals
  const addHospital = async (hospital: Omit<Hospital, 'hospitalId' | 'createdAt'>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;

    const newHosp: Hospital = {
      ...hospital,
      hospitalId: 'hosp-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    setHospitals(prev => [newHosp, ...prev]);
    return true;
  };

  const updateHospital = async (hospitalId: string, updates: Partial<Hospital>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;

    setHospitals(prev =>
      prev.map(h => (h.hospitalId === hospitalId ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h))
    );
    return true;
  };

  const deleteHospital = async (hospitalId: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;

    setHospitals(prev => prev.filter(h => h.hospitalId !== hospitalId));
    return true;
  };

  // Developer Settings
  const updateDeveloperSettings = async (settings: Partial<DeveloperSettings>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;

    setDeveloperSettings(prev => ({
      ...prev,
      ...settings,
      updatedAt: new Date().toISOString()
    }));
    return true;
  };

  // Reset demo
  const resetAllData = () => {
    localStorage.removeItem('tarail_donors');
    localStorage.removeItem('tarail_emergencyRequests');
    localStorage.removeItem('tarail_ratings');
    localStorage.removeItem('tarail_reports');
    localStorage.removeItem('tarail_hospitals');
    localStorage.removeItem('tarail_auditLogs');
    localStorage.removeItem('tarail_developerSettings');
    setDonors(INITIAL_DONORS);
    setEmergencyRequests(INITIAL_EMERGENCY_REQUESTS);
    setRatings(INITIAL_RATINGS);
    setReports([]);
    setHospitals(INITIAL_HOSPITALS);
    setDeveloperSettings(INITIAL_DEVELOPER_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        donors,
        emergencyRequests,
        ratings,
        reports,
        hospitals,
        auditLogs,
        developerSettings,
        isSafetyWarningVisible,
        dismissSafetyWarning,
        loginAsGoogle,
        loginWithEmail,
        logout,
        registerDonor,
        updateDonorProfile,
        verifyDonor,
        createEmergencyRequest,
        updateEmergencyStatus,
        deleteEmergencyRequest,
        submitRating,
        submitReport,
        resolveReport,
        addHospital,
        updateHospital,
        deleteHospital,
        updateDeveloperSettings,
        resetAllData
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
