import { CountryCode } from '../types';

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
  { code: 'AE', name: 'United Arab Emirates', dial_code: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dial_code: '+966', flag: '🇸🇦' },
  { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦' },
  { code: 'QA', name: 'Qatar', dial_code: '+974', flag: '🇶🇦' },
  { code: 'OM', name: 'Oman', dial_code: '+968', flag: '🇴🇲' },
  { code: 'KW', name: 'Kuwait', dial_code: '+965', flag: '🇰🇼' },
  { code: 'SG', name: 'Singapore', dial_code: '+65', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', dial_code: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dial_code: '+49', flag: '🇩🇪' },
  { code: 'MY', name: 'Malaysia', dial_code: '+60', flag: '🇲🇾' },
  { code: 'NP', name: 'Nepal', dial_code: '+977', flag: '🇳🇵' },
  { code: 'BD', name: 'Bangladesh', dial_code: '+880', flag: '🇧🇩' },
];

export const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // India (+91)
