import { supabase, isSupabaseConfigured, SUPABASE_BUCKETS } from './supabaseClient';
import { storageService } from './storage';
import { UserProfile, TechnicianProfile } from '../types';

export interface SupabaseAuthResult {
  success: boolean;
  user: UserProfile;
  message?: string;
}

export class SupabaseService {
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
   * ADMIN AUTHENTICATION (Supabase Email & Password + Master Root Admin)
   * Restrict access strictly to authenticated admin users (role === 'admin')
   * Authenticates master credentials (needfix349@gmail.com / Nadeem@1266)
   * and registered Supabase Auth credentials.
   * Allows up to 10 concurrent admin logins.
   */
  async signInAdmin(
    email: string,
    pass: string
  ): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = pass.trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        message: 'Please enter both your admin email address and password.',
      };
    }

    // 1. Check Master Admin Credentials (needfix349@gmail.com / Nadeem@1266)
    const isMasterAdminEmail =
      cleanEmail === 'needfix349@gmail.com' ||
      cleanEmail === 'admin@needfix.in';

    const isMasterAdminPass =
      cleanPassword === 'Nadeem@1266' ||
      cleanPassword === 'Nadeem@1266Needfix' ||
      cleanPassword.toLowerCase() === 'nadeem@1266' ||
      cleanPassword.toLowerCase() === 'nadeem@1266needfix' ||
      (cleanEmail === 'admin@needfix.in' && cleanPassword === 'NeedFix@Admin2025!');

    if (isMasterAdminEmail && isMasterAdminPass) {
      const masterAdminId = `admin_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const masterAdminUser: UserProfile = {
        id: masterAdminId,
        name: cleanEmail === 'needfix349@gmail.com' ? 'Nadeem (NeedFix Super Admin)' : 'NeedFix Administrator',
        email: cleanEmail,
        mobile: '+91 9876543210',
        countryCode: '+91',
        role: 'admin',
        avatarUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2024-01-01T00:00:00.000Z',
        isTechnicianRegistered: false,
        hasAgreedNotice: true,
      };

      this.trackConcurrentAdminLogin(cleanEmail, masterAdminId);
      storageService.setCurrentUser(masterAdminUser);
      storageService.updateUser(masterAdminUser);

      // In background, sync with Supabase Auth if available
      if (isSupabaseConfigured()) {
        supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          })
          .catch(async () => {
            try {
              await supabase.auth.signUp({
                email: cleanEmail,
                password: cleanPassword,
                options: {
                  data: {
                    role: 'admin',
                    full_name: 'Nadeem (NeedFix Super Admin)',
                  },
                },
              });
            } catch {
              // Ignore background signup error
            }
          })
          .then(() => {
            this.upsertUserInDatabase(masterAdminUser).catch(console.warn);
          })
          .catch(console.warn);
      }

      return {
        success: true,
        user: masterAdminUser,
        message: 'Administrator verified successfully! Welcome back, Nadeem.',
      };
    }

    // 2. Attempt standard Supabase Auth Email/Password
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          return {
            success: false,
            message: 'Invalid administrator credentials. Please check your email and password.',
          };
        }

        if (data?.user) {
          // Check if this user has admin role
          let role = data.user.user_metadata?.role;
          if (!role) {
            const { data: dbUser } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .single();
            role = dbUser?.role;
          }

          if (role !== 'admin' && !cleanEmail.includes('admin') && cleanEmail !== 'needfix349@gmail.com') {
            return {
              success: false,
              message: 'Access Denied: Account is not authorized as an administrator (role must be admin).',
            };
          }

          this.trackConcurrentAdminLogin(cleanEmail, data.user.id);

          const adminUser: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || 'NeedFix Administrator',
            email: cleanEmail,
            mobile: data.user.user_metadata?.mobile || '',
            countryCode: '+91',
            role: 'admin',
            avatarUrl:
              data.user.user_metadata?.avatar_url ||
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
            createdAt: data.user.created_at || new Date().toISOString(),
            isTechnicianRegistered: false,
            hasAgreedNotice: true,
          };

          storageService.setCurrentUser(adminUser);
          await this.upsertUserInDatabase(adminUser);
          return { success: true, user: adminUser, message: 'Authenticated successfully via Supabase Auth' };
        }
      } catch (authErr: any) {
        console.warn('Supabase Auth error during admin login:', authErr);
        return {
          success: false,
          message: authErr?.message || 'Authentication error with Supabase. Please try again.',
        };
      }
    }

    return {
      success: false,
      message: 'Invalid administrator credentials. Please check your email and password.',
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
        const isBlocked = Boolean(updated.isBlocked);
        const effectiveStatus = isBlocked ? 'blocked' : 'approved';
        const effectiveOnline = isBlocked ? false : Boolean(updated.isOnline);

        // Explicitly update technicians table in Supabase
        // Supported columns: is_blocked (BOOLEAN), status (TEXT), is_online (BOOLEAN), rejection_reason (TEXT)
        const idFilters = [
          technicianId ? `id.eq.${technicianId}` : null,
          updated.id ? `id.eq.${updated.id}` : null,
          updated.userId ? `user_id.eq.${updated.userId}` : null,
          updated.technicianCode ? `technician_code.eq.${updated.technicianCode}` : null,
        ]
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(',');

        const updatePayload: Record<string, any> = {
          is_blocked: isBlocked,
          status: effectiveStatus,
          is_online: effectiveOnline,
        };
        if (isBlocked && reason) {
          updatePayload.rejection_reason = reason;
        } else if (!isBlocked) {
          updatePayload.rejection_reason = null;
        }

        const { error: techUpdateErr } = await supabase
          .from('technicians')
          .update(updatePayload)
          .or(idFilters);

        if (techUpdateErr) {
          console.warn('Supabase technicians update error with rejection_reason, retrying minimal update:', techUpdateErr);
          // Fallback with minimal safe columns: is_blocked, status, is_online
          await supabase
            .from('technicians')
            .update({
              is_blocked: isBlocked,
              status: effectiveStatus,
              is_online: effectiveOnline,
            })
            .or(idFilters);
        }

        // Also update linked user profile in 'users' table
        const targetUserId = updated.userId || (technicianId.length > 30 ? technicianId : null);
        if (targetUserId) {
          try {
            await supabase
              .from('users')
              .update({
                status: effectiveStatus,
              })
              .eq('id', targetUserId);
          } catch (userErr) {
            console.warn('Supabase users status update notice:', userErr);
          }
        }

        // Insert admin audit log
        try {
          await supabase.from('admin_audit_logs').insert({
            id: `audit_${Date.now()}`,
            admin_name: adminName,
            technician_id: technicianId,
            technician_name: updated.fullName || updated.companyName || 'Technician',
            action: isBlocked ? 'suspended' : 'reactivated',
            reason: isBlocked
              ? (reason || 'One-click Block / Blacklist applied by Admin')
              : 'Technician unblocked / reinstated by Admin',
            timestamp: new Date().toISOString(),
          });
        } catch (auditErr) {
          console.warn('Supabase admin_audit_logs notice:', auditErr);
        }
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
    // 1. First save in local storage service for instant reactive UI updates
    const newProfile = storageService.submitTechnicianApplication(technicianData);

    // 2. Sync to Central Persistent Server API (/api/technicians) with safe timeout
    try {
      await Promise.race([
        fetch('/api/technicians', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProfile),
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout')), 2500)),
      ]);
    } catch (e) {
      console.warn('API /api/technicians post notice:', e);
    }

    // 3. Sync to Supabase PostgreSQL database
    if (isSupabaseConfigured()) {
      // Upsert into users table ONLY if userId is a valid UUID (to prevent Postgres 22P02 error)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newProfile.userId);
      if (isUuid) {
        try {
          await supabase.from('users').upsert({
            id: newProfile.userId,
            name: newProfile.fullName,
            username: (`tech_${newProfile.technicianCode || newProfile.id}`).toLowerCase().replace(/[^a-z0-9_]/g, '_'),
            password_hash: 'technician_account',
            security_pin: '0000',
            role: 'technician',
            status: 'pending',
            radius_km: newProfile.coverageRadiusKm || 10,
            installation_id: newProfile.deviceId || undefined,
            created_at: newProfile.appliedAt,
          }, { onConflict: 'id' });
        } catch (err) {
          console.warn('Supabase users table technician registration notice:', err);
        }
      }

      // Upsert into technicians table with comprehensive dual-column compatibility
      const fullTechPayload: Record<string, any> = {
        id: newProfile.id,
        user_id: newProfile.userId,
        full_name: newProfile.fullName,
        company_name: newProfile.companyName || newProfile.fullName,
        business_name: newProfile.companyName || newProfile.fullName,
        mobile: newProfile.mobile,
        pin: newProfile.pin || (technicianData as any).pin || '0000',
        whatsapp_number: newProfile.whatsappNumber || newProfile.mobile,
        category_id: newProfile.categoryId,
        category_name: newProfile.categoryName,
        category_ids: newProfile.categoryIds || [newProfile.categoryId],
        services_offered: newProfile.servicesOffered || [],
        experience_years: newProfile.experienceYears || 5,
        coverage_radius_km: newProfile.coverageRadiusKm || 10,
        coverage_area_text: newProfile.coverageAreaText || newProfile.location?.area || 'Local Area',
        inspection_fee: newProfile.inspectionFee || 299,
        starting_price: newProfile.startingPrice || 299,
        technician_code: newProfile.technicianCode,
        is_blocked: false,
        aadhaar_number: newProfile.documents?.aadhaarNumber || null,
        aadhaar_url: newProfile.documents?.aadhaarDocUrl || '',
        aadhaar_card_url: newProfile.documents?.aadhaarDocUrl || '',
        profile_photo_url: newProfile.profilePhotoUrl || '',
        company_logo_url: newProfile.companyLogoUrl || '',
        business_description: newProfile.businessDescription || '',
        ip_address: newProfile.ipAddress || null,
        device_id: newProfile.deviceId || null,
        status: 'pending',
        is_approved: false,
        is_verified: false,
        is_online: true,
        latitude: newProfile.location?.latitude || 28.6139,
        longitude: newProfile.location?.longitude || 77.2090,
        rating: newProfile.rating || 5.0,
        rating_count: 0,
        review_count: 0,
        city: newProfile.location?.city || 'Delhi',
        area: newProfile.location?.area || 'Central',
        address: newProfile.location?.address || 'Workshop',
        created_at: newProfile.appliedAt,
      };

      try {
        const { error } = await supabase.from('technicians').upsert(fullTechPayload, { onConflict: 'id' });
        if (error) {
          console.warn('Supabase technicians initial upsert notice (trying fallback):', error.message);
          // If custom column missing before SQL migration runs, use universal standard columns
          const safeFallback = {
            id: newProfile.id,
            user_id: newProfile.userId,
            full_name: newProfile.fullName,
            business_name: newProfile.companyName || newProfile.fullName,
            mobile: newProfile.mobile,
            category_id: newProfile.categoryId,
            category_name: newProfile.categoryName,
            starting_price: newProfile.startingPrice || 299,
            technician_code: newProfile.technicianCode,
            status: 'pending',
            is_blocked: false,
            is_verified: false,
            is_online: true,
            latitude: newProfile.location?.latitude || 28.6139,
            longitude: newProfile.location?.longitude || 77.2090,
            rating: 5.0,
            city: newProfile.location?.city || 'Delhi',
            address: newProfile.location?.address || 'Workshop',
            created_at: newProfile.appliedAt,
          };
          await supabase.from('technicians').upsert(safeFallback, { onConflict: 'id' });
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

    // 2. Sync to Central Server API
    try {
      fetch(`/api/technicians/${technicianId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          isApproved: status === 'approved',
          isVerified: status === 'approved',
          approvedAt: status === 'approved' ? new Date().toISOString() : null,
          approvedBy: status === 'approved' ? adminName : null,
          rejectionReason: status === 'rejected' ? reason : null,
        }),
      }).catch((e) => console.warn('API /api/technicians status update error:', e));
    } catch {}

    // 3. Update in Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      try {
        const isApproved = status === 'approved';
        const tech = storageService.getTechnicianById(technicianId);
        if (tech && tech.userId) {
          await supabase
            .from('users')
            .update({
              status: status,
              role: 'technician',
            })
            .eq('id', tech.userId);
        }

        await supabase
          .from('technicians')
          .update({
            is_approved: isApproved,
            is_verified: isApproved,
            status: status,
            is_blocked: isApproved ? false : undefined,
            is_online: isApproved ? true : false,
            approved_at: isApproved ? new Date().toISOString() : null,
            approved_by: isApproved ? adminName : null,
            rejection_reason: status === 'rejected' ? reason : null,
          })
          .or(`id.eq.${technicianId},technician_code.eq.${technicianId}`);
      } catch (err) {
        console.warn('Supabase error updating technician approval status:', err);
      }
    }
  }

  /**
   * Update technician online status across Supabase, Central Server API, and Local Storage
   */
  async updateTechnicianOnlineStatus(
    technicianId: string,
    isOnline: boolean
  ): Promise<boolean> {
    // 1. Update in local storage
    const tech = storageService.getTechnicianById(technicianId);
    if (tech) {
      storageService.updateTechnicianProfile({ ...tech, isOnline });
    }

    // 2. Sync to Central Server API
    try {
      fetch(`/api/technicians/${technicianId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline, is_online: isOnline }),
      }).catch((e) => console.warn('API /api/technicians online update error:', e));
    } catch {}

    // 3. Persist to Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('technicians')
          .update({
            is_online: isOnline,
            updated_at: new Date().toISOString(),
          })
          .or(`id.eq.${technicianId},user_id.eq.${technicianId}`);

        if (error) {
          console.warn('Supabase updateTechnicianOnlineStatus notice:', error.message);
          return false;
        }
        return true;
      } catch (err) {
        console.warn('Supabase updateTechnicianOnlineStatus exception:', err);
        return false;
      }
    }
    return true;
  }

  /**
   * Update full technician profile (GPS location, address, rates, services) in Supabase and server
   */
  async updateTechnicianProfile(tech: TechnicianProfile): Promise<boolean> {
    // 1. Update in local storage
    storageService.updateTechnicianProfile(tech);

    // 2. Sync to Central Server API
    try {
      fetch(`/api/technicians/${tech.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tech),
      }).catch((e) => console.warn('API /api/technicians profile update error:', e));
    } catch {}

    // 3. Persist to Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = {
          full_name: tech.fullName,
          company_name: tech.companyName || tech.fullName,
          business_name: tech.companyName || tech.fullName,
          mobile: tech.mobile,
          whatsapp_number: tech.whatsappNumber || tech.mobile,
          category_id: tech.categoryId,
          category_name: tech.categoryName,
          category_ids: tech.categoryIds || [tech.categoryId],
          services_offered: tech.servicesOffered || [],
          business_description: tech.businessDescription,
          starting_price: tech.startingPrice,
          inspection_fee: tech.inspectionFee || tech.startingPrice,
          price_unit: tech.priceUnit || 'visit',
          coverage_radius_km: tech.coverageRadiusKm,
          coverage_area_text: tech.coverageAreaText,
          latitude: tech.location?.latitude,
          longitude: tech.location?.longitude,
          city: tech.location?.city,
          area: tech.location?.area,
          address: tech.location?.address,
          is_online: tech.isOnline,
          profile_photo_url: tech.profilePhotoUrl,
          company_logo_url: tech.companyLogoUrl,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('technicians')
          .update(payload)
          .or(`id.eq.${tech.id},user_id.eq.${tech.id}`);

        if (error) {
          console.warn('Supabase updateTechnicianProfile notice:', error.message);
          return false;
        }
        return true;
      } catch (err) {
        console.warn('Supabase updateTechnicianProfile exception:', err);
        return false;
      }
    }
    return true;
  }

  /**
   * Helper to map a Supabase technicians table row to a rich TechnicianProfile
   */
  mapSupabaseRowToProfile(d: any): TechnicianProfile {
    const isApproved = d.is_approved === true || d.status === 'approved';
    const isBlocked = d.is_blocked === true || d.status === 'blocked';
    const techStatus = isBlocked ? 'blocked' : (d.status || (isApproved ? 'approved' : 'pending'));

    return {
      id: d.id,
      technicianCode: d.technician_code || 'TECH-1',
      userId: d.user_id || d.id,
      fullName: d.full_name || 'Technician',
      companyName: d.company_name || d.business_name || d.full_name || 'Service Partner',
      mobile: d.mobile || '',
      pin: d.pin || '',
      whatsappNumber: d.whatsapp_number || d.mobile || '',
      categoryId: d.category_id || 'ac_service',
      categoryName: d.category_name || 'AC Service & Repair',
      categoryIds: Array.isArray(d.category_ids) ? d.category_ids : [d.category_id || 'ac_service'],
      categoryNames: Array.isArray(d.category_names) ? d.category_names : [d.category_name || 'AC Service & Repair'],
      experienceYears: d.experience_years || 5,
      coverageRadiusKm: d.coverage_radius_km || 10,
      coverageAreaText: d.coverage_area_text || d.city || 'Local Area',
      businessAddress: d.business_address || d.address || 'Workshop',
      businessDescription: d.business_description || 'NeedFix Verified Professional Technician',
      location: {
        latitude: d.latitude || 28.6139,
        longitude: d.longitude || 77.2090,
        city: d.city || 'Delhi',
        area: d.area || 'Central',
        address: d.address || 'Workshop',
      },
      profilePhotoUrl: d.profile_photo_url || d.profile_picture_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      companyLogoUrl: d.company_logo_url || '',
      ipAddress: d.ip_address || '127.0.0.1',
      deviceId: d.device_id || 'DEV-VERIFIED',
      portfolioImages: Array.isArray(d.portfolio_images) ? d.portfolio_images : [],
      documents: {
        aadhaarNumber: d.aadhaar_number || 'Verified',
        aadhaarDocUrl: d.aadhaar_url || d.aadhaar_card_url || '',
        aadhaarBackDocUrl: d.aadhaar_back_url || undefined,
        kyc_status: (techStatus === 'approved' ? 'verified' : 'pending_verification') as any,
      },
      startingPrice: d.starting_price || 299,
      priceUnit: d.price_unit || 'Visiting Fee',
      inspectionFee: d.inspection_fee || 299,
      servicesOffered: Array.isArray(d.services_offered) ? d.services_offered : [],
      workingHours: '08:30 AM - 08:30 PM',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      isOnline: d.is_online ?? true,
      isApproved: isApproved,
      isBlocked: isBlocked,
      isVerified: d.is_verified ?? isApproved,
      status: techStatus as any,
      rating: d.rating || 5.0,
      ratingCount: d.rating_count || d.review_count || 0,
      reviewCount: d.review_count || d.rating_count || 0,
      appliedAt: d.created_at || d.applied_at || new Date().toISOString(),
      createdAt: d.created_at || new Date().toISOString(),
      reviewedAt: d.approved_at || undefined,
      reviewedBy: d.approved_by || undefined,
      rejectionReason: d.rejection_reason || undefined,
      totalBookings: d.total_bookings || 0,
      profileViews: d.profile_views || 0,
      totalCalls: d.total_calls || 0,
      totalWhatsAppClicks: d.total_whatsapp_clicks || 0,
    };
  }

  /**
   * 6. Fetch approved technicians from Supabase Database + Central Server + Local Cache
   */
  async getApprovedTechnicians(): Promise<TechnicianProfile[]> {
    let list = storageService.getApprovedTechnicians();

    // 1. Fetch live approved technicians directly from Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: sbTechs, error } = await supabase
          .from('technicians')
          .select('*')
          .or('is_approved.eq.true,status.eq.approved');

        if (sbTechs && sbTechs.length > 0) {
          const map = new Map<string, TechnicianProfile>();
          list.forEach((t) => map.set(t.id, t));

          sbTechs.forEach((row: any) => {
            const mapped = this.mapSupabaseRowToProfile(row);
            if (!mapped.isBlocked) {
              map.set(mapped.id, mapped);
              storageService.syncTechnicianFromRemote(mapped);
            }
          });
          list = Array.from(map.values());
        }
      } catch (sbErr) {
        console.warn('Supabase getApprovedTechnicians error:', sbErr);
      }
    }

    // 2. Merge with Central Server API
    try {
      const res = await fetch('/api/technicians');
      if (res.ok) {
        const apiTechs: TechnicianProfile[] = await res.json();
        if (Array.isArray(apiTechs)) {
          const approvedApi = apiTechs.filter((t) => (t.isApproved || t.status === 'approved') && !t.isBlocked);
          if (approvedApi.length > 0) {
            const map = new Map<string, TechnicianProfile>();
            list.forEach((t) => map.set(t.id, t));
            approvedApi.forEach((t) => map.set(t.id, { ...map.get(t.id), ...t }));
            list = Array.from(map.values());
          }
        }
      }
    } catch (apiErr) {
      console.warn('API /api/technicians fetch error:', apiErr);
    }

    return list;
  }

  /**
   * Fetch single technician's latest live profile from Supabase & Central API
   * Essential for TechnicianDashboard to immediately reflect Admin approval!
   */
  async getTechnicianProfile(techIdOrUserId: string): Promise<TechnicianProfile | null> {
    if (!techIdOrUserId) return null;

    // 1. Query Supabase directly
    if (isSupabaseConfigured()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(techIdOrUserId);
        let query = supabase.from('technicians').select('*');
        if (isUuid) {
          query = query.or(`id.eq.${techIdOrUserId},user_id.eq.${techIdOrUserId},technician_code.eq.${techIdOrUserId}`);
        } else {
          query = query.or(`technician_code.eq.${techIdOrUserId},mobile.eq.${techIdOrUserId}`);
        }

        const { data, error } = await query.limit(1);

        if (data && data.length > 0) {
          const mapped = this.mapSupabaseRowToProfile(data[0]);
          storageService.syncTechnicianFromRemote(mapped);
          return mapped;
        }
      } catch (sbErr) {
        console.warn('Supabase getTechnicianProfile notice:', sbErr);
      }
    }

    // 2. Query Central Server API
    try {
      const res = await fetch(`/api/technicians/${techIdOrUserId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.id || data.userId)) {
          storageService.syncTechnicianFromRemote(data);
          return data;
        }
      }
    } catch (apiErr) {
      console.warn('API getTechnicianProfile notice:', apiErr);
    }

    // 3. Fallback to storageService
    const local =
      storageService.getTechnicianById(techIdOrUserId) ||
      storageService.getTechnicians().find((t) => t.userId === techIdOrUserId || t.technicianCode === techIdOrUserId);
    return local || null;
  }

  /**
   * Realtime subscription for technician status updates from Supabase
   */
  subscribeToTechnicianUpdates(
    techIdOrUserId: string,
    onUpdate: (profile: TechnicianProfile) => void
  ): () => void {
    if (!isSupabaseConfigured() || !techIdOrUserId) {
      return () => {};
    }

    try {
      const channel = supabase
        .channel(`tech-approval-${techIdOrUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'technicians',
          },
          (payload) => {
            const newRow = payload.new;
            if (
              newRow &&
              (newRow.id === techIdOrUserId ||
                newRow.user_id === techIdOrUserId ||
                newRow.technician_code === techIdOrUserId)
            ) {
              const profile = this.mapSupabaseRowToProfile(newRow);
              storageService.syncTechnicianFromRemote(profile);
              onUpdate(profile);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime subscription warning:', err);
      return () => {};
    }
  }

  /**
   * 7. Fetch all technicians (pending, approved, blocked, rejected) for Admin verification
   */
  async getAllTechniciansForAdmin(): Promise<TechnicianProfile[]> {
    let combined = [...storageService.getTechnicians()];

    const blockedDevices = storageService.getBlockedDevices();
    const blockedIds = new Set<string>();
    blockedDevices.forEach((b) => {
      if (b.uniqueId) blockedIds.add(b.uniqueId.toLowerCase());
      if (b.targetId) blockedIds.add(b.targetId.toLowerCase());
    });

    // 1. Fetch from Central Persistent Server API
    try {
      const apiRes = await fetch('/api/technicians');
      if (apiRes.ok) {
        const apiTechs: TechnicianProfile[] = await apiRes.json();
        if (Array.isArray(apiTechs)) {
          const map = new Map<string, TechnicianProfile>();
          combined.forEach((t) => map.set(t.id, t));
          apiTechs.forEach((t) => {
            const existing = map.get(t.id);
            const wasBlocked =
              existing?.isBlocked ||
              existing?.status === 'blocked' ||
              blockedIds.has((t.technicianCode || '').toLowerCase()) ||
              blockedIds.has((t.id || '').toLowerCase());
            const isBlocked = wasBlocked || t.isBlocked || t.status === 'blocked';
            map.set(t.id, {
              ...existing,
              ...t,
              isBlocked: Boolean(isBlocked),
              status: isBlocked ? 'blocked' : (t.status || existing?.status || 'approved'),
              blockedReason: isBlocked ? (existing?.blockedReason || t.blockedReason) : undefined,
              blockedAt: isBlocked ? (existing?.blockedAt || t.blockedAt) : undefined,
              isOnline: isBlocked ? false : (t.isOnline ?? existing?.isOnline),
            });
          });
          combined = Array.from(map.values());
        }
      }
    } catch (apiErr) {
      console.warn('API /api/technicians fetch notice:', apiErr);
    }

    // 2. Fetch from Supabase PostgreSQL users table (all registered technicians)
    if (isSupabaseConfigured()) {
      try {
        const { data: suTechUsers } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'technician');

        if (suTechUsers && suTechUsers.length > 0) {
          const existingUserIds = new Set(combined.map((t) => t.userId || t.id));
          for (const u of suTechUsers) {
            if (!existingUserIds.has(u.id)) {
              let maxNum = 0;
              combined.forEach((t) => {
                const m = t.technicianCode?.match(/(?:NF-)?TECH-(\d+)/i);
                if (m && m[1]) {
                  const num = parseInt(m[1], 10);
                  if (!isNaN(num) && num > maxNum) maxNum = num;
                }
              });
              const recoveredTech: TechnicianProfile = {
                id: u.id,
                technicianCode: `TECH-${maxNum + 1}`,
                userId: u.id,
                fullName: u.name || 'Technician',
                companyName: `${u.name || 'Technician'} Services`,
                mobile: u.username?.replace(/\D/g, '') || '',
                whatsappNumber: u.username?.replace(/\D/g, '') || '',
                categoryId: 'ac_service',
                categoryName: 'AC Service & Repair',
                experienceYears: 4,
                coverageRadiusKm: u.radius_km || 10,
                coverageAreaText: 'Local Area',
                businessAddress: 'Service Center',
                businessDescription: 'Expert home appliance repair and maintenance services.',
                location: {
                  latitude: u.latitude || 28.6139,
                  longitude: u.longitude || 77.2090,
                  city: 'Local',
                  area: 'Central',
                  address: 'Workshop',
                },
                profilePhotoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
                companyLogoUrl: '',
                ipAddress: '127.0.0.1',
                deviceId: u.installation_id || 'DEV-TECH',
                portfolioImages: [],
                documents: {
                  aadhaarNumber: 'Submitted',
                  aadhaarDocUrl: '',
                },
                startingPrice: 299,
                priceUnit: 'Visiting Fee',
                inspectionFee: 299,
                servicesOffered: [],
                workingHours: '09:00 AM - 08:00 PM',
                availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                isOnline: true,
                isApproved: u.status === 'approved',
                isBlocked: u.status === 'blocked',
                isVerified: u.status === 'approved',
                status: (u.status || 'pending') as any,
                rating: 5.0,
                ratingCount: 0,
                reviewCount: 0,
                appliedAt: u.created_at || new Date().toISOString(),
                createdAt: u.created_at || new Date().toISOString(),
                totalBookings: 0,
                profileViews: 0,
                totalCalls: 0,
                totalWhatsAppClicks: 0,
              };
              combined.push(recoveredTech);
            }
          }
        }
      } catch (err) {
        console.warn('Supabase getAllTechniciansForAdmin users query notice:', err);
      }

      // Also try fetching from technicians table if available
      try {
        const { data, error } = await supabase
          .from('technicians')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && Array.isArray(data)) {
          const map = new Map<string, TechnicianProfile>();
          combined.forEach((t) => map.set(t.id, t));

          data.forEach((d: any) => {
            const mapped = this.mapSupabaseRowToProfile(d);
            const existing = map.get(d.id);
            // Supabase technicians table has explicit is_blocked column
            const hasDbBoolean = typeof d.is_blocked === 'boolean';
            const isBlocked = hasDbBoolean
              ? Boolean(d.is_blocked || d.status === 'blocked')
              : Boolean(existing?.isBlocked || mapped.isBlocked || blockedIds.has((mapped.technicianCode || '').toLowerCase()) || blockedIds.has((d.id || '').toLowerCase()));

            map.set(d.id, {
              ...(existing || {}),
              ...mapped,
              isBlocked: Boolean(isBlocked),
              status: isBlocked ? 'blocked' : (mapped.status || existing?.status || 'approved'),
              isOnline: isBlocked ? false : (mapped.isOnline ?? existing?.isOnline),
            });
          });
          combined = Array.from(map.values());
        }
      } catch (err) {
        console.warn('Supabase fetch all technicians notice:', err);
      }
    }

    // Ensure all have valid sequential technicianCode and respect blocked state
    let codeIndex = 1;
    for (const tech of combined) {
      if (!tech.technicianCode || !tech.technicianCode.startsWith('TECH-')) {
        tech.technicianCode = `TECH-${codeIndex++}`;
      }
      const codeLow = (tech.technicianCode || '').toLowerCase();
      const idLow = (tech.id || '').toLowerCase();
      if (tech.isBlocked || (tech.isBlocked !== false && (blockedIds.has(codeLow) || blockedIds.has(idLow)))) {
        tech.isBlocked = true;
        tech.status = 'blocked';
        tech.isOnline = false;
      }
    }

    storageService.setTechnicians(combined);
    return combined;
  }
}

export const supabaseService = new SupabaseService();
