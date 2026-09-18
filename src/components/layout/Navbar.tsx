import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Navigation,
  Sparkles,
  Heart,
  Settings,
  X,
  Phone,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  HelpCircle,
  Mail,
} from 'lucide-react';
import { UserProfile, TechnicianProfile, UserLocation } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { getCurrentGPSLocation } from '../../services/locationService';
import { NeedFixAppIcon } from '../common/NeedFixAppIcon';
import { LocationSelectionModal } from '../common/LocationSelectionModal';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { EditProfileModal } from '../common/EditProfileModal';

interface NavbarProps {
  currentUser: UserProfile | null;
  technicianProfile: TechnicianProfile | null;
  guestLocation?: UserLocation;
  activeView: 'home' | 'technician_dashboard' | 'admin_panel';
  canGoBack?: boolean;
  onBack?: () => void;
  onNavigate: (view: 'home' | 'technician_dashboard' | 'admin_panel') => void;
  onOpenAuth: () => void;
  onOpenTechnicianRegistration: () => void;
  onOpenHelpSupport: () => void;
  onLogout: () => void;
  onUpdateCity?: (cityName: string) => void;
  onUpdateLocation?: (location: UserLocation) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  technicianProfile,
  guestLocation,
  activeView,
  canGoBack = false,
  onBack,
  onNavigate,
  onOpenAuth,
  onOpenTechnicianRegistration,
  onOpenHelpSupport,
  onLogout,
  onUpdateCity,
  onUpdateLocation,
  onUpdateUser,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const effectiveLocation = currentUser?.location || guestLocation;

  const handleAutoDetectGPS = async () => {
    setIsLocatingGPS(true);
    setGpsNotification(null);
    try {
      const loc = await getCurrentGPSLocation();
      if (onUpdateLocation) {
        onUpdateLocation(loc);
      } else if (onUpdateCity) {
        onUpdateCity(loc.city);
      }
      setGpsNotification(`${loc.area || loc.city}`);
      setTimeout(() => setGpsNotification(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLocatingGPS(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 w-full">
        {/* Left: Top Bar Back Arrow (Only shown on inner views, removed from front page) + Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Functional Top Bar Back Arrow (🔙 / ←) - Hidden on front page */}
          {activeView !== 'home' && (
            <button
              type="button"
              id="top-bar-back-btn"
              onClick={handleBackClick}
              className="p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black shadow-xs active:scale-95 cursor-pointer shrink-0 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-blue-600/20"
              title="Go back to previous screen (🔙 पिछली स्क्रीन पर वापस जाएं)"
              aria-label="Back navigation"
            >
              <ArrowLeft size={18} className="stroke-[2.5] shrink-0" />
              <span className="hidden sm:inline font-bold">Back</span>
            </button>
          )}

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <NeedFixAppIcon
              size={42}
              className="shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl font-display tracking-tight text-slate-950">
                  Need<span className="text-blue-600">Fix</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] font-semibold text-slate-600 -mt-0.5 tracking-wide">
                Verified On-Demand Technicians
              </p>
            </div>
          </div>

          {/* Location Pinning Action (Auto GPS Pinning & Manual Pinning) */}
          <div className="relative hidden md:block">
            <div className="flex items-center bg-blue-50/80 hover:bg-blue-100/90 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-2xs group overflow-hidden">
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                title="Select Location (Auto GPS or Manual Pin)"
                className="flex items-center gap-1.5 py-1.5 pl-3 pr-2 hover:bg-blue-200/40 transition-colors cursor-pointer text-blue-900"
              >
                <div className="relative flex items-center justify-center">
                  <MapPin size={13} className="text-red-500" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="max-w-[140px] truncate">
                  {effectiveLocation
                    ? `${effectiveLocation.area || effectiveLocation.city}`
                    : 'Select Location'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={isLocatingGPS}
                title="Quick Auto GPS Pin"
                className="py-1.5 pr-2.5 pl-1 hover:bg-blue-200/60 border-l border-blue-200/60 text-blue-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isLocatingGPS ? (
                  <RefreshCw size={11} className="animate-spin text-blue-600" />
                ) : (
                  <Navigation size={11} className="text-blue-500 hover:text-blue-700 transition-colors" />
                )}
              </button>
            </div>

            {gpsNotification && (
              <div className="absolute left-0 mt-1.5 px-2.5 py-1 bg-emerald-700 text-white rounded-lg shadow-lg text-[10px] font-bold whitespace-nowrap z-50 animate-in fade-in flex items-center gap-1">
                <CheckCircle2 size={11} />
                <span>GPS Pin Locked: {gpsNotification}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => onNavigate('home')}
            className={`py-2 px-3.5 rounded-xl transition-colors ${
              activeView === 'home'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Find Services
          </button>

          {technicianProfile && (
            <button
              onClick={() => onNavigate('technician_dashboard')}
              className={`py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                activeView === 'technician_dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase size={14} />
              <span>Provider Dashboard</span>
              {technicianProfile.status === 'pending' && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin_panel')}
              className={`py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                activeView === 'admin_panel'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Shield size={14} className="text-purple-600" />
              <span>Admin Approvals</span>
            </button>
          )}
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton className="hidden md:flex" variant="compact" />

          {/* Help & Support Button (Accessible to all users) */}
          <button
            type="button"
            onClick={onOpenHelpSupport}
            className="flex items-center gap-1.5 py-2 px-3 text-slate-700 hover:text-red-600 hover:bg-red-50/80 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            title="File a Complaint / Need Help? (Email Support: needfix349@gmail.com)"
          >
            <HelpCircle size={15} className="text-red-500 shrink-0" />
            <span className="hidden sm:inline">Help & Complaints</span>
          </button>

          {/* Become a Service Provider CTA button */}
          {!technicianProfile && (
            <button
              type="button"
              onClick={onOpenTechnicianRegistration}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Briefcase size={14} />
              <span>Become a Service Provider</span>
            </button>
          )}

          {/* User Profile & Drawer */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                id="user-profile-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu((prev) => !prev);
                }}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer select-none"
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
                <div className="text-left flex flex-col justify-center">
                  <p className="text-xs font-extrabold text-slate-900 leading-tight max-w-[85px] sm:max-w-[140px] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-blue-600 font-semibold capitalize leading-none hidden xs:block">
                    {currentUser.role === 'admin'
                      ? 'Administrator'
                      : technicianProfile
                      ? 'Technician'
                      : 'Customer'}
                  </p>
                </div>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <ChevronDown size={14} className="text-slate-400 shrink-0" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{currentUser.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {currentUser.role}
                        </span>
                      </div>
                      {currentUser.location && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                          <MapPin size={11} className="text-red-500" />
                          <span>{currentUser.location.area}, {currentUser.location.city}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1 text-xs font-semibold text-slate-700">
                      <button
                        type="button"
                        id="navbar-change-name-btn"
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowEditProfileModal(true);
                        }}
                        className="w-full text-left p-2 hover:bg-slate-100 rounded-xl flex items-center justify-between text-slate-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-blue-600" />
                          <span>Change / Edit Name</span>
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          Edit
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('home');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                      >
                        <Sparkles size={14} className="text-blue-600" />
                        <span>Find Services</span>
                      </button>

                    {technicianProfile ? (
                      <button
                        onClick={() => {
                          onNavigate('technician_dashboard');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 hover:bg-slate-100 rounded-xl flex items-center justify-between text-blue-700 bg-blue-50/50"
                      >
                        <div className="flex items-center gap-2 font-bold">
                          <Briefcase size={14} />
                          <span>Technician Dashboard</span>
                        </div>
                        {technicianProfile.status === 'approved' ? (
                          <span className="text-[10px] text-emerald-700 font-bold">Live</span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-bold">Pending</span>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onOpenTechnicianRegistration();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 hover:bg-blue-50 text-blue-700 rounded-xl flex items-center gap-2 font-bold"
                      >
                        <Briefcase size={14} />
                        <span>Become a Service Provider</span>
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin_panel');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 hover:bg-purple-50 text-purple-800 rounded-xl flex items-center gap-2 font-bold"
                      >
                        <Shield size={14} className="text-purple-600" />
                        <span>Admin Approval Center</span>
                      </button>
                    )}

                    {/* File a Complaint / Help Menu item */}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenHelpSupport();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2 hover:bg-red-50 text-red-700 rounded-xl flex items-center justify-between font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle size={14} className="text-red-500" />
                        <span>File a Complaint / Need Help</span>
                      </div>
                      <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                        Email Desk
                      </span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <PWAInstallButton className="w-full justify-center" variant="compact" />
                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2 hover:bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {showLocationModal && (
        <LocationSelectionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          currentLocation={effectiveLocation}
          onSelectLocation={(loc) => {
            if (onUpdateLocation) {
              onUpdateLocation(loc);
            } else if (onUpdateCity) {
              onUpdateCity(loc.city);
            }
            setGpsNotification(`${loc.area || loc.city}`);
            setTimeout(() => setGpsNotification(null), 3500);
          }}
        />
      )}

      {showEditProfileModal && currentUser && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          currentUser={currentUser}
          onUserUpdated={(updated) => {
            if (onUpdateUser) {
              onUpdateUser(updated);
            }
          }}
        />
      )}
    </header>
  );
};
