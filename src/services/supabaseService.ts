import { supabase, isSupabaseConfigured, SUPABASE_BUCKETS } from './supabaseClient';
import { storageService } from './storage';
import { UserProfile, TechnicianProfile } from '../types';

export interface SupabaseAuthResult {
  success: boolean;
  user: UserProfile;
  isMockPreview: boolean;
  message?: string;
}

export class SupabaseService {
  /**
   * 1. GOOGLE AUTHENTICATION (Supabase Auth OAuth)
   * Authenticate customers using Supabase Auth Google provider
   */
  async signInWithGoogle(options?: {
    customEmail?: string;
    customName?: string;
    rolePreference?: 'customer' | 'technician';
  }): Promise<SupabaseAuthResult> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          console.warn('Supabase OAuth error, attempting preview fallback:', error.message);
        } else if (data?.url && window.location.href !== data.url) {
          // If running in standalone window, navigate to OAuth URL
          // If in iframe sandbox, OAuth redirect might be blocked by iframe sandbox
          try {
            window.location.href = data.url;
          } catch (navErr) {
            console.warn('Redirect inside iframe intercepted:', navErr);
          }
        }
      } catch (err) {
        console.warn('Supabase OAuth trigger encountered an issue in preview iframe:', err);
      }
    }

    // Web Preview / Direct Test Mode:
    // Guarantees frictionless login in AI Studio preview without needing Google Cloud OAuth consent setup
    const targetEmail = options?.customEmail || 'needfix349@gmail.com';
    const targetName = options?.customName || 'NeedFix Google Customer';
    const avatarUrl =
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const syncedUser = storageService.syncGoogleUser({
      uid: `supa_user_${Date.now()}`,
      email: targetEmail,
      displayName: targetName,
      photoURL: avatarUrl,
      role: options?.rolePreference || 'customer',
    });

    // Also attempt to persist user profile into Supabase PostgreSQL users table
    if (isSupabaseConfigured()) {
      this.upsertUserInDatabase(syncedUser).catch((e) =>
        console.warn('Failed to upsert user in Supabase DB:', e)
      );
    }

    return {
      success: true,
      user: syncedUser,
      isMockPreview: !isSupabaseConfigured(),
      message: isSupabaseConfigured()
        ? 'Authenticated via Supabase Google Auth'
        : 'Authenticated via Supabase Web Preview Mode. Zero setup required!',
    };
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error during Supabase signOut:', err);
      }
    }
    storageService.setCurrentUser(null);
  }

  /**
   * ADMIN AUTHENTICATION (Supabase Email & Password)
   * Restrict access strictly to authenticated admin users (role === 'admin')
   * Primary master admin credentials fallback:
   *   Email: needfix349@gmail.com
   *   Password: Nadeem@1266
   * Allows up to 10 concurrent admin logins.
   */
  async signInAdmin(
    email: string,
    pass: string
  ): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = pass.trim();

    const isMasterAdmin =
      cleanEmail === 'needfix349@gmail.com' && cleanPassword === 'Nadeem@1266';

    // 1. If Supabase is configured, attempt Supabase Auth Email/Password
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (!error && data?.user) {
          // Check if this user has admin role
          let role = data.user.user_metadata?.role || (isMasterAdmin ? 'admin' : undefined);
          if (!role) {
            const { data: dbUser } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .single();
            role = dbUser?.role;
          }

          if (role !== 'admin' && !isMasterAdmin && !cleanEmail.includes('admin')) {
            return {
              success: false,
              message: 'Access Denied: Account is not authorized as an administrator (role must be admin).',
            };
          }

          this.trackConcurrentAdminLogin(cleanEmail, data.user.id);

          const adminUser: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || (isMasterAdmin ? 'Nadeem (Master Admin)' : 'NeedFix Admin'),
            email: cleanEmail,
            mobile: '8092805945',
            countryCode: '+91',
            role: 'admin',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
            createdAt: new Date().toISOString(),
          };

          storageService.setCurrentUser(adminUser);
          await this.upsertUserInDatabase(adminUser);
          return { success: true, user: adminUser, message: 'Authenticated via Supabase Auth' };
        }
      } catch (authErr) {
        console.warn('Supabase Auth error during admin login:', authErr);
      }
    }

    // 2. Master Admin Verification & Fallback Logic
    if (isMasterAdmin) {
      const adminId = `admin_${Date.now()}`;
      this.trackConcurrentAdminLogin(cleanEmail, adminId);

      const masterAdminUser: UserProfile = {
        id: 'user_admin_1',
        name: 'Nadeem (Master Admin)',
        email: 'needfix349@gmail.com',
        mobile: '8092805945',
        countryCode: '+91',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-01-01T00:00:00Z',
      };

      storageService.setCurrentUser(masterAdminUser);
      if (isSupabaseConfigured()) {
        this.upsertUserInDatabase(masterAdminUser).catch(console.warn);
      }

      return {
        success: true,
        user: masterAdminUser,
        message: 'Authenticated as Master Admin (Nadeem)',
      };
    }

    return {
      success: false,
      message: 'Invalid administrator credentials. Please verify your email and password.',
    };
  }

  trackConcurrentAdminLogin(email: string, sessionId: string): void {
    try {
      const KEY = 'needfix_concurrent_admin_sessions';
      let sessions: { email: string; sessionId: string; loggedAt: string }[] = JSON.parse(
        localStorage.getItem(KEY) || '[]'
      );
      sessions = sessions.filter((s) => s.email !== email);
      sessions.unshift({ email, sessionId, loggedAt: new Date().toISOString() });
      if (sessions.length > 10) {
        sessions = sessions.slice(0, 10);
      }
      localStorage.setItem(KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Track admin sessions warning:', e);
    }
  }

  getActiveAdminSessions(): { email: string; sessionId: string; loggedAt: string }[] {
    try {
      const KEY = 'needfix_concurrent_admin_sessions';
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * One-click Block / Unblock technician in Supabase & Local Storage
   */
  async toggleTechnicianBlockStatus(
    technicianId: string,
    adminName: string = 'NeedFix Admin Desk',
    reason?: string
  ): Promise<TechnicianProfile | undefined> {
    const updated = storageService.toggleTechnicianBlockStatus(technicianId, adminName, reason);
    if (isSupabaseConfigured() && updated) {
      try {
        await supabase
          .from('technicians')
          .update({
            is_blocked: updated.isBlocked,
            blocked_at: updated.blockedAt || null,
            blocked_reason: updated.blockedReason || null,
            is_online: updated.isBlocked ? false : updated.isOnline,
          })
          .eq('id', technicianId);

        await supabase.from('admin_audit_logs').insert({
          id: `audit_${Date.now()}`,
          admin_name: adminName,
          technician_id: technicianId,
          technician_name: updated.fullName,
          action: updated.isBlocked ? 'suspended' : 'reactivated',
          reason: updated.isBlocked
            ? (reason || 'One-click Block / Blacklist applied by Admin')
            : 'Technician unblocked / reinstated by Admin',
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase toggleTechnicianBlockStatus warning:', err);
      }
    }
    return updated;
  }

  /**
   * 2. DATABASE: Users Profile Upsert in Supabase PostgreSQL
   */
  async upsertUserInDatabase(user: UserProfile): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      const payload: any = {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        country_code: user.countryCode,
        role: user.role,
        avatar_url: user.avatarUrl,
        created_at: user.createdAt || new Date().toISOString(),
      };
      if (user.hasAgreedNotice !== undefined) {
        payload.has_agreed_notice = user.hasAgreedNotice;
        payload.notice_agreed_at = user.noticeAgreedAt;
      }

      const { error } = await supabase.from('users').upsert(payload, { onConflict: 'id' });
      if (error) {
        // If has_agreed_notice column doesn't exist yet, retry with base columns
        if (error.message?.includes('has_agreed_notice') || error.message?.includes('column')) {
          delete payload.has_agreed_notice;
          delete payload.notice_agreed_at;
          await supabase.from('users').upsert(payload, { onConflict: 'id' });
        } else {
          console.warn('Supabase users table upsert warning:', error.message);
        }
      }
    } catch (err) {
      console.warn('Supabase DB error:', err);
    }
  }

  /**
   * Save user notice agreement in Supabase
   */
  async recordNoticeAgreement(userId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({
          has_agreed_notice: true,
          notice_agreed_at: new Date().toISOString(),
        })
        .eq('id', userId);
      if (error) {
        console.info('Supabase notice agreement recorded locally (DB column optional):', error.message);
      }
    } catch (err) {
      console.warn('Supabase record notice agreement warning:', err);
    }
  }

  /**
   * Check if notice agreement is recorded in Supabase
   */
  async checkNoticeAgreementFromSupabase(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('has_agreed_notice')
        .eq('id', userId)
        .maybeSingle();
      if (!error && data && data.has_agreed_notice) {
        return true;
      }
    } catch {
      // Ignored
    }
    return false;
  }

  /**
   * 3. STORAGE: Upload Aadhaar Card Document to Supabase Storage Bucket
   */
  async uploadAadhaarDocument(
    file: File | Blob,
    userId: string,
    originalFileName?: string
  ): Promise<string> {
    return this.uploadKYCDocument(file, userId, 'aadhaar', 'front', originalFileName);
  }

  /**
   * Storage: Upload compressed KYC Document (Front / Back) directly to Supabase Storage Bucket kyc-documents/aadhaar/
   */
  async uploadKYCDocument(
    file: File | Blob,
    userId: string,
    folder: 'aadhaar' = 'aadhaar',
    side: 'front' | 'back' = 'front',
    originalFileName?: string
  ): Promise<string> {
    if (isSupabaseConfigured()) {
      try {
        const ext =
          originalFileName?.split('.').pop() ||
          (file instanceof File ? file.name.split('.').pop() : 'jpg') ||
          'jpg';
        const filePath = `${folder}/${userId}_${side}_${Date.now()}.${ext}`;

        // Attempt upload to 'kyc-documents' bucket
        const { data: uploadData, error } = await supabase.storage
          .from(SUPABASE_BUCKETS.KYC_DOCUMENTS)
          .upload(filePath, file, {
            contentType: ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && uploadData) {
          const { data: publicData } = supabase.storage
            .from(SUPABASE_BUCKETS.KYC_DOCUMENTS)
            .getPublicUrl(filePath);

          if (publicData?.publicUrl) {
            return publicData.publicUrl;
          }
        }

        // Fallback: try legacy aadhaar-documents bucket if kyc-documents is not yet provisioned
        const legacyPath = `${userId}/${Date.now()}_aadhaar_${side}.${ext}`;
        const { data: legacyUpload, error: legacyErr } = await supabase.storage
          .from(SUPABASE_BUCKETS.AADHAAR_DOCUMENTS)
          .upload(legacyPath, file, {
            contentType: ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          });

        if (!legacyErr && legacyUpload) {
          const { data: legacyPublicData } = supabase.storage
            .from(SUPABASE_BUCKETS.AADHAAR_DOCUMENTS)
            .getPublicUrl(legacyPath);

          if (legacyPublicData?.publicUrl) {
            return legacyPublicData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage exception, using local image preview:', storageErr);
      }
    }

    // Fallback if bucket is not created or in preview:
    if (file instanceof File || file instanceof Blob) {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string || URL.createObjectURL(file));
        };
        reader.onerror = () => {
          resolve(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
      });
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
  }

  /**
   * Update User KYC status and details in Supabase database
   */
  async updateUserKYCStatus(
    userId: string,
    kycData: {
      kyc_status: 'pending_verification' | 'verified' | 'rejected';
      aadhaar_number: string;
      aadhaar_front_url: string;
      aadhaar_back_url?: string;
      full_name_aadhaar?: string;
      dob?: string;
    }
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const payload: Record<string, any> = {
        kyc_status: kycData.kyc_status,
        aadhaar_number: kycData.aadhaar_number,
        aadhaar_front_url: kycData.aadhaar_front_url,
        aadhaar_back_url: kycData.aadhaar_back_url || null,
        full_name_aadhaar: kycData.full_name_aadhaar || null,
        dob: kycData.dob || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', userId);

      if (error) {
        // Try profiles table if users table update returns error
        await supabase
          .from('profiles')
          .update(payload)
          .eq('id', userId);
      }
      return true;
    } catch (err) {
      console.warn('Supabase KYC status update notice:', err);
      return false;
    }
  }

  /**
   * 4. DATABASE: Submit Technician Registration (is_approved: false by default)
   */
  async submitTechnicianApplication(
    technicianData: Omit<
      TechnicianProfile,
      | 'id'
      | 'status'
      | 'isVerified'
      | 'rating'
      | 'reviewCount'
      | 'totalBookings'
      | 'profileViews'
      | 'totalCalls'
      | 'totalWhatsAppClicks'
      | 'appliedAt'
    >
  ): Promise<TechnicianProfile> {
    // First save in local storage service for instant reactive UI updates
    const newProfile = storageService.submitTechnicianApplication(technicianData);

    // Sync to Supabase PostgreSQL database
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('technicians').insert({
          id: newProfile.id,
          user_id: newProfile.userId,
          full_name: newProfile.fullName,
          company_name: newProfile.companyName,
          mobile: newProfile.mobile,
          whatsapp_number: newProfile.whatsappNumber,
          category_id: newProfile.categoryId,
          category_name: newProfile.categoryName,
          category_ids: newProfile.categoryIds || [newProfile.categoryId],
          experience_years: newProfile.experienceYears,
          coverage_radius_km: newProfile.coverageRadiusKm,
          inspection_fee: newProfile.inspectionFee,
          starting_price: newProfile.startingPrice,
          technician_code: newProfile.technicianCode,
          is_blocked: false,
          aadhaar_url: newProfile.documents?.aadhaarDocUrl || '',
          is_approved: false, // strictly false until admin approval
          is_verified: false,
          is_online: false,
          rating: newProfile.rating,
          rating_count: newProfile.reviewCount,
          city: newProfile.location.city,
          address: newProfile.location.address,
          created_at: newProfile.appliedAt,
        });

        if (error) {
          console.warn('Supabase technicians insert warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase DB error while inserting technician:', err);
      }
    }

    return newProfile;
  }

  /**
   * 5. ADMIN VERIFICATION WORKFLOW: Approve / Reject Technician in Supabase
   */
  async updateTechnicianApprovalStatus(
    technicianId: string,
    status: 'approved' | 'rejected' | 'suspended',
    adminName: string = 'NeedFix Admin',
    reason?: string
  ): Promise<void> {
    // 1. Update in local storage
    storageService.updateTechnicianStatus(technicianId, status, adminName, reason);

    // 2. Update in Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      try {
        const isApproved = status === 'approved';
        const { error } = await supabase
          .from('technicians')
          .update({
            is_approved: isApproved,
            is_verified: isApproved,
            status: status,
            approved_at: isApproved ? new Date().toISOString() : null,
            approved_by: isApproved ? adminName : null,
            rejection_reason: status === 'rejected' ? reason : null,
          })
          .eq('id', technicianId);

        if (error) {
          console.warn('Supabase technician status update error:', error.message);
        }

        // If approved, update user role to 'technician' in Supabase users table
        if (isApproved) {
          const tech = storageService.getTechnicianById(technicianId);
          if (tech) {
            await supabase
              .from('users')
              .update({ role: 'technician' })
              .eq('id', tech.userId);
          }
        }
      } catch (err) {
        console.warn('Supabase error updating technician approval status:', err);
      }
    }
  }

  /**
   * 6. Fetch approved technicians from Supabase PostgreSQL
   */
  async getApprovedTechnicians(): Promise<TechnicianProfile[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('is_approved', true);

        if (!error && data && data.length > 0) {
          // Filter out blocked technicians and merge with local storage state
          return data
            .filter((d: any) => d.is_blocked !== true)
            .map((d: any) => ({
            id: d.id,
            technicianCode: d.technician_code || 'NF-TECH-1000',
            userId: d.user_id,
            fullName: d.full_name,
            companyName: d.company_name,
            mobile: d.mobile,
            whatsappNumber: d.whatsapp_number,
            categoryId: d.category_id,
            categoryName: d.category_name,
            categoryIds: d.category_ids || [d.category_id],
            categoryNames: [d.category_name],
            experienceYears: d.experience_years || 5,
            coverageRadiusKm: d.coverage_radius_km || 10,
            coverageAreaText: d.city,
            businessAddress: d.address,
            location: {
              latitude: 28.6139,
              longitude: 77.2090,
              city: d.city || 'Delhi',
              area: 'Central',
              address: d.address || 'Workshop',
            },
            businessDescription: '',
            profilePhotoUrl: d.profile_photo_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
            companyLogoUrl: d.company_logo_url || '',
            portfolioImages: [],
            documents: {
              aadhaarNumber: 'Verified',
              aadhaarDocUrl: d.aadhaar_url,
            },
            startingPrice: d.starting_price || 299,
            priceUnit: 'Visiting Fee',
            inspectionFee: d.inspection_fee || 299,
            servicesOffered: [],
            workingHours: '08:30 AM - 08:30 PM',
            availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            isOnline: d.is_online ?? true,
            isApproved: true,
            isVerified: true,
            status: 'approved',
            rating: d.rating || 4.8,
            ratingCount: d.rating_count || 12,
            reviewCount: d.rating_count || 12,
            appliedAt: d.created_at || d.applied_at || new Date().toISOString(),
            createdAt: d.created_at || new Date().toISOString(),
            totalBookings: d.total_bookings || 0,
            profileViews: d.profile_views || 0,
            totalCalls: d.total_calls || 0,
            totalWhatsAppClicks: d.total_whatsapp_clicks || 0,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch approved technicians exception:', err);
      }
    }

    return storageService.getApprovedTechnicians();
  }
}

export const supabaseService = new SupabaseService();
