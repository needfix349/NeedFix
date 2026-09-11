import {
  UserProfile,
  TechnicianProfile,
  ServiceLead,
  Review,
  AdminAuditLog,
  ActivityLog,
  ApplicationStatus,
  UserLocation,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TECHNICIANS,
  INITIAL_LEADS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
  ADMIN_PHONE_NUMBER,
} from '../data/mockData';

const STORAGE_VERSION = 'v8';
const KEYS = {
  VERSION: 'needfix_storage_ver_v8',
  CURRENT_USER: 'needfix_v8_current_user',
  USERS: 'needfix_v8_users',
  TECHNICIANS: 'needfix_v8_technicians',
  LEADS: 'needfix_v8_leads',
  REVIEWS: 'needfix_v8_reviews',
  AUDIT_LOGS: 'needfix_v8_audit_logs',
  ACTIVITY_LOGS: 'needfix_v8_activity_logs',
  FAVORITES: 'needfix_v8_favorites',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    const currentVer = localStorage.getItem(KEYS.VERSION);
    if (currentVer !== STORAGE_VERSION) {
      localStorage.setItem(KEYS.VERSION, STORAGE_VERSION);
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(INITIAL_TECHNICIANS));
      localStorage.setItem(KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
      return;
    }

    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(KEYS.TECHNICIANS)) {
      localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(INITIAL_TECHNICIANS));
    }
    if (!localStorage.getItem(KEYS.LEADS)) {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
    if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(KEYS.ACTIVITY_LOGS)) {
      localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.FAVORITES)) {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
    }

    // Default current user to first customer if not set
    if (!localStorage.getItem(KEYS.CURRENT_USER)) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
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
    if (!userId && !email) return false;
    if (userId && localStorage.getItem(`needfix_notice_agreed_${userId}`) === 'true') {
      return true;
    }
    if (email && localStorage.getItem(`needfix_notice_agreed_${email.toLowerCase()}`) === 'true') {
      return true;
    }
    const user = this.getUsers().find(
      (u) => (userId && u.id === userId) || (email && u.email?.toLowerCase() === email.toLowerCase())
    );
    return Boolean(user?.hasAgreedNotice);
  }

  setAgreedImportantNotice(userId: string, email?: string): void {
    const agreedAt = new Date().toISOString();
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
  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      // Also update in users list
      this.updateUser(user);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
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

  syncGoogleUser(googleUser: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role?: 'customer' | 'technician' | 'admin';
  }): UserProfile {
    const users = this.getUsers();
    let existing = users.find(
      (u) =>
        (googleUser.email && u.email?.toLowerCase() === googleUser.email.toLowerCase()) ||
        u.id === googleUser.uid
    );

    const hasAgreed = this.hasAgreedImportantNotice(googleUser.uid, googleUser.email);

    if (existing) {
      existing.name = googleUser.displayName || existing.name;
      existing.avatarUrl = googleUser.photoURL || existing.avatarUrl;
      if (googleUser.email && !existing.email) existing.email = googleUser.email;
      if (hasAgreed && !existing.hasAgreedNotice) {
        existing.hasAgreedNotice = true;
      }
      this.updateUser(existing);
      this.setCurrentUser(existing);
      return existing;
    }

    const isAdmin =
      googleUser.email.toLowerCase().includes('admin') ||
      googleUser.email.toLowerCase() === 'needfix349@gmail.com' ||
      googleUser.email === 'admin@needfix.in';

    const newUser: UserProfile = {
      id: googleUser.uid || `google_${Date.now()}`,
      name: googleUser.displayName || 'Google User',
      email: googleUser.email,
      mobile: '',
      countryCode: '+91',
      role: isAdmin ? 'admin' : (googleUser.role || 'customer'),
      avatarUrl:
        googleUser.photoURL ||
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

  // --- DEMO / BYPASS PROFILE HELPERS ---
  getDemoRoleUser(role: 'customer' | 'technician' | 'admin'): UserProfile {
    const users = this.getUsers();
    if (role === 'customer') {
      const cust = users.find((u) => u.role === 'customer') || INITIAL_USERS[0];
      return cust;
    }
    if (role === 'technician') {
      const techUser = users.find((u) => u.role === 'technician') || INITIAL_USERS[1];
      // Guarantee technician profile exists in technicians collection
      const technicians = this.getTechnicians();
      if (!technicians.some((t) => t.userId === techUser.id)) {
        technicians.unshift(INITIAL_TECHNICIANS[0]);
        localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));
      }
      return techUser;
    }
    // admin
    return users.find((u) => u.role === 'admin') || INITIAL_USERS[2];
  }

  loginAsDemoRole(role: 'customer' | 'technician' | 'admin'): UserProfile {
    const user = this.getDemoRoleUser(role);
    this.setCurrentUser(user);
    return user;
  }

  // --- TECHNICIANS ---
  getTechnicians(): TechnicianProfile[] {
    try {
      return JSON.parse(localStorage.getItem(KEYS.TECHNICIANS) || '[]');
    } catch {
      return [];
    }
  }

  // Auto-generate unique technician code e.g. NF-TECH-1007
  generateNextTechnicianCode(): string {
    const technicians = this.getTechnicians();
    let maxNumber = 1000;
    technicians.forEach((t) => {
      if (t.technicianCode) {
        const match = t.technicianCode.match(/NF-TECH-(\d+)/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    });
    return `NF-TECH-${maxNumber + 1}`;
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
      id: existingIndex >= 0 ? technicians[existingIndex].id : `tech_${Date.now()}`,
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

    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));

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
      tech.isVerified = true;
      tech.verifiedAt = new Date().toISOString();
      tech.isOnline = true;
      tech.rejectionReason = undefined;
      tech.suspensionReason = undefined;
    } else if (status === 'rejected') {
      tech.isVerified = false;
      tech.rejectionReason = reason || 'Documents or service information could not be verified.';
    } else if (status === 'suspended') {
      tech.isVerified = false;
      tech.isOnline = false;
      tech.suspensionReason = reason || 'Account temporarily suspended by platform compliance.';
    }

    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));

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

  // One-click Block / Blacklist or Unblock technician
  toggleTechnicianBlockStatus(
    technicianId: string,
    adminName: string = 'NeedFix Administrator',
    reason?: string
  ): TechnicianProfile | undefined {
    const technicians = this.getTechnicians();
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return undefined;

    const willBeBlocked = !tech.isBlocked;
    tech.isBlocked = willBeBlocked;
    if (willBeBlocked) {
      tech.blockedAt = new Date().toISOString();
      tech.blockedReason = reason || 'Blocked / Blacklisted by Admin moderation';
      tech.isOnline = false;
    } else {
      tech.blockedAt = undefined;
      tech.blockedReason = undefined;
    }

    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(technicians));

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
      localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 200)));

      // Update technician counters
      const tech = this.getTechnicianById(data.technicianId);
      if (tech) {
        if (data.type === 'call') tech.totalCalls = (tech.totalCalls || 0) + 1;
        if (data.type === 'whatsapp') tech.totalWhatsAppClicks = (tech.totalWhatsAppClicks || 0) + 1;
        if (data.type === 'view') tech.profileViews = (tech.profileViews || 0) + 1;
        this.updateTechnicianProfile(tech);
      }
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

  getAuditLogs(): AdminAuditLog[] {
    try {
      return JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
    } catch {
      return [];
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

  // --- RESET DEMO DATA ---
  resetToDefaults() {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(INITIAL_TECHNICIANS));
    localStorage.setItem(KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
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
}

export const storageService = new StorageService();
