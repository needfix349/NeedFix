import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  User,
  Phone,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Shield,
  RotateCcw,
  History,
  Lock,
  Unlock,
  Ban,
  Key,
  LogOut,
  PhoneCall,
  MessageSquare,
  ZoomIn,
  Check,
  Users,
} from 'lucide-react';
import { TechnicianProfile, AdminAuditLog, UserProfile } from '../../types';
import { storageService } from '../../services/storage';
import { supabaseService } from '../../services/supabaseService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { SERVICE_CATEGORIES } from '../../data/categories';

interface AdminPanelProps {
  currentUser?: UserProfile | null;
  onUserChange?: (user: UserProfile | null) => void;
  onExitAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser: propUser,
  onUserChange,
  onExitAdmin,
}) => {
  // Local admin user fallback if not passed as prop
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(
    propUser || storageService.getCurrentUser()
  );

  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [selectedTech, setSelectedTech] = useState<TechnicianProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'blocked' | 'audit'>('pending');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [idSearchQuery, setIdSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Zoomed Aadhaar image preview modal
  const [zoomedAadhaarUrl, setZoomedAadhaarUrl] = useState<string | null>(null);

  // Admin Login state (Supabase Email & Password) - Secure empty defaults
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  // Reject reason modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState(
    'Aadhaar document was blurry or unreadable. Please upload a clear photo of your ID.'
  );
  const [techToReject, setTechToReject] = useState<TechnicianProfile | null>(null);

  // Block confirmation modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('Service quality violation / customer complaint');
  const [techToBlock, setTechToBlock] = useState<TechnicianProfile | null>(null);

  // Sync propUser if changed
  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser);
    }
  }, [propUser]);

  const loadData = () => {
    setTechnicians(storageService.getTechnicians());
    setAuditLogs(storageService.getAuditLogs());

    supabaseService.getAllTechniciansForAdmin().then((allTechs) => {
      if (allTechs) {
        setTechnicians(allTechs);
      }
    }).catch(console.warn);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storageService.subscribe(loadData);
    return unsubscribe;
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  // Counts
  const pendingTechs = useMemo(() => technicians.filter((t) => t.status === 'pending'), [technicians]);
  const approvedTechs = useMemo(
    () => technicians.filter((t) => t.status === 'approved' && !t.isBlocked),
    [technicians]
  );
  const blockedTechs = useMemo(() => technicians.filter((t) => t.isBlocked), [technicians]);
  const rejectedTechs = useMemo(() => technicians.filter((t) => t.status === 'rejected'), [technicians]);
  const suspendedTechs = useMemo(() => technicians.filter((t) => t.status === 'suspended'), [technicians]);

  // Handle Admin Login with Supabase Auth & Master Fallback
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    setLoginSuccessMessage(null);

    try {
      const result = await supabaseService.signInAdmin(adminEmail, adminPassword);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        if (onUserChange) onUserChange(result.user);
        setLoginSuccessMessage(result.message || 'Administrator authenticated successfully.');
      } else {
        setLoginError(result.message || 'Invalid administrator credentials. Please check email & password.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await supabaseService.signOut();
    setCurrentUser(null);
    if (onUserChange) onUserChange(null);
    if (onExitAdmin) onExitAdmin();
  };

  const handleApprove = async (tech: TechnicianProfile) => {
    await supabaseService.updateTechnicianApprovalStatus(
      tech.id,
      'approved',
      currentUser?.name || 'NeedFix Admin Desk'
    );
    loadData();
    if (selectedTech?.id === tech.id) {
      setSelectedTech(storageService.getTechnicianById(tech.id) || null);
    }
  };

  const handleOpenReject = (tech: TechnicianProfile) => {
    setTechToReject(tech);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!techToReject) return;
    await supabaseService.updateTechnicianApprovalStatus(
      techToReject.id,
      'rejected',
      currentUser?.name || 'NeedFix Admin Desk',
      rejectReason
    );
    setShowRejectModal(false);
    setTechToReject(null);
    loadData();
    if (selectedTech?.id === techToReject.id) {
      setSelectedTech(storageService.getTechnicianById(techToReject.id) || null);
    }
  };

  // One-Click Block / Unblock
  const handleToggleBlock = async (tech: TechnicianProfile) => {
    if (tech.isBlocked) {
      // Instant Unblock
      await supabaseService.toggleTechnicianBlockStatus(
        tech.id,
        currentUser?.name || 'NeedFix Admin Desk',
        'Technician restored and unblocked by Admin'
      );
      loadData();
      if (selectedTech?.id === tech.id) {
        setSelectedTech(storageService.getTechnicianById(tech.id) || null);
      }
    } else {
      // Open block confirmation modal
      setTechToBlock(tech);
      setShowBlockModal(true);
    }
  };

  const handleConfirmBlock = async () => {
    if (!techToBlock) return;
    await supabaseService.toggleTechnicianBlockStatus(
      techToBlock.id,
      currentUser?.name || 'NeedFix Admin Desk',
      blockReason
    );
    setShowBlockModal(false);
    setTechToBlock(null);
    loadData();
    if (selectedTech?.id === techToBlock.id) {
      setSelectedTech(storageService.getTechnicianById(techToBlock.id) || null);
    }
  };

  const handleSuspend = async (tech: TechnicianProfile) => {
    const reason = prompt('Enter suspension reason:', 'Quality standards compliance investigation');
    if (reason) {
      await supabaseService.updateTechnicianApprovalStatus(
        tech.id,
        'suspended',
        currentUser?.name || 'NeedFix Admin Desk',
        reason
      );
      loadData();
      if (selectedTech?.id === tech.id) {
        setSelectedTech(storageService.getTechnicianById(tech.id) || null);
      }
    }
  };

  const handleReactivate = async (tech: TechnicianProfile) => {
    await supabaseService.updateTechnicianApprovalStatus(
      tech.id,
      'approved',
      currentUser?.name || 'NeedFix Admin Desk',
      'Account reactivated after review'
    );
    loadData();
    if (selectedTech?.id === tech.id) {
      setSelectedTech(storageService.getTechnicianById(tech.id) || null);
    }
  };

  // Filtered list with ID search & general search
  const filteredTechnicians = useMemo(() => {
    return technicians.filter((t) => {
      // Tab filter
      if (activeTab === 'pending' && t.status !== 'pending') return false;
      if (activeTab === 'blocked' && !t.isBlocked) return false;
      if (activeTab === 'all' && statusFilter !== 'all' && t.status !== statusFilter) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const matchCat =
          t.categoryId === selectedCategory ||
          (t.categoryIds && t.categoryIds.includes(selectedCategory));
        if (!matchCat) return false;
      }

      // Dedicated ID Search
      if (idSearchQuery.trim()) {
        const idQ = idSearchQuery.trim().toLowerCase();
        const code = (t.technicianCode || '').toLowerCase();
        if (!code.includes(idQ)) {
          return false;
        }
      }

      // General search (name, phone, company, category, code)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = (t.technicianCode || '').toLowerCase().includes(q);
        const matchName = t.fullName.toLowerCase().includes(q);
        const matchCompany = t.companyName.toLowerCase().includes(q);
        const matchCategory =
          t.categoryName.toLowerCase().includes(q) ||
          (t.categoryNames && t.categoryNames.some((c) => c.toLowerCase().includes(q)));
        const matchMobile = t.mobile.includes(searchQuery.trim());
        const matchAadhaar = (t.documents?.aadhaarNumber || '').includes(searchQuery.trim());

        if (!matchCode && !matchName && !matchCompany && !matchCategory && !matchMobile && !matchAadhaar) {
          return false;
        }
      }

      return true;
    });
  }, [technicians, activeTab, statusFilter, selectedCategory, idSearchQuery, searchQuery]);

  // Active concurrent admin sessions
  const activeSessions = supabaseService.getActiveAdminSessions();

  // ============================================================================
  // VIEW 1: ADMIN LOGIN GATE (Restricted Access)
  // ============================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900/5">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
                <ShieldCheck size={26} />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400">
                  Restricted Access • Supabase Auth
                </span>
                <h2 className="text-xl font-bold font-display text-white">NeedFix Admin Portal</h2>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Authenticate with your registered Supabase administrator credentials. Access to the technician verification queue and platform controls requires <span className="font-mono text-amber-300">role === 'admin'</span>.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="p-6 sm:p-8 space-y-4">
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {loginSuccessMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{loginSuccessMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying with Supabase Auth...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Sign In to Admin Dashboard</span>
                  </>
                )}
              </button>

              {onExitAdmin && (
                <button
                  type="button"
                  onClick={onExitAdmin}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Return to Customer Portal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ============================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Admin Identity & Supabase Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                <ShieldCheck size={18} />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-purple-300">
                NeedFix Administrator Portal
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Supabase PostgreSQL & Storage Active</span>
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <Users size={11} />
                <span>Concurrent Admins Supported (Max 10)</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Technician Verification & Moderation Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Review technician applications with Aadhaar ID cards & registered phone numbers, search by Technician ID (NF-TECH-XXXX), and moderate listings with 1-click Block/Unblock.
            </p>
          </div>

          {/* Admin Profile & Logout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src={
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
                }
                alt="Admin"
                className="w-9 h-9 rounded-xl object-cover border border-slate-600"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{currentUser?.name || 'Administrator'}</span>
                  <span className="bg-purple-500/30 text-purple-300 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">{currentUser?.email || 'needfix349@gmail.com'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="py-1.5 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Review</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{pendingTechs.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Approved & Live</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{approvedTechs.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Ban size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Blocked / Blacklisted</p>
            <p className="text-xl font-bold text-red-700 font-mono">{blockedTechs.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Registered</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{technicians.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Clock size={14} />
              <span>Pending Review Queue</span>
              {pendingTechs.length > 0 && (
                <span className="bg-white/30 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingTechs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <User size={14} />
              <span>All Technicians Directory ({technicians.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'blocked'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Ban size={14} />
              <span>Blocked / Blacklist ({blockedTechs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <History size={14} />
              <span>Audit Log History</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls (Dedicated Auto ID Search & Name Search) */}
        {activeTab !== 'audit' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {/* Dedicated Technician ID Search */}
            <div className="relative">
              <Key size={14} className="absolute left-3 top-3 text-indigo-500" />
              <input
                type="text"
                placeholder="Search by ID (e.g. NF-TECH-1001)..."
                value={idSearchQuery}
                onChange={(e) => setIdSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-indigo-50/50 border border-indigo-200 rounded-xl outline-none focus:border-indigo-600 font-mono font-semibold text-indigo-950 placeholder:text-indigo-400/80"
              />
              {idSearchQuery && (
                <button
                  type="button"
                  onClick={() => setIdSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-indigo-400 hover:text-indigo-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* General Name / Phone / Category Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, company, Aadhaar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-slate-800"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
            >
              <option value="all">All 22 Categories</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter (when in All tab) */}
            {activeTab === 'all' ? (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved Only</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            ) : (
              <div className="text-xs text-slate-500 flex items-center justify-end px-2 font-medium">
                Showing <span className="font-bold text-slate-900 mx-1">{filteredTechnicians.length}</span> results
              </div>
            )}
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Recent Administrative Approval & Moderation Actions</h3>
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No administrative actions logged yet.</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`p-1.5 rounded-lg mt-0.5 ${
                          log.action === 'approved' || log.action === 'reactivated'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'rejected' || log.action === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.action === 'approved' || log.action === 'reactivated' ? (
                          <CheckCircle2 size={16} />
                        ) : log.action === 'rejected' || log.action === 'blocked' ? (
                          <XCircle size={16} />
                        ) : (
                          <AlertTriangle size={16} />
                        )}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.technicianName}</span>
                          <span
                            className={`px-2 py-0.2 rounded-full font-bold uppercase text-[10px] ${
                              log.action === 'approved' || log.action === 'reactivated'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                : 'bg-red-50 text-red-700 border border-red-300'
                            }`}
                          >
                            {log.action}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{log.reason || 'Standard admin review action'}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          By: {log.adminName} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VERIFICATION VIEW: APPLICATIONS & DIRECTORY LIST */}
        {activeTab !== 'audit' && (
          <div className="space-y-3">
            {filteredTechnicians.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Clock size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700">No technician profiles found in this view</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {idSearchQuery
                    ? `No technician matches ID "${idSearchQuery}".`
                    : activeTab === 'pending'
                    ? 'All pending technician submissions have been reviewed!'
                    : activeTab === 'blocked'
                    ? 'No blocked or blacklisted technicians.'
                    : 'Try changing your search keywords or category filter.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTechnicians.map((tech) => {
                  const isBlocked = Boolean(tech.isBlocked);
                  return (
                    <div
                      key={tech.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isBlocked
                          ? 'bg-red-50/50 border-red-300 shadow-xs'
                          : tech.status === 'pending'
                          ? 'bg-amber-50/40 border-amber-300/80 shadow-xs'
                          : tech.status === 'approved'
                          ? 'bg-white border-slate-200 shadow-xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Header card info with Auto Technician ID */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={tech.profilePhotoUrl}
                              alt={tech.fullName}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              {/* Technician Auto-Generated ID Badge */}
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span className="font-mono text-[11px] font-black px-2 py-0.5 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-md tracking-wider">
                                  {tech.technicianCode || 'NF-TECH-1000'}
                                </span>
                                {tech.isVerified && <VerifiedBadge size="sm" showText={false} />}
                              </div>

                              <h4 className="font-bold text-slate-900 text-sm">
                                {tech.companyName || tech.fullName}
                              </h4>
                              {tech.companyName && tech.fullName !== tech.companyName && (
                                <p className="text-xs font-medium text-slate-500">{tech.fullName}</p>
                              )}

                              <div className="flex items-center gap-1 text-xs text-blue-700 font-medium mt-1 flex-wrap">
                                {(tech.categoryIds && tech.categoryIds.length > 0
                                  ? tech.categoryIds
                                  : [tech.categoryId]
                                ).map((cId) => {
                                  const cObj = SERVICE_CATEGORIES.find((sc) => sc.id === cId);
                                  return (
                                    <span
                                      key={cId}
                                      className="bg-blue-50 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-blue-200/60"
                                    >
                                      {cObj?.name || tech.categoryName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Status Pill */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                                isBlocked
                                  ? 'bg-red-600 text-white'
                                  : tech.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : tech.status === 'pending'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                  : tech.status === 'rejected'
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {isBlocked
                                ? '🚨 Blocked / Blacklisted'
                                : tech.status === 'pending'
                                ? '⏳ Pending Review'
                                : tech.status === 'approved'
                                ? '✅ Approved'
                                : tech.status === 'rejected'
                                ? '❌ Rejected'
                                : '🚫 Suspended'}
                            </span>
                            {isBlocked && (
                              <span className="text-[10px] text-red-600 font-bold">
                                Hidden from all customer searches
                              </span>
                            )}
                          </div>
                        </div>

                        {/* VERIFICATION VIEW: Registered Phone Number & Aadhaar Card Review */}
                        <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-2.5">
                          {/* 1. Registered Phone Section */}
                          <div className="p-2.5 bg-slate-100/70 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-100 text-blue-700">
                                <Phone size={13} />
                              </span>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                  Registered Phone Number
                                </span>
                                <span className="font-mono font-bold text-slate-900 text-xs">
                                  +91 {tech.mobile}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:+91${tech.mobile}`}
                                className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <PhoneCall size={11} className="text-blue-600" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/91${tech.whatsappNumber || tech.mobile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare size={11} />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* 2. Fast Aadhaar Card Review Document View (From Supabase Storage) */}
                          <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative group shrink-0">
                                <img
                                  src={
                                    tech.documents?.aadhaarDocUrl ||
                                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
                                  }
                                  alt="Aadhaar Card"
                                  className="w-14 h-10 object-cover rounded-lg border border-blue-200 cursor-pointer shadow-xs group-hover:opacity-90"
                                  onClick={() =>
                                    setZoomedAadhaarUrl(
                                      tech.documents?.aadhaarDocUrl ||
                                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setZoomedAadhaarUrl(
                                      tech.documents?.aadhaarDocUrl ||
                                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                                    )
                                  }
                                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg transition-opacity"
                                  title="Quick Zoom Aadhaar"
                                >
                                  <ZoomIn size={12} />
                                </button>
                              </div>
                              <div className="truncate">
                                <div className="flex items-center gap-1">
                                  <Shield size={12} className="text-blue-600 shrink-0" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 truncate">
                                    Aadhaar Card (Storage)
                                  </span>
                                </div>
                                <span className="font-mono font-bold text-slate-800 text-[11px] block truncate">
                                  {tech.documents?.aadhaarNumber || 'Verified ID'}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setZoomedAadhaarUrl(
                                  tech.documents?.aadhaarDocUrl ||
                                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                                )
                              }
                              className="text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 shrink-0 flex items-center gap-1"
                            >
                              <Eye size={12} />
                              <span>View Doc</span>
                            </button>
                          </div>

                          {/* Blocked note or Rejection note */}
                          {tech.isBlocked && (
                            <div className="p-2 bg-red-100 text-red-800 rounded-xl text-[11px] font-medium border border-red-200">
                              <span className="font-bold">Blacklist Reason:</span>{' '}
                              {tech.blockedReason || 'Blocked by NeedFix Admin'}
                            </div>
                          )}

                          {tech.rejectionReason && !tech.isBlocked && (
                            <p className="text-[11px] text-red-700 bg-red-50 p-2 rounded-xl border border-red-200">
                              Rejection note: {tech.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons (Review, Approve, Reject, and One-Click Block / Unblock) */}
                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTech(tech)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <FileText size={13} />
                          <span>Full Application</span>
                        </button>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Approval / Rejection Controls */}
                          {tech.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(tech)}
                                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 size={13} />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenReject(tech)}
                                className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {/* ONE-CLICK BLOCK / UNBLOCK BUTTON */}
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(tech)}
                              className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Unblock and restore technician to customer listings"
                            >
                              <Unlock size={13} />
                              <span>Unblock Technician</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(tech)}
                              className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Instantly block and hide this technician from all customer search results"
                            >
                              <Ban size={12} />
                              <span>Block / Blacklist</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FULL APPLICATION & DOCUMENT REVIEW MODAL */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTech.profilePhotoUrl}
                  alt={selectedTech.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-indigo-500/40 text-indigo-200 border border-indigo-400/40 rounded-md">
                      {selectedTech.technicianCode || 'NF-TECH-1000'}
                    </span>
                    <h3 className="text-lg font-bold font-display">{selectedTech.fullName}</h3>
                    {selectedTech.isVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <p className="text-xs text-blue-200">
                    {selectedTech.companyName} • Applied {new Date(selectedTech.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTech(null)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
              {/* Status Notice */}
              <div
                className={`flex items-center justify-between p-3.5 rounded-2xl ${
                  selectedTech.isBlocked
                    ? 'bg-red-100 border border-red-200 text-red-900'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <div>
                  <span className="text-xs text-slate-500 font-medium">Current Moderation Status:</span>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider font-mono">
                    {selectedTech.isBlocked ? '🚨 BLOCKED / BLACKLISTED' : selectedTech.status}
                  </span>
                </div>
                {selectedTech.isBlocked ? (
                  <span className="text-xs text-red-700 font-bold flex items-center gap-1">
                    <Ban size={14} /> Hidden from Customer Search
                  </span>
                ) : selectedTech.isVerified ? (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified Badge Active
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                    <Clock size={14} /> Pending Approval
                  </span>
                )}
              </div>

              {/* Personal & Registered Contact Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Personal & Registered Phone Number Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registered Mobile:</span>
                    <span className="font-semibold text-slate-900 font-mono text-sm">
                      +91 {selectedTech.mobile}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">WhatsApp Business:</span>
                    <span className="font-semibold text-emerald-700 font-mono text-sm">
                      +91 {selectedTech.whatsappNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Address:</span>
                    <span className="font-semibold text-slate-900">{selectedTech.email || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Verification Documents Section (Aadhaar from Supabase Storage) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Shield size={14} className="text-blue-600" />
                  National ID (Aadhaar) Document Review
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Aadhaar Card Front */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">
                        {selectedTech.documents?.aadhaarBackDocUrl ? 'Aadhaar Card (Front Side)' : 'National ID Aadhaar Card'}
                      </span>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-800">
                        {selectedTech.documents?.aadhaarNumber}
                      </span>
                    </div>
                    <img
                      src={
                        selectedTech.documents?.aadhaarDocUrl ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                      }
                      alt="Aadhaar Card Front"
                      className="w-full h-44 object-cover rounded-xl border border-blue-200 shadow-xs cursor-pointer"
                      onClick={() =>
                        setZoomedAadhaarUrl(
                          selectedTech.documents?.aadhaarDocUrl ||
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                        )
                      }
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setZoomedAadhaarUrl(
                            selectedTech.documents?.aadhaarDocUrl ||
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                          )
                        }
                        className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ZoomIn size={13} />
                        <span>Zoom Front</span>
                      </button>
                      <a
                        href={selectedTech.documents?.aadhaarDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <span>Open raw</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Aadhaar Card Back (if available from Guided KYC) */}
                  {selectedTech.documents?.aadhaarBackDocUrl && (
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900">Aadhaar Card (Back Side / Address)</span>
                        <span className="text-[10px] uppercase font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
                          Dual-Side KYC
                        </span>
                      </div>
                      <img
                        src={selectedTech.documents.aadhaarBackDocUrl}
                        alt="Aadhaar Card Back"
                        className="w-full h-44 object-cover rounded-xl border border-indigo-200 shadow-xs cursor-pointer"
                        onClick={() => setZoomedAadhaarUrl(selectedTech.documents?.aadhaarBackDocUrl || '')}
                      />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setZoomedAadhaarUrl(selectedTech.documents?.aadhaarBackDocUrl || '')}
                          className="text-xs text-indigo-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ZoomIn size={13} />
                          <span>Zoom Back</span>
                        </button>
                        <a
                          href={selectedTech.documents.aadhaarBackDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        >
                          <span>Open raw</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Trade License or Business Details */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <span className="text-xs font-bold text-slate-900 block">Service Specifications</span>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Business Address:</span>
                      <span className="font-medium text-slate-900">
                        {selectedTech.businessAddress} ({selectedTech.location.city})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Localities Covered:</span>
                      <span className="font-medium text-slate-900">{selectedTech.coverageAreaText}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Visiting / Inspection Fee:</span>
                      <span className="font-bold text-slate-900">₹{selectedTech.inspectionFee}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Description & Bio:</span>
                      <p className="text-slate-700 mt-1 leading-relaxed text-[11px]">
                        {selectedTech.businessDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-300 cursor-pointer"
              >
                Close View
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {/* ONE-CLICK BLOCK / UNBLOCK */}
                {selectedTech.isBlocked ? (
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(selectedTech)}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Unlock size={14} />
                    <span>Unblock & Restore Technician</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(selectedTech)}
                    className="py-2.5 px-4 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ban size={14} />
                    <span>Block / Blacklist</span>
                  </button>
                )}

                {selectedTech.status !== 'approved' && !selectedTech.isBlocked && (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedTech)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve & Grant Verified Badge</span>
                  </button>
                )}

                {selectedTech.status !== 'rejected' && !selectedTech.isBlocked && (
                  <button
                    type="button"
                    onClick={() => handleOpenReject(selectedTech)}
                    className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reject Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AADHAAR ZOOM MODAL (High-Res Inspector) */}
      {zoomedAadhaarUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setZoomedAadhaarUrl(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2 text-sm font-bold flex items-center gap-1 cursor-pointer"
            >
              <XCircle size={20} />
              <span>Close Document</span>
            </button>
            <img
              src={zoomedAadhaarUrl}
              alt="High-Res Aadhaar Document"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
            <div className="mt-3 text-center text-xs text-white/80">
              National ID Aadhaar Card • Supabase Storage Verified Preview
            </div>
          </div>
        </div>
      )}

      {/* ONE-CLICK BLOCK CONFIRMATION MODAL */}
      {showBlockModal && techToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <Ban size={24} />
              <h3 className="text-base font-bold text-slate-900">Block / Blacklist Technician</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to block <span className="font-bold text-slate-900">{techToBlock.fullName}</span>{' '}
              (<span className="font-mono font-bold text-indigo-700">{techToBlock.technicianCode}</span>)?
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
              <p className="font-bold">Immediate Moderation Effect:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Automatically hidden from ALL customer search results and listings.</li>
                <li>Will not appear on maps or nearby categories.</li>
                <li>Can be unblocked at any time from this Admin Panel.</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Block / Blacklist Reason:
              </label>
              <textarea
                rows={2}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-red-500 font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 cursor-pointer"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {showRejectModal && techToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <XCircle size={22} />
              <h3 className="text-base font-bold text-slate-900">Reject Technician Application</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              State the reason for rejecting <span className="font-bold text-slate-900">{techToReject.fullName}</span>.
              This feedback helps the technician rectify their Aadhaar documentation.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Rejection Reason / Feedback:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-red-500 font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
