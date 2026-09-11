import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Filter,
  Navigation,
  Sparkles,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  ChevronDown,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Heart,
  Calendar,
  Lock,
  Phone,
  LayoutGrid,
} from 'lucide-react';
import { TechnicianProfile, UserLocation, UserProfile } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import {
  MAJOR_CITIES,
  DEFAULT_USER_LOCATION,
  calculateDistanceKm,
  getCurrentGPSLocation,
} from '../../services/locationService';
import { CategoryLogo } from '../common/CategoryLogo';
import { TechnicianCard } from './TechnicianCard';
import { LocationSelectionModal } from '../common/LocationSelectionModal';

interface CustomerHomeProps {
  technicians: TechnicianProfile[];
  currentUser?: UserProfile | null;
  customerLocation?: UserLocation;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectTechnician: (tech: TechnicianProfile) => void;
  onOpenTechnicianRegistration: () => void;
  onUpdateLocation: (newLocation: UserLocation) => void;
  onRequireAuth: (actionDescription?: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  technicians,
  currentUser,
  customerLocation,
  favorites,
  onToggleFavorite,
  onSelectTechnician,
  onOpenTechnicianRegistration,
  onUpdateLocation,
  onRequireAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(20);
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const currentLocation = customerLocation || currentUser?.location || DEFAULT_USER_LOCATION;

  // Auto-detect location seamlessly on first load if not explicitly set
  React.useEffect(() => {
    if (!currentUser?.location) {
      setIsDetectingGps(true);
      getCurrentGPSLocation()
        .then((loc) => {
          onUpdateLocation(loc);
        })
        .catch((err) => {
          console.warn('Location auto-detect fallback:', err);
        })
        .finally(() => {
          setIsDetectingGps(false);
        });
    }
  }, []);

  const handleDetectGPS = async () => {
    setIsDetectingGps(true);
    setGpsSuccess(false);
    try {
      const loc = await getCurrentGPSLocation();
      onUpdateLocation(loc);
      setGpsSuccess(true);
      setTimeout(() => setGpsSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Only approved and unblocked technicians are visible publicly to customers
  const approvedTechnicians = useMemo(() => {
    return technicians.filter((t) => t.status === 'approved' && !t.isBlocked);
  }, [technicians]);

  // Filtered and sorted technicians
  const filteredTechnicians = useMemo(() => {
    return approvedTechnicians
      .filter((tech) => {
        if (showOnlyFavorites && !favorites.includes(tech.id)) return false;
        
        // Multi-category matching
        if (selectedCategory !== 'all') {
          const matchesCategory =
            tech.categoryId === selectedCategory ||
            (tech.categoryIds && tech.categoryIds.includes(selectedCategory));
          if (!matchesCategory) return false;
        }

        if (verifiedOnly && !tech.isVerified) return false;
        if (onlineOnly && !tech.isOnline) return false;
        if (minRating > 0 && tech.rating < minRating) return false;

        // Native GPS Proximity calculation using Haversine formula (Zero API cost)
        const dist = calculateDistanceKm(
          currentLocation.latitude,
          currentLocation.longitude,
          tech.location.latitude,
          tech.location.longitude
        );

        // Hard filter: filter out any technician located beyond 20 km radius
        if (dist > 20) {
          return false;
        }

        // Apply radius filter if customer selected a narrower radius (3, 5, 10, 15 km)
        if (maxDistanceKm < 20 && dist > maxDistanceKm) {
          return false;
        }

        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = tech.fullName.toLowerCase().includes(q);
          const matchCompany = tech.companyName.toLowerCase().includes(q);
          const matchCategory =
            tech.categoryName.toLowerCase().includes(q) ||
            (tech.categoryNames &&
              tech.categoryNames.some((catName) => catName.toLowerCase().includes(q)));
          const matchArea = tech.coverageAreaText?.toLowerCase().includes(q);
          const matchDesc = tech.businessDescription.toLowerCase().includes(q);
          if (!matchName && !matchCompany && !matchCategory && !matchArea && !matchDesc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
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

        if (sortBy === 'distance') {
          // Prioritize technicians whose set coverage range encompasses the customer's location
          const aInRange = distA <= (a.coverageRadiusKm || 15);
          const bInRange = distB <= (b.coverageRadiusKm || 15);
          if (aInRange && !bInRange) return -1;
          if (!aInRange && bInRange) return 1;
          return distA - distB;
        }
        if (sortBy === 'rating') return b.rating - a.rating;
        return distA - distB;
      });
  }, [
    approvedTechnicians,
    selectedCategory,
    searchQuery,
    verifiedOnly,
    onlineOnly,
    minRating,
    maxDistanceKm,
    sortBy,
    showOnlyFavorites,
    favorites,
    currentLocation,
  ]);

  const activeCategoryObj = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* HERO / SEARCH BAR & LOCATION BAR (Optimized for Mobile) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2.5 sm:space-y-4 max-w-3xl">
          <div className="hidden sm:flex items-center gap-2">
            <span className="p-1 rounded-lg bg-white/20 text-white">
              <ShieldCheck size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              India's Trusted On-Demand Technician Network
            </span>
          </div>

          <h1 className="text-lg sm:text-3xl font-extrabold font-display leading-snug sm:leading-tight text-white">
            Find Verified Home & Technical Experts Near You
          </h1>
          <p className="hidden sm:block text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Directly connect with 100% Aadhaar-verified technicians. No middlemen, transparent pricing, and direct WhatsApp contact.
          </p>

          {/* Unified Location & Search Box */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch gap-2">
            {/* Search Input */}
            <div className="flex-1 flex items-center bg-white rounded-xl sm:rounded-2xl px-3 py-2 sm:py-3 shadow-md text-slate-900">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search AC, Electrician, Plumber, Painter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-xs sm:text-sm font-medium placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Auto-detecting Location Indicator Bar & Interactive Dropdown */}
            <div 
              onClick={() => setShowLocationModal(true)}
              className="flex items-center justify-between gap-3 bg-slate-950/70 hover:bg-slate-950/85 backdrop-blur-md border border-white/25 hover:border-white/40 rounded-xl sm:rounded-2xl px-3 py-2 sm:py-2.5 shadow-md transition-all cursor-pointer group"
              title="Click to select location or detect GPS"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate max-w-[130px] sm:max-w-[200px] text-xs font-bold text-white">
                      {currentLocation.area ? `${currentLocation.area}, ${currentLocation.city}` : currentLocation.city}
                    </span>
                    <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-400/30 uppercase shrink-0">
                      Auto GPS
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-200/80 font-mono block truncate">
                    {currentLocation.address || `${currentLocation.latitude.toFixed(4)}°, ${currentLocation.longitude.toFixed(4)}°`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pl-1.5 border-l border-white/15">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDetectGPS();
                  }}
                  disabled={isDetectingGps}
                  title="Auto-detect current GPS location (री-डिटेक्ट GPS)"
                  className="p-1 sm:p-1.5 hover:bg-white/15 active:bg-white/25 rounded-lg text-blue-200 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} className={isDetectingGps ? 'animate-spin text-amber-300' : ''} />
                </button>
                <ChevronDown size={15} className="text-blue-200 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {gpsSuccess && (
            <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/50 px-3 py-1.5 rounded-xl w-fit animate-in fade-in shadow-sm">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>
                GPS Locked: {currentLocation.address || `${currentLocation.area}, ${currentLocation.city}`}
              </span>
            </div>
          )}

          {/* Pan-India 28 States Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/15 text-[11px]">
            <div className="flex items-center gap-1.5 text-blue-100">
              <span className="text-sm">🇮🇳</span>
              <span className="font-bold">Total 28 States Covered</span>
              <span className="text-blue-200/80 hidden sm:inline">(भारत के सभी 28 राज्य और 8 केंद्र शासित प्रदेश)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline decoration-amber-300/60 underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Browse All 28 States & Cities</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 20 OFFICIAL SERVICE CATEGORIES CAROUSEL/GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-display text-slate-900">Explore 20 Service Categories</h2>
            <p className="text-xs text-slate-500">Pick a trade to browse verified specialists in your coverage area</p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Reset Category
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
          {/* "All" button */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 shadow-xs ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/20 scale-105'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl">🌟</span>
            <span className="text-[11px] font-bold leading-tight truncate max-w-full">All Services</span>
            <span className="text-[9px] opacity-80 font-mono">{approvedTechnicians.length} Pros</span>
          </button>

          {/* 17 Categories */}
          {SERVICE_CATEGORIES.map((cat) => {
            const count = approvedTechnicians.filter((t) => t.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 shadow-xs group ${
                  isSelected
                    ? 'bg-blue-50/80 text-blue-900 border-blue-600 ring-2 ring-blue-600/30 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="group-hover:scale-110 transition-transform">
                  <CategoryLogo categoryId={cat.id} size="sm" />
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-2 max-w-full text-center">
                  {cat.name}
                </span>
                <span
                  className={`text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count > 0 ? `${count} active` : (cat.badge || 'Verified')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                verifiedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Verified Only</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlineOnly(!onlineOnly)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                onlineOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online Now</span>
            </button>

            <button
              type="button"
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                minRating >= 4.5
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Star size={13} className="fill-current" />
              <span>4.5+ Rating</span>
            </button>

            <button
              type="button"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showOnlyFavorites
                  ? 'bg-red-500 text-white border-red-500 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Heart size={13} className={showOnlyFavorites ? 'fill-current' : ''} />
              <span>Saved ({favorites.length})</span>
            </button>
          </div>

          {/* Distance & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Dynamic Distance Coverage Slider (1km to 20km) */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-700">Radius:</span>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-lg border border-blue-200">
                  {maxDistanceKm} km
                </span>
              </div>

              {/* Smooth Custom Slider (1 - 20 km) */}
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-20 sm:w-28 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                title={`Coverage Radius: ${maxDistanceKm} km`}
              />

              {/* Quick Preset Chips */}
              <div className="hidden sm:flex items-center gap-1">
                {[1, 5, 10, 15, 20].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setMaxDistanceKm(step)}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      maxDistanceKm === step
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200'
                    }`}
                  >
                    {step}k
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
                className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="distance">Nearest (GPS Distance)</option>
                <option value="rating">Top Rated (⭐)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNICIANS LISTING GRID */}
      <div>
        {/* Notice for guest users: login required to contact technicians */}
        {!currentUser && (
          <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-800 shrink-0">
                <Lock size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Login Required to Call, WhatsApp or Message Technicians
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  बिना लॉगिन किसी भी टेक्नीशियन से कॉल या व्हाट्सएप संपर्क उपलब्ध नहीं है। संपर्क के लिए पहले अपने फोन नंबर से लॉगिन करें।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRequireAuth('contact technicians')}
              className="w-full sm:w-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Phone size={13} />
              <span>Login with Mobile</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {activeCategoryObj ? `${activeCategoryObj.name} Specialists` : 'Available Technicians'}
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredTechnicians.length} verified professionals near {currentLocation.city}
              {currentLocation.state ? `, ${currentLocation.state}` : ''} (Sorted by closest proximity &le; 20 km)
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-200 text-xs self-start sm:self-auto">
            <Navigation size={13} className="text-blue-600" />
            <span>Native GPS Proximity (&le; 20 km)</span>
          </div>
        </div>

        {filteredTechnicians.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-6 sm:p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <MapPin size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                No technicians currently within 20 km in {currentLocation.city}
                {currentLocation.state ? `, ${currentLocation.state}` : ''}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No registered service providers have set their location coverage range within 20 km of your current position. You can pick another district/city or register as a service provider.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMaxDistanceKm(20);
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setVerifiedOnly(false);
                  setOnlineOnly(false);
                  setMinRating(0);
                }}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Expand Search Range to 20 km
              </button>
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
              >
                Pick Another District / State (दूसरा ज़िला चुनें)
              </button>
              <button
                type="button"
                onClick={onOpenTechnicianRegistration}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Register as First Technician Here
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTechnicians.map((tech) => (
              <TechnicianCard
                key={tech.id}
                technician={tech}
                currentUser={currentUser}
                userLocation={currentLocation}
                isFavorite={favorites.includes(tech.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectTechnician={onSelectTechnician}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        )}
      </div>

      {/* BECOME A SERVICE PROVIDER PROMO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-1 rounded-full text-xs font-bold">
            <Briefcase size={14} />
            <span>Are you a technician or craftsman?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Grow Your Business with NeedFix
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Register as a verified service provider. Receive direct customer phone calls, WhatsApp leads, and earn with zero commission fees.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTechnicianRegistration}
          className="py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 shrink-0 transition-all flex items-center gap-2"
        >
          <Briefcase size={16} />
          <span>Become a Service Provider</span>
        </button>
      </div>

      {/* Location Selection Modal (Unified Map & GPS Pinning) */}
      {showLocationModal && (
        <LocationSelectionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          currentLocation={currentLocation}
          onSelectLocation={(loc) => {
            onUpdateLocation(loc);
            setGpsSuccess(true);
            setTimeout(() => setGpsSuccess(false), 4000);
          }}
        />
      )}
    </div>
  );
};
