import React, { useState, useEffect } from 'react';
import {
  X,
  Navigation,
  MapPin,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { UserLocation } from '../../types';
import {
  ALL_INDIAN_STATES,
  UNION_TERRITORIES,
  IndianState,
  DEFAULT_USER_LOCATION,
  getCurrentGPSLocation,
  getDistrictsForState,
  IndianDistrict,
} from '../../services/locationService';

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation?: UserLocation | null;
  onSelectLocation: (location: UserLocation) => void;
  title?: string;
  subtitle?: string;
}

export const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  title = 'Select Location',
  subtitle = 'Choose State, District or use Automatic GPS',
}) => {
  const [tempLocation, setTempLocation] = useState<UserLocation>(
    currentLocation || DEFAULT_USER_LOCATION
  );
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'detecting' | 'locked' | 'error'>('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // 1. Selected State
  const [selectedStateObj, setSelectedStateObj] = useState<IndianState>(() => {
    const stName = currentLocation?.state || DEFAULT_USER_LOCATION.state;
    const match =
      ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === stName?.toLowerCase()) ||
      UNION_TERRITORIES.find((u) => u.name.toLowerCase() === stName?.toLowerCase());
    return match || ALL_INDIAN_STATES.find((s) => s.name === 'Jharkhand') || ALL_INDIAN_STATES[0];
  });

  // 2. Selected District
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() => {
    const stName = currentLocation?.state || DEFAULT_USER_LOCATION.state;
    const dists = getDistrictsForState(stName || 'Jharkhand');
    const cityName = (currentLocation?.city || DEFAULT_USER_LOCATION.city).toLowerCase();
    const match = dists.find(
      (d) =>
        d.name.toLowerCase().includes(cityName) ||
        cityName.includes(d.name.toLowerCase()) ||
        d.name.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase() === cityName
    );
    return match?.id || dists[0]?.id || '';
  });

  // Current State's districts list
  const currentStateDistricts = React.useMemo(() => {
    if (!selectedStateObj) return [];
    return getDistrictsForState(selectedStateObj.name);
  }, [selectedStateObj]);

  // Sync state when opening
  useEffect(() => {
    if (isOpen) {
      setGpsError(null);
      setSuccessNotice(null);
      const locToUse = currentLocation || DEFAULT_USER_LOCATION;
      setTempLocation(locToUse);

      const stName = locToUse.state || 'Jharkhand';
      const matchState =
        ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === stName.toLowerCase()) ||
        UNION_TERRITORIES.find((u) => u.name.toLowerCase() === stName.toLowerCase()) ||
        ALL_INDIAN_STATES.find((s) => s.name === 'Jharkhand') ||
        ALL_INDIAN_STATES[0];

      if (matchState) {
        setSelectedStateObj(matchState);
        const dists = getDistrictsForState(matchState.name);
        const cityName = locToUse.city.toLowerCase();
        const matchDist = dists.find(
          (d) =>
            d.name.toLowerCase().includes(cityName) ||
            cityName.includes(d.name.toLowerCase()) ||
            d.name.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase() === cityName
        );
        if (matchDist) {
          setSelectedDistrictId(matchDist.id);
        } else if (dists.length > 0) {
          setSelectedDistrictId(dists[0].id);
        }
      }
    }
  }, [isOpen, currentLocation]);

  // Phone back button synchronization
  useEffect(() => {
    if (!isOpen) return;
    try {
      window.history.pushState({ needfix: true, needfixTag: 'location_modal', t: Date.now() }, '');
    } catch (e) {
      console.warn('History pushState error in LocationSelectionModal:', e);
    }

    const onPop = () => {
      onClose();
    };

    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, [isOpen, onClose]);

  const handleSafeClose = () => {
    if (window.history.state && window.history.state.needfixTag === 'location_modal') {
      window.history.back();
    } else {
      onClose();
    }
  };

  // 3. Automatic GPS tracker function
  const detectLiveGPS = async () => {
    setIsLocatingGPS(true);
    setGpsStatus('detecting');
    setGpsError(null);
    setSuccessNotice(null);

    try {
      const gpsLocation = await getCurrentGPSLocation();
      setTempLocation(gpsLocation);

      // Match state from GPS
      const detectedState =
        ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === gpsLocation.state?.toLowerCase()) ||
        UNION_TERRITORIES.find((u) => u.name.toLowerCase() === gpsLocation.state?.toLowerCase());

      if (detectedState) {
        setSelectedStateObj(detectedState);
        const dists = getDistrictsForState(detectedState.name);
        const matchDist = dists.find((d) =>
          d.name.toLowerCase().includes(gpsLocation.city.toLowerCase()) ||
          gpsLocation.city.toLowerCase().includes(d.name.toLowerCase())
        );
        if (matchDist) {
          setSelectedDistrictId(matchDist.id);
        }
      }

      setGpsStatus('locked');
      setSuccessNotice(`GPS Locked: ${gpsLocation.city}, ${gpsLocation.state || ''}`);
    } catch (err: any) {
      console.error('GPS error:', err);
      setGpsStatus('error');
      setGpsError('GPS permission denied or unavailable. Please select your State and District below.');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  // 1. Handle State Change
  const handleStateChange = (stateName: string) => {
    const stateItem =
      ALL_INDIAN_STATES.find((s) => s.name === stateName) ||
      UNION_TERRITORIES.find((u) => u.name === stateName);
    if (!stateItem) return;

    setSelectedStateObj(stateItem);
    const districts = getDistrictsForState(stateItem.name);

    // Pick first district or major hub
    let chosenDistrict = districts[0];
    if (stateItem.majorHub) {
      const hubMatch = districts.find(
        (d) =>
          d.name.toLowerCase().includes(stateItem.majorHub.toLowerCase()) ||
          stateItem.majorHub.toLowerCase().includes(d.name.toLowerCase())
      );
      if (hubMatch) chosenDistrict = hubMatch;
    }

    if (chosenDistrict) {
      setSelectedDistrictId(chosenDistrict.id);
    }

    const cleanDistName = chosenDistrict
      ? chosenDistrict.name.replace(/\s*\(.*?\)\s*/g, '').trim()
      : (stateItem.majorHub || stateItem.capital);

    const updated: UserLocation = {
      latitude: chosenDistrict ? chosenDistrict.latitude : stateItem.latitude,
      longitude: chosenDistrict ? chosenDistrict.longitude : stateItem.longitude,
      city: cleanDistName,
      area: cleanDistName,
      state: stateItem.name,
      address: `${cleanDistName}, ${stateItem.name}`,
    };
    setTempLocation(updated);
    setGpsStatus('idle');
    setSuccessNotice(`Selected: ${cleanDistName}, ${stateItem.name}`);
  };

  // 2. Handle District Change
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const chosenDistrict = currentStateDistricts.find((d) => d.id === districtId);
    if (!chosenDistrict) return;

    const cleanDistName = chosenDistrict.name.replace(/\s*\(.*?\)\s*/g, '').trim();

    const updated: UserLocation = {
      latitude: chosenDistrict.latitude,
      longitude: chosenDistrict.longitude,
      city: cleanDistName,
      area: cleanDistName,
      state: chosenDistrict.state,
      address: `${cleanDistName}, ${chosenDistrict.state}`,
    };
    setTempLocation(updated);
    setGpsStatus('idle');
    setSuccessNotice(`Selected: ${cleanDistName}, ${chosenDistrict.state}`);
  };

  // Confirm and Apply Location
  const handleConfirm = () => {
    onSelectLocation(tempLocation);
    handleSafeClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-x-hidden max-w-full">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col box-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-4 sm:p-5 relative shrink-0">
          <button
            type="button"
            onClick={handleSafeClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-2xl border border-white/20 text-white shadow-xs">
              <MapPin size={22} className="text-white" />
            </div>
            <div className="pr-6">
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                {title}
              </h2>
              <p className="text-xs text-blue-100 mt-0.5 leading-snug">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body - Exactly 3 Options */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* OPTION 3: Automatic GPS Tracker Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation size={13} className="text-blue-600" />
                <span>3. Automatic GPS Tracker</span>
              </span>
              {gpsStatus === 'locked' && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> GPS Locked
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={detectLiveGPS}
              disabled={isLocatingGPS}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-75 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLocatingGPS ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Locating via GPS...</span>
                </>
              ) : (
                <>
                  <Navigation size={16} className="fill-white" />
                  <span>Detect My Current GPS Location</span>
                </>
              )}
            </button>
          </div>

          {/* GPS Error Alert */}
          {gpsError && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={15} className="text-amber-600 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Visual Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
              Or Select Manually
            </span>
          </div>

          {/* OPTION 1: State Select Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="state-select-input" className="block text-xs font-bold text-slate-800">
              1. State Select <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="state-select-input"
                value={selectedStateObj?.name || 'Jharkhand'}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 appearance-none cursor-pointer pr-10 shadow-2xs transition-colors"
              >
                <optgroup label="States (28 States)">
                  {ALL_INDIAN_STATES.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Union Territories (8 Union Territories)">
                  {UNION_TERRITORIES.map((ut) => (
                    <option key={ut.id} value={ut.name}>
                      {ut.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* OPTION 2: District / City Select Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="district-select-input" className="block text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>2. District / City Select <span className="text-red-500">*</span></span>
              <span className="text-[10px] font-semibold text-blue-600">
                {currentStateDistricts.length} districts in {selectedStateObj?.name}
              </span>
            </label>
            <div className="relative">
              <select
                id="district-select-input"
                value={selectedDistrictId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 appearance-none cursor-pointer pr-10 shadow-2xs transition-colors"
              >
                {currentStateDistricts.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name} {dist.isMajorCity ? '★ Hub' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Current Selection Status Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-blue-600 text-white rounded-xl shrink-0">
                <MapPin size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  Current Selection
                </span>
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {tempLocation.city}{tempLocation.state ? `, ${tempLocation.state}` : ''}
                </span>
              </div>
            </div>
            {tempLocation.isGpsLocked && (
              <span className="text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shrink-0">
                GPS Active
              </span>
            )}
          </div>

          {successNotice && (
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span className="truncate">{successNotice}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSafeClose}
            className="py-2.5 px-4 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 size={15} />
            <span>Set Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
