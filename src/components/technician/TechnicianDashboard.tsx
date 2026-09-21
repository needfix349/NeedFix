import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  Star,
  Eye,
  Calendar,
  MapPin,
  Edit,
  Save,
  Sparkles,
  User,
  Power,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  Camera,
  FolderOpen,
  Image as ImageIcon,
  Tag,
  Navigation,
  Building2,
  Mail,
  Flag,
} from 'lucide-react';
import { TechnicianProfile, Review, ActivityLog, TechnicianServiceItem } from '../../types';
import { storageService } from '../../services/storage';
import { supabaseService } from '../../services/supabaseService';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { getCurrentGPSLocation } from '../../services/locationService';
import { LocationSelectionModal } from '../common/LocationSelectionModal';

interface TechnicianDashboardProps {
  technician: TechnicianProfile;
  onOpenEditApplication?: () => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  technician: initialTech,
  onOpenEditApplication,
}) => {
  const [tech, setTech] = useState<TechnicianProfile>(initialTech);
  const [activeTab, setActiveTab] = useState<'activity' | 'reviews' | 'edit'>('activity');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  
  // Profile editing state
  const [editBio, setEditBio] = useState(initialTech.businessDescription);
  const [editPrice, setEditPrice] = useState(initialTech.startingPrice);
  const [editInspectionFee, setEditInspectionFee] = useState(initialTech.inspectionFee || initialTech.startingPrice || 299);
  const [editPriceUnit, setEditPriceUnit] = useState(initialTech.priceUnit || 'Visiting Fee');
  const [editHourlyRate, setEditHourlyRate] = useState<number | ''>(initialTech.hourlyRate || '');
  const [editRateCardNotes, setEditRateCardNotes] = useState(initialTech.rateCardNotes || '');
  const [editRadius, setEditRadius] = useState<number>(
    initialTech.coverageRadiusKm && initialTech.coverageRadiusKm >= 1 ? initialTech.coverageRadiusKm : 5
  );
  const [editCoverageArea, setEditCoverageArea] = useState(initialTech.coverageAreaText);
  const [editWorkingHours, setEditWorkingHours] = useState(initialTech.workingHours);
  const [editServices, setEditServices] = useState<TechnicianServiceItem[]>(initialTech.servicesOffered || []);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(299);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePhotoUrl, setNewServicePhotoUrl] = useState('');
  const [newServiceFileName, setNewServiceFileName] = useState('');
  const newServiceFileInputRef = React.useRef<HTMLInputElement>(null);

  // For modifying photo on an existing item
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const editItemFileInputRef = React.useRef<HTMLInputElement>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSyncingStatus, setIsSyncingStatus] = useState(false);
  const [justApprovedAlert, setJustApprovedAlert] = useState(false);

  const syncStatusWithDatabase = async (showLoading = false) => {
    if (showLoading) setIsSyncingStatus(true);
    try {
      const targetId = tech.id || tech.userId || initialTech.id || initialTech.userId;
      const remote = await supabaseService.getTechnicianProfile(targetId);
      if (remote) {
        setTech((prev) => {
          const wasNotApproved = !prev.isApproved && prev.status !== 'approved';
          const isNowApproved = remote.isApproved || remote.status === 'approved';
          if (wasNotApproved && isNowApproved) {
            setJustApprovedAlert(true);
          }
          return { ...prev, ...remote };
        });
      }
    } catch (err) {
      console.warn('Status sync error:', err);
    } finally {
      if (showLoading) setIsSyncingStatus(false);
    }
  };

  const loadData = () => {
    const targetId = tech.id || initialTech.id;
    const updated =
      storageService.getTechnicianById(targetId) ||
      storageService.getTechnicians().find((t) => t.userId === initialTech.userId || t.id === initialTech.id);
    if (updated) {
      setTech((prev) => ({ ...prev, ...updated }));
    }
    setReviews(storageService.getReviews(targetId));
    setActivityLogs(storageService.getActivityLogs(targetId));
    // Also sync latest logs from backend API if available
    storageService.fetchRemoteActivityLogs(targetId).then((remote) => {
      if (remote && Array.isArray(remote)) {
        setActivityLogs(remote);
      }
    });
  };

  useEffect(() => {
    loadData();
    syncStatusWithDatabase(false);

    const unsubscribe = storageService.subscribe(loadData);

    // Subscribe to realtime changes in Supabase
    const targetId = tech.id || tech.userId || initialTech.id || initialTech.userId;
    const unsubRealtime = supabaseService.subscribeToTechnicianUpdates(targetId, (updated) => {
      setTech((prev) => {
        const wasNotApproved = !prev.isApproved && prev.status !== 'approved';
        const isNowApproved = updated.isApproved || updated.status === 'approved';
        if (wasNotApproved && isNowApproved) {
          setJustApprovedAlert(true);
        }
        return { ...prev, ...updated };
      });
    });

    // Background interval to re-check Supabase every 5 seconds if still pending
    let interval: any = null;
    const isLive = tech.status === 'approved' || tech.isApproved;
    if (!isLive) {
      interval = setInterval(() => {
        syncStatusWithDatabase(false);
      }, 5000);
    }

    return () => {
      unsubscribe();
      unsubRealtime();
      if (interval) clearInterval(interval);
    };
  }, [initialTech.id, tech.id, tech.status, tech.isApproved]);

  const [isUpdatingGPS, setIsUpdatingGPS] = useState(false);
  const [gpsUpdateMsg, setGpsUpdateMsg] = useState<string | null>(null);
  const [showWorkshopLocationModal, setShowWorkshopLocationModal] = useState(false);
  const [isTogglingOnline, setIsTogglingOnline] = useState(false);
  const [onlineStatusMsg, setOnlineStatusMsg] = useState<string | null>(null);

  const handleUpdateWorkshopGPS = async () => {
    setIsUpdatingGPS(true);
    setGpsUpdateMsg(null);
    try {
      const loc = await getCurrentGPSLocation();
      const updated: TechnicianProfile = {
        ...tech,
        location: loc,
        coverageAreaText: `${loc.area}, ${loc.city}`,
        businessAddress: loc.address || `${loc.area}, ${loc.city}`,
      };
      setTech(updated);
      storageService.updateTechnicianProfile(updated);
      await supabaseService.updateTechnicianProfile(updated);
      setGpsUpdateMsg(`Workshop GPS Pin updated to ${loc.area || loc.city}`);
      setTimeout(() => setGpsUpdateMsg(null), 4000);
    } catch (e) {
      console.error(e);
      setGpsUpdateMsg('Could not detect live GPS. Please verify permissions.');
      setTimeout(() => setGpsUpdateMsg(null), 4000);
    } finally {
      setIsUpdatingGPS(false);
    }
  };

  const handleManualSelectWorkshopLocation = async (loc: any) => {
    const updated: TechnicianProfile = {
      ...tech,
      location: loc,
      coverageAreaText: `${loc.area}, ${loc.city}`,
      businessAddress: loc.address || `${loc.area}, ${loc.city}`,
    };
    setTech(updated);
    storageService.updateTechnicianProfile(updated);
    await supabaseService.updateTechnicianProfile(updated);
    setGpsUpdateMsg(`Workshop Location updated to ${loc.area || loc.city}`);
    setTimeout(() => setGpsUpdateMsg(null), 4000);
  };

  const handleToggleOnline = async () => {
    if (isTogglingOnline) return;
    const newOnline = !tech.isOnline;
    setIsTogglingOnline(true);
    const updated = { ...tech, isOnline: newOnline };
    setTech(updated);
    storageService.updateTechnicianProfile(updated);
    try {
      await supabaseService.updateTechnicianOnlineStatus(tech.id, newOnline);
      setOnlineStatusMsg(
        newOnline
          ? '🟢 You are now ONLINE & accepting customer leads!'
          : '⚪ You are now OFFLINE (Paused)'
      );
      setTimeout(() => setOnlineStatusMsg(null), 4000);
    } catch (err) {
      console.warn('Error syncing online status:', err);
    } finally {
      setIsTogglingOnline(false);
    }
  };

  const handleSendReply = (reviewId: string) => {
    const reply = replyText[reviewId];
    if (reply?.trim()) {
      storageService.replyToReview(reviewId, reply.trim());
      setReplyText({ ...replyText, [reviewId]: '' });
    }
  };

  const handleNewServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewServiceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewServicePhotoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditItemFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || editingPhotoIndex === null) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const photoUrl = event.target.result as string;
        setEditServices((prev) =>
          prev.map((srv, idx) => (idx === editingPhotoIndex ? { ...srv, photoUrl } : srv))
        );
        setEditingPhotoIndex(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddServiceItem = () => {
    if (!newServiceName.trim()) return;
    setEditServices([
      ...editServices,
      {
        id: `srv_${Date.now()}`,
        name: newServiceName.trim(),
        price: Number(newServicePrice) || 299,
        description: newServiceDesc.trim() || undefined,
        photoUrl: newServicePhotoUrl || undefined,
      },
    ]);
    setNewServiceName('');
    setNewServicePrice(299);
    setNewServiceDesc('');
    setNewServicePhotoUrl('');
    setNewServiceFileName('');
  };

  const handleUpdateServicePrice = (index: number, newPrice: number) => {
    setEditServices((prev) =>
      prev.map((srv, idx) => (idx === index ? { ...srv, price: newPrice } : srv))
    );
  };

  const handleRemoveServiceItem = (index: number) => {
    setEditServices(editServices.filter((_, i) => i !== index));
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const updated: TechnicianProfile = {
      ...tech,
      businessDescription: editBio.trim(),
      startingPrice: Number(editInspectionFee) || Number(editPrice) || 299,
      inspectionFee: Number(editInspectionFee) || Number(editPrice) || 299,
      priceUnit: editPriceUnit.trim() || 'Visiting Fee',
      hourlyRate: editHourlyRate ? Number(editHourlyRate) : undefined,
      rateCardNotes: editRateCardNotes.trim() || undefined,
      coverageRadiusKm: Math.min(20, Math.max(1, Number(editRadius))),
      coverageAreaText: editCoverageArea.trim(),
      workingHours: editWorkingHours.trim(),
      servicesOffered: editServices,
    };
    setTech(updated);
    storageService.updateTechnicianProfile(updated);
    await supabaseService.updateTechnicianProfile(updated);
    setIsSavingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Status-dependent variables
  const isApproved = tech.status === 'approved' || tech.isApproved === true;
  const isPending = !isApproved && (tech.status === 'pending' || !tech.status);
  const isRejected = tech.status === 'rejected';
  const isSuspended = tech.status === 'suspended';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Real-time approval celebration toast banner */}
      {justApprovedAlert && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 border border-emerald-500/80 text-white flex items-start gap-3.5 shadow-xl animate-in fade-in slide-in-from-top-3 duration-300">
          <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-emerald-200">
                🎉 Congratulations! Your Technician Profile is Approved & Live!
              </h3>
              <button
                type="button"
                onClick={() => setJustApprovedAlert(false)}
                className="text-emerald-300 hover:text-white text-xs px-2.5 py-1 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
              Your Aadhaar ID and business documents have been verified by the Admin team. Your profile is now actively visible to customers in your area and ready to receive bookings and direct calls.
            </p>
          </div>
        </div>
      )}

      {/* STATUS HEADER BANNER */}
      <div
        className={`rounded-3xl p-6 sm:p-7 border shadow-xl transition-all ${
          isApproved
            ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-slate-800'
            : isPending
            ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 text-white border-amber-800/80'
            : isRejected
            ? 'bg-gradient-to-r from-red-950 via-red-900 to-slate-900 text-white border-red-800'
            : 'bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 text-white border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <img
              src={tech.profilePhotoUrl}
              alt={tech.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {tech.fullName}
                </h1>
                {isApproved && <VerifiedBadge size="md" />}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{tech.companyName}</p>
              <div className="flex items-center gap-2 text-xs text-blue-200 mt-1 flex-wrap">
                <span>{tech.categoryName}</span>
                <span>•</span>
                <span>{tech.location.city}</span>
              </div>
            </div>
          </div>

          {/* Status Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => syncStatusWithDatabase(true)}
              disabled={isSyncingStatus}
              title="Sync profile status with live database"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/90 transition-all border border-white/15 active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <RefreshCw size={15} className={isSyncingStatus ? 'animate-spin' : ''} />
            </button>

            {isApproved && (
              <button
                type="button"
                onClick={handleToggleOnline}
                disabled={isTogglingOnline}
                title="Toggle Live Online status to receive bookings from customers"
                className={`py-2 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                  tech.isOnline
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                } ${isTogglingOnline ? 'opacity-70 cursor-wait' : ''}`}
              >
                <Power size={14} className={tech.isOnline ? 'animate-pulse' : ''} />
                <span>
                  {isTogglingOnline
                    ? 'Updating...'
                    : tech.isOnline
                    ? '🟢 Accepting Leads (Online)'
                    : '⚪ Paused (Offline)'}
                </span>
              </button>
            )}

            {/* Status Pill */}
            <div
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-xs ${
                isApproved
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                  : isPending
                  ? 'bg-amber-950/90 text-amber-300 border-amber-600 animate-pulse'
                  : isRejected
                  ? 'bg-red-950 text-red-300 border-red-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isApproved && <CheckCircle2 size={15} />}
              {isPending && <Clock size={15} />}
              {isRejected && <XCircle size={15} />}
              {isSuspended && <AlertTriangle size={15} />}
              <span>
                {isApproved
                  ? 'Approved & Live'
                  : isPending
                  ? 'Pending Admin Review'
                  : isRejected
                  ? 'Application Rejected'
                  : 'Account Suspended'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Online Toggle Feedback Toast */}
        {onlineStatusMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{onlineStatusMsg}</span>
          </div>
        )}

        {/* Status Explanation Card */}
        {isPending && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-900/40 border border-amber-600/60 text-xs text-amber-100">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-amber-200 text-sm">Application Status: Pending Admin Review</p>
                <p className="text-amber-100/90 mt-0.5 leading-relaxed">
                  Your technician registration documents (National ID Aadhaar card) are currently being reviewed by the NeedFix administration team.
                  Until approved, your profile will remain hidden from customer search results to prevent unverified listings.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => syncStatusWithDatabase(true)}
                    disabled={isSyncingStatus}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/50 text-amber-100 font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <RefreshCw size={13} className={isSyncingStatus ? 'animate-spin' : ''} />
                    <span>{isSyncingStatus ? 'Checking Live Database...' : 'Check Approval Status Now'}</span>
                  </button>
                  <span className="text-[11px] text-amber-200/70">
                    Auto-checking live updates every 5 seconds...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mt-4 p-4 rounded-2xl bg-red-900/40 border border-red-600/60 text-xs text-red-100 flex items-start gap-3">
            <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-red-200 text-sm">Application Rejected</p>
              <p className="text-red-100/90 mt-0.5">
                Admin feedback: <span className="font-medium text-white">{tech.rejectionReason || 'Documents could not be verified'}</span>
              </p>
              {onOpenEditApplication && (
                <button
                  type="button"
                  onClick={onOpenEditApplication}
                  className="mt-2 py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
                >
                  Resubmit Updated Application
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* METRIC KPI COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Incoming Calls</span>
            <Phone size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{tech.totalCalls || 0}</p>
          <span className="text-[10px] text-slate-400">Direct phone taps</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>WhatsApp Clicks</span>
            <MessageSquare size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{tech.totalWhatsAppClicks || 0}</p>
          <span className="text-[10px] text-slate-400">Chat requests</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Profile Views</span>
            <Eye size={16} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{tech.profileViews || 0}</p>
          <span className="text-[10px] text-slate-400">Customer views</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Rating & Reviews</span>
            <Star size={16} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-bold text-slate-900 font-mono">{tech.rating > 0 ? tech.rating : 'N/A'}</p>
            <span className="text-xs text-slate-400">({reviews.length})</span>
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Customer score</span>
        </div>
      </div>

      {/* DASHBOARD TABS & CONTENT */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center border-b border-slate-200 px-4 pt-3 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2.5 px-4 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'activity'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone size={14} />
            <span>Customer Calls & WhatsApp ({activityLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2.5 px-4 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star size={14} />
            <span>Reviews & Ratings ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`py-2.5 px-4 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'edit'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag size={14} />
            <span>Services, Rates & Photos ({editServices.length})</span>
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* TAB 1: CALL & WHATSAPP LOGS */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Customer Inquiries (Call & WhatsApp Logs)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    View customer name & ID. Tap <strong>Complaint</strong> to send an official report directly to Admin via email.
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                  {activityLogs.length} Customer {activityLogs.length === 1 ? 'Action' : 'Actions'}
                </span>
              </div>

              {activityLogs.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Phone size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No contact activity recorded yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    When customers tap "Call Technician" or "WhatsApp Chat" on your verified card, events will log here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  {activityLogs.map((log) => {
                    const custId = log.customerId || 'CUST-Pending';
                    const custName = log.customerName || 'Customer';
                    const techCode = tech.technicianCode || `TECH-${tech.id.slice(-4)}`;
                    
                    const complaintSubject = encodeURIComponent(
                      `[NeedFix Complaint] Report against Customer ID: ${custId}`
                    );
                    const complaintBody = encodeURIComponent(
                      `Dear NeedFix Admin,\n\nI am reporting an issue/complaint regarding the following customer:\n\n- Customer ID: ${custId}\n- Customer Name: ${custName}\n- Contact Type: ${log.type === 'call' ? 'Phone Call' : log.type === 'whatsapp' ? 'WhatsApp' : 'Profile Interaction'}\n- Time of Interaction: ${new Date(log.timestamp).toLocaleString()}\n\nTechnician Details:\n- Technician Name: ${tech.fullName}\n- Technician ID: ${techCode}\n- Phone: ${tech.mobile}\n\nComplaint / Issue Details:\n[Please describe what happened here...]\n\nRegards,\n${tech.fullName}`
                    );
                    const mailtoUrl = `mailto:needfix349@gmail.com?subject=${complaintSubject}&body=${complaintBody}`;

                    return (
                      <div
                        key={log.id}
                        className="p-3.5 sm:p-4 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              log.type === 'call'
                                ? 'bg-blue-100 text-blue-700'
                                : log.type === 'whatsapp'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {log.type === 'call' ? (
                              <Phone size={16} />
                            ) : log.type === 'whatsapp' ? (
                              <MessageSquare size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-slate-900 text-sm">
                                {custName}
                              </p>
                              <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                ID: {custId}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  log.type === 'call'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : log.type === 'whatsapp'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}
                              >
                                {log.type === 'call'
                                  ? 'Call Clicked'
                                  : log.type === 'whatsapp'
                                  ? 'WhatsApp Clicked'
                                  : 'Profile View'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Complaint Button & Action */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-1 sm:pt-0">
                          <a
                            href={mailtoUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-xl text-xs font-bold transition-all active:scale-[0.98] shadow-2xs"
                            title={`Send Complaint to Admin regarding Customer ${custId}`}
                          >
                            <Flag size={13} className="text-red-600" />
                            <span>Complaint</span>
                            <Mail size={12} className="text-red-500 opacity-70 ml-0.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RATINGS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Customer Ratings & Feedback</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  <span>{tech.rating > 0 ? `${tech.rating} / 5.0` : 'No ratings yet'} ({reviews.length} reviews)</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Star size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No reviews received yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer ratings and feedback from direct calls and service requests will show up here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={rev.customerName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                            <span className="text-[11px] text-slate-400 block">{rev.serviceUsed}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{rev.comment}"
                      </p>

                      {/* Reply section */}
                      {rev.technicianReply ? (
                        <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-200/60 text-xs">
                          <span className="font-bold text-blue-900 text-[11px]">Your Reply:</span>
                          <p className="text-blue-950 mt-0.5">{rev.technicianReply}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Write a polite reply to this customer..."
                            value={replyText[rev.id] || ''}
                            onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendReply(rev.id)}
                            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDIT PROFILE & SERVICES */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfileSettings} className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Profile & Service Rates Settings</h3>
                {saveSuccess && (
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Saved Successfully
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Business Description / Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs outline-none focus:border-blue-600"
                />
              </div>

              {/* Coverage Radius & Working Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>🎯 Service Coverage Radius</span>
                      </label>
                      <p className="text-[10px] text-slate-500 font-normal">
                        Select exact service distance (1 km to 20 km)
                      </p>
                    </div>

                    {/* Interactive Stepper & Value Badge */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setEditRadius((prev) => Math.max(1, prev - 1))}
                        disabled={editRadius <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold transition-all cursor-pointer"
                        title="Decrease 1 km"
                      >
                        <Minus size={14} />
                      </button>

                      <div className="flex items-center justify-center min-w-[58px] px-1 text-center font-extrabold text-blue-600 text-sm">
                        <span>{editRadius}</span>
                        <span className="text-[11px] font-semibold text-slate-500 ml-0.5">km</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditRadius((prev) => Math.min(20, prev + 1))}
                        disabled={editRadius >= 20}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold transition-all cursor-pointer"
                        title="Increase 1 km"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Smooth Real-Time Range Slider (1 to 20 km with dynamic fill & touch-none) */}
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={editRadius}
                      onInput={(e) => {
                        const val = parseInt((e.target as HTMLInputElement).value, 10);
                        if (!isNaN(val)) setEditRadius(Math.min(20, Math.max(1, val)));
                      }}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setEditRadius(Math.min(20, Math.max(1, val)));
                      }}
                      className="w-full accent-blue-600 cursor-pointer h-2.5 rounded-lg appearance-none touch-none"
                      style={{
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((editRadius - 1) / 19) * 100}%, #e2e8f0 ${((editRadius - 1) / 19) * 100}%, #e2e8f0 100%)`,
                      }}
                    />
                  </div>

                  {/* Quick One-Tap Preset Buttons */}
                  <div className="flex items-center justify-between gap-1 sm:gap-1.5">
                    {[1, 2, 3, 5, 8, 10, 15, 20].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setEditRadius(step)}
                        className={`flex-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                          editRadius === step
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105 z-10'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {step}k
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1 km (Local)</span>
                    <span>5 km (City Zone)</span>
                    <span>10 km (Standard)</span>
                    <span>20 km (Max)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={editWorkingHours}
                    onChange={(e) => setEditWorkingHours(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-blue-600"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    e.g. 08:30 AM - 08:30 PM (All Days)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Service Localities & Coverage Text
                </label>
                <input
                  type="text"
                  value={editCoverageArea}
                  onChange={(e) => setEditCoverageArea(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              {/* Workshop GPS Pin Radar Card */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-blue-600 text-white rounded-xl">
                      <MapPin size={16} />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Workshop GPS Pin (Active)
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Lat: {tech.location.latitude.toFixed(5)}°, Lng: {tech.location.longitude.toFixed(5)}°
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleUpdateWorkshopGPS}
                      disabled={isUpdatingGPS}
                      title="Auto Update Workshop GPS Pin"
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    >
                      {isUpdatingGPS ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-amber-300" />
                          <span>Updating GPS...</span>
                        </>
                      ) : (
                        <>
                          <Navigation size={13} className="text-white fill-white" />
                          <span>Auto GPS Pin</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowWorkshopLocationModal(true)}
                      title="Manual Location Selection / Pinning"
                      className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Building2 size={13} className="text-blue-600" />
                      <span>Manual Pin</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-blue-100 text-[11px] text-slate-700">
                  <span className="font-semibold text-slate-800">
                    📍 {tech.location.address || `${tech.location.area}, ${tech.location.city}`}
                  </span>
                </div>

                {gpsUpdateMsg && (
                  <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 size={13} />
                    <span>{gpsUpdateMsg}</span>
                  </div>
                )}

                {/* Native GPS Coordinates & Coverage Status */}
                <div className="mt-3 pt-2.5 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">
                      GPS Coordinates:
                    </span>{' '}
                    <span className="font-mono text-slate-600">
                      {tech.location.latitude.toFixed(5)}°N, {tech.location.longitude.toFixed(5)}°E
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      {tech.coverageRadiusKm} km coverage
                    </span>
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Hidden file inputs for work photos */}
              <input
                ref={newServiceFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleNewServiceFileChange}
              />
              <input
                ref={editItemFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleEditItemFileChange}
              />

              {/* Service Items & Price Rate Card */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                      Work Catalog & Price List (काम और रेट लिस्ट)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Mention the exact work name, standard price (₹), and a photo of your work.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {editServices.length} Services Listed
                  </span>
                </div>

                {/* Existing Services List */}
                <div className="space-y-2.5 mb-4">
                  {editServices.map((srv, idx) => (
                    <div
                      key={srv.id || idx}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      {/* Work Photo & Title */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Service Photo Thumbnail with Click to Change */}
                        <div
                          onClick={() => {
                            setEditingPhotoIndex(idx);
                            editItemFileInputRef.current?.click();
                          }}
                          className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 cursor-pointer group shadow-2xs"
                          title="Click to change work photo"
                        >
                          {srv.photoUrl ? (
                            <img
                              src={srv.photoUrl}
                              alt={srv.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                              <ImageIcon size={18} />
                              <span className="text-[9px] mt-0.5">No photo</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            <Camera size={16} />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-xs break-words">{srv.name}</p>
                          {srv.description && (
                            <p className="font-medium text-[11px] text-slate-600 break-words mt-0.5">{srv.description}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPhotoIndex(idx);
                              editItemFileInputRef.current?.click();
                            }}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mt-1"
                          >
                            <Camera size={10} />
                            <span>{srv.photoUrl ? 'Change Work Photo' : '+ Add Work Photo'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-300">
                          <span className="font-bold text-slate-600 font-mono">₹</span>
                          <input
                            type="number"
                            value={srv.price}
                            onChange={(e) => handleUpdateServicePrice(idx, Number(e.target.value))}
                            className="w-16 font-mono font-bold text-slate-900 text-xs outline-none"
                            placeholder="Price"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceItem(idx)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                          title="Remove service"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {editServices.length === 0 && (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
                      No services listed yet. Add your first service below with price and photo.
                    </div>
                  )}
                </div>

                {/* Add New Work / Service with Price and Photo */}
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                    <Plus size={15} className="text-blue-600" />
                    <span>Add New Work Service (नया काम, रेट और फोटो जोड़ें)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Work / Service Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Inverter Split AC Jet Wash & Gas Check"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Price (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500 font-mono font-bold text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="499"
                          value={newServicePrice}
                          onChange={(e) => setNewServicePrice(Number(e.target.value))}
                          className="w-full pl-7 p-2.5 text-xs bg-white border border-slate-300 rounded-xl outline-none font-mono font-bold focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Short Description / What is Included (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Includes indoor & outdoor jet clean, coil wash, cooling check"
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Work Photo Upload */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                      Work Photo (काम का फोटो अपलोड करें)
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {newServicePhotoUrl ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-blue-600 bg-white shadow-xs">
                          <img
                            src={newServicePhotoUrl}
                            alt="Work preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewServicePhotoUrl('');
                              setNewServiceFileName('');
                            }}
                            className="absolute top-0.5 right-0.5 bg-red-600 text-white p-0.5 rounded-full"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => newServiceFileInputRef.current?.click()}
                        className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FolderOpen size={14} className="text-blue-600" />
                        <span>{newServicePhotoUrl ? 'Change Photo' : 'Upload from Gallery'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => newServiceFileInputRef.current?.click()}
                        className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Camera size={14} className="text-slate-500" />
                        <span>Camera</span>
                      </button>

                      <span className="text-[11px] text-slate-500">
                        {newServiceFileName ? `📁 ${newServiceFileName}` : '(Gallery या Camera से फोटो लें)'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddServiceItem}
                      disabled={!newServiceName.trim()}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus size={14} />
                      <span>Add to Service Menu (काम जोड़ें)</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <Save size={14} />
                  <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile & Services'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Workshop Location Selection Modal (Unified Map & GPS Pinning) */}
      {showWorkshopLocationModal && (
        <LocationSelectionModal
          isOpen={showWorkshopLocationModal}
          onClose={() => setShowWorkshopLocationModal(false)}
          currentLocation={tech.location}
          onSelectLocation={handleManualSelectWorkshopLocation}
        />
      )}
    </div>
  );
};
