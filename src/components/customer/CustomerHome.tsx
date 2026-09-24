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
  AlertCircle,
} from 'lucide-react';
import { TechnicianProfile, UserLocation, UserProfile } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import {
  MAJOR_CITIES,
  DEFAULT_USER_LOCATION,
  calculateDistanceKm,
  getCurrentGPSLocation,
  get_nearby_technicians,
} from '../../services/locationService';
import { CategoryLogo } from '../common/CategoryLogo';
import { TechnicianCard } from './TechnicianCard';
import { LocationSelectionModal } from '../common/LocationSelectionModal';
import { accountService } from '../../services/accountService';

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
  const [minRating, setMinRating] = useState<number>(0);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Default Location Radius: 5 KM by default for newly registered and active users
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(() => {
    if (currentUser?.searchRadiusKm && currentUser.searchRadiusKm >= 1) {
      return currentUser.searchRadiusKm;
    }
    return 5;
  });

  React.useEffect(() => {
    if (currentUser?.searchRadiusKm && currentUser.searchRadiusKm >= 1) {
      setSearchRadiusKm(currentUser.searchRadiusKm);
    }
  }, [currentUser?.searchRadiusKm]);

  const handleRadiusChange = (newRadius: number) => {
    const safeRadius = Math.max(1, Math.min(20, newRadius));
    setSearchRadiusKm(safeRadius);
    if (currentUser?.id) {
      accountService.updateUserSearchRadius(currentUser.id, safeRadius);
    }
  };

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
    setGpsErrorMsg(null);
    try {
      const loc = await getCurrentGPSLocation();
      onUpdateLocation(loc);
      if (loc.isGpsLocked) {
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 5000);
      } else {
        setGpsErrorMsg('Live GPS is blocked or unavailable in this browser. Showing nearest city hub.');
        setTimeout(() => setGpsErrorMsg(null), 6000);
      }
    } catch (err: any) {
      console.error('GPS detection error:', err);
      setGpsErrorMsg('Could not auto-lock live GPS. Please tap to choose your location manually.');
      setTimeout(() => setGpsErrorMsg(null), 6000);
    } finally {
      setIsDetectingGps(false);
    }
  };

  // 1. All valid approved technicians in system with distance calculated from customer location
  const allApprovedWithDistance = useMemo(() => {
    return technicians
      .filter((t) => (t.isApproved === true || t.status === 'approved') && !t.isBlocked)
      .map((tech) => {
        const techLat = Number(tech.location?.latitude);
        const techLng = Number(tech.location?.longitude);
        const dist =
          !isNaN(techLat) && !isNaN(techLng)
            ? calculateDistanceKm(
                currentLocation.latitude,
                currentLocation.longitude,
                techLat,
                techLng
              )
            : 0;
        return {
          ...tech,
          calculatedDistanceKm: dist,
        };
      })
      .sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
  }, [technicians, currentLocation.latitude, currentLocation.longitude]);

  // 2. Technicians strictly within selected searchRadiusKm
  const strictlyNearbyTechnicians = useMemo(() => {
    return allApprovedWithDistance.filter((t) => t.calculatedDistanceKm <= searchRadiusKm);
  }, [allApprovedWithDistance, searchRadiusKm]);

  // Determine whether we fall back to network-wide list if no technicians are within radius
  const isFallbackToNetwork = strictlyNearbyTechnicians.length === 0 && allApprovedWithDistance.length > 0;

  // Filtered and sorted technicians
  const filteredTechnicians = useMemo(() => {
    // If user typed a search query or no technicians are strictly within radius, search against all approved
    const candidateList =
      searchQuery.trim() || strictlyNearbyTechnicians.length === 0
        ? allApprovedWithDistance
        : strictlyNearbyTechnicians;

    return candidateList
      .filter((tech) => {
        if (showOnlyFavorites && !favorites.includes(tech.id)) return false;
        
        // Multi-category matching: show technicians for the selected service
        if (selectedCategory !== 'all') {
          const matchesCategory =
            tech.categoryId === selectedCategory ||
            (tech.categoryIds && tech.categoryIds.includes(selectedCategory));
          if (!matchesCategory) return false;
        }

        if (minRating > 0 && tech.rating < minRating) return false;

        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = tech.fullName.toLowerCase().includes(q);
          const matchCompany = tech.companyName.toLowerCase().includes(q);
          const matchCategory =
            tech.categoryName.toLowerCase().includes(q) ||
            (tech.categoryIds &&
              tech.categoryIds.some((cid) => {
                const c = SERVICE_CATEGORIES.find((sc) => sc.id === cid);
                return c?.name.toLowerCase().includes(q);
              })) ||
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
        // 1. Live Online Technicians ALWAYS prioritized at the top!
        const onlineA = a.isOnline ? 1 : 0;
        const onlineB = b.isOnline ? 1 : 0;
        if (onlineA !== onlineB) return onlineB - onlineA;

        // 2. Proximity priority: closest to current GPS comes first
        if (a.calculatedDistanceKm !== b.calculatedDistanceKm) {
          return a.calculatedDistanceKm - b.calculatedDistanceKm;
        }

        // 3. Rating priority
        return b.rating - a.rating;
      });
  }, [
    strictlyNearbyTechnicians,
    allApprovedWithDistance,
    showOnlyFavorites,
    favorites,
    selectedCategory,
    minRating,
    searchQuery,
  ]);

  const activeCategoryObj = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 space-y-6 w-full max-w-full overflow-hidden">
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
                      {currentLocation.city || 'Select City'}
                    </span>
                    {currentLocation.isGpsLocked ? (
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-400/30 uppercase shrink-0 flex items-center gap-0.5">
                        <CheckCircle2 size={9} /> GPS Live
                      </span>
                    ) : (
                      <span className="text-[9px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-bold border border-blue-400/30 uppercase shrink-0">
                        {currentLocation.state || 'Set Location'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-blue-200/90 block truncate">
                    {currentLocation.state ? `${currentLocation.city}, ${currentLocation.state}` : 'Tap to select State & District'}
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
                  title="Auto-detect current GPS location"
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

          {gpsErrorMsg && (
            <div className="text-xs text-amber-200 font-semibold flex items-center justify-between gap-2 bg-amber-950/80 border border-amber-500/50 px-3 py-2 rounded-xl animate-in fade-in shadow-sm">
              <div className="flex items-center gap-1.5 min-w-0">
                <AlertCircle size={14} className="text-amber-400 shrink-0" />
                <span className="truncate">{gpsErrorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="text-[11px] font-bold underline text-white hover:text-amber-200 shrink-0 cursor-pointer"
              >
                Choose Location
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OFFICIAL SERVICE CATEGORIES & RADIUS SELECTOR */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <span>Explore {SERVICE_CATEGORIES.length} Service Categories</span>
              <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                25 Trades
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Select any trade to see verified specialists active within your {searchRadiusKm} KM radius
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 self-start sm:self-auto cursor-pointer"
            >
              Reset Category
            </button>
          )}
        </div>

        {/* RADIUS GEOFENCE SELECTOR - Smooth Range Slider (1 KM to 20 KM, Default 5 KM) */}
        <div id="radius-slider-card" className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
                <Navigation size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Search Radius: <span className="text-blue-600 font-extrabold">{searchRadiusKm} KM</span>
                  </span>
                  {searchRadiusKm === 5 ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                      Default 5 KM
                    </span>
                  ) : (
                    <button
                      type="button"
                      id="reset-radius-default-btn"
                      onClick={() => handleRadiusChange(5)}
                      className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      Reset to 5 KM
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Showing verified specialists active within {searchRadiusKm} KM of {currentLocation.city || 'your area'}
                </p>
              </div>
            </div>

            {/* Real-Time Radius Indicator Pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-semibold text-slate-600">Selected:</span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-xl text-xs font-bold font-mono shadow-xs">
                {searchRadiusKm} KM
              </span>
            </div>
          </div>

          {/* Smooth Interactive Range Slider Control */}
          <div className="pt-1 px-1 space-y-2">
            <div className="relative flex items-center">
              <input
                id="search-radius-range-slider"
                type="range"
                min={1}
                max={20}
                step={1}
                value={searchRadiusKm}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 transition-all"
                aria-label="Search Radius Range Slider"
              />
            </div>

            {/* Tick Marks & Range Bounds (1 KM - 20 KM) */}
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-0.5 select-none">
              <span
                onClick={() => handleRadiusChange(1)}
                className={`cursor-pointer transition-colors ${searchRadiusKm === 1 ? 'text-blue-600 font-extrabold scale-105' : 'hover:text-slate-600'}`}
              >
                1 KM
              </span>
              <span
                onClick={() => handleRadiusChange(5)}
                className={`cursor-pointer transition-colors ${searchRadiusKm === 5 ? 'text-blue-600 font-extrabold scale-105' : 'hover:text-slate-600'}`}
              >
                5 KM (Default)
              </span>
              <span
                onClick={() => handleRadiusChange(10)}
                className={`cursor-pointer transition-colors ${searchRadiusKm === 10 ? 'text-blue-600 font-extrabold scale-105' : 'hover:text-slate-600'}`}
              >
                10 KM
              </span>
              <span
                onClick={() => handleRadiusChange(15)}
                className={`cursor-pointer transition-colors ${searchRadiusKm === 15 ? 'text-blue-600 font-extrabold scale-105' : 'hover:text-slate-600'}`}
              >
                15 KM
              </span>
              <span
                onClick={() => handleRadiusChange(20)}
                className={`cursor-pointer transition-colors ${searchRadiusKm === 20 ? 'text-blue-600 font-extrabold scale-105' : 'hover:text-slate-600'}`}
              >
                20 KM
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
          {/* 25 Categories */}
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  const nextCat = isSelected ? 'all' : cat.id;
                  setSelectedCategory(nextCat);
                  setTimeout(() => {
                    document.getElementById('technicians-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs group cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 text-blue-900 border-blue-600 ring-2 ring-blue-600/30 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="group-hover:scale-110 transition-transform">
                  <CategoryLogo categoryId={cat.id} size="md" />
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-2 max-w-full text-center">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              minRating >= 4.5
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Star size={13} className="fill-current" />
            <span>4.5+ Rating</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              showOnlyFavorites
                ? 'bg-red-500 text-white border-red-500 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Heart size={13} className={showOnlyFavorites ? 'fill-current' : ''} />
            <span>Saved ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* TECHNICIANS LISTING */}
      <div id="technicians-section" className="scroll-mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {activeCategoryObj ? `${activeCategoryObj.name} Technicians` : 'Verified Technicians'}
            </h3>
            <p className="text-xs text-slate-500">
              {filteredTechnicians.length > 0
                ? isFallbackToNetwork && !searchQuery.trim()
                  ? `Showing nearest verified specialists (${filteredTechnicians.length}) across our network (None within ${searchRadiusKm} KM of ${currentLocation.city})`
                  : `Showing ${filteredTechnicians.length} verified specialist${filteredTechnicians.length > 1 ? 's' : ''} ${searchQuery.trim() ? 'matching your search' : `active within ${searchRadiusKm} KM of ${currentLocation.city}`}`
                : `No active technicians found for the selected criteria`}
            </p>
          </div>

          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto cursor-pointer transition-colors"
            >
              Show All Services
            </button>
          )}
        </div>

        {/* Helpful Fallback Banner if Outside Strict Radius */}
        {isFallbackToNetwork && !searchQuery.trim() && filteredTechnicians.length > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-600 text-white shrink-0">
                <MapPin size={13} />
              </span>
              <span>
                <strong>Nearest Available Specialists:</strong> No registered technicians are within {searchRadiusKm} KM of <strong>{currentLocation.city}</strong>. Below are the closest verified providers from our network, sorted nearest first.
              </span>
            </div>
            {searchRadiusKm < 20 && (
              <button
                type="button"
                onClick={() => handleRadiusChange(20)}
                className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Expand to 20 KM
              </button>
            )}
          </div>
        )}

        {filteredTechnicians.length === 0 ? (
          <div className="py-10 text-center bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {activeCategoryObj
                  ? `No ${activeCategoryObj.name} technicians within ${searchRadiusKm} KM of ${currentLocation.city}`
                  : `No technicians found within ${searchRadiusKm} KM of ${currentLocation.city}`}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No verified technicians are currently within your {searchRadiusKm} KM radius. You can expand your search radius or select another location.
              </p>
            </div>

            {/* Quick 1-tap Radius Expansion in Empty State */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {searchRadiusKm < 10 && (
                <button
                  type="button"
                  onClick={() => handleRadiusChange(10)}
                  className="py-2 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Expand Radius to 10 KM
                </button>
              )}
              {searchRadiusKm < 15 && (
                <button
                  type="button"
                  onClick={() => handleRadiusChange(15)}
                  className="py-2 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Expand Radius to 15 KM
                </button>
              )}
              {searchRadiusKm < 20 && (
                <button
                  type="button"
                  onClick={() => handleRadiusChange(20)}
                  className="py-2 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Expand to Max 20 KM
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Change Location
              </button>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  View All Services
                </button>
              )}
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

      {/* COMPACT STANDARDIZED SERVICE PROVIDER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 shadow-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Briefcase size={16} />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block">
              Grow your business with Needfix. Become a service provider.
            </span>
            <span className="text-[11px] text-slate-500 block">
              Direct customer calls • Verified experts • Professional partner network
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenTechnicianRegistration}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <Briefcase size={13} />
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
