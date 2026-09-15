import React from 'react';

/**
 * High-craft 3D Pictorial Vector SVGs for all 22 trade categories.
 * Each icon is crafted with 3D lighting, gradients, depth layers,
 * highlights, and realistic detailing tailored strictly to the actual trade.
 */

// 1. AC Technician (3D Split Air Conditioner Wall Unit with Louver & Cool Airflow Waves)
export const AcTechnician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      {/* 3D AC Unit Body Gradient */}
      <linearGradient id="acBodyGrad" x1="6" y1="14" x2="58" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      {/* 3D Top Bevel Highlight */}
      <linearGradient id="acTopBevel" x1="10" y1="16" x2="54" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.3" />
      </linearGradient>
      {/* 3D Vent Louver Gradient */}
      <linearGradient id="acLouverGrad" x1="12" y1="36" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      {/* Cold Air Glow */}
      <linearGradient id="coolAirGrad" x1="16" y1="42" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#0284C7" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Drop Shadow beneath the AC unit */}
    <ellipse cx="32" cy="42" rx="26" ry="4" fill="#0284C7" fillOpacity="0.25" />

    {/* Main 3D Split AC Unit Body */}
    <rect x="7" y="16" width="50" height="22" rx="4.5" fill="url(#acBodyGrad)" stroke="#94A3B8" strokeWidth="1" />
    
    {/* Top Highlight Rim */}
    <path d="M9 18C9 17 11 16.5 13 16.5H51C53 16.5 55 17 55 18V21H9V18Z" fill="url(#acTopBevel)" />

    {/* Air Intake Grill Slots on Top */}
    <line x1="13" y1="20" x2="51" y2="20" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    <line x1="15" y1="22.5" x2="49" y2="22.5" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

    {/* Sleek Chrome / Cyan Accent Center Strip */}
    <rect x="7" y="27" width="50" height="1.8" fill="#0284C7" fillOpacity="0.8" />

    {/* 3D Digital LED Temperature Display (16°C) */}
    <rect x="39" y="20.5" width="13" height="5.5" rx="1.5" fill="#0F172A" />
    <text x="41" y="24.8" fill="#38BDF8" fontSize="4.2" fontFamily="monospace" fontWeight="bold">16°</text>
    <circle cx="50" cy="23.2" r="0.7" fill="#22C55E" />

    {/* Bottom Air Outlet Louver Blade (Tilted open for airflow) */}
    <rect x="11" y="34.5" width="42" height="3" rx="1.5" fill="url(#acLouverGrad)" />

    {/* Dynamic 3D Cool Airflow Waves Discharging from Bottom */}
    <path d="M16 40C18 45 22 47 21 54" stroke="url(#coolAirGrad)" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M26 41C28 47 34 50 32 58" stroke="url(#coolAirGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M37 41C39 46 45 50 43 58" stroke="url(#coolAirGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M47 40C49 45 52 48 50 54" stroke="url(#coolAirGrad)" strokeWidth="2.2" strokeLinecap="round" />

    {/* Miniature Frost / Cold Air Sparkles */}
    <circle cx="27" cy="51" r="1" fill="#BAE6FD" />
    <circle cx="39" cy="53" r="1.2" fill="#E0F2FE" />
    <circle cx="21" cy="49" r="0.8" fill="#BAE6FD" />
    <circle cx="49" cy="51" r="0.8" fill="#E0F2FE" />
  </svg>
);

// 2. Electrician & Wiring (3D Heavy-Duty Plug, Socket & High-Voltage Spark)
export const Electrician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="plugBody" x1="14" y1="20" x2="38" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="brassPin" x1="28" y1="12" x2="36" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="elecSpark" x1="26" y1="10" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF" />
        <stop offset="30%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    {/* Wall Switch Plate Background */}
    <rect x="8" y="10" width="34" height="44" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="15" y="17" width="20" height="30" rx="3" fill="#E2E8F0" />
    <circle cx="25" cy="24" r="3" fill="#334155" />
    <circle cx="19" cy="33" r="2.5" fill="#334155" />
    <circle cx="31" cy="33" r="2.5" fill="#334155" />

    {/* 3D High-Voltage Energy Lightning Bolt Bursting Out */}
    <path
      d="M38 8L27 28H39L33 54L54 26H41L49 8H38Z"
      fill="url(#elecSpark)"
      stroke="#B45309"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="drop-shadow-md"
    />
    <circle cx="38" cy="27" r="2" fill="#FEF08A" />
    <circle cx="48" cy="18" r="1.5" fill="#FFFFFF" />
  </svg>
);

// 3. CCTV & Security Installer (3D Bullet Surveillance Camera with Lens & Red REC Light)
export const Cctv3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cctvBody" x1="12" y1="18" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="cctvLens" x1="42" y1="20" x2="56" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="50%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="sunVisor" x1="10" y1="14" x2="46" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    {/* Wall Mount Base Plate */}
    <rect x="8" y="32" width="6" height="18" rx="2" fill="#64748B" />
    {/* Swivel Pivot Arm */}
    <path d="M14 41H24L26 36H30" stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

    {/* Sunshade Top Hood / Visor */}
    <path d="M18 17L49 14C51 14 52 15 52 17L51 22L17 25Z" fill="url(#sunVisor)" stroke="#94A3B8" strokeWidth="0.8" />

    {/* Main Camera Cylinder Barrel (3D Perspective) */}
    <rect x="18" y="21" width="30" height="17" rx="3.5" transform="rotate(-6 18 21)" fill="url(#cctvBody)" stroke="#94A3B8" strokeWidth="1" />

    {/* Front Optical Lens Housing */}
    <ellipse cx="49" cy="27" rx="4.5" ry="7.5" fill="url(#cctvLens)" stroke="#334155" strokeWidth="1.2" />
    <ellipse cx="49.5" cy="27" rx="2.5" ry="4.5" fill="#0284C7" />
    <circle cx="48.5" cy="25" r="1.2" fill="#FFFFFF" opacity="0.8" />

    {/* Red Blinking Status / Recording LED */}
    <circle cx="42" cy="19" r="1.8" fill="#EF4444" />
    <circle cx="42" cy="19" r="3.2" stroke="#EF4444" strokeWidth="0.8" strokeOpacity="0.6" />

    {/* WiFi / Signal Waves */}
    <path d="M53 17C55 19 56 22 56 25" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M56 14C59 17 60 21 60 25" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// 4. Plumber & Water Motor (3D Chrome Water Faucet Tap & Crystal Water Droplet)
export const Plumber3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="tapChrome" x1="8" y1="12" x2="42" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#E2E8F0" />
        <stop offset="70%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="tapHandle" x1="18" y1="6" x2="34" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="waterDropGrad" x1="38" y1="36" x2="48" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>

    {/* Wall Pipe Fitting */}
    <rect x="6" y="24" width="7" height="12" rx="2" fill="#475569" />
    <rect x="11" y="26" width="10" height="8" rx="1" fill="url(#tapChrome)" />

    {/* Rotary Valve Handle (Red 3D Wheel) on Top */}
    <rect x="23" y="8" width="16" height="5" rx="2.5" fill="url(#tapHandle)" stroke="#7F1D1D" strokeWidth="0.8" />
    <rect x="29" y="13" width="4" height="7" fill="#64748B" />

    {/* Main Tap Body Curve */}
    <path
      d="M17 26H34C37 26 40 29 40 33V39H34V35C34 33 33 32 31 32H20V38H17V26Z"
      fill="url(#tapChrome)"
      stroke="#475569"
      strokeWidth="1"
    />

    {/* Aerator / Tap Nozzle */}
    <rect x="33" y="37" width="8" height="4" rx="1" fill="#475569" />

    {/* 3D Crystal Water Droplet Splashing */}
    <path
      d="M37 43C37 43 43 49 43 53C43 56.5 40.3 59 37 59C33.7 59 31 56.5 31 53C31 49 37 43 37 43Z"
      fill="url(#waterDropGrad)"
      stroke="#0369A1"
      strokeWidth="0.8"
      className="drop-shadow-md"
    />
    <ellipse cx="35" cy="52" rx="1.5" ry="3" fill="#FFFFFF" fillOpacity="0.75" />

    {/* Pipe Wrench Accent at bottom */}
    <path d="M12 48L24 48" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 5. Home Appliance Repair (3D Washing Machine with Round Glass Porthole & Suds)
export const HomeAppliance3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="washerBody" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="drumGlass" x1="20" y1="26" x2="44" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="50%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="drumRim" x1="18" y1="24" x2="46" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="50%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>

    {/* Washing Machine Outer Cabinet */}
    <rect x="11" y="9" width="42" height="47" rx="6" fill="url(#washerBody)" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="11" y1="21" x2="53" y2="21" stroke="#CBD5E1" strokeWidth="1" />

    {/* Detergent Soap Drawer */}
    <rect x="15" y="13" width="11" height="5" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />

    {/* Digital Rotary Knob & LED Lights */}
    <circle cx="34" cy="15.5" r="3" fill="#64748B" stroke="#334155" strokeWidth="0.8" />
    <circle cx="43" cy="14" r="1" fill="#22C55E" />
    <circle cx="46" cy="14" r="1" fill="#38BDF8" />
    <circle cx="49" cy="14" r="1" fill="#EF4444" />
    <rect x="43" y="17" width="7" height="2" rx="0.5" fill="#0F172A" />

    {/* 3D Round Porthole Door Rim */}
    <circle cx="32" cy="38" r="15" fill="url(#drumRim)" stroke="#64748B" strokeWidth="1" />
    {/* Inner Glass Drum with Water Swirl */}
    <circle cx="32" cy="38" r="11.5" fill="url(#drumGlass)" />
    <path d="M25 41C28 36 36 36 39 41" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <circle cx="30" cy="35" r="1.5" fill="#BAE6FD" opacity="0.9" />
    <circle cx="35" cy="39" r="1.2" fill="#E0F2FE" opacity="0.9" />

    {/* Door Handle Latch */}
    <rect x="44" y="36" width="2" height="5" rx="1" fill="#FFFFFF" />
  </svg>
);

// 6. Taxi Driver & Cab (3D Yellow City Taxi Cab with Checker Strip & TAXI Roof Sign)
export const TaxiCab3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="taxiBody" x1="12" y1="18" x2="52" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="cabGlass" x1="20" y1="20" x2="44" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
    </defs>

    {/* Drop Shadow */}
    <ellipse cx="32" cy="52" rx="24" ry="4" fill="#854D0E" fillOpacity="0.3" />

    {/* TAXI Roof Top Sign */}
    <rect x="25" y="13" width="14" height="6" rx="2" fill="#FEF08A" stroke="#713F12" strokeWidth="0.8" />
    <text x="26.5" y="17.8" fill="#713F12" fontSize="3.8" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.2">TAXI</text>

    {/* Car Roof & Cabin Windows */}
    <path d="M19 28L23 20H41L45 28Z" fill="url(#cabGlass)" stroke="#713F12" strokeWidth="0.8" />
    {/* Windshield Pillar Frame */}
    <line x1="32" y1="20" x2="32" y2="28" stroke="#713F12" strokeWidth="1.2" />

    {/* Main Yellow Cab Car Body */}
    <path
      d="M10 33C10 30 13 28 16 28H48C51 28 54 30 54 33L56 42C56 44 54 45 52 45H12C10 45 8 44 8 42L10 33Z"
      fill="url(#taxiBody)"
      stroke="#713F12"
      strokeWidth="1.2"
    />

    {/* Iconic Black-and-White Checkerboard Racing Stripe */}
    <rect x="10" y="34" width="44" height="3" fill="#0F172A" />
    <rect x="12" y="34" width="4" height="3" fill="#FFFFFF" />
    <rect x="20" y="34" width="4" height="3" fill="#FFFFFF" />
    <rect x="28" y="34" width="4" height="3" fill="#FFFFFF" />
    <rect x="36" y="34" width="4" height="3" fill="#FFFFFF" />
    <rect x="44" y="34" width="4" height="3" fill="#FFFFFF" />

    {/* Headlights */}
    <rect x="8.5" y="38" width="4" height="3" rx="1" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.6" />
    <rect x="51.5" y="38" width="4" height="3" rx="1" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.6" />

    {/* Rubber Tires & Rims */}
    <circle cx="18" cy="46" r="6" fill="#1E293B" />
    <circle cx="18" cy="46" r="3" fill="#CBD5E1" />
    <circle cx="46" cy="46" r="6" fill="#1E293B" />
    <circle cx="46" cy="46" r="3" fill="#CBD5E1" />
  </svg>
);

// 7. Tile & Marble Layer (3D Isometric Stack of Polished Marble & Floor Tiles)
export const TileMarble3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="marbleTileTop" x1="14" y1="18" x2="50" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="tileSide" x1="12" y1="36" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>

    {/* Isometric Bottom Tile */}
    <path d="M32 30L52 40L32 50L12 40Z" fill="#0D9488" stroke="#0F766E" strokeWidth="1" />
    <path d="M12 40L32 50V54L12 44Z" fill="#115E59" />
    <path d="M52 40L32 50V54L52 44Z" fill="#134E4A" />

    {/* Middle Golden Granite Tile */}
    <path d="M32 23L52 33L32 43L12 33Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" opacity="0.95" />
    <path d="M12 33L32 43V46L12 36Z" fill="#B45309" />
    <path d="M52 33L32 43V46L52 36Z" fill="#92400E" />

    {/* Top Premium Polished Italian White Marble Tile */}
    <path d="M32 15L52 25L32 35L12 25Z" fill="url(#marbleTileTop)" stroke="#94A3B8" strokeWidth="1.2" />
    <path d="M12 25L32 35V38L12 28Z" fill="url(#tileSide)" />
    <path d="M52 25L32 35V38L52 28Z" fill="#475569" />

    {/* Marble Veins */}
    <path d="M22 21C26 23 28 26 34 27C38 28 42 27 46 29" stroke="#94A3B8" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
    <path d="M28 18C30 20 32 22 36 22" stroke="#CBD5E1" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />

    {/* Glossy High-Shine Glint */}
    <path d="M32 18L33.5 21L36 21.5L33.5 22.5L32 25L30.5 22.5L28 21.5L30.5 21Z" fill="#FFFFFF" />
  </svg>
);

// 8. Interior Designer (3D Modern Luxury Designer Sofa Lounge)
export const InteriorDesigner3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sofaBack" x1="12" y1="14" x2="52" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="sofaSeat" x1="14" y1="30" x2="50" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    {/* Wooden Tapered Legs */}
    <line x1="16" y1="44" x2="13" y2="52" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="48" y1="44" x2="51" y2="52" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="26" y1="44" x2="25" y2="51" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="44" x2="39" y2="51" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />

    {/* Sofa Main Backrest Cushion */}
    <rect x="14" y="16" width="36" height="20" rx="8" fill="url(#sofaBack)" stroke="#BE123C" strokeWidth="1" />

    {/* Left Armrest */}
    <rect x="10" y="25" width="8" height="18" rx="4" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />

    {/* Right Armrest */}
    <rect x="46" y="25" width="8" height="18" rx="4" fill="#E11D48" stroke="#BE123C" strokeWidth="1" />

    {/* Main Deep Seating Cushion */}
    <rect x="16" y="32" width="32" height="12" rx="4" fill="url(#sofaSeat)" stroke="#BE123C" strokeWidth="1" />

    {/* Designer Throw Pillow / Cushion */}
    <rect x="20" y="26" width="9" height="9" rx="2" transform="rotate(-12 20 26)" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.8" />
  </svg>
);

// 9. Aluminum Fabricator (3D Sliding Aluminum Glass Window Frame)
export const AluminumFabricator3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="alumFrame" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#CBD5E1" />
        <stop offset="50%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="windowGlass" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="50%" stopColor="#7DD3FC" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>

    {/* Outer 3D Aluminum Window Frame */}
    <rect x="10" y="12" width="44" height="40" rx="3" fill="url(#alumFrame)" stroke="#475569" strokeWidth="1.5" />
    
    {/* Left Glass Sash */}
    <rect x="14" y="16" width="17" height="32" rx="1.5" fill="url(#windowGlass)" stroke="#64748B" strokeWidth="1" />
    {/* Glass Reflection Glint */}
    <line x1="18" y1="20" x2="26" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

    {/* Right Sliding Glass Sash (Overlapping) */}
    <rect x="29" y="16" width="21" height="32" rx="1.5" fill="url(#windowGlass)" stroke="#475569" strokeWidth="1.2" />
    <line x1="35" y1="20" x2="43" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

    {/* Latch Lock Handle */}
    <rect x="30.5" y="30" width="2" height="6" rx="1" fill="#0F172A" />
  </svg>
);

// 10. Glass Technician (3D Beveled Architectural Glass Sheet with Suction Cup Lifter)
export const GlassTechnician3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="thickGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>

    {/* 3D Beveled Glass Pane with Perspective */}
    <polygon points="16,14 48,14 52,48 12,48" fill="url(#thickGlass)" stroke="#0284C7" strokeWidth="1.5" fillOpacity="0.8" />
    {/* Beveled Edge Highlight */}
    <polygon points="16,14 48,14 46,17 18,17" fill="#FFFFFF" fillOpacity="0.8" />
    <polygon points="12,48 16,14 18,17 15,46" fill="#38BDF8" fillOpacity="0.5" />

    {/* Professional Dual-Cup Glass Lifter Tool (Orange 3D) */}
    <line x1="22" y1="31" x2="42" y2="31" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
    {/* Left Suction Cup */}
    <ellipse cx="23" cy="31" rx="5" ry="5" fill="#F97316" stroke="#9A3412" strokeWidth="1" />
    <circle cx="23" cy="31" r="2" fill="#1E293B" />
    {/* Right Suction Cup */}
    <ellipse cx="41" cy="31" rx="5" ry="5" fill="#F97316" stroke="#9A3412" strokeWidth="1" />
    <circle cx="41" cy="31" r="2" fill="#1E293B" />

    {/* Sparkle Glint on Glass Corner */}
    <path d="M46 16L47 18L49 19L47 20L46 22L45 20L43 19L45 18Z" fill="#FFFFFF" />
  </svg>
);

// 11. Painter (3D Paint Roller with Rich Dripping Paint & Color Streak)
export const Painter3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="paintRoll" x1="16" y1="12" x2="44" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="50%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
      <linearGradient id="wetPaint" x1="16" y1="24" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#6B21A8" />
      </linearGradient>
    </defs>

    {/* Wet Painted Trail */}
    <path d="M16 16H44V26C44 26 40 32 38 36C36 40 37 43 37 43H28C28 43 27 38 25 35C23 32 16 33 16 26V16Z" fill="url(#wetPaint)" opacity="0.4" />
    {/* Wet Paint Dripping Droplet */}
    <circle cx="37" cy="46" r="2" fill="#7E22CE" />

    {/* 3D Roller Cylinder */}
    <rect x="16" y="14" width="28" height="12" rx="4" fill="url(#paintRoll)" stroke="#581C87" strokeWidth="1" />
    <rect x="18" y="16" width="24" height="2" rx="1" fill="#E9D5FF" opacity="0.6" />

    {/* Steel Rod Arm connecting handle to roller */}
    <path d="M44 20H49C50.5 20 51 21 51 22.5V36C51 37.5 50 38 48 38H34V46" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Ergonomic Rubber Handle */}
    <rect x="31" y="44" width="6" height="13" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
    <rect x="32" y="46" width="4" height="2" rx="0.5" fill="#A855F7" />
  </svg>
);

// 12. Mehndi Artist (3D Henna Cone with Blooming Floral Henna Mandala Art)
export const MehndiArtist3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="hennaFoil" x1="16" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="50%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
      <linearGradient id="hennaPaste" x1="20" y1="36" x2="36" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>

    {/* Blooming Henna Flower / Mandala Swirls in Background */}
    <circle cx="38" cy="24" r="10" stroke="#15803D" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
    <circle cx="38" cy="24" r="5" fill="#BBF7D0" opacity="0.4" />
    {/* Paisley Leaves */}
    <path d="M38 12C44 14 48 20 48 24C48 28 44 32 38 32" stroke="#16A34A" strokeWidth="1.2" />

    {/* 3D Metallic Henna Cone Tube */}
    <polygon points="14,14 26,10 44,46 41,49" fill="url(#hennaFoil)" stroke="#14532D" strokeWidth="1" />
    {/* Decorative Cone Tape Bands */}
    <line x1="17" y1="18" x2="28" y2="15" stroke="#FDE047" strokeWidth="1.5" />
    <line x1="24" y1="26" x2="34" y2="23" stroke="#DC2626" strokeWidth="1.5" />

    {/* Tip Dispensing Dark Organic Henna Paste */}
    <circle cx="43" cy="48" r="2" fill="url(#hennaPaste)" />
    <path d="M43 48C46 51 51 51 54 53" stroke="url(#hennaPaste)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 13. Makeup Artist (3D Glamour Lipstick & Luxury Powder Brush)
export const MakeupArtist3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="lipstickRed" x1="18" y1="12" x2="28" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="60%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
      <linearGradient id="goldCollar" x1="16" y1="24" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
    </defs>

    {/* 3D Lipstick Bullet (Angled Tip) */}
    <path d="M20 25V18L26 12V25Z" fill="url(#lipstickRed)" />
    {/* Golden Inner Collar */}
    <rect x="18" y="25" width="10" height="7" rx="1" fill="url(#goldCollar)" stroke="#854D0E" strokeWidth="0.8" />
    {/* Black Glossy Outer Tube Base */}
    <rect x="17" y="32" width="12" height="20" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
    <line x1="17" y1="36" x2="29" y2="36" stroke="#EAB308" strokeWidth="0.8" />

    {/* Luxury Powder Brush (Angled Crossing behind/beside) */}
    <path d="M38 14C35 18 36 24 38 28H48C50 24 51 18 48 14C45 11 41 11 38 14Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="0.8" />
    <rect x="40" y="28" width="6" height="5" fill="url(#goldCollar)" />
    <rect x="41" y="33" width="4" height="21" rx="1.5" fill="#0F172A" />

    {/* Glamour Shimmer Sparkle */}
    <path d="M23 11L24 13L26 14L24 15L23 17L22 15L20 14L22 13Z" fill="#FEF08A" />
  </svg>
);

// 14. Marriage Hall / Event Decorator (3D Celebration Party Popper, Confetti & Ribbons)
export const EventDecorator3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="popperCone" x1="10" y1="36" x2="32" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
    </defs>

    {/* 3D Angled Party Popper Cone */}
    <polygon points="12,54 36,36 22,22" fill="url(#popperCone)" stroke="#9A3412" strokeWidth="1.2" />
    {/* Festive Striped Bands on Cone */}
    <line x1="16" y1="43" x2="25" y2="34" stroke="#FDE047" strokeWidth="2" />
    <line x1="21" y1="50" x2="31" y2="40" stroke="#38BDF8" strokeWidth="2" />

    {/* Burst of 3D Confetti Stars & Ribbons */}
    <path d="M28 20C32 14 42 16 46 10" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
    <path d="M34 26C40 24 45 28 54 22" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M24 16C26 8 34 8 36 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

    {/* Golden Sparkles & Confetti Diamonds */}
    <polygon points="46,14 48,18 52,19 48,20 46,24 44,20 40,19 44,18" fill="#FACC15" />
    <circle cx="38" cy="12" r="2" fill="#F43F5E" />
    <circle cx="51" cy="27" r="2.2" fill="#8B5CF6" />
    <circle cx="43" cy="24" r="1.8" fill="#10B981" />
  </svg>
);

// 15. Wallpaper & Panel Installer (3D Decorative Textured Wallpaper Roll & Wall Panel)
export const WallpaperPanel3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wpRoll" x1="12" y1="12" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="wpSheet" x1="16" y1="16" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
    </defs>

    {/* Fluted 3D Wall Panel Base */}
    <rect x="10" y="10" width="44" height="44" rx="4" fill="#78350F" opacity="0.2" />

    {/* Unrolling Luxury Wallpaper Sheet */}
    <path
      d="M14 14H46C48 14 50 16 50 18V44C44 40 38 48 30 44C24 40 18 46 14 44V14Z"
      fill="url(#wpSheet)"
      stroke="#D97706"
      strokeWidth="1.2"
    />

    {/* Geometric / Fluted 3D Panel Patterns on Wallpaper */}
    <line x1="20" y1="18" x2="20" y2="40" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 2" />
    <line x1="28" y1="18" x2="28" y2="40" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 2" />
    <line x1="36" y1="18" x2="36" y2="40" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 2" />
    <line x1="44" y1="18" x2="44" y2="40" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 2" />

    {/* 3D Rolled Tube Cylinder at bottom */}
    <ellipse cx="18" cy="46" rx="4" ry="7" fill="url(#wpRoll)" stroke="#854D0E" strokeWidth="1" />
    <path d="M18 39H48C50 39 52 42 52 46C52 50 50 53 48 53H18" fill="url(#wpRoll)" stroke="#854D0E" strokeWidth="1" />
  </svg>
);

// 16. False Ceiling Contractor (3D POP Step Ceiling with Recessed LED Cove Lighting)
export const FalseCeiling3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="popCeilingTop" x1="10" y1="10" x2="54" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="coveGlow" x1="16" y1="28" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>

    {/* Primary Architectural Ceiling Slab */}
    <rect x="8" y="10" width="48" height="12" rx="2" fill="url(#popCeilingTop)" stroke="#94A3B8" strokeWidth="1" />

    {/* Secondary Dropped False POP Level (Step-down Cove) */}
    <rect x="14" y="20" width="36" height="14" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" />

    {/* Warm LED Strip Lighting Glow beneath the Cove */}
    <rect x="16" y="32" width="32" height="3" fill="url(#coveGlow)" className="drop-shadow-sm" />

    {/* Recessed Circular COB Spotlights with Beams */}
    <ellipse cx="22" cy="27" r="3" fill="#0F172A" />
    <circle cx="22" cy="27" r="1.5" fill="#FEF08A" />
    <ellipse cx="42" cy="27" r="3" fill="#0F172A" />
    <circle cx="42" cy="27" r="1.5" fill="#FEF08A" />

    {/* Light Beams Radiating Down */}
    <polygon points="20,30 24,30 29,52 15,52" fill="#FEF08A" fillOpacity="0.25" />
    <polygon points="40,30 44,30 49,52 35,52" fill="#FEF08A" fillOpacity="0.25" />
  </svg>
);

// 17. Key Lock Maker (3D Golden Brass Key & Heavy Duty Steel Padlock)
export const KeyLockMaker3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="brassKey" x1="14" y1="14" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="padlockBody" x1="24" y1="28" x2="52" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="steelShackle" x1="28" y1="12" x2="48" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>

    {/* Padlock Steel Shackle */}
    <path
      d="M32 28V19C32 14.5 35.5 11 40 11C44.5 11 48 14.5 48 19V28"
      stroke="url(#steelShackle)"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Padlock Solid Brass Body */}
    <rect x="28" y="26" width="24" height="22" rx="4" fill="url(#padlockBody)" stroke="#78350F" strokeWidth="1" />
    <circle cx="40" cy="35" r="2.5" fill="#1E293B" />
    <polygon points="38.5,35 41.5,35 42,42 38,42" fill="#1E293B" />

    {/* 3D Brass Master Key Crossing in Front */}
    <path
      d="M10 32C10 27.5 13.5 24 18 24C21.5 24 24.5 26.5 25.5 30H38V34H34V38H30V34H25.5C24.5 37.5 21.5 40 18 40C13.5 40 10 36.5 10 32Z"
      fill="url(#brassKey)"
      stroke="#78350F"
      strokeWidth="1"
      className="drop-shadow-md"
    />
    {/* Key Bow Hole */}
    <circle cx="17" cy="32" r="3.5" fill="#1E293B" />
  </svg>
);

// 18. Inverter & Battery Mechanic (3D Tubular Inverter Battery & Voltage Charge Indicator)
export const InverterBattery3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="battBody" x1="12" y1="20" x2="52" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="60%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="battLid" x1="10" y1="14" x2="54" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>

    {/* Red Positive (+) & Black Negative (-) Terminal Posts */}
    <rect x="17" y="10" width="6" height="5" rx="1" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
    <rect x="41" y="10" width="6" height="5" rx="1" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />

    {/* Battery Red Top Cover / Lid */}
    <rect x="10" y="14" width="44" height="8" rx="2.5" fill="url(#battLid)" stroke="#991B1B" strokeWidth="1" />

    {/* Tubular Acid Water Level Indicators (Float Plugs) */}
    <circle cx="21" cy="18" r="1.5" fill="#FFFFFF" />
    <circle cx="28" cy="18" r="1.5" fill="#FFFFFF" />
    <circle cx="36" cy="18" r="1.5" fill="#FFFFFF" />
    <circle cx="43" cy="18" r="1.5" fill="#FFFFFF" />

    {/* Heavy Duty Dark Battery Body */}
    <rect x="11" y="21" width="42" height="33" rx="3.5" fill="url(#battBody)" stroke="#475569" strokeWidth="1.2" />

    {/* Voltage Power Lightning Bolt Graphic */}
    <path
      d="M34 26L26 38H33L30 48L40 36H33L36 26H34Z"
      fill="#FACC15"
      stroke="#CA8A04"
      strokeWidth="0.8"
      className="drop-shadow-sm"
    />

    {/* Front Power Indicator Level Gauge */}
    <rect x="17" y="44" width="30" height="4" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
    <rect x="18" y="45" width="20" height="2" rx="1" fill="#22C55E" />
  </svg>
);

// 19. Carpenter & Woodwork (3D Timber Lumber Log, Hand Saw & Hammer)
export const Carpenter3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="timberGrad" x1="12" y1="32" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="sawBlade" x1="12" y1="12" x2="48" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>

    {/* 3D Timber Wood Plank / Lumber */}
    <path d="M10 38L48 38L54 46L16 46Z" fill="url(#timberGrad)" stroke="#78350F" strokeWidth="1" />
    <path d="M10 38L16 46V51L10 43Z" fill="#78350F" />
    <path d="M16 46L54 46V51L16 51Z" fill="#92400E" />

    {/* Wood Growth Rings Texture */}
    <ellipse cx="13" cy="42" rx="2" ry="3" stroke="#92400E" strokeWidth="0.8" />

    {/* 3D Steel Hand Saw */}
    <polygon points="12,18 42,26 42,32 12,32" fill="url(#sawBlade)" stroke="#475569" strokeWidth="0.8" />
    {/* Saw Serrated Sharp Teeth */}
    <path d="M12 32L14 34L16 32L18 34L20 32L22 34L24 32L26 34L28 32L30 34L32 32L34 34L36 32L38 34L40 32" stroke="#475569" strokeWidth="1" />

    {/* Ergonomic Wooden Saw Handle */}
    <rect x="40" y="20" width="12" height="15" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    <rect x="44" y="24" width="4" height="7" rx="1.5" fill="#1E293B" />

    {/* Claw Hammer Resting Beside */}
    <line x1="22" y1="14" x2="36" y2="40" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    <rect x="18" y="11" width="10" height="6" rx="1.5" transform="rotate(30 18 11)" fill="#64748B" stroke="#334155" strokeWidth="0.8" />
  </svg>
);

// 20. Doorstep Bike Repair (3D Motorbike Motorcycle with Mechanic Service Wrench)
export const BikeRepair3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bikeTank" x1="22" y1="20" x2="42" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>

    {/* Wheels (Front & Rear Rubber Tires) */}
    <circle cx="16" cy="43" r="9" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
    <circle cx="16" cy="43" r="5" fill="#CBD5E1" />
    <circle cx="16" cy="43" r="2" fill="#1E293B" />

    <circle cx="48" cy="43" r="9" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
    <circle cx="48" cy="43" r="5" fill="#CBD5E1" />
    <circle cx="48" cy="43" r="2" fill="#1E293B" />

    {/* Bike Chassis Frame & Engine */}
    <path d="M16 43L28 43L36 34L26 34L16 43Z" fill="#64748B" />
    <path d="M36 34L48 43" stroke="#475569" strokeWidth="2.5" />
    <path d="M26 34L22 22H30" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

    {/* Vibrant Red Fuel Tank & Seat */}
    <path d="M24 24C24 22 28 20 34 20C38 20 42 22 42 24L38 28H22L24 24Z" fill="url(#bikeTank)" stroke="#7F1D1D" strokeWidth="1" />
    <rect x="36" y="24" width="10" height="4" rx="2" fill="#0F172A" />

    {/* Handlebar & Headlight */}
    <line x1="19" y1="18" x2="26" y2="22" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="24" r="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />

    {/* Mechanic Spanner / Wrench for Doorstep Service */}
    <path
      d="M32 8L44 20L40 24L28 12L32 8Z"
      fill="#38BDF8"
      stroke="#0284C7"
      strokeWidth="1"
      className="drop-shadow-md"
    />
  </svg>
);

// 21. Home Tuition / Personal Tutor (3D Stack of Colorful Books & Graduation Mortarboard)
export const HomeTuition3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="book1" x1="12" y1="36" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="book2" x1="14" y1="28" x2="50" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="book3" x1="16" y1="20" x2="48" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>

    {/* Bottom Book (Blue) */}
    <rect x="12" y="44" width="40" height="8" rx="2" fill="url(#book1)" stroke="#1E40AF" strokeWidth="0.8" />
    <rect x="48" y="46" width="3" height="4" fill="#FFFFFF" />

    {/* Middle Book (Emerald Green) */}
    <rect x="15" y="37" width="35" height="8" rx="2" fill="url(#book2)" stroke="#065F46" strokeWidth="0.8" />
    <rect x="46" y="39" width="3" height="4" fill="#FFFFFF" />

    {/* Top Book (Amber/Gold) */}
    <rect x="18" y="30" width="30" height="8" rx="2" fill="url(#book3)" stroke="#92400E" strokeWidth="0.8" />
    <rect x="44" y="32" width="3" height="4" fill="#FFFFFF" />

    {/* Black Academic Graduation Cap (Mortarboard) */}
    <polygon points="32,10 52,17 32,24 12,17" fill="#0F172A" stroke="#334155" strokeWidth="1" />
    <rect x="25" y="20" width="14" height="6" rx="1.5" fill="#1E293B" />

    {/* Golden Tassel & Hanging Cord */}
    <circle cx="32" cy="17" r="1.5" fill="#FDE047" />
    <path d="M32 17L44 22V27" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="44" cy="28" r="1.8" fill="#FACC15" />
  </svg>
);

// 22. Goods Transport / Pickup (Chota Hathi / Tata Ace Mini Cargo Truck 3D)
export const GoodsTransport3DIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chotaHathiCab" x1="10" y1="20" x2="30" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="cargoBox" x1="28" y1="18" x2="56" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="50%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
    </defs>

    {/* Drop Shadow */}
    <ellipse cx="32" cy="52" rx="24" ry="3.5" fill="#0F172A" fillOpacity="0.25" />

    {/* Blue High-Wall Cargo Bed (Tata Ace Freight Container) */}
    <rect x="27" y="20" width="28" height="22" rx="2.5" fill="url(#cargoBox)" stroke="#0369A1" strokeWidth="1" />
    {/* Cargo Bed Ribs / Slats */}
    <line x1="34" y1="20" x2="34" y2="42" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
    <line x1="42" y1="20" x2="42" y2="42" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
    <line x1="50" y1="20" x2="50" y2="42" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />

    {/* White Driver Cabin (Iconic Indian Chota Hathi Front) */}
    <path
      d="M10 34L14 22C14.5 21 16 20 18 20H28V44H10V34Z"
      fill="url(#chotaHathiCab)"
      stroke="#64748B"
      strokeWidth="1.2"
    />

    {/* Windshield Glass */}
    <path d="M15 23L17 32H27V23H15Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.8" />
    {/* Headlight */}
    <rect x="9" y="38" width="3.5" height="3" rx="1" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.6" />
    {/* Front Bumper */}
    <rect x="8" y="42" width="6" height="3" rx="1" fill="#1E293B" />

    {/* Heavy Truck Wheels & Hubs */}
    <circle cx="18" cy="46" r="6" fill="#1E293B" stroke="#475569" strokeWidth="1" />
    <circle cx="18" cy="46" r="3" fill="#E2E8F0" />
    <circle cx="46" cy="46" r="6" fill="#1E293B" stroke="#475569" strokeWidth="1" />
    <circle cx="46" cy="46" r="3" fill="#E2E8F0" />
  </svg>
);
