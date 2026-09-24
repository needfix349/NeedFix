import React from 'react';
import {
  AcTechnician3DIcon,
  Electrician3DIcon,
  Cctv3DIcon,
  Plumber3DIcon,
  HomeAppliance3DIcon,
  TaxiCab3DIcon,
  TileMarble3DIcon,
  InteriorDesigner3DIcon,
  AluminumFabricator3DIcon,
  GlassTechnician3DIcon,
  Painter3DIcon,
  MehndiArtist3DIcon,
  MakeupArtist3DIcon,
  EventDecorator3DIcon,
  WallpaperPanel3DIcon,
  FalseCeiling3DIcon,
  KeyLockMaker3DIcon,
  InverterBattery3DIcon,
  Carpenter3DIcon,
  BikeRepair3DIcon,
  HomeTuition3DIcon,
  GoodsTransport3DIcon,
  CleanerMaid3DIcon,
  BabysitterNurse3DIcon,
  PackersMoversHelper3DIcon,
} from './category3DIcons';
import { Wrench } from 'lucide-react';

interface CategoryLogoProps {
  categoryId: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CategoryLogo: React.FC<CategoryLogoProps> = ({
  categoryId,
  className = '',
  size = 'md',
}) => {
  const sizeClasses: Record<string, { container: string; inner: string; padding: string }> = {
    xs: { container: 'w-6 h-6 rounded-lg p-0.5', inner: 'rounded-[6px]', padding: 'p-0.5' },
    sm: { container: 'w-10 h-10 rounded-xl p-1', inner: 'rounded-[9px]', padding: 'p-1' },
    md: { container: 'w-14 h-14 rounded-2xl p-1.5', inner: 'rounded-[12px]', padding: 'p-1.5' },
    lg: { container: 'w-16 h-16 rounded-2xl p-2', inner: 'rounded-[13px]', padding: 'p-2' },
    xl: { container: 'w-20 h-20 rounded-3xl p-2.5', inner: 'rounded-[18px]', padding: 'p-2' },
  };

  const currentConfig = sizeClasses[size] || sizeClasses.md;

  // Render fancy standard badge with specular highlights, rich colored shadows & high-contrast stage
  const renderBadge = (
    gradientClass: string,
    borderClass: string,
    shadowClass: string,
    title: string,
    IconComponent: React.FC<{ className?: string }>
  ) => {
    // If className specifies explicit width/height (e.g. w-8 h-8), let it take precedence
    const hasExplicitDimensions = /\b(w-|h-)\S+/.test(className);
    const containerClasses = hasExplicitDimensions ? className : `${currentConfig.container} ${className}`;

    return (
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br ${gradientClass} ${borderClass} ${shadowClass} shadow-md shrink-0 transition-transform duration-200 overflow-hidden ${containerClasses}`}
        title={title}
      >
        {/* Specular 3D Gloss Highlight on Top Rim */}
        <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-xl" />

        {/* Elevated Pristine Inner Stage: Crystal-clear contrast for 3D graphics */}
        <div
          className={`w-full h-full bg-white/95 backdrop-blur-xs flex items-center justify-center overflow-hidden shadow-xs ring-1 ring-black/5 ${currentConfig.inner} ${currentConfig.padding}`}
        >
          <IconComponent className="w-full h-full drop-shadow-xs transition-transform duration-200" />
        </div>
      </div>
    );
  };

  switch (categoryId) {
    // 1. AC Technician & Gas Refill
    case 'ac-technician':
    case 'ac':
      return renderBadge(
        'from-sky-400 via-blue-500 to-indigo-600',
        'border border-sky-300/60',
        'shadow-sky-500/25',
        'AC Technician & Cooling',
        AcTechnician3DIcon
      );

    // 2. Electrician & Wiring
    case 'electrician':
      return renderBadge(
        'from-amber-400 via-yellow-500 to-orange-500',
        'border border-amber-300/60',
        'shadow-amber-500/25',
        'Electrician & Wiring',
        Electrician3DIcon
      );

    // 3. CCTV & Security Installer
    case 'cctv-security':
    case 'cctv':
      return renderBadge(
        'from-slate-700 via-slate-900 to-indigo-950',
        'border border-slate-600/60',
        'shadow-slate-800/30',
        'CCTV & Security Camera',
        Cctv3DIcon
      );

    // 4. Plumber & Water Motor
    case 'plumber':
      return renderBadge(
        'from-cyan-400 via-blue-600 to-teal-700',
        'border border-cyan-300/60',
        'shadow-cyan-500/25',
        'Plumber & Water Motor',
        Plumber3DIcon
      );

    // 5. Home Appliance Repair
    case 'home-appliance':
    case 'appliance':
      return renderBadge(
        'from-indigo-500 via-purple-600 to-slate-900',
        'border border-indigo-400/60',
        'shadow-indigo-500/25',
        'Home Appliance Repair',
        HomeAppliance3DIcon
      );

    // 6. Taxi Driver & Cab Service
    case 'taxi-cab-service':
    case 'taxi':
    case 'cab':
      return renderBadge(
        'from-amber-400 via-yellow-400 to-amber-500',
        'border border-amber-300/80',
        'shadow-amber-500/30',
        'Taxi Driver & Cab Service',
        TaxiCab3DIcon
      );

    // 7. Tile & Marble Layer
    case 'tile-marble-layer':
    case 'tile':
    case 'marble':
      return renderBadge(
        'from-teal-500 via-emerald-600 to-slate-800',
        'border border-teal-400/60',
        'shadow-teal-500/25',
        'Tile & Marble Layer',
        TileMarble3DIcon
      );

    // 8. Interior Designer
    case 'interior-designer':
    case 'interior':
      return renderBadge(
        'from-rose-500 via-pink-600 to-purple-800',
        'border border-rose-400/60',
        'shadow-rose-500/25',
        'Interior Designer',
        InteriorDesigner3DIcon
      );

    // 9. Aluminum Fabricator
    case 'aluminum-fabricator':
    case 'aluminum':
      return renderBadge(
        'from-slate-500 via-slate-600 to-zinc-800',
        'border border-slate-400/60',
        'shadow-slate-600/25',
        'Aluminum Fabricator',
        AluminumFabricator3DIcon
      );

    // 10. Glass Technician
    case 'glass-technician':
    case 'glass':
      return renderBadge(
        'from-sky-400 via-teal-400 to-blue-600',
        'border border-sky-300/60',
        'shadow-sky-500/25',
        'Glass Technician',
        GlassTechnician3DIcon
      );

    // 11. Painter
    case 'painter':
      return renderBadge(
        'from-fuchsia-500 via-purple-600 to-indigo-700',
        'border border-purple-400/60',
        'shadow-purple-500/25',
        'Painter & Wall Decor',
        Painter3DIcon
      );

    // 12. Mehndi Artist
    case 'mehndi-artist':
    case 'mehndi':
      return renderBadge(
        'from-emerald-500 via-green-600 to-teal-800',
        'border border-emerald-400/60',
        'shadow-emerald-600/25',
        'Mehndi Artist',
        MehndiArtist3DIcon
      );

    // 13. Makeup Artist
    case 'makeup-artist':
    case 'makeup':
      return renderBadge(
        'from-pink-400 via-rose-500 to-red-600',
        'border border-pink-300/60',
        'shadow-pink-500/25',
        'Makeup Artist & Beautician',
        MakeupArtist3DIcon
      );

    // 14. Marriage Hall & Event Decorator
    case 'event-decorator':
    case 'decorator':
      return renderBadge(
        'from-orange-400 via-rose-500 to-purple-600',
        'border border-orange-300/60',
        'shadow-orange-500/25',
        'Event Decorator & Marriage Hall',
        EventDecorator3DIcon
      );

    // 15. Wallpaper & Panel Installer
    case 'wallpaper-panel-installer':
    case 'wallpaper':
      return renderBadge(
        'from-amber-500 via-yellow-600 to-stone-800',
        'border border-amber-400/60',
        'shadow-amber-500/25',
        'Wallpaper & Panel Installer',
        WallpaperPanel3DIcon
      );

    // 16. False Ceiling Contractor
    case 'false-ceiling-contractor':
    case 'ceiling':
      return renderBadge(
        'from-amber-500 via-slate-800 to-zinc-950',
        'border border-amber-400/60',
        'shadow-slate-700/25',
        'False Ceiling Contractor',
        FalseCeiling3DIcon
      );

    // 17. Key Lock Maker
    case 'key-lock-maker':
    case 'locksmith':
      return renderBadge(
        'from-amber-400 via-yellow-500 to-amber-700',
        'border border-amber-300/60',
        'shadow-amber-500/25',
        'Key Lock Maker',
        KeyLockMaker3DIcon
      );

    // 18. Inverter & Battery Mechanic
    case 'inverter-battery-mechanic':
    case 'battery':
      return renderBadge(
        'from-red-500 via-orange-600 to-slate-900',
        'border border-red-400/60',
        'shadow-red-600/25',
        'Inverter & Battery Mechanic',
        InverterBattery3DIcon
      );

    // 19. Carpenter & Woodwork
    case 'carpenter-woodwork':
    case 'carpenter':
      return renderBadge(
        'from-amber-700 via-amber-800 to-stone-900',
        'border border-amber-600/60',
        'shadow-amber-800/25',
        'Carpenter & Woodwork',
        Carpenter3DIcon
      );

    // 20. Doorstep Bike Repair
    case 'doorstep-bike-repair':
    case 'bike':
      return renderBadge(
        'from-red-500 via-rose-600 to-zinc-900',
        'border border-red-400/60',
        'shadow-red-500/25',
        'Doorstep Bike Repair',
        BikeRepair3DIcon
      );

    // 21. Home Tuition / Personal Tutor
    case 'home-tuition':
    case 'tuition':
      return renderBadge(
        'from-blue-500 via-indigo-600 to-slate-900',
        'border border-blue-400/60',
        'shadow-blue-500/25',
        'Home Tuition & Personal Tutor',
        HomeTuition3DIcon
      );

    // 22. Goods Transport / Pickup (Chota Hathi)
    case 'goods-transport':
    case 'transport':
    case 'chota-hathi':
      return renderBadge(
        'from-cyan-500 via-teal-600 to-blue-900',
        'border border-cyan-400/60',
        'shadow-cyan-600/25',
        'Goods Transport & Logistics',
        GoodsTransport3DIcon
      );

    // 23. Cleaner / Maid
    case 'cleaner-maid':
    case 'cleaner':
    case 'maid':
      return renderBadge(
        'from-teal-400 via-cyan-500 to-blue-600',
        'border border-teal-300/60',
        'shadow-teal-500/25',
        'Cleaner & Maid Service',
        CleanerMaid3DIcon
      );

    // 24. Babysitter / Nurse
    case 'babysitter-nurse':
    case 'babysitter':
    case 'nurse':
      return renderBadge(
        'from-rose-400 via-pink-500 to-rose-600',
        'border border-rose-300/60',
        'shadow-rose-500/25',
        'Babysitter & Caretaker',
        BabysitterNurse3DIcon
      );

    // 25. Packers & Movers Helper
    case 'packers-movers-helper':
    case 'packers-movers':
    case 'movers':
    case 'packers':
      return renderBadge(
        'from-amber-600 via-yellow-700 to-stone-800',
        'border border-amber-500/60',
        'shadow-amber-600/25',
        'Packers & Movers Helper',
        PackersMoversHelper3DIcon
      );

    default:
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md border border-blue-400/50 shrink-0 overflow-hidden ${currentConfig.container} ${className}`}
        >
          <div
            className={`w-full h-full bg-white/95 backdrop-blur-xs flex items-center justify-center overflow-hidden shadow-xs ring-1 ring-black/5 ${currentConfig.inner} ${currentConfig.padding}`}
          >
            <Wrench className="w-full h-full p-1 text-blue-600" />
          </div>
        </div>
      );
  }
};
