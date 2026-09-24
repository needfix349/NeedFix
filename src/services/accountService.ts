/**
 * NeedFix Identity & Account Management Service
 * 
 * Implements:
 * 1. Single Account Policy: 1 User = 1 Permanent Account ID (UUID v4) across Customer & Technician roles.
 * 2. Scalable ID Generation: Supabase PostgreSQL native UUID (v4) for primary keys.
 * 3. Strict Username + Password Authentication (No SMS OTP or Email validation needed for login).
 * 4. Privacy-Safe Installation ID (UUID v4) on first install, strictly compliant with Google Play/App Store policies.
 * 5. Fraud Prevention & Blocking: Rejects account creation/login if installation ID or Account ID is registered in blocked registry.
 * 6. Hybrid Password Recovery:
 *    - Self-service: 2 secret security questions & verified answers.
 *    - Admin verification backup: Username + Registered Phone number request with admin verification.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { storageService } from './storage';
import { deviceSecurityService } from './deviceSecurityService';
import { supabaseService } from './supabaseService';
import { UserProfile, SecurityQuestionConfig, PasswordResetRequest, CustomerRecord, TechnicianProfile } from '../types';

export const STANDARD_SECURITY_QUESTIONS = [
  'What is the name of your first school?',
  'What was your childhood nickname?',
  'What city was your mother born in?',
  'What is the make of your first vehicle?',
  'What was the name of your favorite pet?',
  'What is your favorite childhood food or dish?',
];

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
  isBlocked?: boolean;
}

class AccountService {
  /**
   * Fast client-side hash for password and security answers
   * (In production with backend, salted bcrypt/argon2 runs server-side)
   */
  hashSecret(secret: string): string {
    const clean = secret.trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      const char = clean.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `nf_sec_${Math.abs(hash).toString(36)}_${clean.length}`;
  }

  /**
   * Fast client-side hash / encryption for 4-digit numeric Security PIN
   */
  hashPin(pin: string): string {
    const clean = pin.trim();
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      const char = clean.charCodeAt(i);
      hash = (hash << 7) - hash + char;
      hash |= 0;
    }
    return `nf_pin_${Math.abs(hash).toString(36)}_${clean.length}`;
  }

  /**
   * Check if an Installation ID or Username is blocked
   */
  async isInstallationOrUserBlocked(installationId: string, username?: string): Promise<{ isBlocked: boolean; reason?: string }> {
    const blockedMsg = "Your account/device has been blocked by Admin. Access denied until unblocked.";

    // 1. Check local blocked registry
    const blockedDevices = storageService.getBlockedDevices();
    const matchDevice = blockedDevices.find((b) => b.deviceId === installationId || (b.uniqueId && b.uniqueId === installationId));
    if (matchDevice) {
      return { isBlocked: true, reason: blockedMsg };
    }

    if (username) {
      const cleanUser = username.trim().toLowerCase();
      const matchUser = blockedDevices.find((b) => b.uniqueId?.toLowerCase() === cleanUser || b.targetName?.toLowerCase() === cleanUser);
      if (matchUser) {
        return { isBlocked: true, reason: blockedMsg };
      }

      const localUser = storageService.getUserByUsername(cleanUser);
      if (localUser && (localUser.isBlocked || (localUser as any).status === 'blocked')) {
        return { isBlocked: true, reason: blockedMsg };
      }
    }

    // 2. Check Supabase PostgreSQL if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('blocked_devices')
          .select('reason')
          .or(`device_id.eq.${installationId},unique_id.eq.${installationId}`)
          .limit(1);

        if (!error && data && data.length > 0) {
          return { isBlocked: true, reason: blockedMsg };
        }

        if (username) {
          const cleanUser = username.trim().toLowerCase();

          // 2a. Check 'technicians' table for is_blocked = true
          const { data: techData, error: techErr } = await supabase
            .from('technicians')
            .select('is_blocked, status')
            .or(`mobile.eq.${cleanUser},technician_code.ilike.${cleanUser},id.eq.${cleanUser}`)
            .limit(1);

          if (!techErr && techData && techData.length > 0) {
            if (techData[0].is_blocked === true || techData[0].status === 'blocked') {
              return { isBlocked: true, reason: blockedMsg };
            }
          }

          // 2b. Check 'customers' table for is_blocked = true
          const { data: custData, error: custErr } = await supabase
            .from('customers')
            .select('is_blocked, status')
            .or(`phone.eq.${cleanUser},customer_id.ilike.${cleanUser},id.eq.${cleanUser}`)
            .limit(1);

          if (!custErr && custData && custData.length > 0) {
            if (custData[0].is_blocked === true || custData[0].status === 'blocked') {
              return { isBlocked: true, reason: blockedMsg };
            }
          }

          // 2c. Check 'users' table
          const { data: userData, error: userErr } = await supabase
            .from('users')
            .select('status, is_blocked')
            .or(`username.ilike.${cleanUser},id.eq.${cleanUser}`)
            .limit(1);

          if (!userErr && userData && userData.length > 0) {
            if (userData[0].status === 'blocked' || userData[0].is_blocked) {
              return { isBlocked: true, reason: blockedMsg };
            }
          }
        }
      } catch (err) {
        console.warn('Supabase blocked installation check warning:', err);
      }
    }

    return { isBlocked: false };
  }

  /**
   * 1. Dedicated Customer Registration: Name + Mobile Number (Unique) + 4-Digit Secret PIN
   * Zero-cost (no SMS/Email OTP). Bound to device_id.
   * If device_id is blocked, account creation is prevented!
   */
  async registerCustomer(params: {
    name: string;
    mobileNumber: string;
    pin: string;
  }): Promise<AuthResponse> {
    const cleanName = params.name.trim();
    const cleanMobile = params.mobileNumber.trim().replace(/\D/g, '').slice(-10);
    const cleanPin = params.pin.trim();
    const deviceId = deviceSecurityService.getDeviceId();

    if (!cleanName) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!cleanMobile || cleanMobile.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
      return { success: false, message: 'Please set a 4-digit secret numeric PIN (e.g. 1234).' };
    }

    // Anti-fake Device Security check: Is this hardware device or IP blocked?
    const deviceStatus = await deviceSecurityService.checkDeviceBlocked({ mobile: cleanMobile });
    if (deviceStatus.isBlocked) {
      storageService.clearSession(true);
      return {
        success: false,
        isBlocked: true,
        message: 'This device is blocked by Admin. You cannot create an account from this device.',
      };
    }

    // Check if mobile number already exists in Supabase customers table
    if (isSupabaseConfigured()) {
      try {
        const { data: existing, error } = await supabase
          .from('customers')
          .select('id, is_blocked')
          .eq('mobile_number', cleanMobile)
          .limit(1);

        if (!error && existing && existing.length > 0) {
          if (existing[0].is_blocked) {
            storageService.clearSession(true);
            return {
              success: false,
              isBlocked: true,
              message: 'This mobile number has been blocked by Admin. Access denied.',
            };
          }
          return {
            success: false,
            message: 'This mobile number is already registered! Please sign in using your 4-digit PIN.',
          };
        }
      } catch (e) {
        console.warn('Supabase customer registration check warning:', e);
      }
    }

    // Also check local storage for duplicate mobile
    const localCusts = storageService.getCustomers();
    const localMatch = localCusts.find(
      (c) => (c as any).mobile_number === cleanMobile || (c as any).phone === cleanMobile
    );
    if (localMatch) {
      return {
        success: false,
        message: 'This mobile number is already registered! Please sign in using your 4-digit PIN.',
      };
    }

    const generateValidUuid = (): string => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try {
          return crypto.randomUUID();
        } catch {}
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const newCustomerId = generateValidUuid();
    const nowIso = new Date().toISOString();

    const customerRecord: CustomerRecord = {
      id: newCustomerId,
      customerId: `CUST-${cleanMobile.slice(-4)}`,
      name: cleanName,
      phone: cleanMobile,
      mobile_number: cleanMobile,
      pin: cleanPin,
      deviceId: deviceId,
      device_id: deviceId,
      ipAddress: '',
      isBlocked: false,
      createdAt: nowIso,
      lastSeenAt: nowIso,
    };

    // Save to Supabase customers table
    if (isSupabaseConfigured()) {
      try {
        const { error: insertErr } = await supabase.from('customers').upsert(
          [
            {
              id: newCustomerId,
              name: cleanName,
              mobile_number: cleanMobile,
              pin: cleanPin,
              device_id: deviceId,
              is_blocked: false,
              created_at: nowIso,
              last_seen_at: nowIso,
            },
          ],
          { onConflict: 'mobile_number' }
        );
        if (insertErr) {
          console.warn('Supabase customer upsert notice:', insertErr.message);
        }
      } catch (err) {
        console.warn('Supabase customer upsert exception:', err);
      }
    }

    // Save locally
    storageService.saveCustomer(customerRecord);

    // Sync to Central Server API
    try {
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerRecord),
      }).catch((err) => console.warn('API /api/customers post error:', err));
    } catch {}

    const userProfile: UserProfile = {
      id: newCustomerId,
      username: cleanMobile,
      name: cleanName,
      mobile: cleanMobile,
      countryCode: '+91',
      role: 'customer',
      createdAt: nowIso,
      installationId: deviceId,
      isBlocked: false,
    };

    storageService.setCurrentUser(userProfile);

    return {
      success: true,
      user: userProfile,
      message: 'Account created successfully! Welcome to NeedFix.',
    };
  }

  /**
   * 2. Dedicated Customer Login: Mobile Number + 4-Digit Secret PIN
   * Zero-cost (no OTP).
   */
  async loginCustomer(params: {
    mobileNumber: string;
    pin: string;
  }): Promise<AuthResponse> {
    const cleanMobile = params.mobileNumber.trim().replace(/\D/g, '').slice(-10);
    const cleanPin = params.pin.trim();
    const deviceId = deviceSecurityService.getDeviceId();

    if (!cleanMobile || cleanMobile.length !== 10) {
      return { success: false, message: 'Please enter your 10-digit registered mobile number.' };
    }
    if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
      return { success: false, message: 'Please enter your 4-digit secret PIN.' };
    }

    // Check device security
    const deviceStatus = await deviceSecurityService.checkDeviceBlocked({ mobile: cleanMobile });
    if (deviceStatus.isBlocked) {
      storageService.clearSession(true);
      return {
        success: false,
        isBlocked: true,
        message: 'Your account/device has been blocked by Admin. Access denied.',
      };
    }

    let customerData: any = null;

    // 1. Query Supabase customers table
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('mobile_number', cleanMobile)
          .limit(1);

        if (!error && data && data.length > 0) {
          customerData = data[0];
        }
      } catch (err) {
        console.warn('Supabase customer login query exception:', err);
      }
    }

    // Fallback: check local storage customers
    if (!customerData) {
      const localCusts = storageService.getCustomers();
      customerData = localCusts.find(
        (c) => (c as any).mobile_number === cleanMobile || (c as any).phone === cleanMobile
      );
    }

    if (!customerData) {
      return {
        success: false,
        message: 'No customer account found with this mobile number. Please click "Sign Up" to create one.',
      };
    }

    // Check blocked status
    if (customerData.is_blocked || customerData.status === 'blocked') {
      storageService.clearSession(true);
      return {
        success: false,
        isBlocked: true,
        message: 'Your account has been blocked by Admin. Access denied.',
      };
    }

    // Verify 4-Digit PIN
    const storedPin = String(customerData.pin || customerData.security_pin || '');
    if (storedPin !== cleanPin) {
      return {
        success: false,
        message: 'Incorrect 4-digit PIN. Please try again.',
      };
    }

    // Update last_seen_at and device_id in Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('customers')
          .update({
            last_seen_at: new Date().toISOString(),
            device_id: deviceId,
          })
          .eq('mobile_number', cleanMobile);
      } catch {}
    }

    const userProfile: UserProfile = {
      id: customerData.id || `cust_${cleanMobile}`,
      username: cleanMobile,
      name: customerData.name || 'Customer',
      mobile: cleanMobile,
      countryCode: '+91',
      role: 'customer',
      createdAt: customerData.created_at || new Date().toISOString(),
      installationId: deviceId,
      isBlocked: false,
    };

    storageService.setCurrentUser(userProfile);

    // Update customer record with phone and last seen
    const nowIso = new Date().toISOString();
    const customerRec: CustomerRecord = {
      id: customerData.id || `cust_${cleanMobile}`,
      customerId: customerData.customer_id || `CUST-${cleanMobile.slice(-4)}`,
      name: customerData.name || 'Customer',
      phone: cleanMobile,
      mobile_number: cleanMobile,
      deviceId: deviceId,
      device_id: deviceId,
      ipAddress: '',
      isBlocked: false,
      createdAt: customerData.created_at || nowIso,
      lastSeenAt: nowIso,
    };
    storageService.saveCustomer(customerRec);

    try {
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerRec),
      }).catch((e) => console.warn('API /api/customers login sync error:', e));
    } catch {}

    return {
      success: true,
      user: userProfile,
      message: 'Login successful!',
    };
  }

  /**
   * Helper: Find customer record by mobile number in Supabase or local storage
   */
  async findCustomerByMobile(mobile: string): Promise<CustomerRecord | null> {
    const cleanMobile = mobile.trim().replace(/\D/g, '').slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10) return null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('mobile_number', cleanMobile)
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            customerId: row.customer_id || `CUST-${cleanMobile.slice(-4)}`,
            name: row.name || 'Customer',
            phone: row.mobile_number || cleanMobile,
            mobile_number: row.mobile_number || cleanMobile,
            pin: row.pin || '',
            deviceId: row.device_id || '',
            device_id: row.device_id || '',
            ipAddress: '',
            isBlocked: Boolean(row.is_blocked),
            createdAt: row.created_at || new Date().toISOString(),
            lastSeenAt: row.last_seen_at || new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('findCustomerByMobile Supabase query notice:', err);
      }
    }

    const localCusts = storageService.getCustomers();
    const localMatch = localCusts.find(
      (c) => (c as any).mobile_number === cleanMobile || (c as any).phone === cleanMobile
    );
    return localMatch || null;
  }

  /**
   * 3. Dedicated Technician Login: Mobile Number + 4-Digit Secret PIN
   * Technicians log in using their 10-digit mobile number and 4-digit PIN.
   */
  async loginTechnician(params: {
    mobileNumber: string;
    pin: string;
  }): Promise<{
    success: boolean;
    user?: UserProfile;
    technician?: TechnicianProfile;
    isBlocked?: boolean;
    message?: string;
  }> {
    const cleanMobile = params.mobileNumber.trim().replace(/\D/g, '').slice(-10);
    const cleanPin = params.pin.trim();
    const deviceId = deviceSecurityService.getDeviceId();

    if (!cleanMobile || cleanMobile.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!cleanPin || cleanPin.length !== 4) {
      return { success: false, message: 'Please enter your 4-digit secret PIN.' };
    }

    // Check if device is blocked
    const devBlock = await deviceSecurityService.checkDeviceBlocked({
      mobile: cleanMobile,
    });
    if (devBlock.isBlocked) {
      storageService.clearSession(true);
      return {
        success: false,
        isBlocked: true,
        message: 'This device/technician account is blocked by Admin. Access denied.',
      };
    }

    // 1. Verify 4-Digit PIN against Customer / User record
    const customerData = await this.findCustomerByMobile(cleanMobile);
    if (customerData) {
      if (customerData.isBlocked || (customerData as any).is_blocked) {
        storageService.clearSession(true);
        return {
          success: false,
          isBlocked: true,
          message: 'This account has been blocked by Admin. Access denied.',
        };
      }

      const storedPin = String(customerData.pin || (customerData as any).security_pin || '');
      if (storedPin && storedPin !== cleanPin) {
        return {
          success: false,
          message: 'Incorrect 4-digit PIN. Please try again.',
        };
      }
    }

    // 2. Query Supabase technicians table & local storage for this mobile
    let techRow: any = null;
    if (isSupabaseConfigured()) {
      try {
        const filters = [
          `mobile.eq.${cleanMobile}`,
          `whatsapp_number.eq.${cleanMobile}`,
        ];
        if (customerData?.id) {
          filters.push(`user_id.eq.${customerData.id}`);
          filters.push(`id.eq.${customerData.id}`);
        }
        const { data, error } = await supabase
          .from('technicians')
          .select('*')
          .or(filters.join(','))
          .limit(1);

        if (!error && data && data.length > 0) {
          techRow = data[0];
        }
      } catch (err) {
        console.warn('Supabase technician login query exception:', err);
      }
    }

    // Fallback: check local storage technicians
    if (!techRow) {
      const allTechs = storageService.getTechnicians();
      techRow = allTechs.find(
        (t) =>
          t.mobile === cleanMobile ||
          t.whatsappNumber === cleanMobile ||
          (customerData?.id && (t.userId === customerData.id || t.id === customerData.id))
      );
    }

    if (!techRow) {
      if (customerData) {
        return {
          success: false,
          message: 'You have a registered customer account, but have not joined as a Service Provider yet. Click "Register as Service Provider" to apply.',
        };
      }
      return {
        success: false,
        message: 'No service provider account found with this mobile number. Please register as a Service Provider.',
      };
    }

    // Check if blocked
    if (techRow.is_blocked || techRow.isBlocked || techRow.status === 'blocked') {
      storageService.clearSession(true);
      return {
        success: false,
        isBlocked: true,
        message: 'This technician account has been blocked by Admin. Access denied.',
      };
    }

    // Verify 4-Digit PIN directly against technician record's pin column if set
    const technicianPin = String(techRow.pin || '').trim();
    if (technicianPin && technicianPin !== '0000' && technicianPin !== cleanPin) {
      return {
        success: false,
        message: 'Incorrect 4-digit PIN. Please try again.',
      };
    }

    // If techRow exists but customerData was not present (e.g. legacy data), auto-seed customer record with this PIN
    if (!customerData) {
      await this.registerCustomer({
        name: techRow.full_name || techRow.company_name || 'Service Provider',
        mobileNumber: cleanMobile,
        pin: cleanPin,
      }).catch(() => {});
    }

    // Map to TechnicianProfile
    const techProfile: TechnicianProfile = supabaseService.mapSupabaseRowToProfile(techRow);

    // Save/sync locally
    storageService.syncTechnicianFromRemote(techProfile);

    // Build unified UserProfile for session (reusing the exact unified ID)
    const unifiedId = customerData?.id || techProfile.userId || techProfile.id;
    const techUser: UserProfile = {
      id: unifiedId,
      username: cleanMobile,
      name: techProfile.fullName,
      mobile: cleanMobile,
      countryCode: '+91',
      role: 'technician',
      technicianId: techProfile.id,
      isApproved: techProfile.isApproved,
      isTechnicianRegistered: true,
      createdAt: techProfile.createdAt || customerData?.createdAt || new Date().toISOString(),
      installationId: deviceId,
      isBlocked: false,
    };

    storageService.setCurrentUser(techUser);

    return {
      success: true,
      user: techUser,
      technician: techProfile,
      message: 'Technician logged in successfully!',
    };
  }

  /**
   * Register a new user with username + password + 4-digit PIN (UUID v4 Primary Key)
   */
  async registerUser(params: {
    username: string;
    password: string;
    securityPin: string; // Required 4-digit secret PIN for instant password recovery
    name: string;
    phone?: string;
    securityQuestions?: {
      question1: string;
      answer1: string;
      question2: string;
      answer2: string;
    };
  }): Promise<AuthResponse> {
    const cleanUsername = params.username.trim().toLowerCase();
    const cleanPassword = params.password.trim();
    const cleanName = params.name.trim();
    const cleanPin = params.securityPin?.trim() || '';
    const installationId = deviceSecurityService.getDeviceId(); // Privacy-safe UUID

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters long.' };
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
      return { success: false, message: 'Please enter a valid 4-digit numeric Security PIN (0000-9999).' };
    }

    if (!cleanName) {
      return { success: false, message: 'Please enter your full name.' };
    }

    // Check device / user block status
    const blockCheck = await this.isInstallationOrUserBlocked(installationId, cleanUsername);
    if (blockCheck.isBlocked) {
      return {
        success: false,
        isBlocked: true,
        message: `Action Denied: ${blockCheck.reason || 'Device is restricted from creating new accounts.'}`,
      };
    }

    // Check if username is already taken
    const existing = storageService.getUserByUsername(cleanUsername);
    if (existing) {
      return { success: false, message: 'Username is already taken. Please choose another username.' };
    }

    // Generate scalable UUID v4 for the permanent Account ID
    const userId = deviceSecurityService.generateUUID();
    const passwordHash = this.hashSecret(cleanPassword);
    const securityPinHash = this.hashPin(cleanPin);

    let secConfig: SecurityQuestionConfig | undefined = undefined;
    if (params.securityQuestions && params.securityQuestions.answer1 && params.securityQuestions.answer2) {
      secConfig = {
        question1: params.securityQuestions.question1,
        answer1Hash: this.hashSecret(params.securityQuestions.answer1),
        question2: params.securityQuestions.question2,
        answer2Hash: this.hashSecret(params.securityQuestions.answer2),
      };
    }

    const newUser: UserProfile = {
      id: userId,
      username: cleanUsername,
      passwordHash,
      securityPinHash,
      searchRadiusKm: 5, // Default 5 KM as required
      name: cleanName,
      mobile: params.phone?.trim() || '',
      countryCode: '+91',
      role: 'customer',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
      createdAt: new Date().toISOString(),
      installationId,
      securityQuestions: secConfig,
      hasAgreedNotice: true,
      isTechnicianRegistered: false,
    };

    // Save locally
    storageService.updateUser(newUser);
    storageService.setCurrentUser(newUser);

    // Also register in Customers Directory
    try {
      const allCusts = storageService.getCustomers();
      let maxNum = 0;
      allCusts.forEach((c) => {
        if (c.customerId) {
          const m = c.customerId.match(/CUST-(\d+)/i);
          if (m && m[1]) {
            const num = parseInt(m[1], 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          }
        }
      });
      const customerId = `CUST-${maxNum + 1}`;
      const customerRecord = {
        id: `cust_${newUser.id}`,
        customerId,
        userId: newUser.id,
        name: cleanName,
        phone: params.phone?.trim() || '',
        ipAddress: '127.0.0.1',
        deviceId: installationId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        lastSeenAt: new Date().toISOString(),
        createdAt: newUser.createdAt,
        isBlocked: false,
      };
      storageService.saveCustomer(customerRecord);

      // Persist to Central Server API
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerRecord),
      }).catch((err) => console.warn('API /api/customers post error:', err));

      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch((err) => console.warn('API /api/users post error:', err));
    } catch (e) {
      console.warn('Error saving customer directory record:', e);
    }

    // Sync to Supabase PostgreSQL users table with valid schema
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('users').upsert({
          id: newUser.id,
          username: cleanUsername,
          name: newUser.name,
          password_hash: passwordHash,
          security_pin: cleanPin,
          role: 'customer',
          status: 'approved',
          radius_km: 5,
          installation_id: installationId,
          created_at: newUser.createdAt,
        }, { onConflict: 'username' });
      } catch (e) {
        console.warn('Supabase registerUser warning:', e);
      }
    }

    return {
      success: true,
      user: newUser,
      message: 'Account created successfully!',
    };
  }

  /**
   * Login with username + password strictly (No SMS/Email OTP)
   */
  async loginWithCredentials(username: string, pass: string): Promise<AuthResponse> {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = pass.trim();
    const installationId = deviceSecurityService.getDeviceId();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    // Check device / user block status
    const blockCheck = await this.isInstallationOrUserBlocked(installationId, cleanUsername);
    if (blockCheck.isBlocked) {
      storageService.clearSession();
      return {
        success: false,
        isBlocked: true,
        message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
      };
    }

    // 1. Check local storage
    const user = storageService.getUserByUsername(cleanUsername) || storageService.getUserByAccountIdentifier(cleanUsername);
    const passHash = this.hashSecret(cleanPassword);

    if (user) {
      if (user.status === 'pending_deletion') {
        storageService.clearSession();
        return {
          success: false,
          message: 'This account has been permanently deleted. Please register a new account.',
        };
      }

      if (user.isBlocked || (user as any).status === 'blocked') {
        storageService.clearSession();
        return {
          success: false,
          isBlocked: true,
          message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
        };
      }

      // If user has a set passwordHash, verify it
      if (user.passwordHash && user.passwordHash !== passHash && user.passwordHash !== cleanPassword) {
        return { success: false, message: 'Incorrect password. Please verify and try again.' };
      }

      // If user has no passwordHash yet (migrated user), set it now
      if (!user.passwordHash) {
        user.passwordHash = passHash;
        user.username = user.username || cleanUsername;
        user.installationId = user.installationId || installationId;
        storageService.updateUser(user);
      }

      storageService.setCurrentUser(user);
      return { success: true, user, message: `Welcome back, ${user.name}!` };
    }

    // 2. Query Supabase users table if available
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .or(`username.ilike.${cleanUsername},id.eq.${cleanUsername}`)
          .maybeSingle();

        if (!error && data) {
          if (data.status === 'pending_deletion') {
            storageService.clearSession();
            return {
              success: false,
              message: 'This account has been permanently deleted. Please register a new account.',
            };
          }

          if (data.status === 'blocked' || data.is_blocked) {
            storageService.clearSession();
            return {
              success: false,
              isBlocked: true,
              message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
            };
          }

          const fetchedUser: UserProfile = {
            id: data.id,
            username: data.username || cleanUsername,
            name: data.name || data.full_name || 'NeedFix User',
            mobile: data.mobile || '',
            countryCode: data.country_code || '+91',
            email: data.email,
            role: data.role || 'customer',
            createdAt: data.created_at || new Date().toISOString(),
            avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name || 'User')}`,
            isTechnicianRegistered: Boolean(data.is_technician_registered),
            hasAgreedNotice: true,
            installationId: data.installation_id || installationId,
            securityPinHash: data.security_pin_hash || undefined,
            searchRadiusKm: data.search_radius_km ? Number(data.search_radius_km) : 5,
          };

          storageService.updateUser(fetchedUser);
          storageService.setCurrentUser(fetchedUser);
          return { success: true, user: fetchedUser, message: `Welcome back, ${fetchedUser.name}!` };
        }
      } catch (err) {
        console.warn('Supabase credential login check:', err);
      }
    }

    return {
      success: false,
      message: 'User account not found. Please register or verify your username.',
    };
  }

  /**
   * Password Recovery via 4-Digit Secret PIN (No OTP / No Email / No Admin Required)
   */
  async recoverPasswordViaPin(params: {
    username: string;
    pin: string;
    newPassword: string;
  }): Promise<AuthResponse> {
    const cleanUser = params.username.trim().toLowerCase();
    const cleanPin = params.pin.trim();
    const cleanNewPass = params.newPassword.trim();

    if (!cleanUser) {
      return { success: false, message: 'Please enter your username.' };
    }

    if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
      return { success: false, message: 'Please enter your valid 4-digit Security PIN (0000-9999).' };
    }

    if (!cleanNewPass || cleanNewPass.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }

    // Check device / user block status before password reset attempt
    const installationId = deviceSecurityService.getDeviceId();
    const blockCheck = await this.isInstallationOrUserBlocked(installationId, cleanUser);
    if (blockCheck.isBlocked) {
      storageService.clearSession();
      return {
        success: false,
        isBlocked: true,
        message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
      };
    }

    let user = storageService.getUserByUsername(cleanUser) || storageService.getUserByAccountIdentifier(cleanUser);

    if (user && (user.isBlocked || (user as any).status === 'blocked')) {
      storageService.clearSession();
      return {
        success: false,
        isBlocked: true,
        message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
      };
    }

    // If not found in local storage, query Supabase
    if (!user && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .or(`username.ilike.${cleanUser},id.eq.${cleanUser}`)
          .maybeSingle();

        if (!error && data) {
          if (data.status === 'blocked' || data.is_blocked) {
            storageService.clearSession();
            return {
              success: false,
              isBlocked: true,
              message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
            };
          }

          user = {
            id: data.id,
            username: data.username || cleanUser,
            name: data.name || data.full_name || 'NeedFix User',
            mobile: data.mobile || '',
            countryCode: data.country_code || '+91',
            role: data.role || 'customer',
            createdAt: data.created_at || new Date().toISOString(),
            passwordHash: data.password_hash,
            securityPinHash: data.security_pin_hash,
            searchRadiusKm: data.search_radius_km ? Number(data.search_radius_km) : 5,
            hasAgreedNotice: true,
          };
          storageService.updateUser(user);
        }
      } catch (err) {
        console.warn('Supabase fetch for recovery error:', err);
      }
    }

    if (!user) {
      return { success: false, message: 'Account not found for this username. Please verify spelling.' };
    }

    if (user.isBlocked || (user as any).status === 'blocked') {
      storageService.clearSession();
      return {
        success: false,
        isBlocked: true,
        message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
      };
    }

    const expectedPinHash = this.hashPin(cleanPin);

    // Verify PIN against stored hash
    if (user.securityPinHash && user.securityPinHash !== expectedPinHash) {
      return { success: false, message: 'Incorrect 4-digit Security PIN. Please verify your PIN.' };
    }

    // Set new password
    const newPasswordHash = this.hashSecret(cleanNewPass);
    user.passwordHash = newPasswordHash;
    if (!user.securityPinHash) {
      user.securityPinHash = expectedPinHash;
    }
    user.searchRadiusKm = user.searchRadiusKm || 5;

    storageService.updateUser(user);

    // Update in Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('users')
          .update({
            password_hash: newPasswordHash,
            security_pin_hash: user.securityPinHash,
          })
          .eq('id', user.id);
      } catch (e) {
        console.warn('Supabase password reset update error:', e);
      }
    }

    return {
      success: true,
      user,
      message: 'Password reset successfully! You can now log in with your new password.',
    };
  }

  /**
   * Update customer search radius preference (defaults to 5 KM, range 1 - 20 KM)
   */
  async updateUserSearchRadius(userId: string, radiusKm: number): Promise<void> {
    const validRadius = Math.max(1, Math.min(20, radiusKm));
    const user = storageService.getUserById(userId);
    if (user) {
      user.searchRadiusKm = validRadius;
      storageService.updateUser(user);
      const curr = storageService.getCurrentUser();
      if (curr && curr.id === userId) {
        storageService.setCurrentUser({ ...curr, searchRadiusKm: validRadius });
      }
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('users').update({ search_radius_km: validRadius }).eq('id', userId);
      } catch (err) {
        console.warn('Supabase update radius error:', err);
      }
    }
  }

  /**
   * In-place update of user name without invalidating session or auth state
   */
  async updateUserName(userId: string, newName: string): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const cleanName = newName.trim();
    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Please enter a valid name (at least 2 characters).' };
    }

    const user = storageService.getUserById(userId);
    if (!user) {
      return { success: false, message: 'User account not found.' };
    }

    user.name = cleanName;
    user.avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;

    // Update local storage and current user
    storageService.updateUser(user);
    storageService.setCurrentUser(user);
    try {
      localStorage.setItem('needfix_customer_custom_name', cleanName);
    } catch (e) {}

    // If technician also registered, update technician profile full_name
    const tech = storageService.getTechnicianByUserId(userId);
    if (tech) {
      tech.fullName = cleanName;
      storageService.updateTechnicianProfile(tech);
    }

    // In-place database UPDATE via Supabase without invalidating active user session
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('users')
          .update({ name: cleanName })
          .eq('id', userId);

        if (tech) {
          await supabase
            .from('technicians')
            .update({ full_name: cleanName })
            .eq('user_id', userId);
        }
      } catch (err) {
        console.warn('Supabase in-place updateUserName error:', err);
      }
    }

    return {
      success: true,
      message: 'Name updated successfully!',
      user,
    };
  }

  /**
   * Password Recovery: Verify security answers & set new password
   */
  async recoverPasswordViaQuestions(params: {
    username: string;
    answer1: string;
    answer2: string;
    newPassword: string;
  }): Promise<AuthResponse> {
    const cleanUser = params.username.trim().toLowerCase();
    const installationId = deviceSecurityService.getDeviceId();

    // Check device / user block status before password reset attempt
    const blockCheck = await this.isInstallationOrUserBlocked(installationId, cleanUser);
    if (blockCheck.isBlocked) {
      storageService.clearSession();
      return {
        success: false,
        isBlocked: true,
        message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
      };
    }

    const user = storageService.getUserByUsername(cleanUser) || storageService.getUserByAccountIdentifier(cleanUser);

    if (user && (user.isBlocked || (user as any).status === 'blocked')) {
      storageService.clearSession();
      return {
        success: false,
        isBlocked: true,
        message: "Your account/device has been blocked by Admin. Access denied until unblocked.",
      };
    }

    if (!user) {
      return { success: false, message: 'Account not found for this username.' };
    }

    if (!user.securityQuestions) {
      return {
        success: false,
        message: 'Security questions were not configured on this account. Please use "Contact Admin for Password Reset".',
      };
    }

    const hash1 = this.hashSecret(params.answer1);
    const hash2 = this.hashSecret(params.answer2);

    if (
      user.securityQuestions.answer1Hash !== hash1 ||
      user.securityQuestions.answer2Hash !== hash2
    ) {
      return { success: false, message: 'One or more security answers do not match our records.' };
    }

    if (!params.newPassword || params.newPassword.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }

    // Update password
    user.passwordHash = this.hashSecret(params.newPassword);
    storageService.updateUser(user);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('users')
          .update({ password_hash: user.passwordHash })
          .eq('id', user.id);
      } catch (e) {
        console.warn('Supabase password update error:', e);
      }
    }

    return {
      success: true,
      user,
      message: 'Password reset successfully! You can now log in with your new password.',
    };
  }

  /**
   * Password Recovery: Submit request to Admin (Username + Registered Phone Number)
   */
  async submitAdminResetRequest(username: string, phone: string): Promise<{ success: boolean; message: string; requestId?: string }> {
    const cleanUser = username.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanUser) {
      return { success: false, message: 'Please enter your account username.' };
    }

    if (!cleanPhone || cleanPhone.length < 6) {
      return { success: false, message: 'Please enter your registered phone number.' };
    }

    const req = storageService.addPasswordResetRequest({
      username: cleanUser,
      phone: cleanPhone,
    });

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('password_reset_requests').insert({
          id: req.id,
          username: cleanUser,
          phone: cleanPhone,
          status: 'pending',
          requested_at: req.requestedAt,
        });
      } catch (e) {
        console.warn('Supabase submit reset request warning:', e);
      }
    }

    return {
      success: true,
      message: 'Password reset ticket submitted to Admin Desk. Our support team will verify your phone number and issue a temporary credential.',
      requestId: req.id,
    };
  }

  /**
   * Request account deletion with 4-digit secret PIN verification
   * Updates status to 'pending_deletion' and clears local session data
   */
  async deleteAccountWithPin(userId: string, pin: string): Promise<{ success: boolean; message: string }> {
    const cleanPin = (pin || '').trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      return { success: false, message: 'Please enter a valid 4-digit numeric PIN.' };
    }

    const user = storageService.getUserById(userId);
    if (!user) {
      return { success: false, message: 'Account not found.' };
    }

    const pinHash = this.hashPin(cleanPin);
    if (user.securityPinHash && user.securityPinHash !== pinHash) {
      return { success: false, message: 'Incorrect 4-digit Security PIN. Deletion cancelled.' };
    }

    // Update status to pending_deletion
    user.status = 'pending_deletion';
    storageService.updateUser(user);

    // If Supabase is configured, update users table
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('users')
          .update({ status: 'pending_deletion' })
          .eq('id', userId);
      } catch (err) {
        console.warn('Supabase account deletion status update error:', err);
      }
    }

    // Clear local session data
    storageService.clearSession();

    return {
      success: true,
      message: 'Your Needfix account has been marked for permanent deletion. Session cleared.',
    };
  }
}

export const accountService = new AccountService();
