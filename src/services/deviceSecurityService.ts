import { supabase, isSupabaseConfigured } from './supabaseClient';
import { storageService } from './storage';
import { CustomerRecord, BlockedDeviceRecord, DeviceSecurityStatus } from '../types';

class DeviceSecurityService {
  private cachedIp: string | null = null;
  private cachedDeviceId: string | null = null;
  private ipFetchPromise: Promise<string> | null = null;

  /**
   * Helper to generate standard RFC 4122 compliant UUID v4
   */
  generateUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      try {
        return crypto.randomUUID();
      } catch {
        // Fallback
      }
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * 1. Get or generate persistent unique Privacy-Safe Installation ID (UUID v4)
   * Strictly compliant with Google Play Store & Apple App Store Privacy Policies:
   * NO hardware tracking (IMEI, MAC, SIM Serial, or hardware fingerprints).
   */
  getDeviceId(): string {
    if (this.cachedDeviceId) return this.cachedDeviceId;

    try {
      const stored = localStorage.getItem('needfix_installation_uuid');
      if (stored && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(stored)) {
        this.cachedDeviceId = stored;
        return stored;
      }
      // Migrate from old DEV- prefix if present but convert to privacy-safe UUID
      const oldLegacy = localStorage.getItem('needfix_device_fingerprint_id');
      if (oldLegacy) {
        localStorage.removeItem('needfix_device_fingerprint_id');
      }
    } catch {
      // Ignore localStorage access issues
    }

    // Generate privacy-safe UUID v4
    const newInstallationId = this.generateUUID();

    try {
      localStorage.setItem('needfix_installation_uuid', newInstallationId);
    } catch {
      // Ignore
    }

    this.cachedDeviceId = newInstallationId;
    return newInstallationId;
  }

  /**
   * 2. Automatically capture real client IP address with multiple fallbacks
   */
  async getRealIPAddress(): Promise<string> {
    if (this.cachedIp) return this.cachedIp;
    if (this.ipFetchPromise) return this.ipFetchPromise;

    this.ipFetchPromise = (async () => {
      // 1. Check cached in localStorage
      try {
        const saved = localStorage.getItem('needfix_cached_client_ip');
        if (saved && saved.length > 6) {
          this.cachedIp = saved;
        }
      } catch {
        // ignore
      }

      // 2. Query public fast IP APIs with timeouts
      const ipEndpoints = [
        'https://api.ipify.org?format=json',
        'https://api64.ipify.org?format=json',
        'https://ipapi.co/json/',
      ];

      for (const endpoint of ipEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const res = await fetch(endpoint, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const detected = data.ip || data.client_ip;
            if (detected && typeof detected === 'string' && detected.trim()) {
              const cleanIp = detected.trim();
              this.cachedIp = cleanIp;
              try {
                localStorage.setItem('needfix_cached_client_ip', cleanIp);
              } catch {
                // ignore
              }
              return cleanIp;
            }
          }
        } catch {
          // Proceed to next fallback
        }
      }

      // Fallback if offline or network blocks public IP API
      const fallbackIp = this.cachedIp || '103.21.244.12';
      this.cachedIp = fallbackIp;
      return fallbackIp;
    })();

    const result = await this.ipFetchPromise;
    this.ipFetchPromise = null;
    return result;
  }

  /**
   * 3. Get or assign persistent Unique Customer ID ('CUST-1', 'CUST-2'...)
   * Auto-incrementing, unlimited sequential numbers scaling infinitely as users grow
   */
  getCustomerId(): string {
    try {
      const stored = localStorage.getItem('needfix_customer_unique_id');
      if (stored && /^CUST-\d+$/i.test(stored)) {
        return stored;
      }
    } catch {
      // ignore
    }

    // Determine highest sequential number across local customers & tracker
    let maxNum = 0;
    try {
      const storedSeq = localStorage.getItem('needfix_last_cust_seq');
      if (storedSeq) {
        const parsed = parseInt(storedSeq, 10);
        if (!isNaN(parsed) && parsed > maxNum) {
          maxNum = parsed;
        }
      }

      const existingCustomers = storageService.getCustomers();
      existingCustomers.forEach((c) => {
        if (c.customerId) {
          const match = c.customerId.match(/CUST-(\d+)/i);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        }
      });
    } catch {
      // ignore
    }

    const nextSeq = maxNum + 1;
    const newCustId = `CUST-${nextSeq}`;
    try {
      localStorage.setItem('needfix_last_cust_seq', nextSeq.toString());
      localStorage.setItem('needfix_customer_unique_id', newCustId);
    } catch {
      // ignore
    }
    return newCustId;
  }

  /**
   * Resolve customer ID with live Supabase sequence synchronization
   * Ensures seamless sequential progression across multiple devices
   */
  async resolveCustomerSequentialId(): Promise<string> {
    const currentId = this.getCustomerId();

    if (isSupabaseConfigured()) {
      try {
        const deviceId = this.getDeviceId();

        // 1. Check if this device already has an assigned customer record in Supabase
        const { data: existingDeviceCust } = await supabase
          .from('customers')
          .select('customer_id')
          .eq('device_id', deviceId)
          .maybeSingle();

        if (existingDeviceCust?.customer_id) {
          localStorage.setItem('needfix_customer_unique_id', existingDeviceCust.customer_id);
          const match = existingDeviceCust.customer_id.match(/CUST-(\d+)/i);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            const curSeq = parseInt(localStorage.getItem('needfix_last_cust_seq') || '0', 10);
            if (num > curSeq) {
              localStorage.setItem('needfix_last_cust_seq', num.toString());
            }
          }
          return existingDeviceCust.customer_id;
        }

        // 2. Query Supabase for the current highest sequential Customer ID
        const { data: allCusts } = await supabase
          .from('customers')
          .select('customer_id');

        if (allCusts && allCusts.length > 0) {
          let maxDbSeq = 0;
          let isCurrentIdTaken = false;

          allCusts.forEach((row: any) => {
            if (row.customer_id) {
              if (row.customer_id.toUpperCase() === currentId.toUpperCase()) {
                isCurrentIdTaken = true;
              }
              const match = row.customer_id.match(/CUST-(\d+)/i);
              if (match && match[1]) {
                const num = parseInt(match[1], 10);
                if (!isNaN(num) && num > maxDbSeq) {
                  maxDbSeq = num;
                }
              }
            }
          });

          // If current ID is already taken by another device, assign next sequential number
          if (isCurrentIdTaken) {
            const nextSeq = maxDbSeq + 1;
            const updatedId = `CUST-${nextSeq}`;
            localStorage.setItem('needfix_last_cust_seq', nextSeq.toString());
            localStorage.setItem('needfix_customer_unique_id', updatedId);
            return updatedId;
          }
        }
      } catch (err) {
        console.warn('Supabase customer sequence sync notice:', err);
      }
    }

    return currentId;
  }

  /**
   * 4. Generate unique Technician ID ('TECH-1', 'TECH-2'...)
   * Auto-incrementing, unlimited sequential numbers scaling infinitely
   */
  generateTechnicianId(): string {
    return storageService.generateNextTechnicianCode();
  }

  /**
   * Async Technician ID generation that checks both local storage and Supabase
   * for the true maximum sequential number
   */
  async generateTechnicianIdAsync(): Promise<string> {
    let maxNumber = 0;

    // Check local technicians
    const localTechs = storageService.getTechnicians();
    localTechs.forEach((t) => {
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

    // Check Supabase technicians
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('technicians')
          .select('technician_code');
        if (!error && data) {
          data.forEach((row: any) => {
            if (row.technician_code) {
              const match = row.technician_code.match(/(?:NF-)?TECH-(\d+)/i);
              if (match && match[1]) {
                const num = parseInt(match[1], 10);
                if (!isNaN(num) && num > maxNumber) {
                  maxNumber = num;
                }
              }
            }
          });
        }
      } catch (e) {
        console.warn('Supabase technician sequence check:', e);
      }
    }

    return `TECH-${maxNumber + 1}`;
  }

  /**
   * 5. Track & Save Customer on Website Entry into Supabase & Local Cache
   * Customers: Real IP, Device Fingerprint, Customer ID ('CUST-1', 'CUST-2'...), Name
   */
  async trackCustomerEntry(name?: string, phone?: string): Promise<CustomerRecord> {
    const deviceId = this.getDeviceId();
    const customerId = await this.resolveCustomerSequentialId();
    const ipAddress = await this.getRealIPAddress();

    // Stored custom customer name
    let finalName = name;
    if (!finalName) {
      try {
        finalName =
          localStorage.getItem('needfix_customer_custom_name') ||
          storageService.getCurrentUser()?.name ||
          'NeedFix Visitor';
      } catch {
        finalName = 'NeedFix Visitor';
      }
    }

    const customerRecord: CustomerRecord = {
      id: `cust_${customerId.replace('-', '_')}`,
      customerId,
      name: finalName,
      phone: phone || storageService.getCurrentUser()?.mobile || undefined,
      ipAddress,
      deviceId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      lastSeenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isBlocked: false,
    };

    // Save locally
    storageService.saveCustomer(customerRecord);

    // Sync to Supabase PostgreSQL 'customers' table
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('customers').upsert(
          {
            id: customerRecord.id,
            customer_id: customerRecord.customerId,
            name: customerRecord.name,
            phone: customerRecord.phone || null,
            ip_address: customerRecord.ipAddress,
            device_id: customerRecord.deviceId,
            user_agent: customerRecord.userAgent || null,
            last_seen_at: customerRecord.lastSeenAt,
            is_blocked: false,
          },
          { onConflict: 'customer_id' }
        );

        if (error) {
          console.warn('Supabase customers tracking notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase customers upsert exception:', err);
      }
    }

    return customerRecord;
  }

  /**
   * 6. Universal IP & Device Blocking Check
   * Queries 'blocked_devices' table in Supabase & local blacklist
   */
  async checkDeviceBlocked(): Promise<DeviceSecurityStatus> {
    const deviceId = this.getDeviceId();
    const ip = await this.getRealIPAddress();

    // 1. Check local blacklist cache for instant zero-latency freeze
    const localBlock = storageService.isDeviceOrIpBlocked(deviceId, ip);
    if (localBlock) {
      return {
        isBlocked: true,
        reason: localBlock.reason,
        blockedAt: localBlock.blockedAt,
        blockedBy: localBlock.blockedBy,
        uniqueId: localBlock.uniqueId,
        ip,
        deviceId,
      };
    }

    // 2. Query Supabase 'blocked_devices' table
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('blocked_devices')
          .select('*')
          .or(`device_id.eq.${deviceId},ip_address.eq.${ip}`)
          .limit(1);

        if (!error && data && data.length > 0) {
          const item = data[0];
          const record: BlockedDeviceRecord = {
            id: item.id || `block_${Date.now()}`,
            deviceId: item.device_id,
            ipAddress: item.ip_address,
            targetType: item.target_type || 'customer',
            targetId: item.target_id,
            uniqueId: item.unique_id || 'UNKNOWN',
            targetName: item.target_name || 'Restricted Device',
            targetPhone: item.target_phone,
            reason: item.reason || 'Restricted by NeedFix Security Protocol',
            blockedBy: item.blocked_by || 'Admin',
            blockedAt: item.blocked_at || new Date().toISOString(),
          };

          // Cache in local storage for persistent lock
          storageService.addBlockedDevice(record);

          return {
            isBlocked: true,
            reason: record.reason,
            blockedAt: record.blockedAt,
            blockedBy: record.blockedBy,
            uniqueId: record.uniqueId,
            ip,
            deviceId,
          };
        }
      } catch (err) {
        console.warn('Supabase blocked_devices check exception:', err);
      }
    }

    return {
      isBlocked: false,
      ip,
      deviceId,
    };
  }

  /**
   * 7. ADMIN: Block User (Customer or Technician) by IP & Device Fingerprint
   * Saves into 'blocked_devices' table and updates status in Supabase & Local
   */
  async blockUser(params: {
    targetType: 'customer' | 'technician';
    targetId: string;
    uniqueId: string; // 'CUST-XXXX' or 'TECH-XXXX'
    name: string;
    phone?: string;
    ipAddress?: string;
    deviceId?: string;
    reason: string;
    adminName: string;
  }): Promise<boolean> {
    const deviceId = params.deviceId || this.getDeviceId();
    const ipAddress = params.ipAddress || (await this.getRealIPAddress());
    const blockedAt = new Date().toISOString();

    const record: BlockedDeviceRecord = {
      id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      deviceId,
      ipAddress,
      targetType: params.targetType,
      targetId: params.targetId,
      uniqueId: params.uniqueId,
      targetName: params.name,
      targetPhone: params.phone,
      reason: params.reason || 'Security terms violation',
      blockedBy: params.adminName || 'NeedFix Admin Desk',
      blockedAt,
    };

    // 1. Save to local storage
    storageService.addBlockedDevice(record);

    if (params.targetType === 'customer') {
      storageService.updateCustomerBlockStatus(
        params.uniqueId,
        true,
        record.reason,
        record.blockedBy
      );
    } else {
      storageService.toggleTechnicianBlockStatus(
        params.targetId,
        record.blockedBy,
        record.reason
      );
    }

    // 2. Sync to Supabase PostgreSQL 'blocked_devices' table
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('blocked_devices').insert({
          id: record.id,
          device_id: record.deviceId,
          ip_address: record.ipAddress,
          target_type: record.targetType,
          target_id: record.targetId,
          unique_id: record.uniqueId,
          target_name: record.targetName,
          target_phone: record.targetPhone || null,
          reason: record.reason,
          blocked_by: record.blockedBy,
          blocked_at: record.blockedAt,
        });

        // Update target record status in Supabase
        if (params.targetType === 'customer') {
          await supabase
            .from('customers')
            .update({
              is_blocked: true,
              blocked_reason: record.reason,
              blocked_at: record.blockedAt,
            })
            .eq('customer_id', params.uniqueId);
        } else {
          await supabase
            .from('technicians')
            .update({
              is_blocked: true,
              blocked_reason: record.reason,
              blocked_at: record.blockedAt,
              is_online: false,
            })
            .or(`id.eq.${params.targetId},technician_code.eq.${params.uniqueId}`);
        }
      } catch (err) {
        console.warn('Supabase blockUser sync exception:', err);
      }
    }

    return true;
  }

  /**
   * 8. ADMIN: Unblock User / Device / IP
   */
  async unblockUser(params: {
    uniqueId: string; // 'CUST-XXXX' or 'TECH-XXXX' or deviceId or IP
    targetType?: 'customer' | 'technician';
    adminName: string;
  }): Promise<boolean> {
    // 1. Remove from local storage
    storageService.removeBlockedDevice(params.uniqueId);

    if (params.targetType === 'customer' || params.uniqueId.startsWith('CUST-')) {
      storageService.updateCustomerBlockStatus(params.uniqueId, false);
    } else if (params.targetType === 'technician' || params.uniqueId.startsWith('TECH-')) {
      const tech = storageService.getTechnicians().find(
        (t) => t.technicianCode === params.uniqueId || t.id === params.uniqueId
      );
      if (tech) {
        storageService.toggleTechnicianBlockStatus(
          tech.id,
          params.adminName,
          'Reinstated by Admin'
        );
      }
    }

    // 2. Remove from Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('blocked_devices')
          .delete()
          .or(
            `unique_id.eq.${params.uniqueId},device_id.eq.${params.uniqueId},ip_address.eq.${params.uniqueId},id.eq.${params.uniqueId}`
          );

        if (params.targetType === 'customer' || params.uniqueId.startsWith('CUST-')) {
          await supabase
            .from('customers')
            .update({ is_blocked: false, blocked_reason: null, blocked_at: null })
            .eq('customer_id', params.uniqueId);
        } else {
          await supabase
            .from('technicians')
            .update({ is_blocked: false, blocked_reason: null, blocked_at: null })
            .or(`technician_code.eq.${params.uniqueId},id.eq.${params.uniqueId}`);
        }
      } catch (err) {
        console.warn('Supabase unblockUser exception:', err);
      }
    }

    return true;
  }

  /**
   * 9. Fetch all customers from Supabase + Local Cache
   */
  async getAllCustomers(): Promise<CustomerRecord[]> {
    const localList = storageService.getCustomers();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('last_seen_at', { ascending: false });

        if (!error && data) {
          const mapped: CustomerRecord[] = data.map((d: any) => ({
            id: d.id,
            customerId: d.customer_id || 'CUST-0000',
            name: d.name || 'NeedFix Customer',
            phone: d.phone || '',
            ipAddress: d.ip_address || '127.0.0.1',
            deviceId: d.device_id || 'DEV-UNKNOWN',
            userAgent: d.user_agent,
            lastSeenAt: d.last_seen_at || d.created_at || new Date().toISOString(),
            createdAt: d.created_at || new Date().toISOString(),
            isBlocked: Boolean(d.is_blocked),
            blockedReason: d.blocked_reason,
            blockedAt: d.blocked_at,
          }));

          // Merge with local list
          const remoteIds = new Set(mapped.map((c) => c.customerId));
          const combined = [...mapped];
          for (const lc of localList) {
            if (!remoteIds.has(lc.customerId)) {
              combined.push(lc);
            }
          }
          storageService.setCustomers(combined);
          return combined;
        }
      } catch (err) {
        console.warn('Supabase getAllCustomers exception:', err);
      }
    }

    return localList;
  }

  /**
   * 10. Fetch all blocked devices from Supabase + Local Cache
   */
  async getAllBlockedDevices(): Promise<BlockedDeviceRecord[]> {
    const localList = storageService.getBlockedDevices();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('blocked_devices')
          .select('*')
          .order('blocked_at', { ascending: false });

        if (!error && data) {
          const mapped: BlockedDeviceRecord[] = data.map((d: any) => ({
            id: d.id,
            deviceId: d.device_id,
            ipAddress: d.ip_address,
            targetType: d.target_type || 'customer',
            targetId: d.target_id,
            uniqueId: d.unique_id || 'UNKNOWN',
            targetName: d.target_name || 'Restricted Device',
            targetPhone: d.target_phone,
            reason: d.reason || 'Restricted by Admin',
            blockedBy: d.blocked_by || 'Admin',
            blockedAt: d.blocked_at || new Date().toISOString(),
          }));

          const remoteUniqueIds = new Set(mapped.map((b) => b.uniqueId));
          const combined = [...mapped];
          for (const lb of localList) {
            if (!remoteUniqueIds.has(lb.uniqueId)) {
              combined.push(lb);
            }
          }
          storageService.setBlockedDevices(combined);
          return combined;
        }
      } catch (err) {
        console.warn('Supabase getAllBlockedDevices exception:', err);
      }
    }

    return localList;
  }
}

export const deviceSecurityService = new DeviceSecurityService();
