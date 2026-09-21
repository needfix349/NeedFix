import { UserLocation } from '../types';
import { ALL_INDIAN_DISTRICTS } from './districtData';

export interface IndianState {
  id: number;
  name: string;
  hindiName: string;
  capital: string;
  majorHub: string;
  latitude: number;
  longitude: number;
}

// Complete List of All 28 States of India (भारत के सभी 28 राज्य)
export const ALL_INDIAN_STATES: IndianState[] = [
  { id: 1, name: 'Andhra Pradesh', hindiName: 'आंध्र प्रदेश', capital: 'Amaravati', majorHub: 'Visakhapatnam', latitude: 17.6868, longitude: 83.2185 },
  { id: 2, name: 'Arunachal Pradesh', hindiName: 'अरुणाचल प्रदेश', capital: 'Itanagar', majorHub: 'Itanagar', latitude: 27.0844, longitude: 93.6053 },
  { id: 3, name: 'Assam', hindiName: 'असम', capital: 'Dispur', majorHub: 'Guwahati', latitude: 26.1445, longitude: 91.7362 },
  { id: 4, name: 'Bihar', hindiName: 'बिहार', capital: 'Patna', majorHub: 'Patna', latitude: 25.5941, longitude: 85.1376 },
  { id: 5, name: 'Chhattisgarh', hindiName: 'छत्तीसगढ़', capital: 'Raipur', majorHub: 'Raipur', latitude: 21.2514, longitude: 81.6296 },
  { id: 6, name: 'Goa', hindiName: 'गोवा', capital: 'Panaji', majorHub: 'Panaji', latitude: 15.4909, longitude: 73.8278 },
  { id: 7, name: 'Gujarat', hindiName: 'गुजरात', capital: 'Gandhinagar', majorHub: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
  { id: 8, name: 'Haryana', hindiName: 'हरियाणा', capital: 'Chandigarh', majorHub: 'Gurugram', latitude: 28.4595, longitude: 77.0266 },
  { id: 9, name: 'Himachal Pradesh', hindiName: 'हिमाचल प्रदेश', capital: 'Shimla', majorHub: 'Shimla', latitude: 31.1048, longitude: 77.1734 },
  { id: 10, name: 'Jharkhand', hindiName: 'झारखण्ड', capital: 'Ranchi', majorHub: 'Jamshedpur', latitude: 22.8046, longitude: 86.2029 },
  { id: 11, name: 'Karnataka', hindiName: 'कर्नाटक', capital: 'Bengaluru', majorHub: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
  { id: 12, name: 'Kerala', hindiName: 'केरल', capital: 'Thiruvananthapuram', majorHub: 'Kochi', latitude: 9.9312, longitude: 76.2673 },
  { id: 13, name: 'Madhya Pradesh', hindiName: 'मध्य प्रदेश', capital: 'Bhopal', majorHub: 'Indore', latitude: 22.7196, longitude: 75.8577 },
  { id: 14, name: 'Maharashtra', hindiName: 'महाराष्ट्र', capital: 'Mumbai', majorHub: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
  { id: 15, name: 'Manipur', hindiName: 'मणिपुर', capital: 'Imphal', majorHub: 'Imphal', latitude: 24.8170, longitude: 93.9368 },
  { id: 16, name: 'Meghalaya', hindiName: 'मेघालय', capital: 'Shillong', majorHub: 'Shillong', latitude: 25.5788, longitude: 91.8933 },
  { id: 17, name: 'Mizoram', hindiName: 'मिज़ोरम', capital: 'Aizawl', majorHub: 'Aizawl', latitude: 23.7271, longitude: 92.7176 },
  { id: 18, name: 'Nagaland', hindiName: 'नागालैंड', capital: 'Kohima', majorHub: 'Dimapur', latitude: 25.6751, longitude: 94.1086 },
  { id: 19, name: 'Odisha', hindiName: 'ओडिशा', capital: 'Bhubaneswar', majorHub: 'Bhubaneswar', latitude: 20.2961, longitude: 85.8245 },
  { id: 20, name: 'Punjab', hindiName: 'पंजाब', capital: 'Chandigarh', majorHub: 'Ludhiana', latitude: 30.9010, longitude: 75.8573 },
  { id: 21, name: 'Rajasthan', hindiName: 'राजस्थान', capital: 'Jaipur', majorHub: 'Jaipur', latitude: 26.9124, longitude: 75.7873 },
  { id: 22, name: 'Sikkim', hindiName: 'सिक्किम', capital: 'Gangtok', majorHub: 'Gangtok', latitude: 27.3389, longitude: 88.6065 },
  { id: 23, name: 'Tamil Nadu', hindiName: 'तमिलनाडु', capital: 'Chennai', majorHub: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
  { id: 24, name: 'Telangana', hindiName: 'तेलंगाना', capital: 'Hyderabad', majorHub: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 },
  { id: 25, name: 'Tripura', hindiName: 'त्रिपुरा', capital: 'Agartala', majorHub: 'Agartala', latitude: 23.8315, longitude: 91.2868 },
  { id: 26, name: 'Uttar Pradesh', hindiName: 'उत्तर प्रदेश', capital: 'Lucknow', majorHub: 'Noida / Lucknow', latitude: 26.8467, longitude: 80.9462 },
  { id: 27, name: 'Uttarakhand', hindiName: 'उत्तराखंड', capital: 'Dehradun', majorHub: 'Dehradun', latitude: 30.3165, longitude: 78.0322 },
  { id: 28, name: 'West Bengal', hindiName: 'पश्चिम बंगाल', capital: 'Kolkata', majorHub: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
];

export const UNION_TERRITORIES: IndianState[] = [
  { id: 101, name: 'Delhi (NCT)', hindiName: 'दिल्ली', capital: 'New Delhi', majorHub: 'New Delhi', latitude: 28.6139, longitude: 77.2090 },
  { id: 102, name: 'Jammu and Kashmir', hindiName: 'जम्मू और कश्मीर', capital: 'Srinagar / Jammu', majorHub: 'Srinagar', latitude: 34.0837, longitude: 74.7973 },
  { id: 103, name: 'Ladakh', hindiName: 'लद्दाख', capital: 'Leh', majorHub: 'Leh', latitude: 34.1526, longitude: 77.5771 },
  { id: 104, name: 'Chandigarh', hindiName: 'चंडीगढ़', capital: 'Chandigarh', majorHub: 'Chandigarh', latitude: 30.7333, longitude: 76.7794 },
  { id: 105, name: 'Puducherry', hindiName: 'पुडुचेरी', capital: 'Puducherry', majorHub: 'Puducherry', latitude: 11.9416, longitude: 79.8083 },
  { id: 106, name: 'Dadra and Nagar Haveli and Daman and Diu', hindiName: 'दादरा नगर हवेली एवं दमन दीव', capital: 'Daman', majorHub: 'Daman', latitude: 20.4283, longitude: 72.8397 },
  { id: 107, name: 'Andaman and Nicobar Islands', hindiName: 'अंडमान और निकोबार द्वीप समूह', capital: 'Port Blair', majorHub: 'Port Blair', latitude: 11.6234, longitude: 92.7265 },
  { id: 108, name: 'Lakshadweep', hindiName: 'लक्षद्वीप', capital: 'Kavaratti', majorHub: 'Kavaratti', latitude: 10.5667, longitude: 72.6417 },
];

export {
  type IndianDistrict,
  STATE_DISTRICTS,
  ALL_INDIAN_DISTRICTS,
  getDistrictsForState,
  searchAllDistricts,
} from './districtData';

export const MAJOR_CITIES: UserLocation[] = [
  // Jharkhand
  {
    latitude: 22.8046,
    longitude: 86.2029,
    city: 'Jamshedpur',
    area: 'Bistupur & Sakchi',
    state: 'Jharkhand',
    address: 'Bistupur Main Road, Jamshedpur, Jharkhand 831001',
  },
  {
    latitude: 23.3441,
    longitude: 85.3096,
    city: 'Ranchi',
    area: 'Main Road & Lalpur',
    state: 'Jharkhand',
    address: 'Main Road, Ranchi, Jharkhand 834001',
  },
  // Delhi NCR
  {
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'New Delhi',
    area: 'Connaught Place & Central NCR',
    state: 'Delhi',
    address: 'Connaught Place, New Delhi, Delhi 110001',
  },
  // Maharashtra
  {
    latitude: 19.0760,
    longitude: 72.8777,
    city: 'Mumbai',
    area: 'Bandra West & Andheri',
    state: 'Maharashtra',
    address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
  },
  {
    latitude: 18.5204,
    longitude: 73.8567,
    city: 'Pune',
    area: 'Kothrud & Viman Nagar',
    state: 'Maharashtra',
    address: 'Viman Nagar, Pune, Maharashtra 411014',
  },
  // Karnataka
  {
    latitude: 12.9716,
    longitude: 77.5946,
    city: 'Bengaluru',
    area: 'Indiranagar & Koramangala',
    state: 'Karnataka',
    address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
  },
  // Telangana
  {
    latitude: 17.3850,
    longitude: 78.4867,
    city: 'Hyderabad',
    area: 'HITEC City & Gachibowli',
    state: 'Telangana',
    address: 'HITEC City, Madhapur, Hyderabad, Telangana 500081',
  },
  // Rajasthan
  {
    latitude: 26.9124,
    longitude: 75.7873,
    city: 'Jaipur',
    area: 'Malviya Nagar & Vaishali',
    state: 'Rajasthan',
    address: 'Malviya Nagar, Jaipur, Rajasthan 302017',
  },
  // Gujarat
  {
    latitude: 23.0225,
    longitude: 72.5714,
    city: 'Ahmedabad',
    area: 'SG Highway & Navrangpura',
    state: 'Gujarat',
    address: 'SG Highway, Ahmedabad, Gujarat 380015',
  },
  // Tamil Nadu
  {
    latitude: 13.0827,
    longitude: 80.2707,
    city: 'Chennai',
    area: 'T. Nagar & Anna Nagar',
    state: 'Tamil Nadu',
    address: 'T. Nagar, Chennai, Tamil Nadu 600017',
  },
  // West Bengal
  {
    latitude: 22.5726,
    longitude: 88.3639,
    city: 'Kolkata',
    area: 'Salt Lake & Park Street',
    state: 'West Bengal',
    address: 'Salt Lake Sector V, Kolkata, West Bengal 700091',
  },
  // Uttar Pradesh
  {
    latitude: 26.8467,
    longitude: 80.9462,
    city: 'Lucknow',
    area: 'Hazratganj & Gomti Nagar',
    state: 'Uttar Pradesh',
    address: 'Gomti Nagar, Lucknow, Uttar Pradesh 226010',
  },
  {
    latitude: 28.5355,
    longitude: 77.3910,
    city: 'Noida',
    area: 'Sector 18 & Greater Noida',
    state: 'Uttar Pradesh',
    address: 'Sector 18, Noida, Uttar Pradesh 201301',
  },
  // Bihar
  {
    latitude: 25.5941,
    longitude: 85.1376,
    city: 'Patna',
    area: 'Boring Road & Kankarbagh',
    state: 'Bihar',
    address: 'Boring Road, Patna, Bihar 800001',
  },
  // Madhya Pradesh
  {
    latitude: 22.7196,
    longitude: 75.8577,
    city: 'Indore',
    area: 'Vijay Nagar & Palasia',
    state: 'Madhya Pradesh',
    address: 'Vijay Nagar, Indore, Madhya Pradesh 452010',
  },
  {
    latitude: 23.2599,
    longitude: 77.4126,
    city: 'Bhopal',
    area: 'Arera Colony & MP Nagar',
    state: 'Madhya Pradesh',
    address: 'MP Nagar, Bhopal, Madhya Pradesh 462011',
  },
  // Punjab
  {
    latitude: 30.9010,
    longitude: 75.8573,
    city: 'Ludhiana',
    area: 'Model Town & Sarabha Nagar',
    state: 'Punjab',
    address: 'Model Town, Ludhiana, Punjab 141002',
  },
  {
    latitude: 31.6340,
    longitude: 74.8723,
    city: 'Amritsar',
    area: 'Ranjit Avenue & Mall Road',
    state: 'Punjab',
    address: 'Ranjit Avenue, Amritsar, Punjab 143001',
  },
  // Haryana
  {
    latitude: 28.4595,
    longitude: 77.0266,
    city: 'Gurugram',
    area: 'Cyber City & DLF Phase 5',
    state: 'Haryana',
    address: 'Cyber Hub, DLF Phase 2, Gurugram, Haryana 122002',
  },
  // Kerala
  {
    latitude: 9.9312,
    longitude: 76.2673,
    city: 'Kochi',
    area: 'Kakkanad & Marine Drive',
    state: 'Kerala',
    address: 'InfoPark, Kakkanad, Kochi, Kerala 682042',
  },
  // Andhra Pradesh
  {
    latitude: 17.6868,
    longitude: 83.2185,
    city: 'Visakhapatnam',
    area: 'MVP Colony & Gajuwaka',
    state: 'Andhra Pradesh',
    address: 'MVP Colony, Visakhapatnam, Andhra Pradesh 530017',
  },
  // Odisha
  {
    latitude: 20.2961,
    longitude: 85.8245,
    city: 'Bhubaneswar',
    area: 'Saheed Nagar & Patia',
    state: 'Odisha',
    address: 'Patia, Bhubaneswar, Odisha 751024',
  },
  // Assam
  {
    latitude: 26.1445,
    longitude: 91.7362,
    city: 'Guwahati',
    area: 'GS Road & Dispur',
    state: 'Assam',
    address: 'GS Road, Christian Basti, Guwahati, Assam 781005',
  },
  // Jharkhand
  {
    latitude: 23.3441,
    longitude: 85.3096,
    city: 'Ranchi',
    area: 'Main Road & Lalpur',
    state: 'Jharkhand',
    address: 'Main Road, Ranchi, Jharkhand 834001',
  },
  // Chhattisgarh
  {
    latitude: 21.2514,
    longitude: 81.6296,
    city: 'Raipur',
    area: 'Telibandha & Pandri',
    state: 'Chhattisgarh',
    address: 'Telibandha, Raipur, Chhattisgarh 492001',
  },
  // Uttarakhand
  {
    latitude: 30.3165,
    longitude: 78.0322,
    city: 'Dehradun',
    area: 'Rajpur Road & Clock Tower',
    state: 'Uttarakhand',
    address: 'Rajpur Road, Dehradun, Uttarakhand 248001',
  },
  // Himachal Pradesh
  {
    latitude: 31.1048,
    longitude: 77.1734,
    city: 'Shimla',
    area: 'The Mall & Sanjauli',
    state: 'Himachal Pradesh',
    address: 'The Mall Road, Shimla, Himachal Pradesh 171001',
  },
  // Goa
  {
    latitude: 15.4909,
    longitude: 73.8278,
    city: 'Panaji',
    area: 'Fontainhas & Miramar',
    state: 'Goa',
    address: 'Miramar Beach Road, Panaji, Goa 403001',
  },
  // Jammu & Kashmir
  {
    latitude: 34.0837,
    longitude: 74.7973,
    city: 'Srinagar',
    area: 'Lal Chowk & Rajbagh',
    state: 'Jammu and Kashmir',
    address: 'Lal Chowk, Srinagar, Jammu and Kashmir 190001',
  },
  // Chandigarh
  {
    latitude: 30.7333,
    longitude: 76.7794,
    city: 'Chandigarh',
    area: 'Sector 17 & Sector 35',
    state: 'Chandigarh',
    address: 'Sector 17 Plaza, Chandigarh 160017',
  },
  // Tripura
  {
    latitude: 23.8315,
    longitude: 91.2868,
    city: 'Agartala',
    area: 'City Center & Banamalipur',
    state: 'Tripura',
    address: 'City Center, Agartala, Tripura 799001',
  },
  // Manipur
  {
    latitude: 24.8170,
    longitude: 93.9368,
    city: 'Imphal',
    area: 'Thangal Bazar & Kangla',
    state: 'Manipur',
    address: 'Thangal Bazar, Imphal, Manipur 795001',
  },
  // Meghalaya
  {
    latitude: 25.5788,
    longitude: 91.8933,
    city: 'Shillong',
    area: 'Police Bazar & Laitumkhrah',
    state: 'Meghalaya',
    address: 'Police Bazar, Shillong, Meghalaya 793001',
  },
  // Nagaland
  {
    latitude: 25.6751,
    longitude: 94.1086,
    city: 'Kohima',
    area: 'Main Town & Dimapur Hub',
    state: 'Nagaland',
    address: 'Main Town, Kohima, Nagaland 797001',
  },
  // Mizoram
  {
    latitude: 23.7271,
    longitude: 92.7176,
    city: 'Aizawl',
    area: 'Bawngkawn & Zarkawt',
    state: 'Mizoram',
    address: 'Zarkawt, Aizawl, Mizoram 796001',
  },
  // Arunachal Pradesh
  {
    latitude: 27.0844,
    longitude: 93.6053,
    city: 'Itanagar',
    area: 'Ganga Market & Naharlagun',
    state: 'Arunachal Pradesh',
    address: 'Ganga Market, Itanagar, Arunachal Pradesh 791111',
  },
  // Sikkim
  {
    latitude: 27.3389,
    longitude: 88.6065,
    city: 'Gangtok',
    area: 'MG Marg & Deorali',
    state: 'Sikkim',
    address: 'MG Marg, Gangtok, Sikkim 737101',
  },
];

export const DEFAULT_USER_LOCATION: UserLocation = MAJOR_CITIES[0];

// Calculate Haversine distance in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

/**
 * get_nearby_technicians
 * Filters technicians strictly within the selected radius (Min: 1 KM, Max: 20 KM, Default: 5 KM)
 * from the user's location, sorted by proximity (nearest first).
 */
export function get_nearby_technicians<
  T extends {
    location?: { latitude?: number | string; longitude?: number | string };
    status?: string;
    isBlocked?: boolean;
    isApproved?: boolean;
  }
>(
  technicians: T[],
  userLatitude: number,
  userLongitude: number,
  radiusKm: number = 5
): (T & { calculatedDistanceKm: number })[] {
  // Enforce strict boundaries (Min: 1 KM, Max: 20 KM, Default: 5 KM)
  const safeRadius = Math.max(1, Math.min(20, typeof radiusKm === 'number' && !isNaN(radiusKm) ? radiusKm : 5));

  return technicians
    .filter((tech) => {
      // Must be approved and unblocked
      const isApproved = tech.isApproved === true || tech.status === 'approved';
      if (!isApproved) return false;
      if (tech.isBlocked) return false;

      const techLat = Number(tech.location?.latitude);
      const techLng = Number(tech.location?.longitude);
      if (isNaN(techLat) || isNaN(techLng)) {
        return false;
      }
      const dist = calculateDistanceKm(
        userLatitude,
        userLongitude,
        techLat,
        techLng
      );
      // Strictly within the selected radius
      return dist <= safeRadius;
    })
    .map((tech) => {
      const techLat = Number(tech.location?.latitude) || userLatitude;
      const techLng = Number(tech.location?.longitude) || userLongitude;
      const dist = calculateDistanceKm(
        userLatitude,
        userLongitude,
        techLat,
        techLng
      );
      return {
        ...tech,
        calculatedDistanceKm: dist,
      };
    })
    .sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
}

// Alias export for camelCase consumers
export const getNearbyTechnicians = get_nearby_technicians;

// Reverse geocode GPS coordinates to address (Zero external API cost)
export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number,
  accuracyMeters?: number
): Promise<UserLocation> {
  // 1. Primary reverse geocoding via OpenStreetMap Nominatim with strict timeout abort controller
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const address = data.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.suburb ||
        address.city_district ||
        address.state_district ||
        address.county ||
        '';

      const area =
        address.suburb ||
        address.neighbourhood ||
        address.residential ||
        address.commercial ||
        address.industrial ||
        address.road ||
        city ||
        'Local Area';

      const state = address.state || 'India';
      const postcode = address.postcode ? ` - ${address.postcode}` : '';
      const road = address.road ? `${address.road}, ` : '';

      // If city was extracted, use it
      if (city) {
        return {
          latitude,
          longitude,
          city,
          area,
          state,
          address: data.display_name
            ? data.display_name.split(',').slice(0, 4).join(', ') + postcode
            : `${road}${area}, ${city}, ${state}${postcode}`,
          isGpsLocked: true,
          accuracyMeters,
        };
      }
    }
  } catch (e) {
    // Nominatim aborted, rate limited, or CORS issue; fallback to Indian district database
  }

  // 2. High-precision nearest Indian District fallback from 700+ registered districts
  let closestDist = ALL_INDIAN_DISTRICTS[0];
  let minDist = calculateDistanceKm(latitude, longitude, closestDist.latitude, closestDist.longitude);
  for (const dist of ALL_INDIAN_DISTRICTS) {
    const d = calculateDistanceKm(latitude, longitude, dist.latitude, dist.longitude);
    if (d < minDist) {
      minDist = d;
      closestDist = dist;
    }
  }

  const cleanDistName = closestDist.name.replace(/\s*\(.*?\)\s*/g, '').trim();
  const cleanArea =
    minDist < 10
      ? `${cleanDistName} Central`
      : minDist < 25
      ? `${cleanDistName} Vicinity`
      : `Pin (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`;

  return {
    latitude,
    longitude,
    city: cleanDistName,
    area: cleanArea,
    state: closestDist.state,
    address: `${cleanArea}, ${cleanDistName}, ${closestDist.state}, India`,
    isGpsLocked: true,
    accuracyMeters,
  };
}

/**
 * Check browser geolocation permission status safely
 */
export async function checkGPSPermission(): Promise<'granted' | 'prompt' | 'denied' | 'unsupported'> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return 'unsupported';
  }
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return permission.state;
    } catch {
      return 'prompt';
    }
  }
  return 'prompt';
}

/**
 * Helper to get browser position with customizable accuracy and timeout
 */
function getBrowserPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Fallback to IP-based Geolocation when hardware GPS is blocked or unavailable
 */
async function getIPBasedLocation(): Promise<UserLocation | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://ipwho.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const city = data.city || data.region || 'Local Hub';
        const state = data.region || 'India';
        const country = data.country || 'India';

        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city,
          area: `${city} Central`,
          state,
          address: `${city}, ${state}, ${country}`,
          isGpsLocked: true,
          accuracyMeters: 5000,
        };
      }
    }
  } catch (err) {
    // IP fallback failed silently
  }
  return null;
}

/**
 * Real GPS location tracker using multi-tier robust fallback:
 * 1. High-accuracy GPS (satellite/GNSS) with fast 5s timeout
 * 2. Standard accuracy network triangulation (WiFi/Cell towers) with 6s timeout
 * 3. IP-based location fallback (works when browser permission is blocked)
 * 4. Stored user location / Nearest Indian district
 */
export async function getCurrentGPSLocation(): Promise<UserLocation> {
  // Step 1: Try High Accuracy GPS (Satellite/GNSS lock) with generous 10s timeout
  try {
    const pos = await getBrowserPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
    const { latitude, longitude, accuracy } = pos.coords;
    const result = await reverseGeocodeCoordinates(latitude, longitude, accuracy);
    const lockedLoc = { ...result, isGpsLocked: true };
    try {
      localStorage.setItem('needfix_last_gps_location', JSON.stringify(lockedLoc));
    } catch {}
    return lockedLoc;
  } catch (firstErr: any) {
    console.info('High accuracy GPS prompt or satellite lock pending, trying network positioning...', firstErr?.message);
  }

  // Step 2: Try Low Accuracy (WiFi Hotspots & Cellular Network Triangulation - Very fast & works indoors)
  try {
    const pos = await getBrowserPosition({
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
    });
    const { latitude, longitude, accuracy } = pos.coords;
    const result = await reverseGeocodeCoordinates(latitude, longitude, accuracy);
    const lockedLoc = { ...result, isGpsLocked: true };
    try {
      localStorage.setItem('needfix_last_gps_location', JSON.stringify(lockedLoc));
    } catch {}
    return lockedLoc;
  } catch (secondErr: any) {
    console.warn('Network browser geolocation failed or denied:', secondErr?.message);
  }

  // Step 3: Check if we have a recent stored GPS location from previous session
  try {
    const saved = localStorage.getItem('needfix_last_gps_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.latitude && parsed.longitude) {
        return { ...parsed, isGpsLocked: true };
      }
    }
  } catch {}

  // Step 4: Try IP Geolocation (Detect city & state without requiring browser prompt)
  const ipLoc = await getIPBasedLocation();
  if (ipLoc) {
    try {
      localStorage.setItem('needfix_last_gps_location', JSON.stringify(ipLoc));
    } catch {}
    return ipLoc;
  }

  // Step 5: Fallback gracefully to default location
  return {
    ...DEFAULT_USER_LOCATION,
    address: DEFAULT_USER_LOCATION.address,
    isGpsLocked: false,
  };
}

// Re-export all district mappings, interfaces, and helpers
export * from './districtData';
