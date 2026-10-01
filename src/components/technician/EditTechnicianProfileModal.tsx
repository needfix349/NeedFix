import React, { useState, useRef } from 'react';
import {
  X,
  Building2,
  User,
  Phone,
  MessageSquare,
  MapPin,
  Crosshair,
  Image,
  Upload,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
  Briefcase,
  KeyRound,
} from 'lucide-react';
import { TechnicianProfile } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { getCurrentGPSLocation } from '../../services/locationService';
import { supabaseService } from '../../services/supabaseService';
import { storageService } from '../../services/storage';

interface EditTechnicianProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianProfile;
  onUpdated: (updatedTech: TechnicianProfile) => void;
}

export const EditTechnicianProfileModal: React.FC<EditTechnicianProfileModalProps> = ({
  isOpen,
  onClose,
  technician,
  onUpdated,
}) => {
  // 1. Business & Personal Identity
  const [companyName, setCompanyName] = useState(technician.companyName || '');
  const [fullName, setFullName] = useState(technician.fullName || '');
  const [whatsappNumber, setWhatsappNumber] = useState(technician.whatsappNumber || technician.mobile || '');
  const [experienceYears, setExperienceYears] = useState(technician.experienceYears || 5);
  const [businessDescription, setBusinessDescription] = useState(
    technician.businessDescription || ''
  );

  // 2. Workshop Address & GPS Coordinates
  const [address, setAddress] = useState(technician.location?.address || '');
  const [city, setCity] = useState(technician.location?.city || '');
  const [area, setArea] = useState(technician.location?.area || '');
  const [latitude, setLatitude] = useState<number>(technician.location?.latitude || 28.6139);
  const [longitude, setLongitude] = useState<number>(technician.location?.longitude || 77.209);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState<string | null>(null);

  // 3. Service Coverage Radius (KM)
  const [coverageRadiusKm, setCoverageRadiusKm] = useState<number>(
    technician.coverageRadiusKm || 10
  );

  // 4. Trade / Category Selection
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    technician.categoryIds && technician.categoryIds.length > 0
      ? technician.categoryIds
      : [technician.categoryId || 'ac_service']
  );

  // 5. Store / Workshop Logo / Profile Photo
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>(
    technician.companyLogoUrl || technician.profilePhotoUrl || ''
  );
  const [logoFileName, setLogoFileName] = useState<string>('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  // 6. 4-Digit Secret Login PIN
  const [pin, setPin] = useState(technician.pin || '');

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Toggle Category
  const toggleCategory = (catId: string) => {
    if (selectedCategoryIds.includes(catId)) {
      if (selectedCategoryIds.length === 1) {
        setErrorMessage('Please select at least 1 service trade.');
        return;
      }
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
    setErrorMessage(null);
  };

  // Handle Logo Upload from Camera or Gallery
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size is too large (maximum 8MB allowed).');
      return;
    }

    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCompanyLogoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Fetch Live GPS Location
  const handleFetchGPS = async () => {
    setIsFetchingGPS(true);
    setErrorMessage(null);
    setGpsSuccessMsg(null);

    try {
      const pos = await getCurrentGPSLocation();
      setLatitude(pos.latitude);
      setLongitude(pos.longitude);
      if (pos.city) setCity(pos.city);
      if (pos.address) setAddress(pos.address);
      setGpsSuccessMsg(`GPS Updated: ${pos.city || 'Coordinates Locked'} (${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)})`);
      setTimeout(() => setGpsSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to fetch current GPS coordinates. Please check location permissions.');
    } finally {
      setIsFetchingGPS(false);
    }
  };

  // Submit & Save All Profile Changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanCompany = companyName.trim();
    const cleanFull = fullName.trim();
    const cleanCity = city.trim();
    const cleanAddress = address.trim();
    const cleanWhatsapp = whatsappNumber.trim().replace(/\D/g, '').slice(-10);

    if (!cleanCompany) {
      setErrorMessage('Please enter your Workshop / Business Name.');
      return;
    }
    if (!cleanFull) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setErrorMessage('Please select at least one trade category.');
      return;
    }
    if (!cleanCity) {
      setErrorMessage('Please specify your Workshop City.');
      return;
    }
    if (pin && !/^\d{4}$/.test(pin.trim())) {
      setErrorMessage('Login PIN must be exactly 4 numeric digits (0000-9999).');
      return;
    }

    setIsSaving(true);

    try {
      const primaryCat =
        SERVICE_CATEGORIES.find((c) => selectedCategoryIds.includes(c.id)) ||
        SERVICE_CATEGORIES[0];
      const categoryNames = SERVICE_CATEGORIES.filter((c) =>
        selectedCategoryIds.includes(c.id)
      ).map((c) => c.name);

      const updatedTech: TechnicianProfile = {
        ...technician,
        companyName: cleanCompany,
        fullName: cleanFull,
        whatsappNumber: cleanWhatsapp || technician.mobile,
        experienceYears: Number(experienceYears) || 5,
        businessDescription: businessDescription.trim(),
        categoryId: primaryCat.id,
        categoryName: primaryCat.name,
        categoryIds: selectedCategoryIds,
        categoryNames: categoryNames,
        coverageRadiusKm: Number(coverageRadiusKm) || 10,
        coverageAreaText: `${cleanCity} (+${coverageRadiusKm} KM)`,
        location: {
          ...technician.location,
          address: cleanAddress || technician.location?.address || 'Workshop',
          city: cleanCity,
          area: area.trim() || cleanCity,
          latitude: Number(latitude) || technician.location?.latitude || 28.6139,
          longitude: Number(longitude) || technician.location?.longitude || 77.209,
        },
        companyLogoUrl: companyLogoUrl.trim() || undefined,
        profilePhotoUrl: companyLogoUrl.trim() || undefined,
        pin: pin.trim() || technician.pin,
      };

      // 1. Update in local storage
      storageService.updateTechnicianProfile(updatedTech);

      // 2. Persist to Supabase & Central Server
      await supabaseService.updateTechnicianProfile(updatedTech);

      // Also update linked user profile if current user is this technician
      const currentUser = storageService.getCurrentUser();
      if (currentUser && (currentUser.id === technician.userId || currentUser.id === technician.id)) {
        const updatedUser = {
          ...currentUser,
          name: cleanFull,
          companyName: cleanCompany,
        };
        storageService.setCurrentUser(updatedUser);
      }

      setSuccessMessage('Technician profile updated successfully!');
      onUpdated(updatedTech);

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-auto transition-all flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 p-5 sm:p-6 text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Edit Technician Profile & Details
              </h2>
              <p className="text-xs text-blue-200 font-medium">
                Update store branding, address, GPS location, trades, and radius
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Status Alerts */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* SECTION 1: IDENTITY & REGISTERED PHONE (LOCKED) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-600" />
              <span>1. Business & Registered Identity</span>
            </h3>

            {/* Read-Only Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-slate-500" />
                  <span>Registered Mobile (Calling ID)</span>
                </span>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock size={10} /> Locked / Non-Editable
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="text"
                  value={technician.mobile}
                  disabled
                  readOnly
                  className="w-full pl-12 pr-10 py-2.5 text-sm bg-slate-200/70 border border-slate-300 rounded-xl text-slate-600 font-mono font-bold cursor-not-allowed select-none"
                />
                <Lock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                🔒 Registered mobile number cannot be changed to prevent identity fraud and preserve verified technician credentials.
              </p>
            </div>

            {/* Business / Shop Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store / Business Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Asfak Store Services"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner / Technician Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Asfak Ali"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                required
              />
            </div>

            {/* WhatsApp Number (Editable) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} className="text-emerald-600" />
                  <span>Direct WhatsApp Number</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Can be different from call number
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit WhatsApp number"
                  className="w-full pl-12 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: STORE / WORKSHOP LOGO OR PHOTO */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Image size={14} className="text-blue-600" />
              <span>2. Shop Logo & Photo</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-2xl border border-slate-200">
              {companyLogoUrl ? (
                <div className="relative group shrink-0">
                  <img
                    src={companyLogoUrl}
                    alt="Store Logo"
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyLogoUrl('');
                      setLogoFileName('');
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 bg-slate-50">
                  <Image size={24} />
                  <span className="text-[9px] mt-1">No Logo</span>
                </div>
              )}

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors mx-auto sm:mx-0"
                >
                  <Upload size={14} />
                  <span>{companyLogoUrl ? 'Change Shop Photo / Logo' : 'Upload Shop Photo / Logo'}</span>
                </button>
                <p className="text-[11px] text-slate-500">
                  Upload your shop storefront, signboard, or business logo (JPG, PNG). If empty, no dummy photo will be shown.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: WORKSHOP ADDRESS & GPS */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-600" />
                <span>3. Workshop Location & GPS Coordinates</span>
              </h3>
              <button
                type="button"
                onClick={handleFetchGPS}
                disabled={isFetchingGPS}
                className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 transition-colors shadow-2xs"
              >
                <Crosshair size={12} className={isFetchingGPS ? 'animate-spin' : ''} />
                <span>{isFetchingGPS ? 'Fetching GPS...' : 'Fetch Live GPS'}</span>
              </button>
            </div>

            {gpsSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>{gpsSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Gorakhpur / Delhi"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Local Area / Locality
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Civil Lines, Main Market"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Workshop / Shop Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No., Street, Landmark"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            {/* GPS Latitude and Longitude */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: SERVICE COVERAGE RADIUS (KM) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Service Coverage Radius
              </h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                {coverageRadiusKm} KM Range
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Customers within this distance from your workshop will be able to discover and book you directly.
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {[5, 10, 15, 20, 25, 30].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setCoverageRadiusKm(km)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    coverageRadiusKm === km
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {km} KM
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 5: TRADES & SERVICES OFFERED */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                5. Trades & Categories Provided
              </h3>
              <span className="text-xs font-bold text-blue-700">
                {selectedCategoryIds.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {SERVICE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs truncate">{cat.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 text-transparent'
                      }`}
                    >
                      <Check size={12} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 6: DESCRIPTION & SECRET PIN */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              6. Bio & Security PIN
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Description / Services Overview
              </label>
              <textarea
                rows={2}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Briefly describe your services, experience, and tools..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <KeyRound size={12} className="text-blue-600" />
                  <span>Update 4-Digit Login PIN</span>
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Leave as is or enter new 4-digit PIN"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl font-mono tracking-widest text-center"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                'Saving Changes...'
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
