import React from 'react';
import {
  AcTechnician3DIcon,
  Electrician3DIcon,
  Plumber3DIcon,
  HomeAppliance3DIcon,
  Cctv3DIcon,
  TaxiCab3DIcon,
  MakeupArtist3DIcon,
  MehndiArtist3DIcon,
  CarMechanic3DIcon,
  Carpenter3DIcon,
  Painter3DIcon,
  RoTechnician3DIcon,
  BikeRepair3DIcon,
  MobileRepair3DIcon,
  MasonCivil3DIcon,
  TileMarble3DIcon,
  WaterTank3DIcon,
  InverterBattery3DIcon,
  LaptopRepair3DIcon,
  Welder3DIcon,
  CleanerMaid3DIcon,
  PackersMoversHelper3DIcon,
  FalseCeiling3DIcon,
  AluminumFabricator3DIcon,
  WallpaperPanel3DIcon,
  GoodsTransport3DIcon,
  KeyLockMaker3DIcon,
  InteriorDesigner3DIcon,
  BabysitterNurse3DIcon,
  EventDecorator3DIcon,
  GlassTechnician3DIcon,
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
  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const containerSizeClass = sizeClasses[size] || sizeClasses.md;

  const renderBadge = (
    title: string,
    IconComponent: React.FC<{ className?: string }>
  ) => {
    const hasExplicitDimensions = /\b(w-|h-)\S+/.test(className);
    const finalClasses = hasExplicitDimensions ? className : `${containerSizeClass} ${className}`;

    return (
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 select-none ${finalClasses}`}
        title={title}
      >
        <IconComponent className="w-full h-full drop-shadow-2xs" />
      </div>
    );
  };

  const normalizedId = (categoryId || '').toLowerCase().trim();

  switch (normalizedId) {
    // 1. AC Technician & Gas Refill
    case 'ac-technician':
    case 'ac':
    case 'ac_service':
      return renderBadge('AC Technician & Gas Refill', AcTechnician3DIcon);

    // 2. Electrician & Wiring
    case 'electrician':
    case 'electrician-wiring':
      return renderBadge('Electrician & Wiring', Electrician3DIcon);

    // 3. Plumber (Repair & Installation)
    case 'plumber':
    case 'plumbing':
      return renderBadge('Plumber (Repair & Installation)', Plumber3DIcon);

    // 4. Home Appliance Repair
    case 'home-appliance':
    case 'appliance-repair':
      return renderBadge('Home Appliance Repair', HomeAppliance3DIcon);

    // 5. CCTV & Security Installer
    case 'cctv-security':
    case 'cctv':
      return renderBadge('CCTV & Security Installer', Cctv3DIcon);

    // 6. Taxi Driver & Cab
    case 'taxi-cab-service':
    case 'taxi':
    case 'cab':
      return renderBadge('Taxi Driver & Cab', TaxiCab3DIcon);

    // 7. Makeup Artist
    case 'makeup-artist':
    case 'makeup':
      return renderBadge('Makeup Artist', MakeupArtist3DIcon);

    // 8. Mehndi Artist
    case 'mehndi-artist':
    case 'mehendi':
      return renderBadge('Mehndi Artist', MehndiArtist3DIcon);

    // 9. Car Mechanic
    case 'car-mechanic':
    case 'car-repair':
      return renderBadge('Car Mechanic', CarMechanic3DIcon);

    // 10. Carpenter & Woodwork
    case 'carpenter-woodwork':
    case 'carpenter':
      return renderBadge('Carpenter & Woodwork', Carpenter3DIcon);

    // 11. Painter
    case 'painter':
    case 'painting':
      return renderBadge('Painter', Painter3DIcon);

    // 12. RO Technician
    case 'ro-technician':
    case 'water-purifier':
      return renderBadge('RO Technician', RoTechnician3DIcon);

    // 13. Doorstep Bike Repair
    case 'doorstep-bike-repair':
    case 'bike-repair':
      return renderBadge('Doorstep Bike Repair', BikeRepair3DIcon);

    // 14. Mobile Repair
    case 'mobile-repair':
    case 'phone-repair':
      return renderBadge('Mobile Repair', MobileRepair3DIcon);

    // 15. Mason / Civil Contractor
    case 'mason-civil-contractor':
    case 'mason':
      return renderBadge('Mason / Civil Contractor', MasonCivil3DIcon);

    // 16. Tile & Marble Layer
    case 'tile-marble-layer':
    case 'tile-marble':
      return renderBadge('Tile & Marble Layer', TileMarble3DIcon);

    // 17. Water Tank Cleaning
    case 'water-tank-cleaning':
    case 'tank-cleaning':
      return renderBadge('Water Tank Cleaning', WaterTank3DIcon);

    // 18. Inverter & Battery Mechanic
    case 'inverter-battery-mechanic':
    case 'inverter-battery':
      return renderBadge('Inverter & Battery Mechanic', InverterBattery3DIcon);

    // 19. Laptop / Computer Repair
    case 'laptop-computer-repair':
    case 'laptop-repair':
    case 'computer-repair':
      return renderBadge('Laptop / Computer Repair', LaptopRepair3DIcon);

    // 20. Welder & Welding Work
    case 'welder-welding-work':
    case 'welder':
    case 'welding':
      return renderBadge('Welder & Welding Work', Welder3DIcon);

    // 21. Cleaner / Maid
    case 'cleaner-maid':
    case 'cleaning':
    case 'maid':
      return renderBadge('Cleaner / Maid', CleanerMaid3DIcon);

    // 22. Packers & Movers Helper
    case 'packers-movers-helper':
    case 'packers-movers':
      return renderBadge('Packers & Movers Helper', PackersMoversHelper3DIcon);

    // 23. False Ceiling Contractor
    case 'false-ceiling-contractor':
    case 'false-ceiling':
      return renderBadge('False Ceiling Contractor', FalseCeiling3DIcon);

    // 24. Aluminum Fabricator
    case 'aluminum-fabricator':
    case 'fabricator':
      return renderBadge('Aluminum Fabricator', AluminumFabricator3DIcon);

    // 25. Wallpaper & Panel Installer
    case 'wallpaper-panel-installer':
    case 'wallpaper':
      return renderBadge('Wallpaper & Panel Installer', WallpaperPanel3DIcon);

    // 26. Goods Transport / Pickup (Chota Hathi)
    case 'goods-transport':
    case 'chota-hathi':
    case 'transport':
      return renderBadge('Goods Transport / Pickup (Chota Hathi)', GoodsTransport3DIcon);

    // 27. Key Lock Maker
    case 'key-lock-maker':
    case 'key-maker':
    case 'locksmith':
      return renderBadge('Key Lock Maker', KeyLockMaker3DIcon);

    // 28. Interior Designer
    case 'interior-designer':
    case 'interior':
      return renderBadge('Interior Designer', InteriorDesigner3DIcon);

    // 29. Babysitter / Nurse
    case 'babysitter-nurse':
    case 'babysitter':
    case 'nurse':
      return renderBadge('Babysitter / Nurse', BabysitterNurse3DIcon);

    // 30. Marriage Hall / Event Decorator
    case 'event-decorator':
    case 'marriage-hall':
    case 'marriage-hall-decorator':
      return renderBadge('Marriage Hall / Event Decorator', EventDecorator3DIcon);

    // Fallbacks
    case 'glass-technician':
      return renderBadge('Glass Technician', GlassTechnician3DIcon);

    default:
      return (
        <div
          className={`flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-600 rounded-full p-2 shadow-xs ${className || containerSizeClass}`}
        >
          <Wrench className="w-5 h-5 text-slate-500" />
        </div>
      );
  }
};
