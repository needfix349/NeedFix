import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Heart,
  Share2,
  FileText,
  User,
  ExternalLink,
  Lock,
  Image as ImageIcon,
} from 'lucide-react';
import { TechnicianProfile, UserLocation, Review, UserProfile } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { CategoryLogo } from '../common/CategoryLogo';
import { calculateDistanceKm } from '../../services/locationService';
import { storageService } from '../../services/storage';

interface TechnicianDetailModalProps {
  technician: TechnicianProfile;
  currentUser?: UserProfile | null;
  userLocation?: UserLocation;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onRequireAuth: (actionDescription?: string) => void;
}

export const TechnicianDetailModal: React.FC<TechnicianDetailModalProps> = ({
  technician,
  currentUser,
  userLocation,
  isFavorite,
  onToggleFavorite,
  onClose,
  onRequireAuth,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [serviceUsed, setServiceUsed] = useState(technician.categoryName);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Log profile view activity
    storageService.logActivity({
      technicianId: technician.id,
      type: 'view',
    });
    setReviews(storageService.getReviews(technician.id));
  }, [technician.id]);

  const distanceKm = userLocation
    ? calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        technician.location.latitude,
        technician.location.longitude
      )
    : null;

  const handleCall = () => {
    storageService.logActivity({
      technicianId: technician.id,
      type: 'call',
      metadata: { phone: technician.mobile },
    });
    window.location.href = `tel:+91${technician.mobile}`;
  };

  const handleCallForService = (serviceName: string) => {
    storageService.logActivity({
      technicianId: technician.id,
      type: 'call',
      metadata: { phone: technician.mobile, service: serviceName },
    });
    window.location.href = `tel:+91${technician.mobile}`;
  };

  const handleWhatsApp = () => {
    storageService.logActivity({
      technicianId: technician.id,
      type: 'whatsapp',
      metadata: { whatsapp: technician.whatsappNumber },
    });
    const message = `Hello ${technician.fullName}, I am contacting you via NeedFix regarding ${technician.categoryName} services. Are you available for a booking?`;
    window.open(
      `https://wa.me/91${technician.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleWhatsAppForService = (serviceName: string) => {
    storageService.logActivity({
      technicianId: technician.id,
      type: 'whatsapp',
      metadata: { whatsapp: technician.whatsappNumber, service: serviceName },
    });
    const srv = technician.servicesOffered?.find((s) => s.name === serviceName);
    const priceText = srv ? ` (₹${srv.price})` : '';
    const message = `Hello ${technician.fullName}, I am contacting you via NeedFix regarding your service: "${serviceName}"${priceText}. Are you available?`;
    window.open(
      `https://wa.me/91${technician.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth('submit a review for this technician');
      return;
    }
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    storageService.addReview({
      technicianId: technician.id,
      customerId: currentUser.id,
      customerName: currentUser.name || 'Verified Customer',
      customerAvatar: currentUser.avatarUrl,
      rating: ratingScore,
      comment: reviewComment.trim(),
      serviceUsed: serviceUsed,
    });

    setReviews(storageService.getReviews(technician.id));
    setIsSubmittingReview(false);
    setShowReviewForm(false);
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col relative">
        {/* Top Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 relative p-4 shrink-0">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
              title="Share profile"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => onToggleFavorite(technician.id)}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
              title="Favorite"
            >
              <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {copiedLink && (
            <div className="absolute top-4 left-4 bg-white/95 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-in fade-in">
              Profile Link Copied!
            </div>
          )}
        </div>

        {/* Profile Card Overlay */}
        <div className="px-6 pb-2 -mt-14 shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={technician.profilePhotoUrl}
                alt={technician.fullName}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              {technician.isOnline && (
                <span
                  title="Available for immediate booking"
                  className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
                />
              )}
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-display text-slate-900">
                  {technician.companyName || technician.fullName}
                </h2>
                {technician.isVerified && <VerifiedBadge size="md" showText={true} />}
              </div>
              {technician.companyName && technician.fullName !== technician.companyName && (
                <p className="text-xs font-semibold text-slate-600">{technician.fullName}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 flex-wrap">
                {(technician.categoryIds && technician.categoryIds.length > 0
                  ? technician.categoryIds
                  : [technician.categoryId]
                ).map((catId) => {
                  const catObj = SERVICE_CATEGORIES.find((c) => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-blue-200/60"
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
                {distanceKm !== null && (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-0.5">
                    <MapPin size={11} /> {distanceKm} km from you
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Availability Status */}
          <div className="sm:text-right pb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Direct Contact
            </span>
            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {technician.isOnline ? 'Available Now' : 'Accepting Inquiries'}
            </span>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Verification Badge & Guarantee Seal */}
          {technician.isVerified && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    NeedFix Verified Service Provider
                  </h4>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.2 rounded-full font-bold">
                    Admin Approved
                  </span>
                </div>
                <p className="text-xs text-emerald-900/90 mt-0.5 leading-relaxed">
                  Identity and background verified via National ID Aadhaar Card {technician.documents?.aadhaarNumber && /^\d{4}/.test(technician.documents.aadhaarNumber) ? `(${technician.documents.aadhaarNumber.slice(0, 4)}...${technician.documents.aadhaarNumber.slice(-4)})` : 'Document'}. Reviewed and authorized by NeedFix platform administrators.
                </p>
              </div>
            </div>
          )}

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Radius</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{technician.coverageRadiusKm} Km Coverage</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Working Hours</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{technician.workingHours || '8:30 AM - 8:30 PM'}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ratings Score</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-slate-900">
                  {technician.rating > 0 ? technician.rating.toFixed(1) : 'New'}
                </span>
                <span className="text-xs text-slate-400">({reviews.length})</span>
              </div>
            </div>
          </div>

          {/* Business Bio / Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              About & Service Expertise
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {technician.businessDescription}
            </p>
          </div>

          {/* Service Localities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Service Areas Covered
            </h3>
            <div className="flex items-start gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">{technician.location.city} Region</span>
                <p className="text-slate-600 mt-0.5">{technician.coverageAreaText || technician.location.area}</p>
              </div>
            </div>
          </div>

          {/* Services & Price Menu */}
          {technician.servicesOffered && technician.servicesOffered.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Services Offered & Transparent Pricing
                </h3>
                <span className="text-[11px] text-blue-600 font-semibold">Standard Rates</span>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                {technician.servicesOffered.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors"
                  >
                    {/* Left side: Full Service Title & description in bold */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      {/* Work Photo Thumbnail */}
                      {srv.photoUrl ? (
                        <img
                          src={srv.photoUrl}
                          alt={srv.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs bg-slate-100 mt-0.5 sm:mt-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs mt-0.5 sm:mt-0">
                          <CheckCircle2 size={18} className="text-blue-600" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="font-bold text-slate-950 text-sm sm:text-[15px] leading-snug break-words">
                          {srv.name}
                        </h4>
                        {srv.description && (
                          <p className="font-bold text-slate-600 text-xs leading-relaxed break-words">
                            {srv.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Center/Right: Prominent Price tag & Far Right: Action buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2.5 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                      {/* Prominent Price Tag */}
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-xl font-bold font-mono text-base tracking-tight shadow-2xs flex items-center gap-1">
                        <span className="text-xs font-semibold text-emerald-600">Rate:</span>
                        <span>₹{srv.price}</span>
                      </div>

                      {/* Action buttons ("Call" and "WhatsApp") */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCallForService(srv.name)}
                          className="py-2 px-3 sm:px-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                          title={`Call technician for ${srv.name}`}
                        >
                          <Phone size={13} className="shrink-0" />
                          <span>Call</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppForService(srv.name)}
                          className="py-2 px-3 sm:px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                          title={`WhatsApp technician for ${srv.name}`}
                        >
                          <MessageSquare size={13} className="shrink-0" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Work Samples */}
          {technician.portfolioImages && technician.portfolioImages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Previous Work Portfolio & Completed Jobs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {technician.portfolioImages.map((img, idx) => (
                  <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                    <img
                      src={img}
                      alt={`Portfolio ${idx + 1}`}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews & Feedback */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customer Ratings & Reviews ({reviews.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onRequireAuth('rate and review this technician');
                    return;
                  }
                  setShowReviewForm(!showReviewForm);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors flex items-center gap-1"
              >
                <span>{showReviewForm ? 'Cancel Review' : '+ Rate & Review'}</span>
                {!currentUser && <Lock size={11} className="text-blue-500" />}
              </button>
            </div>

            {/* Leave Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-4 p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingScore(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={18}
                          className={
                            star <= ratingScore
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-700 font-mono">
                    {ratingScore} Stars
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Which service was performed? (e.g. AC Gas Refill, Wiring)"
                    value={serviceUsed}
                    onChange={(e) => setServiceUsed(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Share your feedback about the technician's punctuality, work quality, and pricing..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  Submit Verified Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No reviews yet. Be the first to book and rate {technician.fullName}!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={rev.customerName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{rev.customerName}</span>
                          <span className="text-[10px] text-slate-400">{rev.serviceUsed} • {new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    {rev.technicianReply && (
                      <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 text-xs">
                        <span className="font-bold text-blue-900 text-[11px] block">{technician.fullName} (Provider):</span>
                        <p className="text-blue-950 mt-0.5">{rev.technicianReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR: Direct Contact Actions Only (Call & WhatsApp) */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-2xl shrink-0 grid grid-cols-2 gap-3">
          {/* Direct Call Action Button */}
          <button
            type="button"
            onClick={handleCall}
            className="py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 cursor-pointer"
            title="Call Technician Directly"
          >
            <Phone size={17} />
            <span>Direct Call</span>
          </button>

          {/* Direct WhatsApp Action Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer"
            title="Direct WhatsApp Chat"
          >
            <MessageSquare size={17} />
            <span>WhatsApp Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
