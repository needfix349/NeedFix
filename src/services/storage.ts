import {
  UserProfile,
  TechnicianProfile,
  ServiceLead,
  Review,
  AdminAuditLog,
  ActivityLog,
  ApplicationStatus,
  UserLocation,
  CustomerRecord,
  BlockedDeviceRecord,
  PasswordResetRequest,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TECHNICIANS,
  INITIAL_LEADS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
  ADMIN_PHONE_NUMBER,
} from '../data/mockData';

const STORAGE_VERSION = 'v10_production';
const KEYS = {
  VERSION: 'needfix_storage_ver_v10',
  CURRENT_USER: 'needfix_v10_current_user',
  USERS: 'needfix_v10_users',
  TECHNICIANS: 'needfix_v10_technicians',
  PENDING_APPLICATIONS: 'needfix_v10_pending_applications',
  LEADS: 'needfix_v10_leads',
  REVIEWS: 'needfix_v10_reviews',
  AUDIT_LOGS: 'needfix_v10_audit_logs',
  ACTIVITY_LOGS: 'needfix_v10_activity_logs',
  FAVORITES: 'needfix_v10_favorites',
  CUSTOMERS: 'needfix_v10_customers',
  BLOCKED_DEVICES: 'needfix_v10_blocked_devices',
  PASSWORD_RESET_REQUESTS: 'needfix_v10_password_reset_requests',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const currentVer = localStorage.getItem(KEYS.VERSION);
      if (currentVer !== STORAGE_VERSION) {
        localStorage.setItem(KEYS.VERSION, STORAGE_VERSION);
        localStorage.setItem(KEYS.USERS, JSON.stringify([]));
        localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify([]));
        localStorage.setItem(KEYS.LEADS, JSON.stringify([]));
        localStorage.setItem(KEYS.REVIEWS, JSON.stringify([]));
        localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify([]));
        localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
        // Remove any legacy mock user session
        localStorage.removeItem(KEYS.CURRENT_USER);
        return;
      }

      if (!localStorage.getItem(KEYS.USERS)) {
        localStorage.setItem(KEYS.USERS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.TECHNICIANS)) {
        localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.LEADS)) {
        localStorage.setItem(KEYS.LEADS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.REVIEWS)) {
        localStorage.setItem(KEYS.REVIEWS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
        localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.ACTIVITY_LOGS)) {
        localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.FAVORITES)) {
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
      }
    } catch (err) {
      console.warn('StorageService init note:', err);
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- IMPORTANT NOTICE AGREEMENT ---
  hasAgreedImportantNotice(userId?: string, email?: string): boolean {
    // 1. Check persistent visitor acceptance on this device/browser
    const visitorAgreed = localStorage.getItem('needfix_notice_agreed_visitor') === 'true';
    if (!visitorAgreed) {
      return false;
    }

    // If userId or email is provided, verify user-specific acceptance as well
    if (userId && localStorage.getItem(`needfix_notice_agreed_${userId}`) !== 'true') {
      const user = this.getUsers().find((u) => u.id === userId);
      if (!user?.hasAgreedNotice) return false;
    }

    if (email && localStorage.getItem(`needfix_notice_agreed_${email.toLowerCase()}`) !== 'true') {
      const user = this.getUsers().find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (!user?.hasAgreedNotice) return false;
    }

    return true;
  }

  setAgreedImportantNotice(userId?: string, email?: string): void {
    const agreedAt = new Date().toISOString();
    // Mark visitor acceptance on device
    localStorage.setItem('needfix_notice_agreed_visitor', 'true');
    localStorage.setItem('needfix_notice_agreed_at', agreedAt);

    if (userId) {
      localStorage.setItem(`needfix_notice_agreed_${userId}`, 'true');
    }
    if (email) {
      localStorage.setItem(`needfix_notice_agreed_${email.toLowerCase()}`, 'true');
    }

    const users = this.getUsers();
    const user = users.find(
      (u) => (userId && u.id === userId) || (email && u.email?.toLowerCase() === email.toLowerCase())
    );
    if (user) {
      user.hasAgreedNotice = true;
      user.noticeAgreedAt = agreedAt;
      this.updateUser(user);
    }
    const curr = this.getCurrentUser();
    if (curr && ((userId && curr.id === userId) || (email && curr.email?.toLowerCase() === email.toLowerCase()))) {
      this.setCurrentUser({
        ...curr,
        hasAgreedNotice: true,
        noticeAgreedAt: agreedAt,
      });
    }
    this.notify();
  }

  // --- CURRENT USER ---
  clearSession(silent = false) {
    let hadSession = false;
    try {
      hadSession = !!localStorage.getItem(KEYS.CURRENT_USER);
      localStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.removeItem('needfix_auth_token');
      localStorage.removeItem('needfix_session');
    } catch {}
    if (!silent && hadSession) {
      this.notify();
    }
  }

  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      if (!data) return null;
      const user: UserProfile = JSON.parse(data);

      // Check if user is blocked or device is blocked (silent removal without recursive notify)
      if (user.isBlocked || (user as any).status === 'blocked') {
        try {
          localStorage.removeItem(KEYS.CURRENT_USER);
        } catch {}
        return null;
      }

      const blockedDevices = this.getBlockedDevices();
      const isDeviceBlocked = blockedDevices.some(
        (b) =>
          (user.installationId && (b.deviceId === user.installationId || b.uniqueId === user.installationId)) ||
          (user.username && (b.uniqueId?.toLowerCase() === user.username.toLowerCase() || b.targetName?.toLowerCase() === user.username.toLowerCase()))
      );

      if (isDeviceBlocked) {
        try {
          localStorage.removeItem(KEYS.CURRENT_USER);
        } catch {}
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: UserProfile | null) {
    if (user) {
      // Do not allow setting session if user or device is blocked
      if (user.isBlocked || (user as any).status === 'blocked') {
        this.clearSession(true);
        return;
      }
      try {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      } catch (e) {
        console.warn('Storage quota warning in setCurrentUser:', e);
      }
      // Also update in users list
      this.updateUser(user);
    } else {
      try {
        localStorage.removeItem(KEYS.CURRENT_USER);
      } catch {}
    }
    this.notify();
  }

  getUsers(): UserProfile[] {
    try {
      return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    } catch {
      return [];
    }
  }

  getUserByPhone(countryCode: string, mobile: string): UserProfile | undefined {
    const clean = mobile.replace(/\D/g, '');
    if (clean === ADMIN_PHONE_NUMBER) {
      const existingAdmin = this.getUsers().find((u) => u.mobile === ADMIN_PHONE_NUMBER);
      if (existingAdmin) return existingAdmin;
      return {
        id: 'user_admin_1',
        name: 'NeedFix Admin Officer (Desk)',
        mobile: ADMIN_PHONE_NUMBER,
        countryCode: countryCode || '+91',
        email: 'admin@needfix.in',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
    }
    return this.getUsers().find(
      (u) => u.mobile.replace(/\D/g, '') === clean && u.countryCode === countryCode
    );
  }

  getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getUserByUsername(username: string): UserProfile | undefined {
    const clean = username.trim().toLowerCase();
    if (!clean) return undefined;
    return this.getUsers().find(
      (u) => u.username?.toLowerCase() === clean || (clean.startsWith('user_') && u.id.toLowerCase() === clean)
    );
  }

  getUserByAccountIdentifier(identifier: string): UserProfile | undefined {
    const clean = identifier.trim().toLowerCase();
    if (!clean) return undefined;
    return this.getUsers().find(
      (u) =>
        u.id.toLowerCase() === clean ||
        u.username?.toLowerCase() === clean ||
        (u.email && u.email.toLowerCase() === clean) ||
        (u.mobile && u.mobile.replace(/\D/g, '') === clean.replace(/\D/g, ''))
    );
  }

  updateUser(user: UserProfile) {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  updateUserKYC(
    userId: string,
    kycData: {
      kyc_status: 'pending_verification' | 'verified' | 'rejected';
      aadhaar_number: string;
      aadhaar_front_url: string;
      aadhaar_back_url?: string;
      full_name_aadhaar?: string;
      dob?: string;
    }
  ) {
    const user = this.getUserById(userId);
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        kyc_status: kycData.kyc_status,
        aadhaar_number: kycData.aadhaar_number,
        aadhaar_front_url: kycData.aadhaar_front_url,
        aadhaar_back_url: kycData.aadhaar_back_url,
        full_name_aadhaar: kycData.full_name_aadhaar,
        dob: kycData.dob,
      };
      this.updateUser(updatedUser);

      const currentUser = this.getCurrentUser();
      if (currentUser?.id === userId) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      }
      this.notify();
    }
  }

  syncExternalUser(userAuth: {
    uid: string;
    email?: string;
    displayName: string;
    photoURL?: string;
    role?: 'customer' | 'technician' | 'admin';
  }): UserProfile {
    const users = this.getUsers();
    let existing = users.find(
      (u) =>
        (userAuth.email && u.email?.toLowerCase() === userAuth.email.toLowerCase()) ||
        u.id === userAuth.uid
    );

    const hasAgreed = this.hasAgreedImportantNotice(userAuth.uid, userAuth.email);

    const storedCustomName = localStorage.getItem('needfix_customer_custom_name');

    if (existing) {
      if (storedCustomName) {
        existing.name = storedCustomName;
      } else if (!existing.name || existing.name === 'NeedFix Customer' || existing.name === 'NeedFix User' || (existing.role === 'customer' && existing.name === 'Nadeem')) {
        existing.name = userAuth.displayName || existing.name;
      }
      existing.avatarUrl = userAuth.photoURL || existing.avatarUrl;
      if (userAuth.email && !existing.email) existing.email = userAuth.email;
      if (hasAgreed && !existing.hasAgreedNotice) {
        existing.hasAgreedNotice = true;
      }
      this.updateUser(existing);
      this.setCurrentUser(existing);
      return existing;
    }

    const isAdmin =
      (userAuth.email && userAuth.email.toLowerCase().includes('admin')) ||
      userAuth.email === 'admin@needfix.in' ||
      userAuth.email?.toLowerCase() === 'needfix349@gmail.com' ||
      userAuth.role === 'admin';

    const newUser: UserProfile = {
      id: userAuth.uid || `user_${Date.now()}`,
      name: storedCustomName || userAuth.displayName || 'NeedFix User',
      email: userAuth.email,
      mobile: '',
      countryCode: '+91',
      role: isAdmin ? 'admin' : (userAuth.role || 'customer'),
      avatarUrl:
        userAuth.photoURL ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      isTechnicianRegistered: false,
      hasAgreedNotice: hasAgreed,
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return newUser;
  }

  // --- TECHNICIANS ---
  getTechnicians(): TechnicianProfile[] {
    try {
      const primary: TechnicianProfile[] = JSON.parse(localStorage.getItem(KEYS.TECHNICIANS) || '[]');
      const pending: TechnicianProfile[] = JSON.parse(localStorage.getItem(KEYS.PENDING_APPLICATIONS) || '[]');

      const map = new Map<string, TechnicianProfile>();
      // First populate with primary
      for (const t of primary) {
        map.set(t.id, t);
      }
      // Merge with pending (pending must never be lost)
      for (const p of pending) {
        if (!map.has(p.id)) {
          map.set(p.id, p);
        } else {
          const curr = map.get(p.id)!;
          if (!curr.isBlocked && curr.status !== 'approved' && p.status === 'pending') {
            map.set(p.id, { ...curr, status: 'pending', isApproved: false });
          }
        }
      }

      const merged = Array.from(map.values());

      // Cross-check with universal blocked devices / blacklist
      const blockedDevices = this.getBlockedDevices();
      const blockedIds = new Set<string>();
      blockedDevices.forEach((b) => {
        if (b.uniqueId) blockedIds.add(b.uniqueId.toLowerCase());
        if (b.targetId) blockedIds.add(b.targetId.toLowerCase());
      });

      // Ensure every technician has a valid unique technicianCode (e.g. NF-TECH-1001)
      let counter = 1001;
      for (const tech of merged) {
        if (!tech.technicianCode) {
          tech.technicianCode = `NF-TECH-${counter++}`;
        }
        const codeLow = (tech.technicianCode || '').toLowerCase();
        const idLow = (tech.id || '').toLowerCase();
        if (tech.isBlocked || blockedIds.has(codeLow) || blockedIds.has(idLow)) {
          tech.isBlocked = true;
          tech.status = 'blocked';
          tech.isOnline = false;
        }
      }
      return merged;
    } catch {
      return [];
    }
  }

  // Get all pending applications directly
  getPendingTechnicians(): TechnicianProfile[] {
    return this.getTechnicians().filter((t) => t.status === 'pending');
  }

  getPendingCount(): number {
    return this.getPendingTechnicians().length;
  }

  setTechnicians(technicians: TechnicianProfile[]): void {
    const current = this.getTechnicians();
    const incomingMap = new Map(technicians.map((t) => [t.id, t]));
    const merged: TechnicianProfile[] = [...technicians];

    // Keep any pending or existing local technicians that were not present in incoming
    for (const c of current) {
      if (!incomingMap.has(c.id)) {
        merged.push(c);
      }
    }

    // Ensure all have valid technicianCode (unlimited sequential format TECH-1, TECH-2...)
    let codeIndex = 1;
    for (const tech of merged) {
      if (!tech.technicianCode) {
        tech.technicianCode = `TECH-${codeIndex++}`;
      }
    }

    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(merged));
    this.notify();
  }

  // Auto-generate unique technician code: auto-incrementing unlimited sequential numbers (TECH-1, TECH-2...)
  generateNextTechnicianCode(): string {
    const technicians = this.getTechnicians();
    let maxNumber = 0;
    technicians.forEach((t) => {
      if (t.technicianCode) {
        const match = t.technicianCode.match(/(?:NF-)?TECH-(\d+)/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    });
    return `TECH-${maxNumber + 1}`;
  }

  // Customers must only see approved & non-blocked technicians!
  getApprovedTechnicians(): TechnicianProfile[] {
    return this.getTechnicians().filter((t) => t.status === 'approved' && !t.isBlocked);
  }

  getTechnicianById(id: string): TechnicianProfile | undefined {
    return this.getTechnicians().find((t) => t.id === id);
  }

  getTechnicianByCode(code: string): TechnicianProfile | undefined {
    const cleanCode = code.trim().toLowerCase();
    return this.getTechnicians().find(
      (t) => t.technicianCode?.toLowerCase() === cleanCode
    );
  }

  getTechnicianByUserId(userId: string): TechnicianProfile | undefined {
    return this.getTechnicians().find((t) => t.userId === userId);
  }

  // Register / submit new technician application
  submitTechnicianApplication(profile: Omit<TechnicianProfile, 'id' | 'status' | 'isVerified' | 'rating' | 'reviewCount' | 'totalBookings' | 'profileViews' | 'totalCalls' | 'totalWhatsAppClicks' | 'appliedAt'>): TechnicianProfile {
    const technicians = this.getTechnicians();
    
    // Check if technician already exists for this user
    const existingIndex = technicians.findIndex((t) => t.userId === profile.userId);
    const existingCode = existingIndex >= 0 ? technicians[existingIndex].technicianCode : undefined;

    const newProfile: TechnicianProfile = {
      ...profile,
      id: profile.userId, // Single Account Policy: 1 User = 1 Permanent Account ID
      technicianCode: profile.technicianCode || existingCode || this.generateNextTechnicianCode(),
      status: 'pending', // Sent for admin review!
      isApproved: false,
      isBlocked: false,
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      totalBookings: 0,
      profileViews: 0,
      totalCalls: 0,
      totalWhatsAppClicks: 0,
      appliedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      technicians[existingIndex] = newProfile;
    } else {
      technicians.unshift(newProfile);
    }

    // Save in main store
    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));

    // Save in dedicated pending queue so it cannot be cleared
    try {
      const pending: TechnicianProfile[] = JSON.parse(localStorage.getItem(KEYS.PENDING_APPLICATIONS) || '[]');
      const pIdx = pending.findIndex((p) => p.id === newProfile.id || p.userId === newProfile.userId);
      if (pIdx >= 0) {
        pending[pIdx] = newProfile;
      } else {
        pending.unshift(newProfile);
      }
      localStorage.setItem(KEYS.PENDING_APPLICATIONS, JSON.stringify(pending));
    } catch (e) {
      console.warn('Error saving pending application:', e);
    }

    // Add Audit Log
    this.addAuditLog({
      adminName: 'NeedFix System',
      technicianId: newProfile.id,
      technicianName: newProfile.companyName || newProfile.fullName,
      action: 'reactivated',
      reason: `New technician registration submitted (ID: ${newProfile.technicianCode}) for ${newProfile.categoryName}. Awaiting Admin Approval.`,
    });

    // Update user profile record to mark technician registered
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === profile.userId) {
      const updatedUser: UserProfile = {
        ...currentUser,
        isTechnicianRegistered: true,
        technicianId: newProfile.id,
      };
      this.setCurrentUser(updatedUser);
    }

    this.notify();
    return newProfile;
  }

  // Admin approval actions
  updateTechnicianStatus(
    technicianId: string,
    status: ApplicationStatus,
    adminName: string = 'NeedFix Administrator',
    reason?: string
  ) {
    const technicians = this.getTechnicians();
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return;

    tech.status = status;
    tech.reviewedAt = new Date().toISOString();
    tech.reviewedBy = adminName;

    if (status === 'approved') {
      tech.isApproved = true;
      tech.isVerified = true;
      tech.verifiedAt = new Date().toISOString();
      tech.isOnline = true;
      tech.rejectionReason = undefined;
      tech.suspensionReason = undefined;
    } else if (status === 'rejected') {
      tech.isApproved = false;
      tech.isVerified = false;
      tech.rejectionReason = reason || 'Documents or service information could not be verified.';
    } else if (status === 'suspended') {
      tech.isVerified = false;
      tech.isOnline = false;
      tech.suspensionReason = reason || 'Account temporarily suspended by platform compliance.';
    }

    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));

    // Also update in pending applications store
    try {
      const pending: TechnicianProfile[] = JSON.parse(localStorage.getItem(KEYS.PENDING_APPLICATIONS) || '[]');
      const updatedPending = pending.map((p) => (p.id === technicianId ? { ...p, status, isApproved: status === 'approved' } : p));
      localStorage.setItem(KEYS.PENDING_APPLICATIONS, JSON.stringify(updatedPending));
    } catch (e) {
      console.warn('Error updating pending list:', e);
    }

    // Update corresponding user role if approved
    const users = this.getUsers();
    const techUser = users.find((u) => u.id === tech.userId);
    if (techUser) {
      if (status === 'approved') {
        techUser.role = 'technician';
      }
      this.updateUser(techUser);
    }

    // Add Audit Log
    const auditLogs = this.getAuditLogs();
    const newLog: AdminAuditLog = {
      id: `audit_${Date.now()}`,
      adminName,
      technicianId: tech.id,
      technicianName: tech.fullName,
      action: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : status === 'suspended' ? 'suspended' : 'reactivated',
      reason: reason || (status === 'approved' ? 'Verified Aadhaar ID & approved badge.' : undefined),
      timestamp: new Date().toISOString(),
    };
    auditLogs.unshift(newLog);
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));

    // If current logged in user is this technician, refresh current user state
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === tech.userId) {
      this.setCurrentUser({
        ...currentUser,
        role: status === 'approved' ? 'technician' : currentUser.role,
        isTechnicianRegistered: true,
        technicianId: tech.id,
      });
    }

    this.notify();
  }

  // Synchronize technician profile from remote database (Supabase / Central API)
  syncTechnicianFromRemote(tech: TechnicianProfile): void {
    if (!tech || !tech.id) return;

    try {
      const primary: TechnicianProfile[] = JSON.parse(localStorage.getItem(KEYS.TECHNICIANS) || '[]');
      const idx = primary.findIndex((t) => t.id === tech.id || t.userId === tech.userId || (t.technicianCode && tech.technicianCode && t.technicianCode.toLowerCase() === tech.technicianCode.toLowerCase()));
      if (idx >= 0) {
        // IMPORTANT: Never let remote overwrite an existing local blocked status to unblocked!
        const wasBlocked = primary[idx].isBlocked || primary[idx].status === 'blocked';
        primary[idx] = {
          ...primary[idx],
          ...tech,
          isBlocked: wasBlocked ? true : Boolean(tech.isBlocked),
          status: wasBlocked ? 'blocked' : (tech.status || primary[idx].status),
          blockedReason: wasBlocked ? (primary[idx].blockedReason || tech.blockedReason) : tech.blockedReason,
          blockedAt: wasBlocked ? (primary[idx].blockedAt || tech.blockedAt) : tech.blockedAt,
          isOnline: wasBlocked ? false : (tech.isOnline ?? primary[idx].isOnline),
        };
      } else {
        primary.unshift(tech);
      }
      localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(primary));

      // Also update pending list
      const pending: TechnicianProfile[] = JSON.parse(localStorage.getItem(KEYS.PENDING_APPLICATIONS) || '[]');
      const pIdx = pending.findIndex((p) => p.id === tech.id || p.userId === tech.userId || (p.technicianCode && tech.technicianCode && p.technicianCode.toLowerCase() === tech.technicianCode.toLowerCase()));
      if (pIdx >= 0) {
        const wasBlocked = pending[pIdx].isBlocked || pending[pIdx].status === 'blocked';
        if (wasBlocked) {
          pending[pIdx] = { ...pending[pIdx], ...tech, isBlocked: true, status: 'blocked', isApproved: false };
        } else if (tech.status === 'approved' || tech.isApproved) {
          pending[pIdx] = { ...pending[pIdx], ...tech, status: 'approved', isApproved: true };
        } else {
          pending[pIdx] = { ...pending[pIdx], ...tech };
        }
        localStorage.setItem(KEYS.PENDING_APPLICATIONS, JSON.stringify(pending));
      }

      // Update current logged-in user if this is their profile
      const currentUser = this.getCurrentUser();
      if (currentUser && (currentUser.id === tech.userId || currentUser.id === tech.id)) {
        const isApproved = tech.status === 'approved' || tech.isApproved;
        this.setCurrentUser({
          ...currentUser,
          role: isApproved ? 'technician' : currentUser.role,
          status: tech.status || (isApproved ? 'approved' : currentUser.status),
          isTechnicianRegistered: true,
          technicianId: tech.id,
        });
      }

      this.notify();
    } catch (err) {
      console.warn('syncTechnicianFromRemote warning:', err);
    }
  }

  // One-click Block / Blacklist or Unblock technician
  toggleTechnicianBlockStatus(
    technicianId: string,
    adminName: string = 'NeedFix Administrator',
    reason?: string
  ): TechnicianProfile | undefined {
    const technicians = this.getTechnicians();
    const tech = technicians.find(
      (t) =>
        t.id === technicianId ||
        t.userId === technicianId ||
        (t.technicianCode && t.technicianCode.toLowerCase() === technicianId.toLowerCase())
    );
    if (!tech) return undefined;

    const willBeBlocked = !tech.isBlocked;
    tech.isBlocked = willBeBlocked;
    if (willBeBlocked) {
      tech.blockedAt = new Date().toISOString();
      tech.blockedReason = reason || 'Your account/device has been blocked by Admin. Access denied until unblocked.';
      tech.isOnline = false;
      tech.status = 'blocked';
    } else {
      tech.blockedAt = undefined;
      tech.blockedReason = undefined;
      tech.status = 'approved';
    }

    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));

    // Update pending list as well
    try {
      const pending: TechnicianProfile[] = JSON.parse(localStorage.getItem(KEYS.PENDING_APPLICATIONS) || '[]');
      const pIdx = pending.findIndex((p) => p.id === tech.id || p.userId === tech.userId || p.technicianCode === tech.technicianCode);
      if (pIdx >= 0) {
        pending[pIdx] = {
          ...pending[pIdx],
          isBlocked: willBeBlocked,
          status: willBeBlocked ? 'blocked' : 'approved',
          blockedAt: tech.blockedAt,
          blockedReason: tech.blockedReason,
          isOnline: willBeBlocked ? false : pending[pIdx].isOnline,
        };
        localStorage.setItem(KEYS.PENDING_APPLICATIONS, JSON.stringify(pending));
      }
    } catch (e) {
      console.warn('Pending update note:', e);
    }

    // Universal Blacklist & Blocked Devices Sync
    if (willBeBlocked) {
      const blockRecord: BlockedDeviceRecord = {
        id: `block_${tech.id}_${Date.now()}`,
        deviceId: tech.deviceId || `DEV_${tech.id}`,
        ipAddress: tech.ipAddress || '127.0.0.1',
        targetType: 'technician',
        targetId: tech.id,
        uniqueId: tech.technicianCode || tech.id,
        targetName: tech.fullName || tech.companyName,
        targetPhone: tech.mobile,
        reason: tech.blockedReason || 'Blocked by NeedFix Admin Desk',
        blockedBy: adminName,
        blockedAt: tech.blockedAt || new Date().toISOString(),
      };
      this.addBlockedDevice(blockRecord);

      // Async backend sync
      fetch('/api/blocked-devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockRecord),
      }).catch(console.warn);
    } else {
      if (tech.technicianCode) {
        this.removeBlockedDevice(tech.technicianCode);
        fetch(`/api/blocked-devices/${tech.technicianCode}`, { method: 'DELETE' }).catch(console.warn);
      }
      this.removeBlockedDevice(tech.id);
      fetch(`/api/blocked-devices/${tech.id}`, { method: 'DELETE' }).catch(console.warn);
    }

    // Direct server-side API sync
    fetch(`/api/technicians/${tech.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isBlocked: willBeBlocked,
        status: willBeBlocked ? 'blocked' : 'approved',
        blockedAt: tech.blockedAt,
        blockedReason: tech.blockedReason,
        isOnline: willBeBlocked ? false : tech.isOnline,
      }),
    }).catch(console.warn);

    // Also update linked user profile
    if (tech.userId) {
      const user = this.getUserById(tech.userId);
      if (user) {
        user.isBlocked = willBeBlocked;
        (user as any).status = willBeBlocked ? 'blocked' : 'approved';
        this.updateUser(user);
        if (willBeBlocked) {
          const curr = this.getCurrentUser();
          if (curr && curr.id === tech.userId) {
            this.clearSession();
          }
        }
      }
    }

    // Audit log
    const auditLogs = this.getAuditLogs();
    const newLog: AdminAuditLog = {
      id: `audit_${Date.now()}`,
      adminName,
      technicianId: tech.id,
      technicianName: tech.fullName,
      action: willBeBlocked ? 'suspended' : 'reactivated',
      reason: willBeBlocked
        ? (reason || 'One-click Block / Blacklist applied by Admin')
        : 'Technician unblocked / reinstated by Admin',
      timestamp: new Date().toISOString(),
    };
    auditLogs.unshift(newLog);
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));

    this.notify();
    return tech;
  }

  updateTechnicianProfile(technician: TechnicianProfile) {
    const technicians = this.getTechnicians();
    const idx = technicians.findIndex((t) => t.id === technician.id);
    if (idx >= 0) {
      technicians[idx] = technician;
      localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));
      this.notify();
    }
  }

  updateTechnician(technician: TechnicianProfile) {
    this.updateTechnicianProfile(technician);
  }

  // --- LEADS & BOOKINGS ---
  getLeads(): ServiceLead[] {
    try {
      return JSON.parse(localStorage.getItem(KEYS.LEADS) || '[]');
    } catch {
      return [];
    }
  }

  getCustomerLeads(customerId: string): ServiceLead[] {
    return this.getLeads().filter((l) => l.customerId === customerId);
  }

  createLead(lead: Omit<ServiceLead, 'id' | 'createdAt' | 'status'>): ServiceLead {
    const leads = this.getLeads();
    const newLead: ServiceLead = {
      ...lead,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    leads.unshift(newLead);
    localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));

    // Increment technician booking count
    const tech = this.getTechnicianById(lead.technicianId);
    if (tech) {
      tech.totalBookings = (tech.totalBookings || 0) + 1;
      this.updateTechnicianProfile(tech);
    }

    this.logActivity({
      technicianId: lead.technicianId,
      customerId: lead.customerId,
      customerName: lead.customerName,
      customerPhone: lead.customerPhone,
      type: 'booking',
      metadata: { leadId: newLead.id, service: lead.serviceTitle },
    });

    this.notify();
    return newLead;
  }

  updateLeadStatus(leadId: string, status: ServiceLead['status']) {
    const leads = this.getLeads();
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      lead.status = status;
      localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
      this.notify();
    }
  }

  // --- REVIEWS ---
  getReviews(technicianId?: string): Review[] {
    try {
      const reviews: Review[] = JSON.parse(localStorage.getItem(KEYS.REVIEWS) || '[]');
      return technicianId ? reviews.filter((r) => r.technicianId === technicianId) : reviews;
    } catch {
      return [];
    }
  }

  addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const reviews: Review[] = JSON.parse(localStorage.getItem(KEYS.REVIEWS) || '[]');
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(newRev);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));

    // Recalculate average rating for technician
    const techReviews = reviews.filter((r) => r.technicianId === review.technicianId);
    const avgRating = techReviews.reduce((sum, r) => sum + r.rating, 0) / techReviews.length;
    const tech = this.getTechnicianById(review.technicianId);
    if (tech) {
      tech.rating = Math.round(avgRating * 10) / 10;
      tech.reviewCount = techReviews.length;
      this.updateTechnicianProfile(tech);
    }

    this.notify();
    return newRev;
  }

  replyToReview(reviewId: string, reply: string) {
    const reviews: Review[] = JSON.parse(localStorage.getItem(KEYS.REVIEWS) || '[]');
    const r = reviews.find((x) => x.id === reviewId);
    if (r) {
      r.technicianReply = reply;
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
      this.notify();
    }
  }

  // --- ACTIVITY LOGGING (Call, WhatsApp, View) ---
  logActivity(data: Omit<ActivityLog, 'id' | 'timestamp'>) {
    try {
      const logs: ActivityLog[] = JSON.parse(localStorage.getItem(KEYS.ACTIVITY_LOGS) || '[]');
      const newLog: ActivityLog = {
        ...data,
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      logs.unshift(newLog);
      localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 300)));

      // Sync to backend API
      try {
        fetch('/api/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLog),
        }).catch(() => {});
      } catch {
        // ignore fetch failures
      }

      // Update technician counters
      const tech = this.getTechnicianById(data.technicianId);
      if (tech) {
        if (data.type === 'call') tech.totalCalls = (tech.totalCalls || 0) + 1;
        if (data.type === 'whatsapp') tech.totalWhatsAppClicks = (tech.totalWhatsAppClicks || 0) + 1;
        if (data.type === 'view') tech.profileViews = (tech.profileViews || 0) + 1;
        this.updateTechnicianProfile(tech);
      }
      this.notify();
    } catch {
      // ignore
    }
  }

  getActivityLogs(technicianId?: string): ActivityLog[] {
    try {
      const logs: ActivityLog[] = JSON.parse(localStorage.getItem(KEYS.ACTIVITY_LOGS) || '[]');
      return technicianId ? logs.filter((l) => l.technicianId === technicianId) : logs;
    } catch {
      return [];
    }
  }

  async fetchRemoteActivityLogs(technicianId?: string): Promise<ActivityLog[]> {
    try {
      const url = technicianId ? `/api/activity-logs?technicianId=${encodeURIComponent(technicianId)}` : '/api/activity-logs';
      const res = await fetch(url);
      if (res.ok) {
        const remoteLogs: ActivityLog[] = await res.json();
        if (Array.isArray(remoteLogs) && remoteLogs.length > 0) {
          const localLogs: ActivityLog[] = JSON.parse(localStorage.getItem(KEYS.ACTIVITY_LOGS) || '[]');
          const map = new Map<string, ActivityLog>();
          remoteLogs.forEach((l) => map.set(l.id, l));
          localLogs.forEach((l) => map.set(l.id, l));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify(merged.slice(0, 300)));
          this.notify();
          return technicianId ? merged.filter((l) => l.technicianId === technicianId) : merged;
        }
      }
    } catch (e) {
      console.warn('Error fetching remote activity logs:', e);
    }
    return this.getActivityLogs(technicianId);
  }

  getAuditLogs(): AdminAuditLog[] {
    try {
      return JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
    } catch {
      return [];
    }
  }

  addAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): void {
    try {
      const auditLogs = this.getAuditLogs();
      const newLog: AdminAuditLog = {
        ...log,
        id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
      };
      auditLogs.unshift(newLog);
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(auditLogs.slice(0, 200)));
      this.notify();
    } catch (e) {
      console.warn('Error adding audit log:', e);
    }
  }

  // --- FAVORITES ---
  getFavorites(): string[] {
    try {
      return JSON.parse(localStorage.getItem(KEYS.FAVORITES) || '[]');
    } catch {
      return [];
    }
  }

  toggleFavorite(technicianId: string): boolean {
    const favs = this.getFavorites();
    const idx = favs.indexOf(technicianId);
    let isFav = false;
    if (idx >= 0) {
      favs.splice(idx, 1);
      isFav = false;
    } else {
      favs.push(technicianId);
      isFav = true;
    }
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
    this.notify();
    return isFav;
  }

  // --- RESET DATA ---
  resetToDefaults() {
    localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify([]));
    localStorage.setItem(KEYS.LEADS, JSON.stringify([]));
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify([]));
    localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
    localStorage.removeItem(KEYS.CURRENT_USER);
    this.notify();
  }

  // --- GUEST LOCATION PERSISTENCE ---
  getGuestLocation(): UserLocation | null {
    const raw = localStorage.getItem('needfix_guest_location');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setGuestLocation(loc: UserLocation): void {
    localStorage.setItem('needfix_guest_location', JSON.stringify(loc));
    this.notify();
  }

  // --- CUSTOMER TRACKING STORAGE ---
  getCustomers(): CustomerRecord[] {
    try {
      const raw = localStorage.getItem(KEYS.CUSTOMERS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveCustomer(customer: CustomerRecord): void {
    try {
      const list = this.getCustomers();
      const idx = list.findIndex(
        (c) => c.customerId === customer.customerId || c.id === customer.id || (c.deviceId && c.deviceId === customer.deviceId)
      );
      if (idx >= 0) {
        list[idx] = {
          ...list[idx],
          ...customer,
          lastSeenAt: new Date().toISOString(),
        };
      } else {
        list.unshift(customer);
      }
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(list.slice(0, 500)));
      this.notify();
    } catch (e) {
      console.warn('Error saving customer:', e);
    }
  }

  setCustomers(customers: CustomerRecord[]): void {
    try {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
      this.notify();
    } catch (e) {
      console.warn('Error setting customers:', e);
    }
  }

  updateCustomerBlockStatus(
    customerId: string,
    isBlocked: boolean,
    reason?: string,
    blockedBy?: string
  ): CustomerRecord | undefined {
    try {
      const list = this.getCustomers();
      const target = list.find((c) => c.customerId === customerId || c.id === customerId);
      if (target) {
        target.isBlocked = isBlocked;
        target.blockedReason = isBlocked ? reason : undefined;
        target.blockedAt = isBlocked ? new Date().toISOString() : undefined;
        target.blockedBy = isBlocked ? blockedBy : undefined;
        localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(list));
        this.notify();
        return target;
      }
    } catch (e) {
      console.warn('Error updating customer block status:', e);
    }
    return undefined;
  }

  // --- BLOCKED DEVICES & IPS STORAGE ---
  getBlockedDevices(): BlockedDeviceRecord[] {
    try {
      const raw = localStorage.getItem(KEYS.BLOCKED_DEVICES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  setBlockedDevices(records: BlockedDeviceRecord[]): void {
    try {
      localStorage.setItem(KEYS.BLOCKED_DEVICES, JSON.stringify(records));
      this.notify();
    } catch (e) {
      console.warn('Error setting blocked devices:', e);
    }
  }

  addBlockedDevice(record: BlockedDeviceRecord, silent = false): void {
    try {
      const list = this.getBlockedDevices();
      const filtered = list.filter(
        (b) =>
          b.uniqueId !== record.uniqueId &&
          b.deviceId !== record.deviceId &&
          (!b.ipAddress || b.ipAddress !== record.ipAddress)
      );
      filtered.unshift(record);
      localStorage.setItem(KEYS.BLOCKED_DEVICES, JSON.stringify(filtered));
      if (!silent) {
        this.notify();
      }
    } catch (e) {
      console.warn('Error adding blocked device:', e);
    }
  }

  removeBlockedDevice(uniqueIdOrDeviceIdOrIp: string): void {
    try {
      const list = this.getBlockedDevices();
      const filtered = list.filter(
        (b) =>
          b.uniqueId !== uniqueIdOrDeviceIdOrIp &&
          b.deviceId !== uniqueIdOrDeviceIdOrIp &&
          b.ipAddress !== uniqueIdOrDeviceIdOrIp &&
          b.id !== uniqueIdOrDeviceIdOrIp
      );
      localStorage.setItem(KEYS.BLOCKED_DEVICES, JSON.stringify(filtered));
      this.notify();
    } catch (e) {
      console.warn('Error removing blocked device:', e);
    }
  }

  isDeviceOrIpBlocked(deviceId: string, ipAddress: string): BlockedDeviceRecord | null {
    try {
      const list = this.getBlockedDevices();
      const match = list.find((b) => {
        if (deviceId && b.deviceId && b.deviceId === deviceId) return true;
        if (ipAddress && b.ipAddress && b.ipAddress !== '127.0.0.1' && b.ipAddress === ipAddress) return true;
        return false;
      });
      return match || null;
    } catch {
      return null;
    }
  }

  // --- PASSWORD RESET REQUESTS (Admin Contact Option) ---
  getPasswordResetRequests(): PasswordResetRequest[] {
    try {
      const raw = localStorage.getItem(KEYS.PASSWORD_RESET_REQUESTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  addPasswordResetRequest(req: Omit<PasswordResetRequest, 'id' | 'requestedAt' | 'status'>): PasswordResetRequest {
    const list = this.getPasswordResetRequests();
    const newReq: PasswordResetRequest = {
      ...req,
      id: `reset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    list.unshift(newReq);
    localStorage.setItem(KEYS.PASSWORD_RESET_REQUESTS, JSON.stringify(list.slice(0, 100)));
    this.notify();
    return newReq;
  }

  resolvePasswordResetRequest(
    id: string,
    temporaryPassword: string,
    resolvedBy: string,
    adminNotes?: string
  ): boolean {
    const list = this.getPasswordResetRequests();
    const target = list.find((r) => r.id === id);
    if (!target) return false;

    target.status = 'resolved';
    target.resolvedAt = new Date().toISOString();
    target.resolvedBy = resolvedBy;
    target.temporaryPassword = temporaryPassword;
    target.adminNotes = adminNotes;

    // Also update user's password
    const user = this.getUserByUsername(target.username) || this.getUserByAccountIdentifier(target.username);
    if (user) {
      user.passwordHash = temporaryPassword; // In our client-side hashing service
      this.updateUser(user);
    }

    localStorage.setItem(KEYS.PASSWORD_RESET_REQUESTS, JSON.stringify(list));
    this.notify();
    return true;
  }
}

export const storageService = new StorageService();
