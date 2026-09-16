import React from 'react';

/**
 * High-Craft Fancy Standard Vector Icons for all 25 Service Categories.
 * Designed with bold silhouettes, rich 3D gradients, specular highlights,
 * and unmistakable trade symbolism so users instantly recognize each service at a glance.
 */

// 1. AC Technician & Gas Refill (Modern Split Air Conditioner with Frost Snowflake & Ice-Cool Breeze)
export const AcTechnician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="acBody" x1="6" y1="12" x2="58" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="acLouver" x1="10" y1="33" x2="54" y2="39" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="coolWave" x1="16" y1="38" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="snowGrad" x1="12" y1="17" x2="26" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>

    {/* Ambient shadow beneath AC unit */}
    <ellipse cx="32" cy="40" rx="25" ry="3.5" fill="#0369A1" fillOpacity="0.25" />

    {/* AC Indoor Wall Unit Body */}
    <rect x="6" y="14" width="52" height="23" rx="5" fill="url(#acBody)" stroke="#475569" strokeWidth="1.6" />
    <path d="M7 19C7 16 9 14.5 13 14.5H51C55 14.5 57 16 57 19V22H7V19Z" fill="#FFFFFF" fillOpacity="0.85" />

    {/* Metallic Center Accent Ribbon */}
    <rect x="6" y="25" width="52" height="2" fill="#0284C7" />

    {/* Digital LED Display with 16°C & Power Indicator */}
    <rect x="36" y="17" width="17" height="6.5" rx="1.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
    <text x="38.5" y="22" fill="#38BDF8" fontSize="4.8" fontFamily="monospace" fontWeight="900">16°</text>
    <circle cx="50" cy="20.2" r="0.9" fill="#22C55E" />

    {/* Bottom Air Discharge Louver Blade */}
    <rect x="9" y="33" width="46" height="3.5" rx="1.5" fill="url(#acLouver)" stroke="#0369A1" strokeWidth="0.8" />

    {/* Iconic Ice Snowflake Symbol on Left */}
    <g transform="translate(13, 16) scale(0.65)" stroke="url(#snowGrad)" strokeWidth="2.2" strokeLinecap="round">
      <line x1="10" y1="2" x2="10" y2="18" />
      <line x1="2" y1="10" x2="18" y2="10" />
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="4" y1="16" x2="16" y2="4" />
      <circle cx="10" cy="10" r="1.5" fill="#38BDF8" />
    </g>

    {/* Dynamic Icy Airflow Waves Blowing Downwards */}
    <path d="M16 38C17 45 22 48 20 57" stroke="url(#coolWave)" strokeWidth="3" strokeLinecap="round" />
    <path d="M26 39C28 46 33 50 32 60" stroke="url(#coolWave)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M37 39C38 46 44 50 42 60" stroke="url(#coolWave)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M47 38C48 45 52 48 50 57" stroke="url(#coolWave)" strokeWidth="3" strokeLinecap="round" />

    {/* Frost Sparkles */}
    <circle cx="28" cy="51" r="1.5" fill="#38BDF8" />
    <circle cx="40" cy="53" r="1.5" fill="#38BDF8" />
  </svg>
);

// 2. Electrician & Wiring (High-Voltage Lightning Bolt Bursting from 3-Pin Power Plug)
export const Electrician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="elecBolt" x1="20" y1="4" x2="52" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="35%" stopColor="#FACC15" />
        <stop offset="80%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="plugBody" x1="8" y1="20" x2="34" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="brassPin" x1="22" y1="12" x2="30" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>

    {/* Wall Switch Plate / Socket in background */}
    <rect x="6" y="10" width="32" height="42" rx="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.8" />
    <rect x="11" y="15" width="22" height="32" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
    {/* 3 Socket Holes */}
    <circle cx="22" cy="23" r="3" fill="#1E293B" />
    <circle cx="16.5" cy="33" r="2.5" fill="#1E293B" />
    <circle cx="27.5" cy="33" r="2.5" fill="#1E293B" />

    {/* Heavy 3-Pin Plug Head hovering */}
    <path d="M12 44C12 40 15 36 22 36C29 36 32 40 32 44V52H12V44Z" fill="url(#plugBody)" stroke="#334155" strokeWidth="1.2" />
    <rect x="18" y="52" width="8" height="6" rx="2" fill="#334155" />
    <line x1="22" y1="58" x2="22" y2="62" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

    {/* Giant High-Voltage Glowing 3D Lightning Bolt */}
    <path
      d="M36 4L21 27H35L27 58L54 25H39L49 4H36Z"
      fill="url(#elecBolt)"
      stroke="#78350F"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="drop-shadow-lg"
    />

    {/* Electric Energy Sparks */}
    <path d="M49 14L53 10M55 20L61 22M43 45L49 49" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="36" cy="27" r="2" fill="#FFFFFF" />
  </svg>
);

// 3. CCTV & Security Installer (High-Tech Bullet Surveillance Camera with Glossy Lens & REC LED)
export const Cctv3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cctvBody" x1="12" y1="16" x2="50" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="cctvLens" x1="40" y1="20" x2="56" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>

    {/* Wall Mount Base Plate */}
    <rect x="6" y="32" width="7" height="18" rx="2" fill="#475569" stroke="#334155" strokeWidth="1" />
    {/* Swivel Pivot Arm */}
    <path d="M13 41H23L26 36H30" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Weather Visor Hood */}
    <path d="M16 16L48 13C50.5 13 52 14.5 52 17L51 22L15 25Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />

    {/* Camera Cylinder Body (Angled Perspective) */}
    <rect x="16" y="20" width="31" height="17" rx="4" transform="rotate(-6 16 20)" fill="url(#cctvBody)" stroke="#475569" strokeWidth="1.5" />

    {/* Front Optical Lens Housing */}
    <ellipse cx="48" cy="27" rx="5" ry="8" fill="url(#cctvLens)" stroke="#1E293B" strokeWidth="1.6" />
    <ellipse cx="48.5" cy="27" rx="2.8" ry="5" fill="#0284C7" />
    <circle cx="47.5" cy="25" r="1.5" fill="#FFFFFF" />

    {/* Blinking Red REC Recording Light */}
    <circle cx="41" cy="18" r="2" fill="#EF4444" />
    <circle cx="41" cy="18" r="3.8" stroke="#EF4444" strokeWidth="0.8" strokeOpacity="0.8" />

    {/* Radiating Wi-Fi Security Surveillance Waves */}
    <path d="M53 18C56 21 57 25 57 28" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    <path d="M57 14C61 18 62 24 62 29" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// 4. Plumber & Water Motor (Chrome Water Faucet Tap with Splash Droplet & Red Pipe Wrench)
export const Plumber3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="tapChrome" x1="10" y1="12" x2="44" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#E2E8F0" />
        <stop offset="70%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="waterDrop" x1="33" y1="36" x2="47" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="wrenchHandle" x1="10" y1="46" x2="28" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>

    {/* Wall Pipe Base */}
    <rect x="6" y="24" width="7" height="12" rx="2" fill="#334155" />
    <rect x="11" y="26" width="9" height="8" rx="1" fill="url(#tapChrome)" stroke="#475569" strokeWidth="1" />

    {/* Red Top Rotary Valve Turn Handle */}
    <rect x="23" y="7" width="16" height="5.5" rx="2.75" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
    <rect x="29.5" y="12" width="3.5" height="7" fill="#64748B" />

    {/* Faucet Curved Neck */}
    <path
      d="M17 26H35C38.5 26 41 29 41 33V38H35V35C35 33 34 32 32 32H20V38H17V26Z"
      fill="url(#tapChrome)"
      stroke="#334155"
      strokeWidth="1.5"
    />

    {/* Aerator Spout */}
    <rect x="34" y="37" width="8" height="4.5" rx="1" fill="#475569" stroke="#334155" strokeWidth="0.8" />

    {/* Big Sparkling Water Droplet Falling */}
    <path
      d="M38 43C38 43 45 50 45 54.5C45 58.5 41.8 61 38 61C34.2 61 31 58.5 31 54.5C31 50 38 43 38 43Z"
      fill="url(#waterDrop)"
      stroke="#0369A1"
      strokeWidth="1.2"
      className="drop-shadow-md"
    />
    <ellipse cx="36" cy="53" rx="1.5" ry="3.2" fill="#FFFFFF" fillOpacity="0.8" />

    {/* Plumber Heavy Pipe Wrench Gripping Pipe */}
    <rect x="8" y="47" width="18" height="6" rx="2.5" transform="rotate(-25 8 47)" fill="url(#wrenchHandle)" stroke="#7F1D1D" strokeWidth="1" />
    <rect x="20" y="41" width="7" height="6" rx="1" transform="rotate(-25 20 41)" fill="#64748B" stroke="#334155" strokeWidth="1" />
  </svg>
);

// 5. Home Appliance Repair (Front-Load Washing Machine with Blue Churning Water Porthole)
export const HomeAppliance3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="washerBody" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="drumGlass" x1="20" y1="26" x2="44" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="60%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>

    {/* Main Washer Cabinet */}
    <rect x="10" y="8" width="44" height="49" rx="7" fill="url(#washerBody)" stroke="#475569" strokeWidth="1.8" />
    <line x1="10" y1="21" x2="54" y2="21" stroke="#94A3B8" strokeWidth="1.2" />

    {/* Detergent Soap Drawer */}
    <rect x="14" y="12.5" width="12" height="5.5" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />

    {/* Main Program Control Dial Knob */}
    <circle cx="34" cy="15" r="3.5" fill="#475569" stroke="#1E293B" strokeWidth="0.8" />
    <circle cx="34" cy="15" r="1.5" fill="#E2E8F0" />

    {/* Digital LED Display Lights */}
    <circle cx="44" cy="13.5" r="1" fill="#22C55E" />
    <circle cx="48" cy="13.5" r="1" fill="#38BDF8" />
    <circle cx="44" cy="16.5" r="1" fill="#FACC15" />

    {/* Outer Drum Metallic Door Rim */}
    <circle cx="32" cy="38" r="14.5" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
    <circle cx="32" cy="38" r="12" fill="#E2E8F0" />

    {/* Churning Blue Water Glass Center */}
    <circle cx="32" cy="38" r="9.5" fill="url(#drumGlass)" />
    {/* Swirling Water Wave */}
    <path d="M25 39C27 35 31 35 33 39C35 42 39 42 41 38" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />

    {/* Clean White Soap Suds / Bubbles */}
    <circle cx="28" cy="35" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
    <circle cx="35" cy="34" r="1.2" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="37" cy="41" r="1.6" fill="#FFFFFF" fillOpacity="0.9" />

    {/* Glass Door Handle */}
    <rect x="42" y="34.5" width="2.5" height="7" rx="1" fill="#334155" />
  </svg>
);

// 6. Taxi Driver & Cab (Classic Bright Yellow City Taxi Sedan with TAXI Sign & Checkers)
export const TaxiCab3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="taxiYellow" x1="12" y1="18" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="windshield" x1="16" y1="18" x2="48" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="50%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>

    {/* Road Surface Shadow */}
    <ellipse cx="32" cy="54" rx="24" ry="4" fill="#0F172A" fillOpacity="0.3" />

    {/* Taxi Roof Sign Box with "TAXI" */}
    <rect x="22" y="7" width="20" height="7" rx="2" fill="#FEF08A" stroke="#854D0E" strokeWidth="1.2" />
    <text x="24.5" y="12.3" fill="#713F12" fontSize="4.2" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.5">TAXI</text>

    {/* Car Roof & Cabin Pillars */}
    <path d="M16 28L20 15H44L48 28Z" fill="#CA8A04" stroke="#713F12" strokeWidth="1.2" />

    {/* Front Windshield Glass */}
    <path d="M17.5 27L21 16.5H43L46.5 27Z" fill="url(#windshield)" />
    <line x1="26" y1="18" x2="23" y2="26" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

    {/* Main Taxi Hood & Lower Body */}
    <path
      d="M8 32C8 29.5 10 28 13 28H51C54 28 56 29.5 56 32L57 44C57 47 55 49 52 49H12C9 49 7 47 7 44L8 32Z"
      fill="url(#taxiYellow)"
      stroke="#713F12"
      strokeWidth="1.5"
    />

    {/* Classic Black & White Checkered Taxi Band */}
    <rect x="8" y="32" width="48" height="3" fill="#0F172A" />
    <rect x="11" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="19" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="27" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="35" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="43" y="32" width="4" height="3" fill="#FFFFFF" />
    <rect x="51" y="32" width="4" height="3" fill="#FFFFFF" />

    {/* Radiator Center Grille */}
    <rect x="22" y="38" width="20" height="7" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="0.8" />
    <line x1="22" y1="40.5" x2="42" y2="40.5" stroke="#94A3B8" strokeWidth="0.8" />
    <line x1="22" y1="42.5" x2="42" y2="42.5" stroke="#94A3B8" strokeWidth="0.8" />

    {/* Big Glowing Xenon Headlights */}
    <rect x="9" y="37" width="9.5" height="6" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    <circle cx="13.7" cy="40" r="2" fill="#FFFFFF" />
    <rect x="45.5" y="37" width="9.5" height="6" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    <circle cx="50.2" cy="40" r="2" fill="#FFFFFF" />

    {/* Front Wheels Beneath Body */}
    <rect x="9" y="47" width="9" height="5.5" rx="2" fill="#1E293B" />
    <rect x="46" y="47" width="9" height="5.5" rx="2" fill="#1E293B" />
  </svg>
);

// 7. Tile & Marble Layer (Isometric Polished Italian Marble & Floor Tiles with Trowel)
export const TileMarble3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="marbleTop" x1="14" y1="16" x2="50" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>

    {/* Bottom Base Slate Tile */}
    <path d="M32 29L54 40L32 51L10 40Z" fill="#0D9488" stroke="#0F766E" strokeWidth="1.2" />
    <path d="M10 40L32 51V55L10 44Z" fill="#115E59" />
    <path d="M54 40L32 51V55L54 44Z" fill="#134E4A" />

    {/* Middle Golden Granite Tile */}
    <path d="M32 22L54 33L32 44L10 33Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" />
    <path d="M10 33L32 44V47L10 36Z" fill="#B45309" />
    <path d="M54 33L32 44V47L54 36Z" fill="#92400E" />

    {/* Top Luxury White Italian Marble Slab */}
    <path d="M32 14L54 25L32 36L10 25Z" fill="url(#marbleTop)" stroke="#475569" strokeWidth="1.5" />
    <path d="M10 25L32 36V39L10 28Z" fill="#64748B" />
    <path d="M54 25L32 36V39L54 28Z" fill="#475569" />

    {/* Tile Grout Grid Cross */}
    <line x1="21" y1="19.5" x2="43" y2="30.5" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="43" y1="19.5" x2="21" y2="30.5" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="2 2" />

    {/* Elegant Grey & Gold Marble Veins */}
    <path d="M22 21C26 23 29 26 35 27C39 28 44 26 47 28" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M27 18C30 20 33 21 37 21" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />

    {/* Masonry Trowel with Wooden Handle */}
    <g transform="translate(18, 10)">
      <polygon points="26,14 35,7 30,2" fill="#E2E8F0" stroke="#334155" strokeWidth="1.2" />
      <path d="M30 2L26 0" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* High Gloss Glint */}
    <path d="M32 17L33.5 20L36.5 20.5L33.5 22L32 25L30.5 22L27.5 20.5L30.5 20Z" fill="#FFFFFF" />
  </svg>
);

// 8. Interior Designer (Luxury Velvet Armchair & Arched Floor Lamp)
export const InteriorDesigner3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sofaBody" x1="12" y1="18" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="lampGlow" x1="48" y1="8" x2="38" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Arched Floor Lamp casting golden light */}
    <path d="M52 48V20C52 14 46 10 42 10" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
    <path d="M44 8L39 12H47L44 8Z" fill="#EAB308" stroke="#A16207" strokeWidth="1" />
    <polygon points="39,12 47,12 56,36 30,36" fill="url(#lampGlow)" opacity="0.6" />

    {/* Wooden Chair Legs */}
    <line x1="14" y1="46" x2="11" y2="55" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    <line x1="44" y1="46" x2="47" y2="55" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="46" x2="21" y2="53" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="36" y1="46" x2="37" y2="53" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

    {/* Sofa Main Backrest */}
    <rect x="12" y="20" width="34" height="20" rx="8" fill="url(#sofaBody)" stroke="#9F1239" strokeWidth="1.5" />

    {/* Left Armrest */}
    <rect x="8" y="28" width="8" height="18" rx="4" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.2" />
    {/* Right Armrest */}
    <rect x="42" y="28" width="8" height="18" rx="4" fill="#E11D48" stroke="#9F1239" strokeWidth="1.2" />

    {/* Main Deep Seating Cushion */}
    <rect x="14" y="34" width="30" height="13" rx="5" fill="#FDA4AF" stroke="#9F1239" strokeWidth="1.2" />

    {/* Golden Accent Throw Pillow */}
    <rect x="17" y="28" width="10" height="10" rx="2.5" transform="rotate(-15 17 28)" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
  </svg>
);

// 9. Aluminum Fabricator (Sliding Window Frame with Glass & Welding Spark)
export const AluminumFabricator3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="alumFrame" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="glassPane" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>

    {/* Outer Heavy Aluminum Outer Track Frame */}
    <rect x="8" y="9" width="48" height="46" rx="4" fill="url(#alumFrame)" stroke="#1E293B" strokeWidth="1.8" />
    <rect x="11" y="12" width="42" height="40" rx="2" fill="#0F172A" />

    {/* Left Fixed Glass Pane */}
    <rect x="13" y="14" width="18.5" height="36" fill="url(#glassPane)" fillOpacity="0.8" stroke="#64748B" strokeWidth="1.5" />
    <line x1="15" y1="16" x2="27" y2="38" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

    {/* Right Sliding Glass Sash Pane (Overlap in front) */}
    <rect x="29" y="14" width="22" height="36" fill="url(#glassPane)" fillOpacity="0.9" stroke="#E2E8F0" strokeWidth="1.8" />
    <line x1="32" y1="17" x2="46" y2="44" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

    {/* Sliding Window Lock Handle */}
    <rect x="31" y="28" width="3" height="8" rx="1" fill="#0F172A" stroke="#E2E8F0" strokeWidth="0.8" />

    {/* Fabrication Welder Flame & Hot Sparks */}
    <g transform="translate(42, 40)">
      <polygon points="6,6 15,1 12,12" fill="#FDE047" />
      <polygon points="7,7 13,3 11,10" fill="#FFFFFF" />
      <line x1="6" y1="6" x2="0" y2="0" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="4" r="1.5" fill="#EF4444" />
      <circle cx="14" cy="14" r="1.2" fill="#F59E0B" />
    </g>
  </svg>
);

// 10. Glass Technician (Crystal Architectural Tempered Glass Pane with Dual Suction Lifters)
export const GlassTechnician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="glassBody" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#7DD3FC" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>

    {/* Large 3D Beveled Tempered Glass Sheet */}
    <polygon points="12,18 46,8 54,44 20,54" fill="url(#glassBody)" fillOpacity="0.8" stroke="#0284C7" strokeWidth="1.8" />
    {/* Glass Edge Bevel Depth */}
    <polygon points="20,54 54,44 56,47 22,57" fill="#0369A1" stroke="#075985" strokeWidth="1" />

    {/* Crisp Light Refraction Streaks */}
    <line x1="20" y1="18" x2="48" y2="44" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
    <line x1="26" y1="16" x2="50" y2="38" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

    {/* Industrial Orange Dual-Cup Glass Suction Lifter Tool */}
    <g transform="translate(18, 22) rotate(-15)">
      {/* Heavy Connecting Bar */}
      <rect x="6" y="8" width="22" height="5" rx="2" fill="#F97316" stroke="#9A3412" strokeWidth="1.2" />
      {/* Top Center Grip Handle */}
      <path d="M12 8V3C12 1.5 14 1 17 1C20 1 22 1.5 22 3V8" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left Suction Cup */}
      <ellipse cx="6" cy="10" rx="5" ry="5" fill="#1E293B" stroke="#F97316" strokeWidth="1.2" />
      {/* Right Suction Cup */}
      <ellipse cx="28" cy="10" rx="5" ry="5" fill="#1E293B" stroke="#F97316" strokeWidth="1.2" />
    </g>

    {/* Diamond Prism Glint Star */}
    <path d="M46 11L48 15L52 16L48 17L46 21L44 17L40 16L44 15Z" fill="#FFFFFF" />
  </svg>
);

// 11. Painter (Paint Roller Spreading Vibrant Dual-Tone Paint Stroke with Drips & Palette)
export const Painter3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wetPaint" x1="10" y1="6" x2="54" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="50%" stopColor="#9333EA" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="rollerCylinder" x1="20" y1="16" x2="48" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
    </defs>

    {/* Broad Wet Paint Stroke on Wall */}
    <path
      d="M10 8C10 6 13 6 16 6H48C51 6 54 6 54 8V24C54 26 51 27 48 26C45 25 43 27 40 28C37 29 34 26 31 27C28 28 25 32 22 28C19 25 15 28 12 26C10 25 10 23 10 21V8Z"
      fill="url(#wetPaint)"
    />

    {/* Dripping Wet Paint Drops */}
    <circle cx="16" cy="33" r="2.2" fill="#9333EA" />
    <circle cx="28" cy="36" r="1.8" fill="#4F46E5" />
    <circle cx="44" cy="32" r="1.5" fill="#9333EA" />

    {/* Paint Roller Core Cylinder */}
    <rect x="18" y="20" width="30" height="11" rx="4" fill="url(#rollerCylinder)" stroke="#881337" strokeWidth="1.5" />
    <rect x="16" y="22" width="2" height="7" rx="1" fill="#475569" />
    <rect x="48" y="22" width="2" height="7" rx="1" fill="#475569" />

    {/* Steel Roller Rod Frame */}
    <path d="M49 25.5H53C54.5 25.5 56 27 56 29V38C56 40 54 41 52 41H36V46" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

    {/* Wooden Roller Grip Handle */}
    <rect x="32" y="46" width="8" height="14" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.4" />
    <line x1="36" y1="49" x2="36" y2="57" stroke="#78350F" strokeWidth="1.2" />

    {/* Artist Color Dab Star */}
    <circle cx="18" cy="48" r="3" fill="#FACC15" />
    <circle cx="14" cy="54" r="2.5" fill="#38BDF8" />
  </svg>
);

// 12. Mehndi Artist (Henna Cone Dispensing Dark Herbal Mehndi into Paisley Mandala)
export const MehndiArtist3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="coneFoil" x1="32" y1="6" x2="56" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
      <linearGradient id="hennaDark" x1="12" y1="24" x2="40" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="70%" stopColor="#14532D" />
        <stop offset="100%" stopColor="#052E16" />
      </linearGradient>
    </defs>

    {/* Traditional Intricate Indian Paisley (Keri) Motif */}
    <path
      d="M26 56C16 56 10 47 10 37C10 27 19 20 28 20C34 20 38 23 40 28C42 33 39 37 34 37C29 37 27 34 29 31C30 29 31 29 30 28C27 26 21 28 19 33C17 38 19 46 26 48C31 49 35 46 36 43"
      stroke="url(#hennaDark)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Mandala Floral Petals & Dots */}
    <circle cx="26" cy="37" r="2.5" fill="#14532D" />
    <circle cx="15" cy="44" r="1.5" fill="#16A34A" />
    <circle cx="19" cy="51" r="1.5" fill="#16A34A" />
    <circle cx="33" cy="53" r="1.5" fill="#16A34A" />
    <circle cx="39" cy="48" r="1.5" fill="#16A34A" />

    {/* Elegant Decorative Leaves */}
    <path d="M12 28C10 25 12 21 16 22C16 26 14 28 12 28Z" fill="#15803D" />
    <path d="M10 36C8 33 10 29 14 30C14 34 12 36 10 36Z" fill="#15803D" />

    {/* Professional Gold Foil Henna Applicator Cone */}
    <polygon points="56,6 40,8 24,35" fill="url(#coneFoil)" stroke="#713F12" strokeWidth="1.2" />
    <polygon points="56,6 50,22 24,35" fill="#EAB308" stroke="#713F12" strokeWidth="1" />

    {/* Fine Needle Tip dispensing fresh mehndi */}
    <line x1="24" y1="35" x2="21" y2="38" stroke="#14532D" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 13. Makeup Artist (Luxury Ruby Lipstick & Fluffy Powder Makeup Blush Brush with Sparkles)
export const MakeupArtist3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldTube" x1="12" y1="30" x2="26" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      <linearGradient id="rubyLip" x1="14" y1="12" x2="24" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="40%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="brushBristles" x1="38" y1="8" x2="56" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="50%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>

    {/* Lipstick Base Body */}
    <rect x="12" y="32" width="13" height="24" rx="2.5" fill="url(#goldTube)" stroke="#78350F" strokeWidth="1.2" />
    <rect x="14" y="27" width="9" height="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />

    {/* Sculpted Ruby-Red Lipstick Tip (Beveled) */}
    <path d="M14 27V19L21 12C22.5 14 23 16 23 19V27H14Z" fill="url(#rubyLip)" stroke="#881337" strokeWidth="1" />

    {/* Makeup Powder Blush Brush (Crossed Angled) */}
    <g transform="translate(12, -4) rotate(22 34 32)">
      {/* Wooden Handle */}
      <rect x="32" y="32" width="6" height="26" rx="2.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
      {/* Rose Gold Ferrule */}
      <rect x="31" y="23" width="8" height="9" rx="1.5" fill="url(#goldTube)" stroke="#78350F" strokeWidth="0.8" />
      {/* Fluffy Rounded Bristles */}
      <path d="M31 23C30 15 33 10 35 10C37 10 40 15 39 23H31Z" fill="url(#brushBristles)" stroke="#BE123C" strokeWidth="1" />
    </g>

    {/* Dazzling Glamour Sparkle Stars */}
    <path d="M48 36L49.5 40L53.5 41L49.5 42L48 46L46.5 42L42.5 41L46.5 40Z" fill="#F43F5E" />
    <path d="M34 16L35 19L38 20L35 21L34 24L33 21L30 20L33 19Z" fill="#FACC15" />
    <circle cx="28" cy="14" r="1.5" fill="#F43F5E" />
  </svg>
);

// 14. Marriage Hall & Event Decorator (Royal Grand Celebration Tent / Mandap with Flower Garlands & Lights)
export const EventDecorator3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="tentRoof" x1="12" y1="12" x2="52" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>

    {/* Golden Pinnacle / Kalash on Top */}
    <circle cx="32" cy="10" r="2.5" fill="#FDE047" stroke="#A16207" strokeWidth="0.8" />
    <path d="M32 6L32 10" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />

    {/* Royal Canopy Pavilion Roof with Alternating Stripes */}
    <path d="M32 11L10 26V31C10 31 16 34 21 31C26 28 32 32 32 32C32 32 38 28 43 31C48 34 54 31 54 31V26L32 11Z" fill="url(#tentRoof)" stroke="#78350F" strokeWidth="1.2" />
    <path d="M32 11L21 31" stroke="#FDE047" strokeWidth="1.8" />
    <path d="M32 11L43 31" stroke="#FDE047" strokeWidth="1.8" />

    {/* Grand Entrance Pillars */}
    <rect x="14" y="31" width="5" height="23" rx="1.5" fill="#CA8A04" stroke="#78350F" strokeWidth="1" />
    <rect x="45" y="31" width="5" height="23" rx="1.5" fill="#CA8A04" stroke="#78350F" strokeWidth="1" />

    {/* Festive Fresh Marigold Floral Garland Arch */}
    <path d="M16 34C20 40 44 40 48 34" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 2" />
    <path d="M16 38C22 44 42 44 48 38" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 2" />

    {/* Glowing Golden Fairy String Lights */}
    <circle cx="19" cy="36" r="1.5" fill="#FEF08A" />
    <circle cx="26" cy="40" r="1.8" fill="#FEF08A" />
    <circle cx="32" cy="41" r="2" fill="#FFFFFF" />
    <circle cx="38" cy="40" r="1.8" fill="#FEF08A" />
    <circle cx="45" cy="36" r="1.5" fill="#FEF08A" />

    {/* Celebration Confetti & Balloons */}
    <circle cx="8" cy="20" r="3.5" fill="#38BDF8" />
    <circle cx="56" cy="22" r="3.5" fill="#A855F7" />
  </svg>
);

// 15. Wallpaper & Panel Installer (Unrolling Luxury 3D Wallpaper Roll Revealing Modern Wood Paneling)
export const WallpaperPanel3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="woodPanel" x1="8" y1="8" x2="36" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
      <linearGradient id="paperSheet" x1="16" y1="12" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>

    {/* Background Vertical Fluted Wood Wall Panels */}
    <rect x="8" y="8" width="48" height="48" rx="4" fill="#78350F" />
    <line x1="14" y1="8" x2="14" y2="56" stroke="#451A03" strokeWidth="2.5" />
    <line x1="20" y1="8" x2="20" y2="56" stroke="#451A03" strokeWidth="2.5" />
    <line x1="26" y1="8" x2="26" y2="56" stroke="#451A03" strokeWidth="2.5" />
    <line x1="32" y1="8" x2="32" y2="56" stroke="#451A03" strokeWidth="2.5" />

    {/* Unrolling Luxury Wallpaper Sheet */}
    <path
      d="M20 12H52C54 12 56 14 56 16V44C48 44 42 40 36 48C30 56 22 52 20 48V12Z"
      fill="url(#paperSheet)"
      stroke="#D97706"
      strokeWidth="1.5"
    />

    {/* Damask / Geometric Gold Floral Wallpaper Patterns */}
    <circle cx="38" cy="24" r="4.5" stroke="#B45309" strokeWidth="1.2" strokeDasharray="2 1.5" />
    <polygon points="38,20 40,24 38,28 36,24" fill="#D97706" />
    <circle cx="48" cy="34" r="3.5" stroke="#B45309" strokeWidth="1.2" strokeDasharray="2 1.5" />

    {/* Rolled Cylinder Bottom Curl */}
    <ellipse cx="28" cy="50" rx="9" ry="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    <ellipse cx="28" cy="50" rx="5" ry="2" fill="#D97706" />
  </svg>
);

// 16. False Ceiling Contractor (Modern 3D Stepped False Ceiling with Golden Recessed Cove Light & Spotlights)
export const FalseCeiling3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="coveGlow" x1="12" y1="20" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#FACC15" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Top Master Ceiling Slab */}
    <path d="M10 10H54L48 20H16L10 10Z" fill="#475569" stroke="#1E293B" strokeWidth="1.2" />

    {/* Stepped Recessed False Ceiling Trough */}
    <rect x="14" y="20" width="36" height="24" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

    {/* Golden Glowing Ambient Cove Lighting Rim */}
    <rect x="16" y="22" width="32" height="20" rx="3" fill="#334155" stroke="#FACC15" strokeWidth="2.5" />
    <rect x="18" y="24" width="28" height="16" rx="2" fill="url(#coveGlow)" />

    {/* Recessed Modern Spotlights (Downlights) casting light beams */}
    <circle cx="22" cy="28" r="2.5" fill="#FFFFFF" stroke="#FACC15" strokeWidth="1" />
    <polygon points="22,31 16,56 28,56" fill="#FEF08A" fillOpacity="0.3" />

    <circle cx="42" cy="28" r="2.5" fill="#FFFFFF" stroke="#FACC15" strokeWidth="1" />
    <polygon points="42,31 36,56 48,56" fill="#FEF08A" fillOpacity="0.3" />

    {/* Center Modern Chandelier / Fan Hook Plate */}
    <circle cx="32" cy="32" r="3.5" fill="#FDE047" stroke="#A16207" strokeWidth="1" />
  </svg>
);

// 17. Key Lock Maker (Heavy Solid Brass Master Padlock with Golden Grooved Key)
export const KeyLockMaker3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="brassLock" x1="12" y1="24" x2="42" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="steelShackle" x1="16" y1="8" x2="38" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="60%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>

    {/* Heavy Curved Steel Shackle */}
    <path
      d="M17 26V18C17 12 21 7 27 7C33 7 37 12 37 18V26"
      stroke="url(#steelShackle)"
      strokeWidth="5.5"
      strokeLinecap="round"
    />

    {/* Solid Brass Padlock Body */}
    <rect x="11" y="24" width="32" height="30" rx="6" fill="url(#brassLock)" stroke="#78350F" strokeWidth="1.8" />
    <rect x="14" y="27" width="26" height="2" fill="#FEF08A" />

    {/* Keyhole */}
    <circle cx="27" cy="37" r="3.5" fill="#1E293B" />
    <polygon points="25.5,37 28.5,37 29.5,45 24.5,45" fill="#1E293B" />

    {/* Golden Serrated Master Key (Poised to Unlock) */}
    <g transform="translate(32, 28) rotate(-35)">
      {/* Key Head Bow */}
      <circle cx="10" cy="18" r="6" fill="url(#brassLock)" stroke="#78350F" strokeWidth="1.4" />
      <circle cx="10" cy="18" r="2.5" fill="#FFFFFF" />
      {/* Key Blade Stem */}
      <rect x="15" y="16.5" width="22" height="3" fill="url(#brassLock)" stroke="#78350F" strokeWidth="1" />
      {/* Key Cuts / Bittings */}
      <rect x="29" y="19.5" width="2.5" height="3.5" fill="#CA8A04" />
      <rect x="33" y="19.5" width="2.5" height="4.5" fill="#CA8A04" />
    </g>
  </svg>
);

// 18. Inverter & Battery Mechanic (Heavy Backup Battery with Glowing LED Bars & Power Zap)
export const InverterBattery3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="batteryBody" x1="10" y1="18" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>

    {/* Battery Terminal Posts */}
    {/* Negative (-) Post */}
    <rect x="16" y="12" width="7" height="6" rx="1.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
    <text x="18" y="16.5" fill="#FFFFFF" fontSize="4.5" fontWeight="bold">-</text>
    {/* Positive (+) Post */}
    <rect x="41" y="12" width="7" height="6" rx="1.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
    <text x="43" y="16.5" fill="#FFFFFF" fontSize="4.5" fontWeight="bold">+</text>

    {/* Main Heavy Duty Battery Casing */}
    <rect x="10" y="17" width="44" height="40" rx="5" fill="url(#batteryBody)" stroke="#450A0A" strokeWidth="1.8" />
    <rect x="10" y="24" width="44" height="2" fill="#450A0A" />

    {/* Digital Battery Power Level Display Window */}
    <rect x="16" y="30" width="32" height="15" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />

    {/* Glowing Green Power Level Bars */}
    <rect x="19" y="33" width="5" height="9" rx="1" fill="#22C55E" />
    <rect x="26" y="33" width="5" height="9" rx="1" fill="#22C55E" />
    <rect x="33" y="33" width="5" height="9" rx="1" fill="#22C55E" />
    <rect x="40" y="33" width="5" height="9" rx="1" fill="#FACC15" />

    {/* High-Voltage Charge Flash Pulse */}
    <path d="M34 10L27 23H35L31 35L44 19H36L41 10H34Z" fill="#FDE047" stroke="#78350F" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

// 19. Carpenter & Woodwork (Hardwood Timber Log with Steel Handsaw Cutting Through & Claw Hammer)
export const Carpenter3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sawBlade" x1="12" y1="12" x2="48" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="woodLog" x1="8" y1="36" x2="56" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>

    {/* Natural Cut Timber Log / Board at base */}
    <rect x="8" y="38" width="48" height="17" rx="3" fill="url(#woodLog)" stroke="#451A03" strokeWidth="1.5" />
    <ellipse cx="56" cy="46.5" rx="3" ry="8.5" fill="#D97706" stroke="#451A03" strokeWidth="1.2" />
    <line x1="12" y1="44" x2="48" y2="44" stroke="#78350F" strokeWidth="1.5" />
    <line x1="16" y1="48" x2="44" y2="48" stroke="#78350F" strokeWidth="1.5" />

    {/* Professional Steel Handsaw Cutting Deeply */}
    <g transform="translate(6, 4) rotate(18 24 24)">
      {/* Wooden D-Grip Handle */}
      <path d="M10 18C10 13 14 10 18 10C21 10 24 13 24 18V28C24 33 21 36 18 36C14 36 10 33 10 28V18Z" fill="#D97706" stroke="#78350F" strokeWidth="1.4" />
      <rect x="14" y="16" width="6" height="14" rx="3" fill="#FFFFFF" />

      {/* Tapered Saw Blade with Serrated Teeth */}
      <polygon points="22,14 54,23 54,26 22,32" fill="url(#sawBlade)" stroke="#475569" strokeWidth="1.2" />
      {/* Saw Blade Teeth */}
      <path d="M26 32L28 34L30 32L32 34L34 32L36 34L38 32L40 34L42 32L44 34L46 32L48 34L50 32L52 34L54 32" stroke="#334155" strokeWidth="1.2" />
    </g>

    {/* Carpenter Claw Hammer resting beside */}
    <g transform="translate(34, 18) rotate(45)">
      <rect x="10" y="8" width="5" height="24" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="1" />
      <path d="M5 8H20V13H5Z" fill="#64748B" stroke="#334155" strokeWidth="1" />
    </g>
  </svg>
);

// 20. Doorstep Bike Repair (Motorcycle with Mechanic Spanner Wrench & Drive Cog)
export const BikeRepair3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bikeRed" x1="16" y1="20" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>

    {/* Background Mechanic Drive Cog */}
    <circle cx="32" cy="30" r="14" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="3.5 2.5" opacity="0.6" />
    <circle cx="32" cy="30" r="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />

    {/* Rear Wheel */}
    <circle cx="16" cy="42" r="9" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <circle cx="16" cy="42" r="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />

    {/* Front Wheel */}
    <circle cx="48" cy="42" r="9" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <circle cx="48" cy="42" r="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />

    {/* Motorcycle Frame & Fuel Tank */}
    <path d="M18 42L28 32H38L48 42" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
    <path d="M26 32L33 22H42L40 32Z" fill="url(#bikeRed)" stroke="#991B1B" strokeWidth="1.2" />

    {/* Handlebar & Headlight */}
    <path d="M41 22L45 16H42" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="47" cy="20" r="2.2" fill="#FEF08A" />

    {/* Heavy Crossed Mechanic Open-End Spanner */}
    <g transform="translate(18, 10)">
      <path
        d="M26 4C23 4 21 6 20 8L6 22C4 24 4 27 6 29C8 31 11 31 13 29L27 15C29 14 31 12 31 9C31 7 29 4 26 4Z"
        fill="#F8FAFC"
        stroke="#1E293B"
        strokeWidth="1.8"
      />
      <circle cx="8" cy="27" r="1.5" fill="#1E293B" />
    </g>
  </svg>
);

// 21. Home Tuition / Personal Tutor (Graduation Mortarboard Cap atop Stacked Textbooks & Pencil)
export const HomeTuition3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="capGrad" x1="12" y1="10" x2="52" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>

    {/* Stack of Study Textbooks */}
    {/* Bottom Book (Green) */}
    <rect x="14" y="47" width="36" height="7" rx="2" fill="#16A34A" stroke="#14532D" strokeWidth="1.2" />
    <rect x="18" y="49" width="30" height="3" fill="#F8FAFC" />

    {/* Middle Book (Crimson Red) */}
    <rect x="12" y="39" width="40" height="8" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
    <rect x="16" y="41.5" width="34" height="3" fill="#F8FAFC" />

    {/* Top Book (Royal Blue) */}
    <rect x="16" y="31" width="32" height="8" rx="2" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.2" />
    <rect x="20" y="33.5" width="26" height="3" fill="#F8FAFC" />

    {/* Academic Mortarboard Diamond Cap */}
    <polygon points="32,8 54,18 32,27 10,18" fill="url(#capGrad)" stroke="#0284C7" strokeWidth="1.2" />

    {/* Cap Skull Cap Head Band */}
    <path d="M22 23V29C22 33 26 36 32 36C38 36 42 33 42 29V23" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />

    {/* Golden Hanging Tassel */}
    <circle cx="32" cy="17.5" r="1.8" fill="#FDE047" />
    <path d="M32 17.5L46 22V31" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
    <polygon points="44,31 48,31 46,37" fill="#EAB308" />

    {/* Student Pencil */}
    <polygon points="46,42 56,52 53,55 43,45" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
  </svg>
);

// 22. Goods Transport / Pickup (Iconic Chota Hathi / Tata Ace Mini Delivery Truck Loaded with Cargo)
export const GoodsTransport3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="truckCab" x1="32" y1="18" x2="56" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="60%" stopColor="#0891B2" />
        <stop offset="100%" stopColor="#0E7490" />
      </linearGradient>
    </defs>

    {/* Cargo Stack of Boxes in Truck Bed */}
    <rect x="10" y="20" width="14" height="12" rx="1.5" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    <line x1="17" y1="20" x2="17" y2="32" stroke="#B45309" strokeWidth="1" />
    <rect x="22" y="16" width="13" height="16" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <line x1="28.5" y1="16" x2="28.5" y2="32" stroke="#D97706" strokeWidth="1" />

    {/* Cargo Open Truck Bed Sides */}
    <rect x="8" y="30" width="28" height="15" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
    <line x1="8" y1="36" x2="36" y2="36" stroke="#94A3B8" strokeWidth="1.2" />

    {/* Truck Front Driver Cab (Chota Hathi) */}
    <path
      d="M36 45V25C36 22 38 20 41 20H47L54 30V45H36Z"
      fill="url(#truckCab)"
      stroke="#155E75"
      strokeWidth="1.6"
    />

    {/* Driver Windshield & Side Window */}
    <path d="M40 23H46L51 30H40V23Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />

    {/* Front Xenon Headlight */}
    <rect x="52" y="38" width="4.5" height="5" rx="1.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />

    {/* Front & Rear Heavy Wheels */}
    <circle cx="18" cy="46" r="7" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <circle cx="18" cy="46" r="3.5" fill="#CBD5E1" />

    <circle cx="45" cy="46" r="7" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <circle cx="45" cy="46" r="3.5" fill="#CBD5E1" />

    {/* Motion Speed Lines */}
    <line x1="2" y1="36" x2="6" y2="36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <line x1="1" y1="41" x2="5" y2="41" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 23. Cleaner / Maid (Cleaning Spray Bottle with Mist Spray, Squeegee & Sparkling Bubbles)
export const CleanerMaid3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sprayBottle" x1="24" y1="20" x2="48" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>

    {/* Rubber Cleaning Squeegee in Background */}
    <g transform="translate(10, 8) rotate(-28)">
      {/* Wiper Blade Head */}
      <rect x="6" y="8" width="28" height="5" rx="1.5" fill="#0D9488" stroke="#115E59" strokeWidth="1" />
      {/* Handle */}
      <rect x="18" y="13" width="4" height="26" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
    </g>

    {/* Spray Bottle Body */}
    <path
      d="M32 28C32 25 35 23 37 23H41C43 23 46 25 46 28L48 54C48 56 46 58 43 58H35C32 58 30 56 30 54L32 28Z"
      fill="url(#sprayBottle)"
      stroke="#0369A1"
      strokeWidth="1.5"
    />
    <rect x="33" y="36" width="12" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.85" />

    {/* Spray Trigger Mechanism Head */}
    <path d="M37 23V17H41V23" fill="#E2E8F0" />
    <path d="M34 17H44C46 17 47 16 47 14L45 11H36L34 17Z" fill="#F8FAFC" stroke="#475569" strokeWidth="1.2" />
    {/* Trigger Lever */}
    <path d="M35 17C32 19 32 23 35 25" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    {/* Spray Nozzle */}
    <rect x="31" y="12" width="4" height="4" rx="1" fill="#EF4444" />

    {/* Fine Mist Droplets */}
    <circle cx="25" cy="11" r="1.5" fill="#38BDF8" />
    <circle cx="20" cy="14" r="1.2" fill="#38BDF8" />
    <circle cx="24" cy="17" r="1.2" fill="#38BDF8" />

    {/* Clean Sparkling Bubbles & Glint Stars */}
    <circle cx="50" cy="30" r="4.5" fill="#BAE6FD" fillOpacity="0.6" stroke="#38BDF8" strokeWidth="1" />
    <circle cx="53" cy="28" r="1.2" fill="#FFFFFF" />
    <circle cx="54" cy="44" r="3" fill="#BAE6FD" fillOpacity="0.5" stroke="#38BDF8" strokeWidth="0.8" />
    <path d="M18 42L19.5 45L22.5 46L19.5 47L18 50L16.5 47L13.5 46L16.5 45Z" fill="#FACC15" />
  </svg>
);

// 24. Babysitter / Nurse (Cute Baby Stroller with Medical Nurse Cross & Stethoscope Heart)
export const BabysitterNurse3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="pramBody" x1="12" y1="16" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
    </defs>

    {/* Baby Stroller Carriage Hood */}
    <path
      d="M14 28C14 18 22 14 32 14V34H14V28Z"
      fill="url(#pramBody)"
      stroke="#9F1239"
      strokeWidth="1.6"
    />
    {/* Stroller Bassinet Lower Basket */}
    <path
      d="M14 34H38C38 41 33 46 26 46C19 46 14 41 14 34Z"
      fill="#FDA4AF"
      stroke="#9F1239"
      strokeWidth="1.5"
    />

    {/* Stroller Handle Bar */}
    <path d="M32 18H44L40 44" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

    {/* Stroller Wheels */}
    <circle cx="19" cy="50" r="5.5" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
    <circle cx="19" cy="50" r="2" fill="#E11D48" />

    <circle cx="33" cy="50" r="5.5" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
    <circle cx="33" cy="50" r="2" fill="#E11D48" />

    {/* Nurse / Medical Heart Badge on Top Right */}
    <g transform="translate(38, 8)">
      <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#E11D48" strokeWidth="1.8" className="drop-shadow-sm" />
      {/* Red Cross */}
      <rect x="10.5" y="6" width="3" height="12" rx="1" fill="#E11D48" />
      <rect x="6" y="10.5" width="12" height="3" rx="1" fill="#E11D48" />
    </g>
  </svg>
);

// 25. Packers & Movers Helper (Corrugated Shipping Box with Tape & Moving Hand Truck)
export const PackersMoversHelper3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="boxTop" x1="16" y1="12" x2="48" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="boxFront" x1="12" y1="26" x2="42" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>

    {/* Two-Wheel Luggage Hand Truck / Dolly */}
    <path d="M48 10L42 46H52" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="43" cy="50" r="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <circle cx="43" cy="50" r="2" fill="#CBD5E1" />

    {/* 3D Isometric Corrugated Carton Box */}
    {/* Box Top Flaps */}
    <polygon points="26,12 44,19 30,27 12,20" fill="url(#boxTop)" stroke="#78350F" strokeWidth="1.4" />
    {/* Brown Sealing Tape across top */}
    <polygon points="19,16 37,23 33,25 15,18" fill="#92400E" opacity="0.8" />

    {/* Box Left Side */}
    <polygon points="12,20 30,27 30,50 12,43" fill="url(#boxFront)" stroke="#78350F" strokeWidth="1.4" />
    {/* Box Right Side */}
    <polygon points="30,27 44,19 44,42 30,50" fill="#92400E" stroke="#78350F" strokeWidth="1.4" />

    {/* "FRAGILE / THIS SIDE UP" Arrows on Front of Box */}
    <g transform="translate(16, 29)">
      <path d="M5 10V4M3 6L5 3L7 6" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10V4M8 6L10 3L12 6" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Handle Cutout Slot */}
    <rect x="34" y="27" width="5" height="2.5" rx="1.2" fill="#451A03" />
  </svg>
);
