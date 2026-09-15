import React from 'react';
import {
  Star,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Heart,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { TechnicianProfile, UserLocation, UserProfile } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { calculateDistanceKm } from '../../services/locationService';
import { storageService } from '../../services/storage';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { CategoryLogo } from '../common/CategoryLogo';

interface TechnicianCardProps {
  technician: TechnicianProfile;
  currentUser?: UserProfile | null;
  userLocation?: UserLocation;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectTechnician: (tech: TechnicianProfile) => void;
  onRequireAuth?: (action?: string) => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  currentUser,
  userLocation,
  isFavorite,
  onToggleFavorite,
  onSelectTechnician,
  onRequireAuth,
}) => {
  const category = SERVICE_CATEGORIES.find((c) => c.id === technician.categoryId);

  // Calculate real GPS distance
  const distanceKm = userLocation
    ? calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        technician.location.latitude,
        technician.location.longitude
      )
    : null;

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.logActivity({
      technicianId: technician.id,
      type: 'call',
      metadata: { phone: technician.mobile },
    });
    window.location.href = `tel:+91${technician.mobile}`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.logActivity({
      technicianId: technician.id,
      type: 'whatsapp',
      metadata: { whatsapp: technician.whatsappNumber },
    });
    const message = `Hello ${technician.fullName}, I found your verified profile on NeedFix for ${technician.categoryName} services. Are you available for a service call?`;
    window.open(
      `https://wa.me/91${technician.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div
      onClick={() => onSelectTechnician(technician)}
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer relative"
    >
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Top bar: Category badges, Verified badge & Favorite button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(technician.categoryIds && technician.categoryIds.length > 0
              ? technician.categoryIds
              : [technician.categoryId]
            ).slice(0, 3).map((catId) => {
              const catObj = SERVICE_CATEGORIES.find((c) => c.id === catId);
              return (
                <span
                  key={catId}
                  className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-1 rounded-xl flex items-center gap-1.5"
                >
                  <CategoryLogo
                    categoryId={catId}
                    size="xs"
                    className="w-4 h-4 shrink-0"
                  />
                  <span>{catObj?.name || technician.categoryName}</span>
                </span>
              );
            })}
            {technician.categoryIds && technician.categoryIds.length > 3 && (
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-lg">
                +{technician.categoryIds.length - 3} more
              </span>
            )}
            {technician.isVerified && <VerifiedBadge size="sm" showText={true} />}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(technician.id);
            }}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart size={16} className={isFavorite ? 'fill-red-500' : ''} />
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={technician.profilePhotoUrl || technician.companyLogoUrl}
              alt={technician.companyName || technician.fullName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
            />
            {technician.isOnline && (
              <span
                title="Available Now"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {technician.companyName || technician.fullName}
            </h3>
            {technician.companyName && technician.fullName !== technician.companyName && (
              <p className="text-xs text-slate-500 font-medium truncate">{technician.fullName}</p>
            )}

            <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs">
              {/* Rating */}
              <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>{technician.rating > 0 ? technician.rating.toFixed(1) : 'New'}</span>
                {technician.reviewCount > 0 && (
                  <span className="text-[11px] text-slate-400 font-normal">
                    ({technician.reviewCount})
                  </span>
                )}
              </div>

              {/* GPS Distance & Coverage Radius Indicator */}
              {distanceKm !== null && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1 ${
                    distanceKm <= (technician.coverageRadiusKm || 15)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    <MapPin size={11} className={distanceKm <= (technician.coverageRadiusKm || 15) ? 'text-emerald-600' : 'text-blue-600'} />
                    <span>{distanceKm} km away</span>
                    {distanceKm <= (technician.coverageRadiusKm || 15) && (
                      <span className="text-[10px] font-bold text-emerald-800">
                        • In Range
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location & Coverage Range */}
        <div className="text-xs text-slate-600 flex items-center justify-between gap-1.5 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{technician.coverageAreaText || `${technician.location.area}, ${technician.location.city}`}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
            {technician.coverageRadiusKm} km range
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {technician.businessDescription}
        </p>

        {/* View Details Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            {technician.servicesOffered?.length ? `${technician.servicesOffered.length} services available` : 'Verified technician'}
          </span>
          <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 shrink-0">
            <span>View Details</span>
            <ChevronRight size={14} />
          </span>
        </div>
      </div>

      {/* Action Buttons Footer: Direct Contact Only (Call & WhatsApp) */}
      <div className="p-3 bg-slate-50 border-t border-slate-200/80 grid grid-cols-2 gap-2.5">
        {/* Call Button */}
        <button
          type="button"
          onClick={handleCallClick}
          className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs shadow-blue-600/20 active:scale-[0.98]"
          title="Call Technician Directly"
        >
          <Phone size={14} />
          <span>Call</span>
        </button>

        {/* WhatsApp Button */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs shadow-emerald-600/20 active:scale-[0.98]"
          title="Direct WhatsApp Chat"
        >
          <MessageSquare size={14} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
