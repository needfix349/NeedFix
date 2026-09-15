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
  const sizeClasses = {
    xs: 'w-5 h-5 rounded-md p-0.5',
    sm: 'w-8 h-8 rounded-xl p-1',
    md: 'w-11 h-11 rounded-2xl p-1.5',
    lg: 'w-16 h-16 rounded-2xl p-2',
    xl: 'w-20 h-20 rounded-3xl p-2.5',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  switch (categoryId) {
    // 1. AC Technician & Gas Refill (3D Air Conditioner Unit)
    case 'ac-technician':
    case 'ac':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 text-white shadow-md shadow-cyan-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="AC Technician (Air Conditioner 3D)"
        >
          <AcTechnician3DIcon />
        </div>
      );

    // 2. Electrician & Wiring (3D Plug, Socket & High Voltage Spark)
    case 'electrician':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Electrician & Wiring 3D"
        >
          <Electrician3DIcon />
        </div>
      );

    // 3. CCTV & Security Installer (3D Security Surveillance Camera)
    case 'cctv-security':
    case 'cctv':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-700 text-white shadow-md shadow-indigo-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="CCTV & Security Camera 3D"
        >
          <Cctv3DIcon />
        </div>
      );

    // 4. Plumber & Water Motor (3D Chrome Tap Faucet & Droplet)
    case 'plumber':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-600 to-teal-700 text-white shadow-md shadow-blue-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Plumber & Water Motor 3D"
        >
          <Plumber3DIcon />
        </div>
      );

    // 5. Home Appliance Repair (3D Washing Machine with Round Drum)
    case 'home-appliance':
    case 'appliance':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 text-white shadow-md shadow-slate-700/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Home Appliance Washing Machine 3D"
        >
          <HomeAppliance3DIcon />
        </div>
      );

    // 6. Taxi Driver & Cab Service (3D Yellow Taxi Cab)
    case 'taxi-cab-service':
    case 'taxi':
    case 'cab':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Taxi Driver & Cab 3D"
        >
          <TaxiCab3DIcon />
        </div>
      );

    // 7. Tile & Marble Layer (3D Polished Marble & Floor Tiles)
    case 'tile-marble-layer':
    case 'tile':
    case 'marble':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-800 text-white shadow-md shadow-teal-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Tile & Marble 3D"
        >
          <TileMarble3DIcon />
        </div>
      );

    // 8. Interior Designer (3D Luxury Lounge Sofa)
    case 'interior-designer':
    case 'interior':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 text-white shadow-md shadow-rose-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Interior Designer Sofa 3D"
        >
          <InteriorDesigner3DIcon />
        </div>
      );

    // 9. Aluminum Fabricator (3D Sliding Aluminum Glass Window)
    case 'aluminum-fabricator':
    case 'aluminum':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-slate-400 via-slate-600 to-zinc-700 text-white shadow-md shadow-slate-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Aluminum Fabricator Window 3D"
        >
          <AluminumFabricator3DIcon />
        </div>
      );

    // 10. Glass Technician & Glazier (3D Glass Sheet & Suction Lifter)
    case 'glass-technician':
    case 'glass':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 text-white shadow-md shadow-sky-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Glass Technician 3D"
        >
          <GlassTechnician3DIcon />
        </div>
      );

    // 11. Painter & Wall Decor (3D Paint Roller with Dripping Color)
    case 'painter':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 text-white shadow-md shadow-purple-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Painter 3D"
        >
          <Painter3DIcon />
        </div>
      );

    // 12. Mehndi Artist (3D Henna Cone & Mandala Art)
    case 'mehndi-artist':
    case 'mehndi':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-800 text-white shadow-md shadow-emerald-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Mehndi Artist 3D"
        >
          <MehndiArtist3DIcon />
        </div>
      );

    // 13. Makeup Artist & Beautician (3D Glamour Lipstick & Powder Brush)
    case 'makeup-artist':
    case 'makeup':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 text-white shadow-md shadow-pink-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Makeup Artist 3D"
        >
          <MakeupArtist3DIcon />
        </div>
      );

    // 14. Marriage Hall & Event Decorator (3D Celebration Popper & Confetti)
    case 'event-decorator':
    case 'decorator':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-pink-600 text-white shadow-md shadow-orange-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Event Decorator 3D"
        >
          <EventDecorator3DIcon />
        </div>
      );

    // 15. Wallpaper & Panel Installer (3D Textured Wallpaper Roll)
    case 'wallpaper-panel-installer':
    case 'wallpaper':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-700 text-white shadow-md shadow-amber-600/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Wallpaper & Panel 3D"
        >
          <WallpaperPanel3DIcon />
        </div>
      );

    // 16. False Ceiling Contractor (3D POP Ceiling with Warm LED Cove Light)
    case 'false-ceiling-contractor':
    case 'ceiling':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-slate-500 via-slate-600 to-zinc-800 text-white shadow-md shadow-slate-600/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="False Ceiling 3D"
        >
          <FalseCeiling3DIcon />
        </div>
      );

    // 17. Key Lock Maker (3D Brass Master Key & Heavy Padlock)
    case 'key-lock-maker':
    case 'locksmith':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 text-white shadow-md shadow-amber-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Key & Lock Maker 3D"
        >
          <KeyLockMaker3DIcon />
        </div>
      );

    // 18. Inverter & Battery Mechanic (3D Tubular Inverter Battery)
    case 'inverter-battery-mechanic':
    case 'battery':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-red-500 via-orange-600 to-slate-800 text-white shadow-md shadow-red-500/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Inverter & Battery 3D"
        >
          <InverterBattery3DIcon />
        </div>
      );

    // 19. Carpenter & Woodwork (3D Timber Wood Lumber, Saw & Hammer)
    case 'carpenter-woodwork':
    case 'carpenter':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-white shadow-md shadow-amber-800/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Carpenter & Woodwork 3D"
        >
          <Carpenter3DIcon />
        </div>
      );

    // 20. Doorstep Bike Repair (3D Motorbike Motorcycle with Mechanic Wrench)
    case 'doorstep-bike-repair':
    case 'bike':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-red-600 via-rose-600 to-slate-900 text-white shadow-md shadow-red-600/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Doorstep Bike Repair 3D"
        >
          <BikeRepair3DIcon />
        </div>
      );

    // 21. Home Tuition / Personal Tutor (3D Books & Graduation Cap)
    case 'home-tuition':
    case 'tuition':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-600/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Home Tuition 3D"
        >
          <HomeTuition3DIcon />
        </div>
      );

    // 22. Goods Transport / Pickup (Chota Hathi / Tata Ace Mini Cargo Truck)
    case 'goods-transport':
    case 'transport':
    case 'chota-hathi':
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-teal-600 via-cyan-700 to-sky-800 text-white shadow-md shadow-teal-600/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
          title="Goods Transport Chota Hathi 3D"
        >
          <GoodsTransport3DIcon />
        </div>
      );

    default:
      return (
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 border border-white/20 shrink-0 overflow-hidden ${currentSizeClass} ${className}`}
        >
          <Wrench className="w-full h-full p-1 text-white" />
        </div>
      );
  }
};
