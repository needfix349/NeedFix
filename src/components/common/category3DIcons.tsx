import React from 'react';

/**
 * High-Fidelity Professional Service Category Illustrations.
 * Each illustration features:
 * - A soft pastel/colored circular background behind each icon
 * - Rich, detailed, polished vector objects matching the visual reference
 * - Large, prominent composition filling the 64x64 canvas
 * - Distinctive professional accent colors for each category
 * - Unmistakable trade symbolism recognizable in 1 second
 */

// 1. AC Technician & Gas Refill (Split AC + Ice Snowflake + Cool Airflow + Gas Tank)
export const AcTechnician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Pastel Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />

    {/* Ambient shadow beneath AC unit */}
    <ellipse cx="32" cy="36" rx="22" ry="3" fill="#0284C7" fillOpacity="0.12" />

    {/* Split AC Indoor Unit */}
    <rect x="10" y="16" width="44" height="20" rx="3.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
    {/* Top air intake vents */}
    <line x1="14" y1="19.5" x2="50" y2="19.5" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    <line x1="14" y1="22" x2="50" y2="22" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />

    {/* Bottom discharge flap / louver */}
    <rect x="12" y="30" width="40" height="3.5" rx="1.5" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />

    {/* Digital LED temperature display */}
    <rect x="37" y="24" width="13" height="5" rx="1" fill="#0F172A" />
    <text x="39" y="28" fill="#38BDF8" fontSize="3.8" fontFamily="monospace" fontWeight="bold">18°</text>
    <circle cx="47.5" cy="26.5" r="0.8" fill="#22C55E" />

    {/* Prominent Ice Snowflake on AC unit */}
    <g transform="translate(16, 23.5)" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round">
      <line x1="3.5" y1="0" x2="3.5" y2="7" />
      <line x1="0" y1="3.5" x2="7" y2="3.5" />
      <line x1="1" y1="1" x2="6" y2="6" />
      <line x1="1" y1="6" x2="6" y2="1" />
    </g>

    {/* Dynamic Cool Airflow Waves */}
    <path d="M16 35C17 41 20 44 18 51" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <path d="M26 35C28 42 32 45 30 53" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M36 35C38 42 42 45 40 53" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M46 35C47 41 50 44 48 51" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

    {/* Gas Refill Gauge Symbol on bottom right */}
    <circle cx="50" cy="46" r="6" fill="#F0F9FF" stroke="#0369A1" strokeWidth="1.5" />
    <line x1="50" y1="46" x2="52" y2="43" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="50" cy="46" r="1" fill="#0369A1" />
  </svg>
);

// 2. Electrician & Wiring (Glowing Light Bulb + Heavy Plug + Wire + Socket + Sparks)
export const Electrician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Amber Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />

    {/* Wall Switch Socket Plate in background */}
    <rect x="8" y="14" width="24" height="34" rx="4" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
    <rect x="12" y="18" width="16" height="26" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.8" />
    <circle cx="20" cy="24" r="2.2" fill="#334155" />
    <circle cx="16" cy="32" r="1.8" fill="#334155" />
    <circle cx="24" cy="32" r="1.8" fill="#334155" />
    <rect x="18" y="37" width="4" height="4" rx="0.5" fill="#D97706" />

    {/* Large Glowing Light Bulb in Center */}
    <path
      d="M38 12C31.5 12 26 17.2 26 23.5C26 27.8 28.3 31.4 31.8 33.5V38.5C31.8 39.3 32.5 40 33.3 40H42.7C43.5 40 44.2 39.3 44.2 38.5V33.5C47.7 31.4 50 27.8 50 23.5C50 17.2 44.5 12 38 12Z"
      fill="#FDE047"
      stroke="#B45309"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Bulb metallic screw base */}
    <rect x="33.5" y="40" width="9" height="2.5" rx="0.8" fill="#B45309" />
    <rect x="34.5" y="42.5" width="7" height="2" rx="0.8" fill="#78350F" />
    {/* Internal Filament */}
    <path d="M38 18L35 24H41L38 30" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Light Glow Rays */}
    <line x1="38" y1="6" x2="38" y2="9.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="16" x2="55.5" y2="14.5" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="54" y1="26" x2="58" y2="26" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />

    {/* Heavy 3-Pin Plug with Curled Wire */}
    <path d="M38 45C38 51 32 54 26 54H16" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
    <g transform="translate(18, 43)">
      <rect x="0" y="3" width="12" height="10" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.2" />
      <line x1="12" y1="6" x2="16" y2="6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="10" x2="16" y2="10" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Electrical Spark Zap */}
    <path d="M48 38L45 43H49L47 48" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 3. Plumber (Repair & Installation) - Tap + Pipe + Heavy Pipe Wrench + Water Droplets
export const Plumber3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Blue Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#DBEAFE" stroke="#BFDBFE" strokeWidth="1" />

    {/* L-Shaped Plumbing Water Pipes */}
    <path d="M8 18H24V34" stroke="#64748B" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 18H24V34" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

    {/* Chrome / Brass Water Tap (Faucet) */}
    <rect x="22" y="26" width="15" height="7" rx="2" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
    {/* Tap turn valve handle */}
    <rect x="27" y="18" width="5" height="9" rx="1" fill="#0369A1" />
    <path d="M22 18H37" stroke="#0284C7" strokeWidth="3.2" strokeLinecap="round" />
    {/* Tap spout nozzle */}
    <path d="M33 33V40H28V33" fill="#0284C7" stroke="#0369A1" strokeWidth="1.2" />

    {/* Falling Sparkling Water Droplets */}
    <path d="M30.5 44C30.5 44 28 48 28 50C28 51.7 29.1 53 30.5 53C31.9 53 33 51.7 33 50C33 48 30.5 44 30.5 44Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
    <circle cx="30.5" cy="57" r="1.5" fill="#38BDF8" />

    {/* Heavy Stillson / Pipe Wrench (Red & Steel) */}
    <g transform="translate(20, 10) rotate(32)">
      {/* Wrench handle */}
      <rect x="15" y="18" width="7.5" height="30" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      <circle cx="18.7" cy="42" r="2" fill="#FFFFFF" />
      {/* Heavy wrench jaw */}
      <path d="M12 10H25V20H12V10Z" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
      <path d="M8 4H23V10H14V13H8V4Z" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      {/* Brass adjustment knurl nut */}
      <rect x="21" y="14" width="5.5" height="5.5" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
    </g>
  </svg>
);

// 4. Home Appliance Repair (Refrigerator + Washing Machine + Microwave/Appliances + Wrench)
export const HomeAppliance3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Teal Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#CCFBF1" stroke="#99F6E4" strokeWidth="1" />

    {/* Left: Modern Double-Door Refrigerator */}
    <rect x="9" y="13" width="21" height="40" rx="3" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2" />
    <line x1="9" y1="26" x2="30" y2="26" stroke="#0D9488" strokeWidth="1.8" />
    {/* Fridge handles */}
    <rect x="27" y="17" width="1.5" height="6" rx="0.75" fill="#0D9488" />
    <rect x="27" y="29" width="1.5" height="12" rx="0.75" fill="#0D9488" />
    <rect x="12" y="16" width="4" height="2" rx="0.5" fill="#5EEAD4" />

    {/* Right: Front-Load Washing Machine */}
    <rect x="32" y="21" width="24" height="32" rx="3" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2" />
    {/* Washer control panel */}
    <rect x="32" y="21" width="24" height="7" fill="#E6FFFA" stroke="#0D9488" strokeWidth="1" />
    <circle cx="48" cy="24.5" r="1.8" fill="#0D9488" />
    <line x1="35" y1="24.5" x2="42" y2="24.5" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" />
    {/* Round glass washer door with water drum */}
    <circle cx="44" cy="38" r="8" fill="#F1F5F9" stroke="#0D9488" strokeWidth="1.8" />
    <circle cx="44" cy="38" r="5.5" fill="#38BDF8" fillOpacity="0.3" stroke="#0EA5E9" strokeWidth="1.2" />
    <rect x="50.5" y="36.5" width="1.5" height="3" rx="0.75" fill="#0D9488" />

    {/* Small Microwave Appliance on top of washer */}
    <rect x="34" y="10" width="20" height="9" rx="1.5" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.4" />
    <rect x="36" y="12" width="10" height="5" rx="1" fill="#334155" />
    <circle cx="50" cy="14.5" r="1.2" fill="#0D9488" />

    {/* Repair Service Wrench Badge */}
    <g transform="translate(36, 42) scale(0.65)">
      <circle cx="14" cy="14" r="12" fill="#0F766E" />
      <path d="M10 7L13 10L18 5L21 8L16 13L19 16L16 19L13 16L8 21L5 18L10 13L7 10Z" fill="#FFFFFF" />
    </g>
  </svg>
);

// 5. CCTV & Security Installer (Large Detailed Security Camera + Bracket + IR LEDs + Signal)
export const Cctv3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Slate/Gray Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

    {/* Wall Mount Bracket on Left */}
    <rect x="9" y="18" width="6" height="26" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
    <path d="M15 27H24V33H15" fill="#475569" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="24" cy="30" r="4.5" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />

    {/* Main Camera Housing (Tilted downward) */}
    <g transform="translate(24, 30) rotate(18)">
      {/* Sunshield Visor */}
      <path d="M-2 -13H32L28 -6H-2V-13Z" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      {/* Camera Body Barrel */}
      <rect x="0" y="-6" width="28" height="16" rx="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      {/* Front Bezel */}
      <rect x="27" y="-7.5" width="5.5" height="19" rx="2" fill="#1E293B" />
      {/* Camera Lens */}
      <ellipse cx="31.5" cy="2" rx="1.5" ry="6.5" fill="#38BDF8" />
      <ellipse cx="31.5" cy="2" rx="0.8" ry="3.5" fill="#0284C7" />
      {/* Red Recording LED */}
      <circle cx="24" cy="-3" r="1.5" fill="#EF4444" />
    </g>

    {/* Surveillance Wireless Waves */}
    <path d="M47 38C50 41 53 45 55 50" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M51 34C56 39 59 45 61 52" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />

    {/* Shield Security Verified Check in bottom left */}
    <path d="M14 47L19 44V52C19 55 14 58 14 58C14 58 9 55 9 52V44L14 47Z" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
    <path d="M11 50L13 52L17 48" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 6. Taxi Driver & Cab (Front-View Classic Yellow City Taxi Cab)
export const TaxiCab3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Yellow Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FEF08A" stroke="#FDE047" strokeWidth="1" />

    {/* Black Tires */}
    <rect x="11" y="44" width="7" height="12" rx="2" fill="#0F172A" />
    <rect x="46" y="44" width="7" height="12" rx="2" fill="#0F172A" />

    {/* Main Yellow Taxi Body */}
    <path
      d="M14 26L18 16C18.8 14.5 20.4 14 22 14H42C43.6 14 45.2 14.5 46 16L50 26C53 27 55 29.5 55 33V47C55 48.5 53.8 50 52 50H48V46H16V50H12C10.2 50 9 48.5 9 47V33C9 29.5 11 27 14 26Z"
      fill="#F59E0B"
      stroke="#B45309"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    {/* Front Windshield Glass with interior mirror */}
    <path
      d="M17.5 26L20.5 17H43.5L46.5 26H17.5Z"
      fill="#E0F2FE"
      stroke="#0369A1"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect x="30.5" y="17.5" width="3" height="1.8" rx="0.5" fill="#334155" />

    {/* Roof "TAXI" Light Box */}
    <rect x="24" y="8" width="16" height="7" rx="1.5" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.5" />
    <text x="25.5" y="13.5" fill="#B45309" fontSize="4.5" fontFamily="sans-serif" fontWeight="900">TAXI</text>

    {/* Checkerboard Taxi Stripe on Bonnet */}
    <rect x="13" y="32" width="38" height="3" fill="#1E293B" />
    <rect x="17" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="25" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="33" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="41" y="32" width="4" height="3" fill="#FFFFFF" />

    {/* Headlights */}
    <circle cx="15" cy="40" r="3.2" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
    <circle cx="49" cy="40" r="3.2" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />

    {/* Grille & Number Plate */}
    <rect x="23" y="38" width="18" height="5" rx="1" fill="#334155" />
    <rect x="27" y="45" width="10" height="3" rx="0.5" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.8" />
  </svg>
);

// 7. Makeup Artist (Fluffy Brushes + Lipstick + Mirror Compact + Sparkles)
export const MakeupArtist3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Pink Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FCE7F3" stroke="#FBCFE8" strokeWidth="1" />

    {/* Powder Compact Open */}
    <circle cx="23" cy="39" r="14" fill="#FFFFFF" stroke="#DB2777" strokeWidth="2" />
    <circle cx="23" cy="39" r="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1.2" />
    <circle cx="23" cy="39" r="6" fill="#F472B6" />

    {/* Lipstick (Gold & Black Case + Crimson Bullet) */}
    <g transform="translate(38, 19)">
      <rect x="2" y="16" width="11" height="19" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="3" y="11" width="9" height="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      {/* Slanted red bullet */}
      <path d="M4 11V3.5C4 3.5 6.5 0.5 9.5 0.5C11 0.5 11.5 2.5 11.5 11H4Z" fill="#E11D48" stroke="#BE123C" strokeWidth="1.5" />
      <line x1="6" y1="3" x2="6" y2="10" stroke="#FDA4AF" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* Fluffy Makeup Brush Crossed */}
    <g transform="translate(13, 7) rotate(36)">
      <rect x="18" y="18" width="5" height="30" rx="2" fill="#831843" stroke="#500724" strokeWidth="1.2" />
      <rect x="17.5" y="11" width="6" height="8" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      <path d="M15 11C14 5 16 0 20.5 0C25 0 27 5 26 11H15Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.2" />
      <path d="M16 3C18 0.5 23 0.5 25 3L24 5C22 3 20 3 17 5L16 3Z" fill="#F472B6" />
    </g>

    {/* Sparkle Stars */}
    <path d="M12 16L13 19L16 20L13 21L12 24L11 21L8 20L11 19L12 16Z" fill="#F43F5E" />
    <path d="M52 13L53 15L55 16L53 17L52 19L51 17L49 16L51 15L52 13Z" fill="#F59E0B" />
  </svg>
);

// 8. Mehndi Artist (HUMAN HAND with detailed HENNA / MEHENDI on palm/fingers + Henna Cone)
export const MehndiArtist3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Peach/Orange Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FFEDD5" stroke="#FED7AA" strokeWidth="1" />

    {/* Human Hand Facing Forward */}
    <g transform="translate(5, 3)">
      <path
        d="M17 55V43C13 41 10 36 10 31C10 28 11 24 13 22C13.8 21.2 15 21.5 15.5 22.5L18 28V10C18 8.5 19.5 7.5 21 7.5C22.5 7.5 24 8.5 24 10V24H25V6C25 4.5 26.5 3.5 28 3.5C29.5 3.5 31 4.5 31 6V24H32V8C32 6.5 33.5 5.5 35 5.5C36.5 5.5 38 6.5 38 8V24H39V14C39 12.5 40.5 11.5 42 11.5C43.5 11.5 45 12.5 45 14V35C45 43 41 55 41 55H17Z"
        fill="#FFFFFF"
        stroke="#78350F"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Intricate Henna / Mehndi Mandala on Palm */}
      <circle cx="29" cy="35" r="5" fill="none" stroke="#9A3412" strokeWidth="1.6" />
      <circle cx="29" cy="35" r="1.8" fill="#9A3412" />
      <circle cx="29" cy="28" r="1.3" fill="#9A3412" />
      <circle cx="29" cy="42" r="1.3" fill="#9A3412" />
      <circle cx="22" cy="35" r="1.3" fill="#9A3412" />
      <circle cx="36" cy="35" r="1.3" fill="#9A3412" />
      <circle cx="24" cy="30" r="1.1" fill="#9A3412" />
      <circle cx="34" cy="30" r="1.1" fill="#9A3412" />
      <circle cx="24" cy="40" r="1.1" fill="#9A3412" />
      <circle cx="34" cy="40" r="1.1" fill="#9A3412" />

      {/* Mehndi Vine Lines on Fingers */}
      <path d="M21 11V21" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 1.5" />
      <circle cx="21" cy="9" r="1.3" fill="#9A3412" />
      <path d="M28 7V21" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 1.5" />
      <circle cx="28" cy="5" r="1.3" fill="#9A3412" />
      <path d="M35 9V21" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 1.5" />
      <circle cx="35" cy="7" r="1.3" fill="#9A3412" />
      <path d="M42 15V25" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 1.5" />
      <circle cx="42" cy="13" r="1.3" fill="#9A3412" />

      {/* Mehndi Bangle Cuff */}
      <path d="M19 47H39" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M21 51H37" stroke="#9A3412" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 2" />
    </g>

    {/* Henna Cone */}
    <g transform="translate(44, 25) rotate(-28)">
      <path d="M0 0L4.5 24L-4.5 24L0 0Z" fill="#15803D" stroke="#14532D" strokeWidth="1" />
      <polygon points="0,0 2.5,8 -2.5,8" fill="#78350F" />
      <line x1="-3.5" y1="13" x2="3.5" y2="13" stroke="#FDE047" strokeWidth="1" />
      <line x1="-4" y1="18" x2="4" y2="18" stroke="#FDE047" strokeWidth="1" />
    </g>
  </svg>
);

// 9. Car Mechanic (Front Car Silhouette + Crossed Wrench & Gear)
export const CarMechanic3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Blue Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#DBEAFE" stroke="#BFDBFE" strokeWidth="1" />

    {/* Car Silhouette (Front View) */}
    <path
      d="M13 28L17 16C17.8 14.5 19.5 14 21 14H43C44.5 14 46.2 14.5 47 16L51 28C54 29 55 32 55 35V47C55 48.5 53.8 50 52 50H49V47H15V50H12C10.2 50 9 48.5 9 47V35C9 32 10 29 13 28Z"
      fill="#FFFFFF"
      stroke="#1E40AF"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M17 26L19.5 17H44.5L47 26H17Z" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="15" cy="38" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2" />
    <circle cx="49" cy="38" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2" />
    <rect x="23" y="36" width="18" height="6.5" rx="1.5" fill="#1E293B" />
    <line x1="26" y1="39" x2="38" y2="39" stroke="#94A3B8" strokeWidth="1" />

    {/* Mechanic Crossed Tools & Gear in Center */}
    <g transform="translate(18, 22)">
      <circle cx="14" cy="14" r="10" fill="#0284C7" stroke="#0369A1" strokeWidth="1.8" />
      <circle cx="14" cy="14" r="4.5" fill="#FFFFFF" />
      <g transform="rotate(45, 14, 14)">
        <rect x="12" y="3" width="4" height="22" rx="1" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.2" />
        <circle cx="14" cy="4" r="3" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.2" />
        <rect x="13" y="1" width="2" height="3" fill="#0284C7" />
        <circle cx="14" cy="24" r="3" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.2" />
        <rect x="13" y="24" width="2" height="3" fill="#0284C7" />
      </g>
    </g>
  </svg>
);

// 10. Carpenter & Woodwork (Wood Planks with Grain + Claw Hammer + Saw)
export const Carpenter3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Amber Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />

    {/* Stack of Wood Planks with rich grain */}
    <rect x="9" y="34" width="46" height="19" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="2.2" />
    <path d="M13 40C24 38 32 44 44 41" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M17 46C28 44 38 50 50 47" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    <ellipse cx="27" cy="43" rx="3" ry="1.5" stroke="#B45309" strokeWidth="1.2" />

    {/* Hand Saw laying on left */}
    <g transform="translate(11, 14) rotate(-22)">
      <path d="M6 10H34L30 18H6V10Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.4" />
      <path d="M8 18L10 16L12 18L14 16L16 18L18 16L20 18L22 16L24 18L26 16L28 18" stroke="#475569" strokeWidth="1.4" />
      <path d="M2 7C0.8 7 0 7.8 0 9V19C0 20.2 0.8 21 2 21H8V7H2Z" fill="#92400E" stroke="#78350F" strokeWidth="1.2" />
      <circle cx="4" cy="14" r="1.8" fill="#FDE68A" />
    </g>

    {/* Heavy Claw Hammer on right */}
    <g transform="translate(34, 4) rotate(14)">
      <rect x="9" y="14" width="5.5" height="34" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
      <path d="M2 8H18V14H2V8Z" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="0" y="7" width="3" height="8" rx="1" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
      <path d="M18 8C23 8 26 11 27 16L23 15C22 12 20 11 18 11V8Z" fill="#475569" stroke="#1E293B" strokeWidth="1.2" />
    </g>
  </svg>
);

// 11. Painter (Paint Roller with wet streak + Paint Bucket)
export const Painter3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Coral/Pink Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FFE4E6" stroke="#FECDD3" strokeWidth="1" />

    {/* Fresh Wet Paint Stroke on Wall */}
    <path d="M16 9H48C50 9 52 11 52 13V23C52 25 50 27 48 27H16V9Z" fill="#FEE2E2" />
    <path d="M19 27V33C19 34.5 20 35 21 35C22 35 23 34.5 23 33V27" fill="#EF4444" />
    <path d="M33 27V37C33 38.5 34 39 35 39C36 39 37 38.5 37 37V27" fill="#EF4444" />

    {/* Paint Roller Tool */}
    <g transform="translate(13, 7)">
      <rect x="4" y="6" width="32" height="13" rx="3.5" fill="#EF4444" stroke="#DC2626" strokeWidth="1.8" />
      <path d="M36 12.5H42V26H26V34" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="23" y="34" width="6" height="18" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
    </g>

    {/* Paint Bucket with Drips */}
    <g transform="translate(8, 29)">
      <path d="M3 10L6 28C6.3 30 8 31 10 31H20C22 31 23.7 30 24 28L27 10H3Z" fill="#FFFFFF" stroke="#334155" strokeWidth="1.8" />
      <ellipse cx="15" cy="10" rx="12" ry="3" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M19 12V18C19 19.5 20.5 20 21.5 19C22.5 18 22 16 22 12" fill="#EF4444" />
      <path d="M2 10C2 3 28 3 28 10" stroke="#64748B" strokeWidth="1.5" fill="none" />
    </g>
  </svg>
);

// 12. RO Technician (Complete RO Water Purifier + Filter Candle + Water Droplet)
export const RoTechnician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Aqua/Cyan Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#CFFAFE" stroke="#A5F3FC" strokeWidth="1" />

    {/* RO Purifier Wall Cabinet */}
    <rect x="11" y="9" width="32" height="46" rx="4.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.2" />

    {/* Purifier Header & Lights */}
    <rect x="15" y="13" width="24" height="6" rx="2" fill="#0284C7" />
    <circle cx="19" cy="16" r="1.2" fill="#22C55E" />
    <circle cx="23" cy="16" r="1.2" fill="#38BDF8" />
    <text x="27" y="17.5" fill="#FFFFFF" fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">RO</text>

    {/* Water Reservoir with Wavy Water */}
    <rect x="15" y="22" width="24" height="21" rx="2.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
    <path d="M15 33C18 31 21 34 25 32C29 30 33 33 39 31V41C39 42 38 43 37 43H17C16 43 15 42 15 41V33Z" fill="#38BDF8" fillOpacity="0.75" />

    {/* Chrome Tap Spout */}
    <rect x="25" y="44" width="5" height="3" fill="#64748B" />
    <path d="M26.5 47V51H28.5V47" stroke="#334155" strokeWidth="1.5" />

    {/* Sediment / Carbon Filter Candle Cartridge on Right */}
    <g transform="translate(45, 12)">
      <rect x="0" y="6" width="11" height="30" rx="3.5" fill="#FFFFFF" stroke="#0369A1" strokeWidth="1.8" />
      <rect x="2" y="2" width="7" height="5" rx="1.5" fill="#0284C7" />
      <rect x="2" y="35" width="7" height="4" rx="1.5" fill="#0284C7" />
      <line x1="2" y1="13" x2="9" y2="13" stroke="#BAE6FD" strokeWidth="1.5" />
      <line x1="2" y1="19" x2="9" y2="19" stroke="#BAE6FD" strokeWidth="1.5" />
      <line x1="2" y1="25" x2="9" y2="25" stroke="#BAE6FD" strokeWidth="1.5" />
      <line x1="2" y1="31" x2="9" y2="31" stroke="#BAE6FD" strokeWidth="1.5" />
    </g>

    {/* Falling Pure Water Droplet */}
    <path d="M27.5 52C27.5 52 24.5 55 24.5 56.5C24.5 58 25.8 59.2 27.5 59.2C29.2 59.2 30.5 58 30.5 56.5C30.5 55 27.5 52 27.5 52Z" fill="#0284C7" />
  </svg>
);

// 13. Doorstep Bike Repair (Motorcycle + Repair Spanner Wrench)
export const BikeRepair3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Orange Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FFEDD5" stroke="#FED7AA" strokeWidth="1" />

    {/* Motorcycle Wheels */}
    <circle cx="16" cy="42" r="9.5" fill="#0F172A" stroke="#334155" strokeWidth="2" />
    <circle cx="16" cy="42" r="5.5" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
    <circle cx="16" cy="42" r="2" fill="#0F172A" />

    <circle cx="48" cy="42" r="9.5" fill="#0F172A" stroke="#334155" strokeWidth="2" />
    <circle cx="48" cy="42" r="5.5" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
    <circle cx="48" cy="42" r="2" fill="#0F172A" />

    {/* Chassis & Body Frame */}
    <path d="M16 42L25 32H35L44 42" stroke="#EA580C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 32L32 42H16" stroke="#475569" strokeWidth="2.2" strokeLinejoin="round" />
    <rect x="24" y="36" width="10" height="7.5" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.2" />

    {/* Fuel Tank & Seat */}
    <path d="M20 28H30C32 28 36 24 40 24L36 30H20V28Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
    <path d="M18 28H28C26 25 21 25 18 28Z" fill="#1E293B" />

    {/* Handlebars */}
    <path d="M48 42L41 20L37 18" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="35" y1="18" x2="43" y2="18" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="44" cy="22" r="2.2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />

    {/* Repair Spanner Wrench on top */}
    <g transform="translate(18, 6) rotate(-24)">
      <rect x="8" y="2" width="4" height="22" rx="1.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
      <circle cx="10" cy="3" r="3.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="9" y="0" width="2" height="3.5" fill="#EA580C" />
      <circle cx="10" cy="23" r="3.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="9" y="23" width="2" height="3.5" fill="#EA580C" />
    </g>
  </svg>
);

// 14. Mobile Repair (Smartphone with Screen + Screwdriver Tool + Microchip)
export const MobileRepair3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Indigo Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1" />

    {/* Smartphone Body */}
    <rect x="17" y="9" width="30" height="47" rx="5.5" fill="#1E1B4B" stroke="#4338CA" strokeWidth="2.2" />
    {/* Screen Area */}
    <rect x="19.5" y="14" width="25" height="37" rx="3" fill="#FFFFFF" />

    {/* Top notch */}
    <rect x="28" y="11" width="8" height="1.8" rx="0.9" fill="#94A3B8" />

    {/* Internal Microchip & Circuit Lines on Screen */}
    <rect x="25" y="23" width="14" height="14" rx="2" fill="#4338CA" stroke="#312E81" strokeWidth="1.2" />
    <circle cx="32" cy="30" r="2.5" fill="#818CF8" />
    <path d="M22 27H25M22 33H25M39 27H42M39 33H42" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 20V23M32 37V40" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />

    {/* Screwdriver Repair Tool on Right */}
    <g transform="translate(37, 7) rotate(32)">
      <rect x="0" y="8" width="5.5" height="19" rx="1.5" fill="#4F46E5" stroke="#3730A3" strokeWidth="1.2" />
      <rect x="1.8" y="0" width="2" height="9" fill="#94A3B8" stroke="#475569" strokeWidth="0.8" />
      <polygon points="1.8,0 3.8,0 2.8,-3" fill="#334155" />
    </g>

    <circle cx="32" cy="46" r="2.2" fill="#C7D2FE" stroke="#4338CA" strokeWidth="1" />
  </svg>
);

// 15. Mason / Civil Contractor (Red Construction Bricks + Steel Trowel + Mortar)
export const MasonCivil3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Terracotta/Stone Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1" />

    {/* Staggered Red Bricks Wall */}
    <rect x="8" y="27" width="22" height="8" rx="1" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.2" />
    <rect x="32" y="27" width="24" height="8" rx="1" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />

    <rect x="6" y="37" width="14" height="8" rx="1" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
    <rect x="22" y="37" width="20" height="8" rx="1" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.2" />
    <rect x="44" y="37" width="14" height="8" rx="1" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />

    <rect x="8" y="47" width="22" height="8" rx="1" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.2" />
    <rect x="32" y="47" width="24" height="8" rx="1" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />

    {/* Wet Cement Mortar */}
    <path d="M18 25C24 23 28 27 34 24C40 22 44 26 48 25" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" />

    {/* Pointed Mason's Steel Trowel (Karni) */}
    <g transform="translate(18, 6) rotate(-28)">
      <path d="M4 14L20 4L22 22L4 14Z" fill="#F1F5F9" stroke="#334155" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 18V26H18" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="18" y="23" width="14" height="6" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
      <circle cx="30" cy="26" r="1.5" fill="#FDE68A" />
    </g>
  </svg>
);

// 16. Tile & Marble Layer (Marble / Tile Slabs with Veining & Notched Trowel)
export const TileMarble3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Emerald Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="1" />

    {/* Tiled Grid Floor */}
    <rect x="9" y="13" width="21" height="17" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="1.8" />
    <path d="M13 17C17 19 20 25 24 27" stroke="#6EE7B7" strokeWidth="1.2" strokeLinecap="round" />

    <rect x="34" y="13" width="21" height="17" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="1.8" />
    <path d="M39 15C44 21 47 23 51 29" stroke="#6EE7B7" strokeWidth="1.2" strokeLinecap="round" />

    <rect x="9" y="34" width="21" height="17" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="1.8" />
    <path d="M14 38C18 44 22 46 26 50" stroke="#6EE7B7" strokeWidth="1.2" strokeLinecap="round" />

    <rect x="34" y="34" width="21" height="17" rx="2" fill="#A7F3D0" stroke="#047857" strokeWidth="2.2" />
    <path d="M38 38C44 42 46 46 50 48" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />

    {/* Grout Cross Spacers */}
    <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
      <line x1="31" y1="20" x2="31" y2="24" />
      <line x1="29" y1="22" x2="33" y2="22" />
      <line x1="31" y1="41" x2="31" y2="45" />
      <line x1="29" y1="43" x2="33" y2="43" />
    </g>

    {/* Notched Trowel */}
    <g transform="translate(24, 24) rotate(15)">
      <rect x="6" y="2" width="18" height="8" rx="1.5" fill="#334155" stroke="#0F172A" strokeWidth="1.2" />
      <path d="M6 10L7 8L9 8L10 10L12 8L13 10L15 8L16 10L18 8L19 10L21 8L22 10" stroke="#0F172A" strokeWidth="1" />
      <rect x="11" y="-3" width="8" height="5" rx="1" fill="#B45309" />
    </g>
  </svg>
);

// 17. Water Tank Cleaning (Overhead Water Tank + High-Pressure Cleaning Hose Spray)
export const WaterTank3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Sky Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />

    {/* Ribbed Overhead Water Tank Body */}
    <rect x="15" y="16" width="34" height="35" rx="4" fill="#0284C7" stroke="#075985" strokeWidth="2.2" />
    <ellipse cx="32" cy="16" rx="14" ry="4.5" fill="#38BDF8" stroke="#075985" strokeWidth="1.8" />
    <rect x="26" y="10" width="12" height="4" rx="1.5" fill="#0369A1" stroke="#075985" strokeWidth="1.2" />

    {/* Reinforcement Ribs */}
    <line x1="15" y1="26" x2="49" y2="26" stroke="#7DD3FC" strokeWidth="2" />
    <line x1="15" y1="36" x2="49" y2="36" stroke="#7DD3FC" strokeWidth="2" />
    <line x1="15" y1="44" x2="49" y2="44" stroke="#7DD3FC" strokeWidth="2" />

    {/* High-Pressure Washer Wand / Spray Lance */}
    <g transform="translate(36, 17) rotate(42)">
      <rect x="0" y="2" width="24" height="2.5" fill="#FFFFFF" stroke="#475569" strokeWidth="1" />
      <polygon points="0,0 0,6 -4,3" fill="#F59E0B" />
      <path d="M-4 3L-18 -4L-18 10Z" fill="#38BDF8" fillOpacity="0.85" />
    </g>

    <circle cx="23" cy="31" r="2.2" fill="#FFFFFF" />
    <circle cx="28" cy="40" r="1.5" fill="#FFFFFF" />
    <path d="M11 53C17 51 25 55 33 53C41 51 49 55 53 53" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 18. Inverter & Battery Mechanic (Inverter + Tall Tubular Battery + Power Spark)
export const InverterBattery3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Emerald/Mint Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1" />

    {/* Left: Home Digital Inverter */}
    <rect x="7" y="22" width="25" height="29" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <rect x="10" y="26" width="19" height="7.5" rx="1.5" fill="#0F172A" />
    <circle cx="13" cy="29.5" r="1.3" fill="#22C55E" />
    <circle cx="18" cy="29.5" r="1.3" fill="#F59E0B" />
    <circle cx="23" cy="29.5" r="1.3" fill="#38BDF8" />
    <line x1="10" y1="38" x2="28" y2="38" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="42" x2="28" y2="42" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="46" x2="28" y2="46" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

    {/* Right: Heavy Tall Tubular Battery */}
    <rect x="35" y="16" width="22" height="35" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
    <rect x="38" y="12" width="4" height="4" rx="1" fill="#DC2626" />
    <rect x="50" y="12" width="4" height="4" rx="1" fill="#0F172A" />
    <circle cx="40.5" cy="20" r="1.4" fill="#10B981" />
    <circle cx="46" cy="20" r="1.4" fill="#10B981" />
    <circle cx="51.5" cy="20" r="1.4" fill="#10B981" />
    <rect x="38" y="26" width="16" height="11" rx="1" fill="#059669" />
    <text x="39.5" y="34" fill="#FFFFFF" fontSize="4" fontFamily="sans-serif" fontWeight="900">12V</text>

    {/* Cable Connection */}
    <path d="M22 22C22 14 36 14 38 14" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />

    {/* Lightning Bolt */}
    <path d="M33 4L28 13H34L30 20" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 19. Laptop / Computer Repair (Laptop + Desktop Monitor + Screwdriver)
export const LaptopRepair3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Slate Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

    {/* Desktop Monitor Screen in background */}
    <rect x="22" y="10" width="32" height="24" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <rect x="24.5" y="12.5" width="27" height="19" rx="1.5" fill="#0F172A" />
    <rect x="36" y="34" width="4" height="6" fill="#64748B" />
    <rect x="32" y="40" width="12" height="2" rx="1" fill="#475569" />

    {/* Foreground Laptop (Open Screen & Keyboard) */}
    <rect x="10" y="22" width="28" height="20" rx="2" fill="#334155" stroke="#0F172A" strokeWidth="1.8" />
    <rect x="12" y="24" width="24" height="16" rx="1" fill="#0F172A" />
    <path d="M15 28H20L23 33H30" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="30" cy="33" r="1.5" fill="#0284C7" />

    {/* Laptop keyboard base */}
    <path d="M7 42L10 50C10.5 51 11.5 51.5 12.5 51.5H35.5C36.5 51.5 37.5 51 38 50L41 42H7Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
    <rect x="21" y="46.5" width="7" height="2.5" rx="0.5" fill="#94A3B8" />

    {/* Screwdriver on Right */}
    <g transform="translate(43, 8) rotate(34)">
      <rect x="4" y="6" width="5" height="18" rx="1.5" fill="#4338CA" stroke="#312E81" strokeWidth="1.2" />
      <rect x="5.5" y="-2" width="2" height="9" fill="#94A3B8" stroke="#475569" strokeWidth="0.8" />
      <polygon points="5.5,-2 7.5,-2 6.5,-5" fill="#1E293B" />
    </g>
  </svg>
);

// 20. Welder & Welding Work (Welder with Helmet + Welding Torch + Arc Sparks)
export const Welder3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Warm Industrial Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />

    {/* Welder Helmet Shield */}
    <path
      d="M13 16C13 10 17 6 25 6C33 6 37 10 37 16V36C37 46 31 52 25 52C19 52 13 46 13 36V16Z"
      fill="#1E293B"
      stroke="#0F172A"
      strokeWidth="2.2"
    />
    <circle cx="17" cy="14" r="1.5" fill="#64748B" />
    <circle cx="33" cy="14" r="1.5" fill="#64748B" />
    {/* Dark Glass Viewing Window */}
    <rect x="17" y="20" width="16" height="9" rx="2" fill="#047857" stroke="#0F172A" strokeWidth="1.8" />
    <line x1="19" y1="23" x2="31" y2="23" stroke="#6EE7B7" strokeWidth="1" strokeLinecap="round" />

    {/* Welding Electrode Holder & Rod */}
    <g transform="translate(36, 26) rotate(-35)">
      <rect x="6" y="16" width="6" height="20" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <rect x="5" y="10" width="8" height="6" rx="1.5" fill="#475569" stroke="#1E293B" strokeWidth="1.2" />
      <line x1="9" y1="10" x2="9" y2="-6" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Radiant Welding Arc & Sparks */}
    <g transform="translate(36, 18)">
      <circle cx="0" cy="0" r="4.5" fill="#FEF08A" />
      <line x1="0" y1="-9" x2="0" y2="9" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="-9" y1="0" x2="9" y2="0" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="-7" y1="-7" x2="7" y2="7" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-7" y1="7" x2="7" y2="-7" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="-8" r="1.5" fill="#F59E0B" />
      <circle cx="-8" cy="9" r="1.2" fill="#EF4444" />
    </g>
  </svg>
);

// 21. Cleaner / Maid (Bucket + Standing Mop + Spray Bottle + Cleaning Supplies)
export const CleanerMaid3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Mint/Teal Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#CCFBF1" stroke="#99F6E4" strokeWidth="1" />

    {/* Blue Cleaning Bucket */}
    <path d="M12 24L15 48C15.3 50 17 51.5 19 51.5H35C37 51.5 38.7 50 39 48L42 24H12Z" fill="#0EA5E9" stroke="#0284C7" strokeWidth="2" />
    <ellipse cx="27" cy="24" rx="15" ry="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.8" />
    <path d="M12 24C12 14 42 14 42 24" stroke="#64748B" strokeWidth="2" fill="none" />

    {/* Bubbles */}
    <circle cx="22" cy="22" r="3" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1" />
    <circle cx="28" cy="20" r="3.5" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1" />
    <circle cx="33" cy="22" r="2.5" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1" />

    {/* Standing Mop */}
    <g transform="translate(18, 2)">
      <line x1="16" y1="2" x2="10" y2="40" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="10" cy="40" rx="6" ry="3" fill="#D97706" />
      <path d="M6 40C6 46 8 50 10 50C12 50 14 46 14 40" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Trigger Spray Bottle on Right */}
    <g transform="translate(42, 27)">
      <rect x="2" y="10" width="12" height="19" rx="3" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
      <rect x="5.5" y="6" width="5" height="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
      <path d="M4 6H12V2C12 0.8 11 0 10 0H6C5 0 4 0.8 4 2V6Z" fill="#334155" />
      <rect x="0" y="2" width="4" height="2.5" rx="0.5" fill="#EF4444" />
      <path d="M2 6L-2 9" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    <path d="M8 12L9 14L11 15L9 16L8 18L7 16L5 15L7 14L8 12Z" fill="#38BDF8" />
  </svg>
);

// 22. Packers & Movers Helper (Moving Boxes + Hand Truck Trolley)
export const PackersMoversHelper3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Amber/Kraft Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />

    {/* Orange Industrial Hand Truck */}
    <g transform="translate(6, 6)">
      <line x1="8" y1="4" x2="16" y2="44" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="16" x2="20" y2="20" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="28" x2="22" y2="32" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 44H42" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="16" cy="44" r="5" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
      <circle cx="16" cy="44" r="2" fill="#FFFFFF" />
    </g>

    {/* Bottom Large Moving Box */}
    <rect x="24" y="28" width="28" height="22" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="2" />
    <line x1="38" y1="28" x2="38" y2="50" stroke="#B45309" strokeWidth="4" />
    <path d="M28 34H32L30 38V42M28 42H32" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

    {/* Top Smaller Box */}
    <rect x="30" y="12" width="22" height="16" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
    <line x1="41" y1="12" x2="41" y2="28" stroke="#D97706" strokeWidth="3" />
    <path d="M45 16H48V20H45" stroke="#78350F" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

// 23. False Ceiling Contractor (Finished False Ceiling with Downlights & Cove Light)
export const FalseCeiling3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Champagne / Architectural Warm Gray Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1" />

    {/* Main Ceiling Slab (Top) */}
    <rect x="7" y="8" width="50" height="12" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />

    {/* Stepped Down Suspended Gypsum Ceiling */}
    <path
      d="M12 20H52V28H44V34H20V28H12V20Z"
      fill="#E2E8F0"
      stroke="#475569"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Glowing Golden Cove Light Layer */}
    <rect x="22" y="24" width="20" height="8" rx="2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />

    {/* Spot Downlights */}
    <circle cx="16" cy="14" r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.2" />
    <circle cx="16" cy="14" r="1.5" fill="#F59E0B" />
    <path d="M13 17L9 38H23L19 17Z" fill="#FDE047" fillOpacity="0.25" />

    <circle cx="48" cy="14" r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.2" />
    <circle cx="48" cy="14" r="1.5" fill="#F59E0B" />
    <path d="M45 17L41 38H55L51 17Z" fill="#FDE047" fillOpacity="0.25" />

    <circle cx="32" cy="28" r="2.5" fill="#FFFFFF" stroke="#334155" strokeWidth="1.2" />
    <circle cx="32" cy="28" r="1.2" fill="#F59E0B" />
    <path d="M29.5 30.5L25 54H39L34.5 30.5Z" fill="#FDE047" fillOpacity="0.35" />

    <line x1="28" y1="44" x2="36" y2="44" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="26" y1="48" x2="38" y2="48" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 24. Aluminum Fabricator (Aluminum Window / Door Sliding Frame + Mitre Tool)
export const AluminumFabricator3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Sky Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />

    {/* Aluminum Window Profile Outer Frame */}
    <rect x="9" y="10" width="46" height="44" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.4" />
    <rect x="30" y="10" width="4" height="44" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.5" />

    {/* Left Glass Sash */}
    <rect x="13" y="14" width="15" height="36" rx="1.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
    <line x1="16" y1="20" x2="23" y2="34" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

    {/* Right Glass Sash with Latch */}
    <rect x="36" y="14" width="15" height="36" rx="1.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
    <line x1="39" y1="20" x2="46" y2="34" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="36" y="28" width="2" height="8" rx="1" fill="#334155" />

    {/* Corner Mitre L-Bracket */}
    <path d="M9 10H20V16H14V22H9V10Z" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
    <circle cx="11.5" cy="13" r="1.2" fill="#0F172A" />

    {/* Fabricator Cutting Tool */}
    <g transform="translate(36, 32) rotate(25)">
      <rect x="6" y="8" width="4" height="18" rx="1.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      <path d="M4 8L8 2L12 8H4Z" fill="#64748B" stroke="#334155" strokeWidth="1" />
    </g>
  </svg>
);

// 25. Wallpaper & Panel Installer (Wallpaper Rolls + Striped Wall Panels)
export const WallpaperPanel3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Sage/Olive Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#ECFCCB" stroke="#D9F99D" strokeWidth="1" />

    {/* Striped Wall Panels */}
    <rect x="9" y="9" width="46" height="46" rx="3" fill="#FFFFFF" stroke="#78716C" strokeWidth="2" />
    <line x1="20" y1="9" x2="20" y2="55" stroke="#E7E5E4" strokeWidth="1.5" />
    <line x1="32" y1="9" x2="32" y2="55" stroke="#E7E5E4" strokeWidth="1.5" />
    <line x1="44" y1="9" x2="44" y2="55" stroke="#E7E5E4" strokeWidth="1.5" />

    {/* Hanging Wallpaper Sheet Pasted on Wall */}
    <path d="M14 9H38V42C38 42 28 44 24 38C20 32 14 36 14 36V9Z" fill="#ECFCCB" stroke="#65A30D" strokeWidth="1.8" />
    <circle cx="26" cy="18" r="3" fill="#84CC16" />
    <circle cx="26" cy="30" r="3" fill="#84CC16" />
    <path d="M26 15C29 18 29 21 26 24C23 21 23 18 26 15Z" fill="#4D7C0F" />
    <path d="M26 27C29 30 29 33 26 36C23 33 23 30 26 27Z" fill="#4D7C0F" />

    {/* Unrolling Wallpaper Cylindrical Roll */}
    <g transform="translate(18, 37)">
      <ellipse cx="12" cy="10" rx="14" ry="5" fill="#A3E635" stroke="#4D7C0F" strokeWidth="1.8" />
      <ellipse cx="22" cy="10" rx="4" ry="2" fill="#365314" />
      <path d="M-2 10V14C-2 17 4 19 12 19C20 19 26 17 26 14V10" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
    </g>

    <g transform="translate(36, 15) rotate(-20)">
      <rect x="0" y="0" width="16" height="8" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
      <rect x="0" y="6" width="16" height="3" fill="#1E293B" />
    </g>
  </svg>
);

// 26. Goods Transport / Pickup (Chota Hathi - Mini Truck Carrying Boxes)
export const GoodsTransport3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Blue Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#DBEAFE" stroke="#BFDBFE" strokeWidth="1" />

    {/* Wheels */}
    <circle cx="18" cy="46" r="6.5" fill="#0F172A" stroke="#334155" strokeWidth="2" />
    <circle cx="18" cy="46" r="2.5" fill="#FFFFFF" />
    <circle cx="48" cy="46" r="6.5" fill="#0F172A" stroke="#334155" strokeWidth="2" />
    <circle cx="48" cy="46" r="2.5" fill="#FFFFFF" />

    {/* Open Rear Cargo Bed (Chota Hathi / Tata Ace) */}
    <rect x="8" y="24" width="28" height="18" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.2" />
    <line x1="14" y1="24" x2="14" y2="42" stroke="#0284C7" strokeWidth="1.5" />
    <line x1="22" y1="24" x2="22" y2="42" stroke="#0284C7" strokeWidth="1.5" />
    <line x1="30" y1="24" x2="30" y2="42" stroke="#0284C7" strokeWidth="1.5" />

    {/* Loaded Cargo Boxes in truck bed */}
    <rect x="11" y="16" width="12" height="10" rx="1.5" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
    <line x1="17" y1="16" x2="17" y2="26" stroke="#B45309" strokeWidth="1.5" />
    <rect x="22" y="14" width="11" height="12" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />

    {/* Driver Cab */}
    <path
      d="M36 22H46C49 22 51 24 52 27L56 34V44H36V22Z"
      fill="#0284C7"
      stroke="#0369A1"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M40 25H46L50 33H40V25Z" fill="#E0F2FE" stroke="#0369A1" strokeWidth="1.2" />
    <rect x="54" y="38" width="2.5" height="4" rx="1" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
    <rect x="52" y="44" width="5" height="3" rx="1" fill="#334155" />
  </svg>
);

// 27. Key Lock Maker (Solid Brass Padlock + Keys)
export const KeyLockMaker3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Amber/Gold Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />

    {/* Padlock Shackle */}
    <path
      d="M20 26V16C20 9.4 25.4 4 32 4C38.6 4 44 9.4 44 16V26"
      stroke="#64748B"
      strokeWidth="4.5"
      strokeLinecap="round"
    />

    {/* Padlock Brass Body */}
    <rect x="14" y="24" width="36" height="30" rx="5" fill="#F59E0B" stroke="#B45309" strokeWidth="2.4" />
    <rect x="18" y="28" width="28" height="22" rx="3" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />

    {/* Keyhole */}
    <circle cx="32" cy="37" r="3.2" fill="#78350F" />
    <polygon points="30.5,37 33.5,37 34,44 30,44" fill="#78350F" />

    {/* Keys on Ring */}
    <g transform="translate(24, 28) rotate(35)">
      <circle cx="20" cy="10" r="7" fill="none" stroke="#64748B" strokeWidth="2" />
      <path d="M20 10H4L4 14L8 14L8 16L12 16L14 10" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="10" r="3" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" />
    </g>
  </svg>
);

// 28. Interior Designer (Sofa + Complete Room Interior + Standing Lamp + Table)
export const InteriorDesigner3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Sky Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />

    {/* Wall Picture Frame in background */}
    <rect x="18" y="10" width="14" height="12" rx="1.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
    <circle cx="23" cy="14" r="1.5" fill="#F59E0B" />
    <path d="M19 20L23 16L27 19L31 15" stroke="#0D9488" strokeWidth="1" strokeLinecap="round" />

    {/* Modern Stylish Sofa */}
    <g transform="translate(4, 18)">
      <rect x="8" y="8" width="30" height="18" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
      <rect x="6" y="20" width="34" height="10" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.8" />
      <rect x="4" y="16" width="6" height="14" rx="2" fill="#0369A1" stroke="#082F49" strokeWidth="1.5" />
      <rect x="36" y="16" width="6" height="14" rx="2" fill="#0369A1" stroke="#082F49" strokeWidth="1.5" />
      <line x1="8" y1="30" x2="5" y2="38" stroke="#B45309" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="38" y1="30" x2="41" y2="38" stroke="#B45309" strokeWidth="2.2" strokeLinecap="round" />
    </g>

    {/* Floor Arc Lamp on Right */}
    <g transform="translate(42, 6)">
      <path d="M12 48V20C12 12 4 10 0 10" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
      <polygon points="0,7 -6,14 6,14" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
      <ellipse cx="12" cy="48" rx="5" ry="2" fill="#334155" />
      <path d="M-5 14L-10 28H10L5 14Z" fill="#FEF08A" fillOpacity="0.3" />
    </g>

    {/* Small Coffee Table */}
    <ellipse cx="14" cy="50" rx="8" ry="3" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
    <line x1="14" y1="52" x2="14" y2="58" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 29. Babysitter / Nurse (Woman Nurse/Caretaker + Baby in Blanket + Heart Care)
export const BabysitterNurse3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Pastel Rose Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FCE7F3" stroke="#FBCFE8" strokeWidth="1" />

    {/* Caring Nurse / Mother Silhouette Head & Hair in background */}
    <circle cx="26" cy="18" r="9" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1.5" />
    {/* Hair */}
    <path d="M18 18C18 11 22 9 28 9C34 9 35 13 35 18C33 16 30 16 26 17C21 18 19 20 18 22" fill="#78350F" />
    {/* Nurse Cap */}
    <path d="M21 9H31L30 5H22L21 9Z" fill="#FFFFFF" stroke="#EF4444" strokeWidth="0.8" />
    <rect x="25" y="6" width="2" height="2" fill="#EF4444" />

    {/* Baby Swaddled in Pink/Peach Blanket in Foreground */}
    <path
      d="M16 42C16 28 26 22 36 22C46 22 52 30 52 42C52 51 42 56 32 56C21 56 16 50 16 42Z"
      fill="#FFFFFF"
      stroke="#F472B6"
      strokeWidth="2.2"
    />

    {/* Cute Baby Face */}
    <circle cx="34" cy="34" r="11" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1.8" />
    <path d="M34 23C33 21 35 19 37 21" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />
    {/* Sleeping Eyes */}
    <path d="M29 33C30 35 32 35 33 33" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M36 33C37 35 39 35 40 33" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <circle cx="29" cy="37" r="1.8" fill="#FDA4AF" />
    <circle cx="40" cy="37" r="1.8" fill="#FDA4AF" />
    <path d="M33.5 39C34.5 40.2 35.5 40.2 36.5 39" stroke="#BE123C" strokeWidth="1.4" strokeLinecap="round" fill="none" />

    {/* Medical Heart & Cross Badge on Left */}
    <g transform="translate(6, 14)">
      <path
        d="M10 3C6.5 -1.2 0.8 1.5 0.8 7C0.8 13 10 19 10 19C10 19 19.2 13 19.2 7C19.2 1.5 13.5 -1.2 10 3Z"
        fill="#EF4444"
        stroke="#B91C1C"
        strokeWidth="1.2"
      />
      <rect x="8.5" y="4.5" width="3" height="8" rx="0.8" fill="#FFFFFF" />
      <rect x="6" y="7" width="8" height="3" rx="0.8" fill="#FFFFFF" />
    </g>
  </svg>
);

// 30. Marriage Hall / Event Decorator (Grand Wedding Stage / Mandap with Canopy, Garlands & Chandelier)
export const EventDecorator3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Royal Rose Circular Background */}
    <circle cx="32" cy="32" r="30" fill="#FFE4E6" stroke="#FECDD3" strokeWidth="1" />

    {/* Red Carpet Stage Platform */}
    <rect x="7" y="48" width="50" height="9" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
    <line x1="7" y1="51" x2="57" y2="51" stroke="#F59E0B" strokeWidth="2" />

    {/* Mandap Pillars with Floral Wraps */}
    <rect x="12" y="18" width="6" height="30" rx="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
    <rect x="46" y="18" width="6" height="30" rx="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="15" cy="24" r="2.2" fill="#E11D48" />
    <circle cx="15" cy="34" r="2.2" fill="#F59E0B" />
    <circle cx="49" cy="24" r="2.2" fill="#E11D48" />
    <circle cx="49" cy="34" r="2.2" fill="#F59E0B" />

    {/* Royal Draped Arch Canopy Roof */}
    <path
      d="M8 18C16 10 24 16 32 10C40 16 48 10 56 18C52 24 44 20 32 24C20 20 12 24 8 18Z"
      fill="#B91C1C"
      stroke="#7F1D1D"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Marigold & Rose Flower Garlands */}
    <path d="M14 22C20 28 26 28 32 24C38 28 44 28 50 22" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 2" fill="none" />
    <path d="M18 25C24 30 28 30 32 27C36 30 40 30 46 25" stroke="#E11D48" strokeWidth="2" strokeDasharray="2.5 1.5" fill="none" />

    {/* Royal Golden Chandelier in Center */}
    <g transform="translate(28, 22)">
      <line x1="4" y1="0" x2="4" y2="6" stroke="#D97706" strokeWidth="1.5" />
      <polygon points="4,6 0,11 8,11" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
      <circle cx="4" cy="13" r="1.5" fill="#EF4444" />
    </g>

    {/* Throne Chairs */}
    <rect x="23" y="36" width="8" height="12" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
    <rect x="33" y="36" width="8" height="12" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
  </svg>
);

// Backward-compatibility exports
export const GlassTechnician3DIcon = AluminumFabricator3DIcon;
export const HomeTuition3DIcon = AcTechnician3DIcon;
