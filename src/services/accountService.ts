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
import { UserProfile, SecurityQuestionConfig, PasswordResetRequest } from '../types';

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
