import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Navigation,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Search,
  Building2,
  Compass,
  Crosshair,
  ChevronDown,
  ChevronUp,
  Globe,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { UserLocation } from '../../types';
import {
  MAJOR_CITIES,
  ALL_INDIAN_STATES,
  UNION_TERRITORIES,
  IndianState,
  DEFAULT_USER_LOCATION,
  getCurrentGPSLocation,
  reverseGeocodeCoordinates,
  IndianDistrict,
  getDistrictsForState,
  searchAllDistricts,
} from '../../services/locationService';

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation?: UserLocation | null;
  onSelectLocation: (location: UserLocation) => void;
  title?: string;
  subtitle?: string;
}

// Popular city quick-picker chips
const POPULAR_CITIES = [
  'Jamshedpur',
  'Ranchi',
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Jaipur',
  'Ahmedabad',
  'Patna',
  'Lucknow',
];

export const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  title = 'Select Your Location (स्थान चुनें)',
  subtitle = 'Auto-detect live GPS doorstep or select City/District manually',
}) => {
  const [tempLocation, setTempLocation] = useState<UserLocation>(
    currentLocation || DEFAULT_USER_LOCATION
  );
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'detecting' | 'locked' | 'manual'>('detecting');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [statesTab, setStatesTab] = useState<'states' | 'uts'>('states');
  const [isSearching, setIsSearching] = useState(false);
  const [customArea, setCustomArea] = useState(currentLocation?.area || DEFAULT_USER_LOCATION.area);
  const [customAddress, setCustomAddress] = useState(
    currentLocation?.address || DEFAULT_USER_LOCATION.address
  );

  // Hierarchical State -> District Selection State
  const [selectedStateObj, setSelectedStateObj] = useState<IndianState | null>(() => {
    const stName = currentLocation?.state || DEFAULT_USER_LOCATION.state;
    return (
      ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === stName?.toLowerCase()) ||
      UNION_TERRITORIES.find((u) => u.name.toLowerCase() === stName?.toLowerCase()) ||
      ALL_INDIAN_STATES.find((s) => s.name === 'Jharkhand') ||
      ALL_INDIAN_STATES[0]
    );
  });
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
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'none' | 'districts' | 'states'>('none');
  const [districtNotice, setDistrictNotice] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Synchronize location and cascading selectors whenever opening modal
  useEffect(() => {
    if (isOpen) {
      setSearchCityQuery('');
      setDistrictSearchQuery('');
      setShowCityDropdown(false);
      setGpsError(null);
      setDistrictNotice(null);

      const locToUse = currentLocation || DEFAULT_USER_LOCATION;
      setTempLocation(locToUse);
      setCustomArea(locToUse.area || locToUse.city);
      setCustomAddress(locToUse.address || `${locToUse.area || locToUse.city}, ${locToUse.city}`);

      const stName = locToUse.state || 'Jharkhand';
      const matchState =
        ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === stName.toLowerCase()) ||
        UNION_TERRITORIES.find((u) => u.name.toLowerCase() === stName.toLowerCase()) ||
        ALL_INDIAN_STATES.find((s) => s.name === 'Jharkhand');

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

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const detectLiveGPS = async () => {
    setIsLocatingGPS(true);
    setGpsStatus('detecting');
    setGpsError(null);

    try {
      const loc = await getCurrentGPSLocation();
      setTempLocation(loc);
      setCustomArea(loc.area || loc.city);
      setCustomAddress(loc.address || `${loc.area}, ${loc.city}`);
      setGpsStatus('locked');

      // Attempt to align state
      if (loc.state) {
        const matchingState =
          ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === loc.state.toLowerCase()) ||
          UNION_TERRITORIES.find((u) => u.name.toLowerCase() === loc.state.toLowerCase());
        if (matchingState) {
          setSelectedStateObj(matchingState);
        }
      }
    } catch (err: any) {
      console.warn('GPS detection notice:', err);
      setGpsError('Could not auto-lock live GPS. You can select your State & District or drag the pin.');
      setGpsStatus('manual');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  // Select City from dropdown or quick-chips
  const handleSelectCity = (cityObj: UserLocation) => {
    const updated: UserLocation = {
      ...cityObj,
      area: cityObj.area,
      address: cityObj.address,
    };
    setTempLocation(updated);
    setCustomArea(cityObj.area);
    setCustomAddress(cityObj.address);
    setSearchCityQuery('');
    setShowCityDropdown(false);
    setGpsStatus('manual');
    setActiveSection('none');

    if (cityObj.state) {
      const matchingState =
        ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === cityObj.state.toLowerCase()) ||
        UNION_TERRITORIES.find((u) => u.name.toLowerCase() === cityObj.state.toLowerCase());
      if (matchingState) {
        setSelectedStateObj(matchingState);
      }
    }
  };

  // Select State from All 28 States: Automatically cascades to districts and preselects primary hub
  const handleSelectState = (stateItem: IndianState) => {
    setSelectedStateObj(stateItem);
    setDistrictSearchQuery('');

    // Pre-select primary hub or first district (e.g. Jamshedpur for Jharkhand)
    const districts = getDistrictsForState(stateItem.name);
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

    const lat = chosenDistrict ? chosenDistrict.latitude : stateItem.latitude;
    const lng = chosenDistrict ? chosenDistrict.longitude : stateItem.longitude;
    const areaName = chosenDistrict ? `${cleanDistName} Hub` : `${stateItem.capital} District`;
    const addr = chosenDistrict
      ? `${cleanDistName}, ${stateItem.name}, India`
      : `${stateItem.capital}, ${stateItem.name}, India`;

    const updated: UserLocation = {
      latitude: lat,
      longitude: lng,
      city: cleanDistName,
      area: areaName,
      state: stateItem.name,
      address: addr,
    };
    setTempLocation(updated);
    setCustomArea(areaName);
    setCustomAddress(addr);
    setSearchCityQuery('');
    setShowCityDropdown(false);
    setGpsStatus('manual');
    setDistrictNotice(`📍 Selected ${cleanDistName} Hub, ${stateItem.name}`);
    setTimeout(() => {
      setDistrictNotice(null);
    }, 3500);
  };

  // Select District from the State's Districts List
  const handleSelectDistrict = (district: IndianDistrict) => {
    setSelectedDistrictId(district.id);
    const cleanDistName = district.name.replace(/\s*\(.*?\)\s*/g, '').trim();
    const areaName = `${cleanDistName} Hub`;
    const addr = `${cleanDistName}, ${district.state}, India`;

    const updated: UserLocation = {
      latitude: district.latitude,
      longitude: district.longitude,
      city: cleanDistName,
      area: areaName,
      state: district.state,
      address: addr,
    };
    setTempLocation(updated);
    setCustomArea(areaName);
    setCustomAddress(addr);
    setDistrictNotice(`📍 Selected ${district.name} (${district.hindiName}), ${district.state}`);
    setActiveSection('none');
    setSearchCityQuery('');
    setShowCityDropdown(false);
    setGpsStatus('manual');

    // Auto clear notification after 3.5 seconds
    setTimeout(() => {
      setDistrictNotice(null);
    }, 3500);
  };

  // Search submit (Enter key or button)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCityQuery.trim()) return;

    const query = searchCityQuery.trim().toLowerCase();

    // 1. Check direct match in Districts first
    const districtMatches = searchAllDistricts(query, 5);
    if (districtMatches.length > 0) {
      handleSelectDistrict(districtMatches[0]);
      return;
    }

    // 2. Check match in 28 States
    const stateMatch = ALL_INDIAN_STATES.find(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.hindiName.toLowerCase().includes(query) ||
        s.capital.toLowerCase().includes(query) ||
        s.majorHub.toLowerCase().includes(query)
    );

    if (stateMatch) {
      handleSelectState(stateMatch);
      return;
    }

    // 3. Check match in Union Territories
    const utMatch = UNION_TERRITORIES.find(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.hindiName.toLowerCase().includes(query) ||
        u.capital.toLowerCase().includes(query)
    );

    if (utMatch) {
      handleSelectState(utMatch);
      return;
    }

    // 4. Check local matches in MAJOR_CITIES
    const localMatch = MAJOR_CITIES.find(
      (c) =>
        c.city.toLowerCase().includes(query) ||
        c.area.toLowerCase().includes(query) ||
        c.state.toLowerCase().includes(query)
    );

    if (localMatch) {
      handleSelectCity(localMatch);
      return;
    }

    // 5. Free search with OpenStreetMap Nominatim for India
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchCityQuery.trim()
        )}&countrycodes=in&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const resolved = await reverseGeocodeCoordinates(lat, lng);
          setTempLocation(resolved);
          setCustomArea(resolved.area || searchCityQuery.trim());
          setCustomAddress(resolved.address || item.display_name);
          setGpsStatus('manual');
          setShowCityDropdown(false);
          setActiveSection('none');
        } else {
          setGpsError(`No matching location found for "${searchCityQuery}". Please select your State & District from the list below.`);
        }
      }
    } catch {
      setGpsError('Location search temporary unavailable. Please pick your State & District below or retry GPS detection.');
    } finally {
      setIsSearching(false);
    }
  };

  // Confirm Location
  const handleConfirm = () => {
    const finalLocation: UserLocation = {
      ...tempLocation,
      area: customArea.trim() || tempLocation.area || tempLocation.city,
      address:
        customAddress.trim() ||
        tempLocation.address ||
        `${tempLocation.area}, ${tempLocation.city}`,
    };
    onSelectLocation(finalLocation);
    onClose();
  };

  // Current State's districts
  const currentStateDistricts = selectedStateObj
    ? getDistrictsForState(selectedStateObj.name)
    : [];

  const filteredCurrentDistricts = currentStateDistricts.filter(
    (d) =>
      d.name.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
      d.hindiName.toLowerCase().includes(districtSearchQuery.toLowerCase())
  );

  // Global search autocomplete results
  const matchingDistrictsFromSearch = searchCityQuery.trim()
    ? searchAllDistricts(searchCityQuery.trim(), 8)
    : [];

  const filteredStatesFromSearch = searchCityQuery.trim()
    ? ALL_INDIAN_STATES.filter(
        (s) =>
          s.name.toLowerCase().includes(searchCityQuery.toLowerCase()) ||
          s.hindiName.toLowerCase().includes(searchCityQuery.toLowerCase()) ||
          s.capital.toLowerCase().includes(searchCityQuery.toLowerCase())
      )
    : [];

  const filteredCities = MAJOR_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(searchCityQuery.toLowerCase()) ||
      c.area.toLowerCase().includes(searchCityQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchCityQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-4 sm:p-5 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-2xl border border-white/20 text-white shadow-xs">
              <MapPin size={22} className="text-white" />
            </div>
            <div className="pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  {title}
                </h2>
                {gpsStatus === 'locked' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-300/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} /> Live GPS Locked
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 mt-0.5 leading-snug">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {/* Top Search Input Box & GPS Re-center */}
          <div ref={searchContainerRef} className="relative space-y-2">
            <div className="flex items-center gap-2">
              {/* Search Box with Autocomplete for States + Districts */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchCityQuery}
                  onChange={(e) => {
                    setSearchCityQuery(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder="Search any of 28 States, District or City (e.g. Bihar, Patna, Lucknow, Pune)..."
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {searchCityQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchCityQuery('');
                      setShowCityDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Prominent Live GPS / Locate Me Button */}
              <button
                type="button"
                onClick={detectLiveGPS}
                disabled={isLocatingGPS}
                className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 active:scale-95 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Automatically detect live GPS location"
              >
                {isLocatingGPS ? (
                  <RefreshCw size={14} className="animate-spin text-white" />
                ) : (
                  <Navigation size={14} className="fill-white" />
                )}
                <span className="hidden xs:inline">
                  {isLocatingGPS ? 'Locking...' : 'Locate Me'}
                </span>
              </button>
            </div>

            {/* Dropdown results when typing: Shows Districts + States + Cities */}
            {showCityDropdown &&
              searchCityQuery.trim().length > 0 &&
              (matchingDistrictsFromSearch.length > 0 ||
                filteredStatesFromSearch.length > 0 ||
                filteredCities.length > 0) && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-64 overflow-y-auto p-2 animate-in fade-in zoom-in-95 duration-100">
                  {/* Matching Districts */}
                  {matchingDistrictsFromSearch.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 px-2.5 py-1 bg-blue-50/90 rounded-lg flex items-center justify-between">
                        <span>🏙️ Districts & Cities (ज़िले और शहर)</span>
                        <span>{matchingDistrictsFromSearch.length} found</span>
                      </div>
                      {matchingDistrictsFromSearch.map((dist) => (
                        <button
                          key={`${dist.state}-${dist.name}`}
                          type="button"
                          onClick={() => handleSelectDistrict(dist)}
                          className="w-full px-3 py-2 text-left rounded-xl hover:bg-blue-50 text-xs flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-700">
                              {dist.name}
                            </span>
                            <span className="text-slate-500 text-[11px] ml-1.5">
                              ({dist.hindiName})
                            </span>
                          </div>
                          <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md font-bold">
                            {dist.state}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matching States */}
                  {filteredStatesFromSearch.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 px-2.5 py-1 bg-indigo-50/90 rounded-lg flex items-center justify-between">
                        <span>🇮🇳 Indian States (राज्य)</span>
                        <span>{filteredStatesFromSearch.length} match</span>
                      </div>
                      {filteredStatesFromSearch.slice(0, 4).map((state) => (
                        <button
                          key={state.name}
                          type="button"
                          onClick={() => handleSelectState(state)}
                          className="w-full px-3 py-2 text-left rounded-xl hover:bg-indigo-50 text-xs flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-indigo-700">
                              {state.name} ({state.hindiName})
                            </span>
                            <span className="text-slate-500 text-[11px] ml-1.5">
                              • Capital: {state.capital}
                            </span>
                          </div>
                          <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold border border-indigo-100">
                            Select Districts ➔
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Cascading State & District Selector Dropdowns */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-sm">🇮🇳</span>
                  <span>State & District (राज्य व जिला)</span>
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium border border-blue-200/60">
                  Cascading Filter • Exact Coordinates
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. State Selector Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="state-select" className="block text-[11px] font-semibold text-slate-600">
                    Select State (राज्य):
                  </label>
                  <div className="relative">
                    <select
                      id="state-select"
                      value={selectedStateObj?.name || tempLocation.state || 'Jharkhand'}
                      onChange={(e) => {
                        const chosen =
                          ALL_INDIAN_STATES.find((s) => s.name === e.target.value) ||
                          UNION_TERRITORIES.find((u) => u.name === e.target.value);
                        if (chosen) {
                          handleSelectState(chosen);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 appearance-none cursor-pointer pr-8 shadow-2xs transition-colors"
                    >
                      <optgroup label="States (28)">
                        {ALL_INDIAN_STATES.map((state) => (
                          <option key={state.id} value={state.name}>
                            {state.name} ({state.hindiName})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Union Territories (8)">
                        {UNION_TERRITORIES.map((ut) => (
                          <option key={ut.id} value={ut.name}>
                            {ut.name} ({ut.hindiName})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* 2. District / City Selector Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="district-select" className="block text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                    <span>District / City (जिला):</span>
                    <span className="text-[10px] font-normal text-blue-600">
                      {currentStateDistricts.length} in {selectedStateObj?.name || 'State'}
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="district-select"
                      value={selectedDistrictId || currentStateDistricts[0]?.id || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const chosen = currentStateDistricts.find((d) => d.id === val);
                        if (chosen) {
                          handleSelectDistrict(chosen);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 appearance-none cursor-pointer pr-8 shadow-2xs transition-colors"
                    >
                      {currentStateDistricts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name} ({district.hindiName}) {district.isMajorCity ? '★ Hub' : ''}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick View Controls */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveSection(activeSection === 'districts' ? 'none' : 'districts')}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                      activeSection === 'districts'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 size={12} />
                    <span>Browse {selectedStateObj?.name} Districts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection(activeSection === 'states' ? 'none' : 'states')}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                      activeSection === 'states'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Globe size={12} />
                    <span>All States</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  28 States • 700+ Districts
                </span>
              </div>
            </div>

            {/* Popular City Quick-Select Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <span className="text-slate-400 font-semibold shrink-0 text-[10px] uppercase tracking-wider pl-1">
                Popular:
              </span>
              {POPULAR_CITIES.map((cityName) => {
                const cityMatch = MAJOR_CITIES.find((c) => c.city === cityName);
                const isSelected = tempLocation.city.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => {
                      if (cityMatch) {
                        handleSelectCity(cityMatch);
                      } else {
                        const distMatch = searchAllDistricts(cityName, 1);
                        if (distMatch.length > 0) {
                          handleSelectDistrict(distMatch[0]);
                        }
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap font-semibold transition-all cursor-pointer text-xs shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cityName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* District Selected Confirmation Notice */}
          {districtNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{districtNotice}</span>
            </div>
          )}

          {/* VIEW SECTION 1: ALL 28 STATES OF INDIA BROWSER */}
          {activeSection === 'states' && (
            <div className="p-3.5 bg-slate-50 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🇮🇳</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Select State (राज्य चुनें)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tap a state to explore all its districts & cities:
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setStatesTab('states')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                      statesTab === 'states' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    28 States
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatesTab('uts')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                      statesTab === 'uts' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    8 UTs
                  </button>
                </div>
              </div>

              {statesTab === 'states' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {ALL_INDIAN_STATES.map((state) => {
                    const isSelected = selectedStateObj?.name.toLowerCase() === state.name.toLowerCase();
                    return (
                      <button
                        key={state.id}
                        type="button"
                        onClick={() => handleSelectState(state)}
                        className={`p-2 rounded-xl text-left transition-all text-[11px] flex flex-col justify-between border cursor-pointer group ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white hover:bg-blue-50/80 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold truncate leading-tight">
                            {state.id}. {state.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px] opacity-80">
                          <span>{state.hindiName}</span>
                          <span className="text-[9px] font-mono">({state.capital})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {UNION_TERRITORIES.map((ut) => {
                    const isSelected = selectedStateObj?.name.toLowerCase() === ut.name.toLowerCase();
                    return (
                      <button
                        key={ut.id}
                        type="button"
                        onClick={() => handleSelectState(ut)}
                        className={`p-2 rounded-xl text-left transition-all text-[11px] flex flex-col justify-between border cursor-pointer group ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white hover:bg-blue-50/80 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="font-bold truncate leading-tight">
                          {ut.name}
                        </span>
                        <div className="flex items-center justify-between mt-1 text-[10px] opacity-80">
                          <span>{ut.hindiName}</span>
                          <span className="text-[9px] font-mono">({ut.capital})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW SECTION 2: DISTRICT & CITY SELECTION FOR CHOSEN STATE */}
          {activeSection === 'districts' && selectedStateObj && (
            <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    🏙️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Districts & Cities in {selectedStateObj.name} ({selectedStateObj.hindiName})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Showing {filteredCurrentDistricts.length} of {currentStateDistricts.length} districts
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSection('states')}
                  className="text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl cursor-pointer"
                >
                  Change State (दूसरा राज्य)
                </button>
              </div>

              {/* Quick District Filter Input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={districtSearchQuery}
                  onChange={(e) => setDistrictSearchQuery(e.target.value)}
                  placeholder={`Search district in ${selectedStateObj.name} (e.g. ${currentStateDistricts[0]?.name || 'district'})...`}
                  className="w-full pl-8 pr-7 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                />
                {districtSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDistrictSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* District Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredCurrentDistricts.map((district) => {
                  const isCurrentDistrict =
                    tempLocation.city.toLowerCase() === district.name.toLowerCase();
                  return (
                    <button
                      key={district.id}
                      type="button"
                      onClick={() => handleSelectDistrict(district)}
                      className={`p-2 rounded-xl text-left transition-all text-[11px] flex flex-col justify-between border cursor-pointer group ${
                        isCurrentDistrict
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white hover:bg-blue-100/60 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold truncate leading-tight group-hover:text-blue-700">
                          {district.name}
                        </span>
                        {isCurrentDistrict && <Check size={12} className="shrink-0 ml-1" />}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] opacity-80">
                        <span>{district.hindiName}</span>
                        {district.isMajorCity && (
                          <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                            isCurrentDistrict ? 'bg-blue-500 text-white' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Hub
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {filteredCurrentDistricts.length === 0 && (
                  <div className="col-span-full py-4 text-center text-xs text-slate-500">
                    No district found matching "{districtSearchQuery}" in {selectedStateObj.name}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GPS Notification / Status Alerts */}
          {gpsError && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium flex items-center justify-between">
              <span>{gpsError}</span>
              <button
                type="button"
                onClick={() => setGpsError(null)}
                className="text-amber-700 hover:text-amber-900 p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Pinned Coordinates & Address Details Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {tempLocation.city}
                    {tempLocation.state ? `, ${tempLocation.state}` : ''}
                    {customArea && customArea !== tempLocation.city ? ` • ${customArea}` : ''}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {tempLocation.latitude.toFixed(4)}°N, {tempLocation.longitude.toFixed(4)}°E
                  </p>
                </div>
              </div>

              <div>
                {isLocatingGPS ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full animate-pulse">
                    <RefreshCw size={10} className="animate-spin" /> Detecting GPS...
                  </span>
                ) : gpsStatus === 'locked' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={11} /> Live GPS Locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    <MapPin size={11} /> Location Selected
                  </span>
                )}
              </div>
            </div>

            {/* Editable Locality & Street Address Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200/80">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  District / Locality Area
                </label>
                <input
                  type="text"
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  placeholder="e.g. Boring Road, Connaught Place"
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Doorstep Landmark / House No. <span className="text-slate-400 lowercase font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="e.g. Near City Center, Flat 201"
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 truncate max-w-[200px] sm:max-w-xs">
            <span className="font-bold text-slate-800">Selected: </span>
            <span className="font-medium text-slate-900">{tempLocation.city}</span>
            {tempLocation.state && <span className="text-slate-500"> ({tempLocation.state})</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="py-2.5 px-4 sm:px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>Confirm & Search Nearby Techs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
