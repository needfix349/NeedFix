import React, { useState } from 'react';
import {
  Home,
  Search,
  Calendar,
  User,
  ShieldCheck,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  Heart,
  ChevronRight,
  Plus,
  RefreshCw,
  Award,
  Clock,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { TechnicianProfile, UserLocation, UserProfile, ServiceLead } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { CategoryLogo } from '../common/CategoryLogo';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { NeedFixAppIcon } from '../common/NeedFixAppIcon';
import { calculateDistanceKm, MAJOR_CITIES, getCurrentGPSLocation } from '../../services/locationService';
import { storageService } from '../../services/storage';
import { deviceSecurityService } from '../../services/deviceSecurityService';

interface MobileAppViewProps {
  technicians: TechnicianProfile[];
  currentUser?: UserProfile | null;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectTechnician: (tech: TechnicianProfile) => void;
  onBookNow: (tech: TechnicianProfile) => void;
  onOpenTechnicianRegistration: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onUpdateLocation: (newLocation: UserLocation) => void;
  onOpenInstallModal: () => void;
  onSwitchToWebsite: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  technicians,
  currentUser,
  favorites,
  onToggleFavorite,
  onSelectTechnician,
  onBookNow,
  onOpenTechnicianRegistration,
  onOpenAdmin,
  onOpenAuth,
  onUpdateLocation,
  onOpenInstallModal,
  onSwitchToWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const currentLocation = currentUser.location || MAJOR_CITIES[0];

  const handleDetectGPS = async () => {
    setIsDetectingGps(true);
    try {
      const liveLoc = await getCurrentGPSLocation();
      onUpdateLocation(liveLoc);
    } catch {
      // ignore
    } finally {
      setIsDetectingGps(false);
    }
  };

  const approvedTechnicians = technicians.filter((t) => t.status === 'approved');

  const filteredTechnicians = approvedTechnicians
    .filter((tech) => {
      if (selectedCategory !== 'all') {
        const matches =
          tech.categoryId === selectedCategory ||
          (tech.categoryIds && tech.categoryIds.includes(selectedCategory));
        if (!matches) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tech.fullName.toLowerCase().includes(q);
        const matchCompany = tech.companyName.toLowerCase().includes(q);
        const matchCategory =
          tech.categoryName.toLowerCase().includes(q) ||
          (tech.categoryNames &&
            tech.categoryNames.some((cName) => cName.toLowerCase().includes(q)));
        const matchCity = tech.location.city.toLowerCase().includes(q);
        const matchServices = tech.servicesOffered?.some((s) => s.name.toLowerCase().includes(q));
        if (!matchName && !matchCompany && !matchCategory && !matchCity && !matchServices)
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Proximity sort: Closest to current GPS location appears first!
      const distA = calculateDistanceKm(
        currentLocation.latitude,
        currentLocation.longitude,
        a.location.latitude,
        a.location.longitude
      );
      const distB = calculateDistanceKm(
        currentLocation.latitude,
        currentLocation.longitude,
        b.location.latitude,
        b.location.longitude
      );
      return distA - distB;
    });

  return (
    <div className="min-h-screen bg-slate-900/10 flex justify-center py-0 sm:py-6 px-0 sm:px-4">
      {/* Mobile Smartphone Frame Container */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:max-h-[920px] sm:rounded-[40px] shadow-2xl border-0 sm:border-[8px] sm:border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* Mobile Status Bar Simulation */}
        <div className="bg-blue-800 text-white px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none">
          <div className="flex items-center gap-2">
            <NeedFixAppIcon size={20} rounded="rounded-md" className="shadow-2xs" />
            <span className="font-bold">NeedFix</span>
            <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">App</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToWebsite}
              className="text-[10px] bg-blue-700/80 hover:bg-blue-600 px-2 py-0.5 rounded-full border border-blue-400/30 text-white transition-colors"
            >
              🌐 Switch to Website Mode
            </button>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-3 shrink-0 shadow-md">
          <div className="flex items-center justify-between gap-2">
            {/* Location Selector */}
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-xs max-w-[220px]">
              <MapPin size={13} className="text-amber-400 shrink-0" />
              <span className="font-bold truncate text-[11px]">{currentLocation.city}</span>
              <span className="text-blue-200 text-[10px] truncate max-w-[65px]">({currentLocation.area})</span>
              <button
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="bg-white/20 hover:bg-white/30 active:scale-95 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ml-auto shrink-0 transition-all cursor-pointer"
                title="Auto Select GPS Pin"
              >
                <Navigation size={10} className={isDetectingGps ? 'animate-spin' : 'fill-white'} />
                <span>{isDetectingGps ? 'Locating...' : 'GPS Pin'}</span>
              </button>
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenInstallModal}
                className="text-[11px] font-bold bg-amber-400 text-slate-900 px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1"
              >
                <span>📲</span>
                <span>Install</span>
              </button>
            </div>
          </div>

          {/* Search Pill inside header */}
          <div className="mt-2.5 flex items-center bg-white rounded-2xl px-3 py-2 text-slate-900 shadow-sm">
            <Search size={15} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search AC, Plumber, Electrician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs font-medium placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-slate-400 font-bold px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Scrollable Content based on Tab */}
        <div className="flex-1 overflow-y-auto pb-24 p-4 space-y-4">
          
          {/* TAB 1: HOME TAB */}
          {activeTab === 'home' && (
            <>
              {/* Promo Banner */}
              <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                <div className="space-y-1 max-w-[260px] relative z-10">
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full">
                    100% Aadhaar Verified
                  </span>
                  <h3 className="text-sm font-bold leading-snug">Need a Technician in {currentLocation.city}?</h3>
                  <p className="text-[11px] text-blue-100/80 leading-tight">
                    Direct phone & WhatsApp booking without commission fees.
                  </p>
                </div>
                <div className="absolute -bottom-2 -right-2 text-5xl opacity-30 select-none">
                  ⚡
                </div>
              </div>

              {/* 22 Categories Grid (Mobile Optimized) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    22 Trade Categories
                  </h3>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-[11px] font-bold text-blue-600"
                    >
                      Show All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {/* 22 Specific Categories */}
                  {SERVICE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                        className={`p-1.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-1 transition-all group cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 border-blue-600 ring-2 ring-blue-600/30'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CategoryLogo categoryId={cat.id} size="sm" className="w-8 h-8 rounded-xl" />
                        <span className="text-[9px] font-bold leading-tight line-clamp-2 text-center">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Technicians Section */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {selectedCategory === 'all'
                      ? `Top Verified Experts (${filteredTechnicians.length})`
                      : `${SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Category'} (${filteredTechnicians.length})`}
                  </h3>
                </div>

                {filteredTechnicians.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                    <p className="text-sm font-bold text-slate-700">No technicians found</p>
                    <p className="text-xs text-slate-500">Try resetting filters or checking another city.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="text-xs text-blue-600 font-bold"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTechnicians.map((tech) => {
                      const isFav = favorites.includes(tech.id);
                      const distance = calculateDistanceKm(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        tech.location.latitude,
                        tech.location.longitude
                      );

                      return (
                        <div
                          key={tech.id}
                          onClick={() => onSelectTechnician(tech)}
                          className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs space-y-2.5 cursor-pointer hover:border-blue-300 transition-all"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={tech.profilePhotoUrl}
                                alt={tech.fullName}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                              />
                              <div>
                                <div className="flex items-center gap-1">
                                  <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                                    {tech.companyName || tech.fullName}
                                  </h4>
                                  <VerifiedBadge size="sm" />
                                </div>
                                {tech.companyName && tech.fullName !== tech.companyName && (
                                  <p className="text-[10px] text-slate-500 line-clamp-1">{tech.fullName}</p>
                                )}
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium mt-0.5">
                                  <span className="text-amber-500 font-bold">★ {tech.rating}</span>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-bold">{distance} km away</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(tech.id);
                              }}
                              className="text-slate-400 p-1"
                            >
                              <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                            </button>
                          </div>

                          {/* Category Badges */}
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 gap-2">
                            <div className="flex items-center gap-1 flex-wrap overflow-hidden">
                              {(tech.categoryIds && tech.categoryIds.length > 0
                                ? tech.categoryIds
                                : [tech.categoryId]
                              ).slice(0, 2).map((cId) => {
                                const cObj = SERVICE_CATEGORIES.find((sc) => sc.id === cId);
                                return (
                                  <span
                                    key={cId}
                                    className="bg-slate-100 text-slate-800 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px]"
                                  >
                                    <CategoryLogo
                                      categoryId={cId}
                                      size="xs"
                                      className="w-3.5 h-3.5 shrink-0"
                                    />
                                    <span className="truncate max-w-[120px]">
                                      {cObj?.name || tech.categoryName}
                                    </span>
                                  </span>
                                );
                              })}
                              {tech.categoryIds && tech.categoryIds.length > 2 && (
                                <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1 py-0.2 rounded">
                                  +{tech.categoryIds.length - 2}
                                </span>
                              )}
                            </div>
                            <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5 shrink-0">
                              Direct Connect
                            </span>
                          </div>

                          {/* Action Buttons: Direct Contact (Call & WhatsApp) */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!currentUser || currentUser.id === 'guest') {
                                  onOpenAuth();
                                  return;
                                }
                                const custId = deviceSecurityService.getCustomerId();
                                storageService.logActivity({
                                  technicianId: tech.id,
                                  customerId: custId,
                                  customerName: currentUser.name || 'Customer',
                                  customerPhone: currentUser.mobile,
                                  type: 'call',
                                  metadata: { phone: tech.mobile },
                                });
                                window.location.href = `tel:+91${tech.mobile}`;
                              }}
                              className="py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <Phone size={13} />
                              <span>Call</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!currentUser || currentUser.id === 'guest') {
                                  onOpenAuth();
                                  return;
                                }
                                const custId = deviceSecurityService.getCustomerId();
                                storageService.logActivity({
                                  technicianId: tech.id,
                                  customerId: custId,
                                  customerName: currentUser.name || 'Customer',
                                  customerPhone: currentUser.mobile,
                                  type: 'whatsapp',
                                  metadata: { whatsapp: tech.whatsappNumber },
                                });
                                const msg = `Hello ${tech.fullName}, I found your profile on NeedFix for ${tech.categoryName}. Are you available?`;
                                window.open(`https://wa.me/91${tech.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                              className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <MessageSquare size={13} />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase">Find Near Me</h3>
                <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 text-xs">
                  <Search size={14} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by specialty, area, or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">All Categories ({SERVICE_CATEGORIES.length})</h4>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setActiveTab('home');
                      }}
                      className="p-3 bg-white rounded-2xl border border-slate-200 text-left flex items-center gap-2.5 hover:border-blue-400 transition-all"
                    >
                      <CategoryLogo categoryId={c.id} size="sm" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{c.hindiName || 'Verified Experts'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE / PROVIDER HUB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* User Identity Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={currentUser.name}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
                    <span className="inline-block mt-0.5 text-[10px] uppercase font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                      {currentUser.role} Account
                    </span>
                    {currentUser.location && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        📍 {currentUser.location.area}, {currentUser.location.city}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200/60"
                >
                  <User size={14} />
                  <span>Edit Name / Profile (नाम बदलें / दर्ज करें)</span>
                </button>
              </div>

              {/* Become a Service Provider Promo */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 space-y-2 shadow-md">
                <div className="flex items-center gap-1.5">
                  <Award size={16} />
                  <span className="text-xs font-bold uppercase">Earn with NeedFix</span>
                </div>
                <h4 className="text-sm font-bold">Become a Service Provider</h4>
                <p className="text-xs text-amber-100">
                  Register your business in any of the {SERVICE_CATEGORIES.length} categories and receive direct customer leads in your city.
                </p>
                <button
                  onClick={onOpenTechnicianRegistration}
                  className="w-full py-2 bg-white text-orange-700 font-bold rounded-xl text-xs shadow-xs mt-1"
                >
                  Apply as Technician
                </button>
              </div>

              {/* Admin Panel Access */}
              <div className="bg-slate-100 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Admin Control Center</p>
                  <p className="text-[10px] text-slate-500">Approve/reject technician registrations</p>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="py-1.5 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Open Admin
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Native Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around z-20 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
              activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home size={18} />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
              activeTab === 'search' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search size={18} />
            <span className="text-[10px]">Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
              activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User size={18} />
            <span className="text-[10px]">Account</span>
          </button>
        </div>

      </div>
    </div>
  );
};
