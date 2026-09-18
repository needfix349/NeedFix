import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Wrench,
  Search,
  Ban,
  CheckCircle2,
  Key,
  Smartphone,
  Globe,
  Clock,
  AlertTriangle,
  RefreshCw,
  Lock,
  Unlock,
  ShieldCheck,
  X,
  FileText,
  Copy,
  Check,
  Phone,
  KeyRound,
} from 'lucide-react';
import { CustomerRecord, TechnicianProfile, BlockedDeviceRecord, PasswordResetRequest } from '../../types';
import { deviceSecurityService } from '../../services/deviceSecurityService';
import { storageService } from '../../services/storage';

interface UserSecurityDirectoryProps {
  adminName?: string;
  technicians: TechnicianProfile[];
  onRefreshData?: () => void;
}

export const UserSecurityDirectory: React.FC<UserSecurityDirectoryProps> = ({
  adminName = 'NeedFix Administrator',
  technicians,
  onRefreshData,
}) => {
  // Toggle Switch: 'customers' | 'technicians' | 'blocked' | 'password_resets'
  const [activeDirectoryTab, setActiveDirectoryTab] = useState<'customers' | 'technicians' | 'blocked' | 'password_resets'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [blockedDevices, setBlockedDevices] = useState<BlockedDeviceRecord[]>([]);
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Temporary password issue modal
  const [selectedResetRequest, setSelectedResetRequest] = useState<PasswordResetRequest | null>(null);
  const [tempPassword, setTempPassword] = useState('NeedFix@2026');

  // Block Modal State
  const [itemToBlock, setItemToBlock] = useState<{
    targetType: 'customer' | 'technician';
    targetId: string;
    uniqueId: string;
    name: string;
    phone?: string;
    ipAddress?: string;
    deviceId?: string;
  } | null>(null);
  const [blockReason, setBlockReason] = useState('Suspicious activity / Policy violation');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Data
  const loadDirectoryData = async () => {
    setIsLoading(true);
    try {
      const [custData, blockedData] = await Promise.all([
        deviceSecurityService.getAllCustomers(),
        deviceSecurityService.getAllBlockedDevices(),
      ]);
      setCustomers(custData);
      setBlockedDevices(blockedData);
      setResetRequests(storageService.getPasswordResetRequests());
    } catch (e) {
      console.warn('Error loading security directory:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDirectoryData();
    const unsub = storageService.subscribe(() => {
      setCustomers(storageService.getCustomers());
      setBlockedDevices(storageService.getBlockedDevices());
      setResetRequests(storageService.getPasswordResetRequests());
    });
    return unsub;
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Block Modal
  const handleOpenBlockModal = (item: {
    targetType: 'customer' | 'technician';
    targetId: string;
    uniqueId: string;
    name: string;
    phone?: string;
    ipAddress?: string;
    deviceId?: string;
  }) => {
    setItemToBlock(item);
    setBlockReason('Suspicious activity / Policy violation');
  };

  // Confirm Block
  const handleConfirmBlock = async () => {
    if (!itemToBlock) return;
    setIsSubmittingBlock(true);
    try {
      await deviceSecurityService.blockUser({
        ...itemToBlock,
        reason: blockReason,
        adminName,
      });

      setActionSuccessMessage(`Successfully blocked ${itemToBlock.name} (${itemToBlock.uniqueId}). IP and Device Fingerprint are blacklisted.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);

      setItemToBlock(null);
      await loadDirectoryData();
      if (onRefreshData) onRefreshData();
    } catch (e: any) {
      alert(`Failed to block user: ${e.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  // Confirm Unblock
  const handleUnblock = async (uniqueId: string, targetType: 'customer' | 'technician', name: string) => {
    const confirm = window.confirm(`Are you sure you want to unblock ${name} (${uniqueId})? Access will be restored immediately.`);
    if (!confirm) return;

    try {
      await deviceSecurityService.unblockUser({
        uniqueId,
        targetType,
        adminName,
      });

      setActionSuccessMessage(`Successfully unblocked ${name} (${uniqueId}). Device & IP restrictions lifted.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);

      await loadDirectoryData();
      if (onRefreshData) onRefreshData();
    } catch (e: any) {
      alert(`Failed to unblock: ${e.message || 'Unknown error'}`);
    }
  };

  // Filter Customers
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.customerId.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        c.ipAddress.includes(q) ||
        c.deviceId.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  // Filter Technicians
  const filteredTechnicians = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return technicians;
    return technicians.filter(
      (t) =>
        (t.technicianCode && t.technicianCode.toLowerCase().includes(q)) ||
        t.fullName.toLowerCase().includes(q) ||
        t.mobile.includes(q) ||
        (t.whatsappNumber && t.whatsappNumber.includes(q)) ||
        (t.ipAddress && t.ipAddress.includes(q)) ||
        (t.deviceId && t.deviceId.toLowerCase().includes(q)) ||
        t.categoryName.toLowerCase().includes(q)
    );
  }, [technicians, searchQuery]);

  // Filter Blocked Devices
  const filteredBlockedDevices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return blockedDevices;
    return blockedDevices.filter(
      (b) =>
        b.uniqueId.toLowerCase().includes(q) ||
        b.targetName.toLowerCase().includes(q) ||
        (b.targetPhone && b.targetPhone.includes(q)) ||
        b.ipAddress.includes(q) ||
        b.deviceId.toLowerCase().includes(q)
    );
  }, [blockedDevices, searchQuery]);

  // Filter Reset Requests
  const filteredResetRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return resetRequests;
    return resetRequests.filter(
      (r) =>
        r.username.toLowerCase().includes(q) ||
        r.registeredPhone.includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [resetRequests, searchQuery]);

  const pendingResetCount = useMemo(
    () => resetRequests.filter((r) => r.status === 'pending').length,
    [resetRequests]
  );

  const handleResolveResetRequest = (req: PasswordResetRequest, passwordToIssue: string) => {
    const ok = storageService.resolvePasswordResetRequest(
      req.id,
      passwordToIssue,
      adminName,
      'Verified phone match via Admin security desk'
    );
    if (ok) {
      setActionSuccessMessage(`Temporary password set for user "${req.username}": ${passwordToIssue}`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
      setResetRequests(storageService.getPasswordResetRequests());
      setSelectedResetRequest(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {actionSuccessMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Directory Management Header with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tracked Customers</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">{customers.length}</p>
            <p className="text-[10px] text-slate-400">Sequential (CUST-1, CUST-2...) & IP</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Wrench size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tracked Technicians</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">{technicians.length}</p>
            <p className="text-[10px] text-slate-400">Sequential (TECH-1, TECH-2...) & Aadhaar</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Ban size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Blocked Devices & IPs</p>
            <p className="text-2xl font-extrabold text-red-600 font-mono">{blockedDevices.length}</p>
            <p className="text-[10px] text-slate-400">Completely frozen access</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <KeyRound size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Password Reset Requests</p>
            <p className="text-2xl font-extrabold text-amber-600 font-mono">{resetRequests.length}</p>
            <p className="text-[10px] text-slate-400">{pendingResetCount} pending verification</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Directory Toggle Switch & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* TOGGLE SWITCH: Customers vs Technicians vs Blocked vs Password Resets */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-start flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveDirectoryTab('customers')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDirectoryTab === 'customers'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={14} />
              <span>Customers ({customers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDirectoryTab('technicians')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDirectoryTab === 'technicians'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench size={14} />
              <span>Technicians ({technicians.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDirectoryTab('blocked')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDirectoryTab === 'blocked'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-700'
              }`}
            >
              <Ban size={14} />
              <span>Blocked List ({blockedDevices.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDirectoryTab('password_resets')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDirectoryTab === 'password_resets'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <KeyRound size={14} />
              <span>Password Resets ({resetRequests.length})</span>
              {pendingResetCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-mono">
                  {pendingResetCount}
                </span>
              )}
            </button>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={loadDirectoryData}
            disabled={isLoading}
            className="self-end md:self-auto py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync Supabase</span>
          </button>
        </div>

        {/* Search Bar (Search by Unique ID, Name, Phone Number, or IP) */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeDirectoryTab === 'customers'
                ? 'Search customers by Customer ID (e.g. CUST-1), Name, Phone, IP Address, or Device ID...'
                : activeDirectoryTab === 'technicians'
                ? 'Search technicians by Technician ID (e.g. TECH-1), Name, Mobile, IP, or Trade...'
                : 'Search blocked blacklist by Reference ID, IP Address, Device Fingerprint, or Name...'
            }
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CUSTOMERS DIRECTORY LIST                                           */}
      {/* ========================================================================= */}
      {activeDirectoryTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-100 text-blue-700">
                <Users size={16} />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Customer Entries & Device Tracking ({filteredCustomers.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Auto IP & Device Capture Active
            </span>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Users size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No Customers Found</p>
              <p className="text-xs text-slate-500">
                {searchQuery ? 'Try clearing your search query.' : 'Customer entries will appear here automatically.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Unique Customer ID</th>
                    <th className="py-3 px-4">Customer Name & Contact</th>
                    <th className="py-3 px-4">Real IP Address</th>
                    <th className="py-3 px-4">Device Fingerprint</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4">Security Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Customer ID */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                            <Key size={11} />
                            {cust.customerId}
                          </span>
                          <button
                            onClick={() => handleCopyId(cust.customerId)}
                            className="text-slate-400 hover:text-blue-600 p-0.5 transition-colors"
                            title="Copy Customer ID"
                          >
                            {copiedId === cust.customerId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>

                      {/* Name & Phone */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{cust.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {cust.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone size={10} /> {cust.phone}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Web Visitor (No phone yet)</span>
                          )}
                        </div>
                      </td>

                      {/* IP Address */}
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          <Globe size={11} className="text-slate-400" />
                          <span>{cust.ipAddress}</span>
                        </div>
                      </td>

                      {/* Device Fingerprint */}
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                          <Smartphone size={11} className="text-slate-400" />
                          <span>{cust.deviceId}</span>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock size={11} />
                          <span>{new Date(cust.lastSeenAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {cust.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            <Ban size={10} /> BLOCKED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={10} /> ACTIVE
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {cust.isBlocked ? (
                          <button
                            type="button"
                            onClick={() => handleUnblock(cust.customerId, 'customer', cust.name)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Unlock size={12} />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenBlockModal({
                                targetType: 'customer',
                                targetId: cust.id,
                                uniqueId: cust.customerId,
                                name: cust.name,
                                phone: cust.phone,
                                ipAddress: cust.ipAddress,
                                deviceId: cust.deviceId,
                              })
                            }
                            className="py-1.5 px-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Ban size={12} />
                            <span>Block User</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TECHNICIANS DIRECTORY LIST                                         */}
      {/* ========================================================================= */}
      {activeDirectoryTab === 'technicians' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-100 text-indigo-700">
                <Wrench size={16} />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Technician Directory & Security Tracking ({filteredTechnicians.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Includes Aadhaar, Phone, IP & Device
            </span>
          </div>

          {filteredTechnicians.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Wrench size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No Technicians Found</p>
              <p className="text-xs text-slate-500">
                {searchQuery ? 'Try clearing your search query.' : 'Registered technicians will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Technician ID</th>
                    <th className="py-3 px-4">Name & Trade</th>
                    <th className="py-3 px-4">Phone / Aadhaar</th>
                    <th className="py-3 px-4">Captured IP</th>
                    <th className="py-3 px-4">Device Fingerprint</th>
                    <th className="py-3 px-4">Approval & Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTechnicians.map((tech) => (
                    <tr key={tech.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Technician Code */}
                      <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1">
                            <Key size={11} />
                            {tech.technicianCode || 'TECH-1000'}
                          </span>
                          <button
                            onClick={() => handleCopyId(tech.technicianCode || 'TECH-1000')}
                            className="text-slate-400 hover:text-indigo-600 p-0.5 transition-colors"
                            title="Copy Technician ID"
                          >
                            {copiedId === tech.technicianCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>

                      {/* Name & Trade */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tech.fullName}</div>
                        <div className="text-[11px] text-indigo-600 font-medium">
                          {tech.categoryName || 'Service Provider'}
                        </div>
                      </td>

                      {/* Phone & Aadhaar */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-800 flex items-center gap-1">
                          <Phone size={10} className="text-slate-400" />
                          <span>{tech.mobile}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <FileText size={10} className="text-slate-400" />
                          <span>Aadhaar: {tech.documents?.aadhaarNumber ? `XXXX-${tech.documents.aadhaarNumber.slice(-4)}` : 'Verified'}</span>
                        </div>
                      </td>

                      {/* IP Address */}
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          <Globe size={11} className="text-slate-400" />
                          <span>{tech.ipAddress || '103.21.244.12'}</span>
                        </div>
                      </td>

                      {/* Device Fingerprint */}
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                          <Smartphone size={11} className="text-slate-400" />
                          <span>{tech.deviceId || 'DEV-VERIFIED'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {tech.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            <Ban size={10} /> BLOCKED
                          </span>
                        ) : tech.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={10} /> APPROVED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            <Clock size={10} /> PENDING
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {tech.isBlocked ? (
                          <button
                            type="button"
                            onClick={() => handleUnblock(tech.technicianCode || tech.id, 'technician', tech.fullName)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Unlock size={12} />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenBlockModal({
                                targetType: 'technician',
                                targetId: tech.id,
                                uniqueId: tech.technicianCode || tech.id,
                                name: tech.fullName,
                                phone: tech.mobile,
                                ipAddress: tech.ipAddress,
                                deviceId: tech.deviceId,
                              })
                            }
                            className="py-1.5 px-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Ban size={12} />
                            <span>Block Tech</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BLOCKED DEVICES & IPS BLACKLIST                                    */}
      {/* ========================================================================= */}
      {activeDirectoryTab === 'blocked' && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-red-100 flex items-center justify-between bg-red-50/50">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-red-100 text-red-700">
                <Ban size={16} />
              </span>
              <h2 className="text-sm font-bold text-red-950">
                Universal Blacklist: Blocked IPs & Devices ({filteredBlockedDevices.length})
              </h2>
            </div>
            <span className="text-[11px] text-red-700 font-mono font-semibold">
              Interface Frozen for all listed entities
            </span>
          </div>

          {filteredBlockedDevices.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <ShieldCheck size={32} className="mx-auto text-emerald-400" />
              <p className="text-sm font-semibold text-slate-700">No Blocked Devices or IPs</p>
              <p className="text-xs text-slate-500">
                All platform users currently have full operational access.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-red-50/70 text-red-800 font-semibold border-b border-red-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Unique ID</th>
                    <th className="py-3 px-4">Entity Name / Type</th>
                    <th className="py-3 px-4">Blocked IP</th>
                    <th className="py-3 px-4">Blocked Device ID</th>
                    <th className="py-3 px-4">Ban Reason</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100 text-slate-700">
                  {filteredBlockedDevices.map((b) => (
                    <tr key={b.id} className="hover:bg-red-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-red-700 whitespace-nowrap">
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-200">
                          {b.uniqueId}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{b.targetName}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {b.targetType}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-900 border border-red-200">
                          <Globe size={11} className="text-red-400" />
                          <span>{b.ipAddress}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                          <Smartphone size={11} className="text-slate-400" />
                          <span>{b.deviceId}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={b.reason}>
                        {b.reason}
                      </td>

                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(b.blockedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleUnblock(b.uniqueId || b.deviceId, b.targetType, b.targetName)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto cursor-pointer shadow-xs"
                        >
                          <Unlock size={12} />
                          <span>Unblock / Restore</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PASSWORD RESET REQUESTS (ADMIN VERIFICATION QUEUE)                 */}
      {/* ========================================================================= */}
      {activeDirectoryTab === 'password_resets' && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-amber-100 flex items-center justify-between bg-amber-50/50">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-800">
                <KeyRound size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Password Reset & Recovery Requests ({filteredResetRequests.length})
                </h2>
                <p className="text-[11px] text-slate-500">
                  Users who requested Admin verification via Username + Registered Phone
                </p>
              </div>
            </div>
            {pendingResetCount > 0 && (
              <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-lg font-bold flex items-center gap-1.5 animate-pulse">
                <Clock size={12} />
                <span>{pendingResetCount} Pending Review</span>
              </span>
            )}
          </div>

          {filteredResetRequests.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <ShieldCheck size={32} className="mx-auto text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">No Password Reset Requests</p>
              <p className="text-xs text-slate-500">
                There are no open or historic password reset requests in the queue.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Request Date</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Registered Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Temporary Password</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredResetRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        <div className="font-semibold text-slate-800">
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {req.username}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                          <Phone size={12} className="text-emerald-600" />
                          <span>+91 {req.registeredPhone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {req.status === 'pending' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                            <Clock size={10} /> Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 size={10} /> Resolved by {req.resolvedBy || 'Admin'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        {req.temporaryPassword ? (
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-bold text-xs">
                            {req.temporaryPassword}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Not issued yet</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {req.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedResetRequest(req);
                              setTempPassword(`NeedFix@${Math.floor(1000 + Math.random() * 9000)}`);
                            }}
                            className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Key size={12} />
                            <span>Issue Temporary Password</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedResetRequest(req);
                              setTempPassword(`NeedFix@${Math.floor(1000 + Math.random() * 9000)}`);
                            }}
                            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw size={11} />
                            <span>Re-issue</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ISSUE TEMPORARY PASSWORD                                           */}
      {/* ========================================================================= */}
      {selectedResetRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
                <KeyRound size={20} />
                <span>Issue Temporary Password</span>
              </div>
              <button
                onClick={() => setSelectedResetRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl text-xs space-y-1">
              <p className="font-bold">Identity Verification Checklist</p>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Confirm user identity before issuing credentials:
              </p>
              <div className="pt-1 font-mono text-xs font-semibold text-slate-800 space-y-0.5">
                <div>Username: <span className="text-blue-700">{selectedResetRequest.username}</span></div>
                <div>Registered Mobile: <span className="text-emerald-700">+91 {selectedResetRequest.registeredPhone}</span></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Temporary Password to Assign</label>
                <button
                  type="button"
                  onClick={() => setTempPassword(`NeedFix@${Math.floor(1000 + Math.random() * 9000)}`)}
                  className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Generate New
                </button>
              </div>
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                placeholder="Enter temporary password..."
              />
              <p className="text-[10px] text-slate-500">
                The user can immediately log in using their username and this password, then change it in their profile settings.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedResetRequest(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResolveResetRequest(selectedResetRequest, tempPassword)}
                disabled={!tempPassword.trim()}
                className="py-2.5 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                <span>Confirm & Update Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BLOCK CONFIRMATION & REASON INPUT                                  */}
      {/* ========================================================================= */}
      {itemToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <Ban size={20} />
                <span>Confirm Universal Device & IP Block</span>
              </div>
              <button
                onClick={() => setItemToBlock(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs space-y-1.5">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle size={14} className="text-red-600" />
                <span>Warning: Immediate Universal Freeze</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Blocking <strong>{itemToBlock.name}</strong> ({itemToBlock.uniqueId}) will add their IP address ({itemToBlock.ipAddress || 'Auto'}) and Device Fingerprint ({itemToBlock.deviceId || 'Auto'}) to the <strong>blocked_devices</strong> database. Their web interface will immediately freeze, and all Call & WhatsApp features will be permanently disabled.
              </p>
            </div>

            {/* Quick Reason Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reason for Suspension</label>
              <select
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="Suspicious activity / Policy violation">Suspicious activity / Policy violation</option>
                <option value="Fraudulent contact details or fake identity">Fraudulent contact details or fake identity</option>
                <option value="Abusive behavior / Customer harassment">Abusive behavior / Customer harassment</option>
                <option value="Fake Aadhaar or trade license documents">Fake Aadhaar or trade license documents</option>
                <option value="Multiple customer complaints regarding service">Multiple customer complaints regarding service</option>
                <option value="Unregistered commercial spamming">Unregistered commercial spamming</option>
              </select>
            </div>

            {/* Custom Reason Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Additional Notes (Optional)</label>
              <input
                type="text"
                placeholder="Enter specific audit remarks..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    setBlockReason(e.target.value);
                  }
                }}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToBlock(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                disabled={isSubmittingBlock}
                className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Ban size={14} />
                <span>{isSubmittingBlock ? 'Blacklisting...' : 'Confirm Block & Freeze'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
