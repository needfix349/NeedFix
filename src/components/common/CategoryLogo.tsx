import React from 'react';

interface CategoryLogoProps {
  categoryId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CategoryLogo: React.FC<CategoryLogoProps> = ({
  categoryId,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  switch (categoryId) {
    // 1. AC Technician
    case 'ac-technician':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* AC Unit Body */}
            <rect x="4" y="10" width="40" height="20" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
            {/* Vent Louvers */}
            <rect x="8" y="23" width="32" height="3" rx="1" fill="#0284C7" />
            <circle cx="38" cy="15" r="2" fill="#10B981" />
            <line x1="32" y1="15" x2="35" y2="15" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
            {/* Cold Air Waves */}
            <path d="M12 33C12 37 14 39 17 39" stroke="#E0F2FE" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 33C24 38 24 41 24 43" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M36 33C36 37 34 39 31 39" stroke="#E0F2FE" strokeWidth="2.5" strokeLinecap="round" />
            {/* Snowflake Accent */}
            <path d="M24 13V19M21 16H27M22 14L26 18M26 14L22 18" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 2. Electrician
    case 'electrician':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Lightbulb outline */}
            <path d="M24 6C16.82 6 11 11.82 11 19C11 23.48 13.27 27.42 16.74 29.77C17.5 30.29 18 31.14 18 32.06V34C18 35.1 18.9 36 20 36H28C29.1 36 30 35.1 30 34V32.06C30 31.14 30.5 30.29 31.26 29.77C34.73 27.42 37 23.48 37 19C37 11.82 31.18 6 24 6Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" />
            {/* Base & Thread */}
            <rect x="20" y="36" width="8" height="3" rx="1" fill="#F59E0B" />
            <path d="M22 39C22 41 26 41 26 39" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            {/* High Voltage Lightning Bolt */}
            <path d="M26 13L19 23H25L22 30L30 19H24L26 13Z" fill="#D97706" stroke="#92400E" strokeWidth="1" strokeLinejoin="round" />
            {/* Sparks */}
            <line x1="24" y1="2" x2="24" y2="4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="12" x2="10" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="12" x2="38" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 3. CCTV & Security
    case 'cctv-security':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-950 text-white shadow-md shadow-indigo-900/30 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Shield Background */}
            <path d="M24 4L38 9V20C38 30.5 32 39 24 44C16 39 10 30.5 10 20V9L24 4Z" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2" />
            {/* CCTV Camera Unit */}
            <path d="M16 17H30L34 23H18L16 17Z" fill="#E0E7FF" stroke="#4338CA" strokeWidth="1.5" />
            <rect x="18" y="23" width="16" height="8" rx="2" fill="#FFFFFF" stroke="#4338CA" strokeWidth="1.5" />
            {/* Camera Lens */}
            <circle cx="26" cy="27" r="3" fill="#1E1B4B" />
            <circle cx="26" cy="27" r="1.5" fill="#38BDF8" />
            {/* Recording Red Dot */}
            <circle cx="31" cy="25" r="1" fill="#EF4444" />
            {/* Mounting Arm */}
            <path d="M16 19L12 21V25" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 4. Plumber
    case 'plumber':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-teal-500 text-white shadow-md shadow-sky-600/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Water Pipe System */}
            <path d="M6 14H18V26H14V38H22" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Water Faucet Tap */}
            <rect x="22" y="10" width="12" height="6" rx="1" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
            <path d="M28 6V10M24 6H32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M34 13H38C39.1 13 40 13.9 40 15V18C40 19.1 39.1 20 38 20H36V22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pipe Wrench */}
            <path d="M16 38L32 22L36 26L20 42L16 38Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            <rect x="30" y="20" width="8" height="6" rx="1" transform="rotate(-45 30 20)" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
            {/* Sparkling Droplet */}
            <path d="M36 27C36 27 40 31 40 33C40 35.2 38.2 37 36 37C33.8 37 32 35.2 32 33C32 31 36 27 36 27Z" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
          </svg>
        </div>
      );

    // 5. Home Appliance Technician
    case 'home-appliance':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Washing Machine Cabinet */}
            <rect x="8" y="8" width="32" height="34" rx="4" fill="#FFFFFF" stroke="#4338CA" strokeWidth="2" />
            {/* Top Control Panel */}
            <line x1="8" y1="16" x2="40" y2="16" stroke="#C7D2FE" strokeWidth="1.5" />
            <circle cx="14" cy="12" r="2" fill="#4F46E5" />
            <circle cx="20" cy="12" r="1.5" fill="#10B981" />
            <rect x="28" y="10.5" width="8" height="3" rx="1" fill="#312E81" />
            {/* Drum Glass Door */}
            <circle cx="24" cy="28" r="10" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
            <circle cx="24" cy="28" r="6" stroke="#818CF8" strokeWidth="2" strokeDasharray="4 2" />
            {/* Water Ripple inside */}
            <path d="M20 28C22 26 24 30 26 28" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 6. Taxi & Cab Service
    case 'taxi-cab-service':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-600 text-slate-900 shadow-md shadow-amber-500/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Taxi Top Roof Light */}
            <rect x="18" y="7" width="12" height="5" rx="1.5" fill="#1E293B" stroke="#000000" strokeWidth="1" />
            <rect x="20" y="8.5" width="8" height="2" fill="#FDE047" />
            {/* Car Roof & Windshield */}
            <path d="M12 21L16 13H32L36 21H12Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
            {/* Car Main Body */}
            <rect x="7" y="21" width="34" height="15" rx="4" fill="#FACC15" stroke="#854D0E" strokeWidth="2" />
            {/* Checkered Taxi Stripe */}
            <rect x="10" y="24" width="4" height="3" fill="#000000" />
            <rect x="18" y="24" width="4" height="3" fill="#000000" />
            <rect x="26" y="24" width="4" height="3" fill="#000000" />
            <rect x="34" y="24" width="4" height="3" fill="#000000" />
            {/* Headlights */}
            <circle cx="12" cy="29" r="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="36" cy="29" r="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
            {/* Front Grill */}
            <rect x="18" y="29" width="12" height="4" rx="1" fill="#1E293B" />
            {/* Wheels */}
            <rect x="10" y="36" width="6" height="4" rx="1" fill="#0F172A" />
            <rect x="32" y="36" width="6" height="4" rx="1" fill="#0F172A" />
          </svg>
        </div>
      );

    // 7. Tile & Marble Layer
    case 'tile-marble-layer':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-stone-600 via-stone-700 to-slate-800 text-white shadow-md shadow-stone-700/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Marble Floor Tiles (Diamond Grid) */}
            <path d="M24 6L38 16L24 26L10 16L24 6Z" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="1.5" />
            {/* Marble Veins */}
            <path d="M16 14C20 18 24 12 28 17" stroke="#A8A29E" strokeWidth="1" strokeLinecap="round" />
            <path d="M24 26L38 36L24 46L10 36L24 26Z" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="1.5" />
            {/* Side Tiles */}
            <path d="M10 16L24 26L10 36L4 26L10 16Z" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="1" />
            <path d="M38 16L44 26L38 36L24 26L38 16Z" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="1" />
            {/* Trowel Tool */}
            <path d="M28 20L36 28L33 31L25 23L28 20Z" fill="#F97316" stroke="#C2410C" strokeWidth="1" />
            <line x1="33" y1="31" x2="38" y2="36" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 8. Interior Designer
    case 'interior-designer':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white shadow-md shadow-teal-700/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Floor Lamp */}
            <line x1="12" y1="12" x2="12" y2="38" stroke="#FDE68A" strokeWidth="1.5" />
            <path d="M8 12H16L14 7H10L8 12Z" fill="#F59E0B" />
            <line x1="8" y1="38" x2="16" y2="38" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
            {/* Modern Living Room Sofa */}
            <rect x="18" y="24" width="24" height="10" rx="3" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
            {/* Sofa Back Cushions */}
            <rect x="18" y="16" width="11" height="9" rx="2" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
            <rect x="30" y="16" width="12" height="9" rx="2" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
            {/* Sofa Legs */}
            <line x1="21" y1="34" x2="20" y2="38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            <line x1="39" y1="34" x2="40" y2="38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            {/* Interior Design Sparkle */}
            <path d="M36 8L37.5 11.5L41 13L37.5 14.5L36 18L34.5 14.5L31 13L34.5 11.5L36 8Z" fill="#FBBF24" />
          </svg>
        </div>
      );

    // 9. Aluminum Fabricator
    case 'aluminum-fabricator':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 via-zinc-700 to-slate-800 text-white shadow-md shadow-zinc-700/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Heavy Aluminum Section */}
            <rect x="8" y="8" width="32" height="32" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
            {/* Inner Sliding Window Panes */}
            <rect x="11" y="11" width="13" height="26" fill="#93C5FD" stroke="#64748B" strokeWidth="1.5" />
            <rect x="24" y="11" width="13" height="26" fill="#BAE6FD" stroke="#64748B" strokeWidth="1.5" />
            {/* Glass Glint */}
            <line x1="14" y1="14" x2="19" y2="24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="27" y1="14" x2="32" y2="24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            {/* Metal Saw / Cutter Blade */}
            <circle cx="36" cy="36" r="6" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            <line x1="36" y1="36" x2="42" y2="42" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 10. Glass Technician
    case 'glass-technician':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 text-white shadow-md shadow-sky-500/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Frameless Glass Sheet */}
            <path d="M10 8L34 6L38 38L14 40L10 8Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" fillOpacity="0.85" />
            {/* Reflection Diagonal Bevel Lines */}
            <line x1="16" y1="12" x2="28" y2="34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="10" x2="33" y2="32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            {/* Glass Suction Cup Lifter */}
            <ellipse cx="20" cy="25" rx="5" ry="3" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            <path d="M20 22V17M16 17H24" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            {/* Crystal Sparkles */}
            <path d="M38 12L39 14.5L41.5 15.5L39 16.5L38 19L37 16.5L34.5 15.5L37 14.5L38 12Z" fill="#FFFFFF" />
            <path d="M8 28L8.8 30L31 30.8L8.8 31.6L8 33.6L7.2 31.6L5 30.8L7.2 30L8 28Z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    // 11. Painter
    case 'painter':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 text-white shadow-md shadow-rose-500/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Paint Swatch on Wall */}
            <rect x="6" y="8" width="24" height="16" rx="2" fill="#38BDF8" />
            {/* Paint Roller Cylinder */}
            <rect x="18" y="12" width="22" height="9" rx="3" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />
            {/* Roller Metal Arm & Handle */}
            <path d="M40 16.5H44V28H32V36" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="30" y="36" width="4" height="8" rx="1" fill="#78350F" stroke="#451A03" strokeWidth="1" />
            {/* Paint Drips */}
            <path d="M10 24C10 26 12 28 12 30C12 31 11 32 10 32C9 32 8 31 8 30C8 28 10 26 10 24Z" fill="#38BDF8" />
            <path d="M18 24C18 27 20 29 20 31C20 32 19 33 18 33C17 33 16 32 16 31C16 29 18 27 18 24Z" fill="#38BDF8" />
          </svg>
        </div>
      );

    // 12. Mehndi Artist
    case 'mehndi-artist':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-700 via-orange-800 to-amber-950 text-white shadow-md shadow-amber-800/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Mandala Flower Motif */}
            <circle cx="24" cy="24" r="5" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="2" fill="#FDE68A" />
            {/* Mandala Petals */}
            <circle cx="24" cy="14" r="3" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
            <circle cx="24" cy="34" r="3" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
            <circle cx="14" cy="24" r="3" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
            <circle cx="34" cy="24" r="3" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
            <circle cx="17" cy="17" r="2.5" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />
            <circle cx="31" cy="17" r="2.5" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />
            <circle cx="17" cy="31" r="2.5" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />
            <circle cx="31" cy="31" r="2.5" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />
            {/* Mehndi Cone */}
            <path d="M38 6L44 10L32 26L30 24L38 6Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
            <line x1="30" y1="24" x2="27" y2="27" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 13. Makeup Artist
    case 'makeup-artist':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white shadow-md shadow-pink-500/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Lipstick */}
            <rect x="8" y="24" width="8" height="16" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
            <rect x="9" y="18" width="6" height="6" fill="#F43F5E" />
            <path d="M9 18L15 13V18H9Z" fill="#E11D48" />
            {/* Makeup Brush */}
            <path d="M28 26L38 38L35 41L25 29L28 26Z" fill="#78350F" stroke="#451A03" strokeWidth="1" />
            <rect x="23" y="23" width="6" height="6" transform="rotate(45 23 23)" fill="#FCD34D" />
            {/* Brush Bristles with Powder Flare */}
            <path d="M19 19C16 16 18 10 24 12C26 14 22 22 19 19Z" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
            {/* Compact Powder Mirror */}
            <circle cx="36" cy="16" r="7" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1.5" />
            <circle cx="36" cy="16" r="4.5" fill="#FBCFE8" />
          </svg>
        </div>
      );

    // 14. Marriage Hall / Event Decorator
    case 'event-decorator':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-md shadow-purple-600/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Floral Wedding Arch / Mandap */}
            <path d="M10 40V20C10 12 16 6 24 6C32 6 38 12 38 20V40" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
            {/* Drapery Curves */}
            <path d="M10 20C14 26 20 28 24 20C28 28 34 26 38 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Hanging Floral Garlands */}
            <circle cx="16" cy="24" r="2" fill="#F43F5E" />
            <circle cx="24" cy="18" r="2.5" fill="#FB923C" />
            <circle cx="32" cy="24" r="2" fill="#F43F5E" />
            {/* Pillars */}
            <rect x="8" y="38" width="6" height="3" rx="1" fill="#FDE047" />
            <rect x="34" y="38" width="6" height="3" rx="1" fill="#FDE047" />
            {/* Celebration Sparkles */}
            <path d="M24 28L25 31L28 32L25 33L24 36L23 33L20 32L23 31L24 28Z" fill="#FDE047" />
          </svg>
        </div>
      );

    // 15. Wallpaper & Panel Installer
    case 'wallpaper-panel-installer':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 text-white shadow-md shadow-teal-600/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Wall Panels (Fluted Louvers) */}
            <rect x="6" y="8" width="5" height="32" rx="1" fill="#CCFBF1" stroke="#0F766E" strokeWidth="1" />
            <rect x="13" y="8" width="5" height="32" rx="1" fill="#99F6E4" stroke="#0F766E" strokeWidth="1" />
            <rect x="20" y="8" width="5" height="32" rx="1" fill="#5EEAD4" stroke="#0F766E" strokeWidth="1" />
            {/* Unrolling Wallpaper Roll */}
            <path d="M27 8H40C41.1 8 42 8.9 42 10V28C42 29.1 41.1 30 40 30H30C28.3 30 27 31.3 27 33V8Z" fill="#FDF4FF" stroke="#A21CAF" strokeWidth="1.5" />
            {/* Wallpaper Geometric Pattern */}
            <path d="M31 14L35 18L39 14" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M31 22L35 26L39 22" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
            {/* Bottom Roll Cylinder */}
            <ellipse cx="32" cy="35" rx="5" ry="3" fill="#D946EF" stroke="#86198F" strokeWidth="1" />
          </svg>
        </div>
      );

    // 16. False Ceiling Contractor
    case 'false-ceiling-contractor':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 via-yellow-600 to-stone-700 text-white shadow-md shadow-amber-600/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Ceiling Step */}
            <rect x="6" y="8" width="36" height="32" rx="2" fill="#F5F5F4" stroke="#78716C" strokeWidth="2" />
            {/* Recessed Cove Step (POP Ceiling) */}
            <rect x="12" y="14" width="24" height="20" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Ambient LED Glow Lines */}
            <line x1="14" y1="16" x2="34" y2="16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="32" x2="34" y2="32" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            {/* Recessed Spotlight Downlights */}
            <circle cx="18" cy="24" r="2.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="30" cy="24" r="2.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            {/* Light Rays */}
            <path d="M18 27L16 31M30 27L32 31" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 17. Key Lock maker
    case 'key-lock-maker':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 via-zinc-800 to-amber-700 text-white shadow-md shadow-zinc-800/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Master Padlock Body */}
            <rect x="10" y="20" width="20" height="20" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            {/* Shackle */}
            <path d="M14 20V14C14 10.7 16.7 8 20 8C23.3 8 26 10.7 26 14V20" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" />
            {/* Keyhole */}
            <circle cx="20" cy="28" r="2.5" fill="#451A03" />
            <path d="M19 28L18 34H22L21 28" fill="#451A03" />
            {/* Brass Computerized Key */}
            <circle cx="36" cy="14" r="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="36" cy="14" r="2" fill="#78350F" />
            <path d="M36 19V38L32 40V37L35 34V29L32 27V24L36 21" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    // 18. Inverter & Battery Mechanic
    case 'inverter-battery-mechanic':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 text-white shadow-md shadow-amber-600/30 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Inverter Body */}
            <rect x="6" y="8" width="36" height="20" rx="3" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
            {/* Digital Display */}
            <rect x="11" y="13" width="14" height="7" rx="1.5" fill="#0F172A" />
            <path d="M13 16.5H16M13 18.5H18" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="21.5" cy="16.5" r="1" fill="#10B981" />
            {/* Power LED & Switch */}
            <circle cx="31" cy="16" r="2" fill="#22C55E" />
            <circle cx="36" cy="16" r="2" fill="#EF4444" />
            {/* Vent slots */}
            <line x1="12" y1="24" x2="36" y2="24" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            {/* Tubular Battery Container */}
            <rect x="10" y="31" width="28" height="13" rx="2" fill="#334155" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Battery Terminals */}
            <rect x="14" y="29" width="4" height="2" fill="#EF4444" />
            <rect x="30" y="29" width="4" height="2" fill="#0284C7" />
            <line x1="15" y1="35" x2="17" y2="35" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="34" x2="16" y2="36" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="31" y1="35" x2="33" y2="35" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Fast Charging Lightning Bolt */}
            <path d="M25 29L22 36H26L23 42L28 35H24L25 29Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
          </svg>
        </div>
      );

    // 19. Carpenter & Woodwork
    case 'carpenter-woodwork':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-white shadow-md shadow-amber-900/30 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Wooden Timber Beam */}
            <rect x="6" y="30" width="36" height="12" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
            <line x1="10" y1="34" x2="38" y2="34" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
            <line x1="12" y1="38" x2="34" y2="38" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
            {/* Traditional Handsaw Blade */}
            <path d="M8 12L32 20L32 26L8 16Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
            {/* Saw Teeth */}
            <path d="M12 17L14 19L16 18L18 20L20 19L22 21L24 20L26 22L28 21L30 23" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
            {/* Wooden Saw Handle */}
            <path d="M30 18C34 18 38 20 38 24C38 28 34 30 30 30V26C32 26 34 25 34 24C34 23 32 22 30 22V18Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="34" cy="24" r="1.5" fill="#78350F" />
            {/* Hammer Accent Cross */}
            <path d="M12 8L16 12L10 18L6 14Z" fill="#94A3B8" stroke="#334155" strokeWidth="1" />
            <rect x="13" y="11" width="18" height="3" rx="1" transform="rotate(45 13 11)" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
          </svg>
        </div>
      );

    // 20. Doorstep Bike Repair
    case 'doorstep-bike-repair':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-amber-700 text-white shadow-md shadow-orange-600/30 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Bike Front Wheel */}
            <circle cx="12" cy="32" r="8" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="12" cy="32" r="3" fill="#FFFFFF" />
            {/* Bike Rear Wheel */}
            <circle cx="36" cy="32" r="8" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="36" cy="32" r="3" fill="#FFFFFF" />
            {/* Bike Frame & Fuel Tank */}
            <path d="M12 32L20 20L28 20L36 32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 20L24 32H36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Handlebar & Headlamp */}
            <path d="M18 14L20 20M16 14H22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="15" cy="18" r="2" fill="#FEF08A" />
            {/* Seat */}
            <path d="M24 18H31" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
            {/* Doorstep Mechanic Wrench */}
            <path d="M28 8L38 18L35 21L25 11Z" fill="#F1F5F9" stroke="#334155" strokeWidth="1" />
            <circle cx="37" cy="19.5" r="1.5" fill="#334155" />
          </svg>
        </div>
      );

    // 21. Home Tuition / Personal Tutor
    case 'home-tuition':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Mortarboard Graduation Cap */}
            <path d="M24 8L6 18L24 28L42 18L24 8Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M14 23.5V34C14 36.5 18.5 40 24 40C29.5 40 34 36.5 34 34V23.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            {/* Tassel */}
            <path d="M38 20V32" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
            <circle cx="38" cy="33" r="2" fill="#FDE047" />
            {/* Open Book Pages */}
            <path d="M16 34C19 32 24 32 24 35C24 32 29 32 32 34" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 22. Goods Transport / Pickup (Chota Hathi)
    case 'goods-transport':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md shadow-teal-600/25 p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Tata Ace / Chota Hathi Cabin */}
            <path d="M28 14H36L42 22V34H28V14Z" fill="#FFFFFF" stroke="#0F766E" strokeWidth="1.5" />
            {/* Windshield */}
            <path d="M30 17H35L39 23H30V17Z" fill="#38BDF8" />
            {/* Cargo Bed Container */}
            <rect x="6" y="16" width="22" height="18" rx="2" fill="#F1F5F9" stroke="#0F766E" strokeWidth="2" />
            {/* Cargo Stripes / Tie-down Ribs */}
            <line x1="12" y1="18" x2="12" y2="32" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="18" x2="18" y2="32" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="18" x2="24" y2="32" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            {/* Front & Rear Wheels */}
            <circle cx="14" cy="34" r="5" fill="#1E293B" stroke="#F8FAFC" strokeWidth="1.5" />
            <circle cx="14" cy="34" r="2" fill="#94A3B8" />
            <circle cx="36" cy="34" r="5" fill="#1E293B" stroke="#F8FAFC" strokeWidth="1.5" />
            <circle cx="36" cy="34" r="2" fill="#94A3B8" />
            {/* Headlight */}
            <rect x="40" y="27" width="3" height="3" rx="0.5" fill="#FDE047" />
          </svg>
        </div>
      );

    // Default Fallback Logo
    default:
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md p-1.5 ${currentSizeClass} ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="32" height="32" rx="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M16 24H32M24 16V32" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
};
