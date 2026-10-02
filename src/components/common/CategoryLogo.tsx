import React from 'react';
import { GlassTechnician3DIcon } from './category3DIcons';
import { Wrench } from 'lucide-react';

interface CategoryLogoProps {
  categoryId: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

interface CategoryImage {
  title: string;
  file: string;
}

const CATEGORY_IMAGES: Record<string, CategoryImage> = {
  'ac-technician': { title: 'AC Technician & Gas Refill', file: 'ac-technician' },
  electrician: { title: 'Electrician & Wiring', file: 'electrician' },
  plumber: { title: 'Plumber (Repair & Installation)', file: 'plumber' },
  'home-appliance': { title: 'Home Appliance Repair', file: 'home-appliance' },
  'cctv-security': { title: 'CCTV & Security Installer', file: 'cctv-security' },
  'taxi-cab-service': { title: 'Taxi Driver & Cab', file: 'taxi-cab-service' },
  'makeup-artist': { title: 'Makeup Artist', file: 'makeup-artist' },
  'mehndi-artist': { title: 'Mehndi Artist', file: 'mehndi-artist' },
  'car-mechanic': { title: 'Car Mechanic', file: 'car-mechanic' },
  'carpenter-woodwork': { title: 'Carpenter & Woodwork', file: 'carpenter-woodwork' },
  painter: { title: 'Painter', file: 'painter' },
  'ro-technician': { title: 'RO Technician', file: 'ro-technician' },
  'doorstep-bike-repair': { title: 'Doorstep Bike Repair', file: 'doorstep-bike-repair' },
  'mobile-repair': { title: 'Mobile Repair', file: 'mobile-repair' },
  'mason-civil-contractor': { title: 'Mason / Civil Contractor', file: 'mason-civil-contractor' },
  'tile-marble-layer': { title: 'Tile & Marble Layer', file: 'tile-marble-layer' },
  'water-tank-cleaning': { title: 'Water Tank Cleaning', file: 'water-tank-cleaning' },
  'inverter-battery-mechanic': { title: 'Inverter & Battery Mechanic', file: 'inverter-battery-mechanic' },
  'laptop-computer-repair': { title: 'Laptop / Computer Repair', file: 'laptop-computer-repair' },
  'welder-welding-work': { title: 'Welder & Welding Work', file: 'welder-welding-work' },
  'cleaner-maid': { title: 'Cleaner / Maid', file: 'cleaner-maid' },
  'packers-movers-helper': { title: 'Packers & Movers Helper', file: 'packers-movers-helper' },
  'false-ceiling-contractor': { title: 'False Ceiling Contractor', file: 'false-ceiling-contractor' },
  'aluminum-fabricator': { title: 'Aluminum Fabricator', file: 'aluminum-fabricator' },
  'wallpaper-panel-installer': { title: 'Wallpaper & Panel Installer', file: 'wallpaper-panel-installer' },
  'goods-transport': { title: 'Goods Transport / Pickup (Chota Hathi)', file: 'goods-transport' },
  'key-lock-maker': { title: 'Key Lock Maker', file: 'key-lock-maker' },
  'interior-designer': { title: 'Interior Designer', file: 'interior-designer' },
  'babysitter-nurse': { title: 'Babysitter / Nurse', file: 'babysitter-nurse' },
  'event-decorator': { title: 'Marriage Hall / Event Decorator', file: 'event-decorator' },
};

const CATEGORY_ALIASES: Record<string, string> = {
  ac: 'ac-technician',
  ac_service: 'ac-technician',
  'electrician-wiring': 'electrician',
  plumbing: 'plumber',
  'appliance-repair': 'home-appliance',
  cctv: 'cctv-security',
  taxi: 'taxi-cab-service',
  cab: 'taxi-cab-service',
  makeup: 'makeup-artist',
  mehendi: 'mehndi-artist',
  'car-repair': 'car-mechanic',
  carpenter: 'carpenter-woodwork',
  painting: 'painter',
  'water-purifier': 'ro-technician',
  'bike-repair': 'doorstep-bike-repair',
  'phone-repair': 'mobile-repair',
  mason: 'mason-civil-contractor',
  'tile-marble': 'tile-marble-layer',
  'tank-cleaning': 'water-tank-cleaning',
  'inverter-battery': 'inverter-battery-mechanic',
  'laptop-repair': 'laptop-computer-repair',
  'computer-repair': 'laptop-computer-repair',
  welder: 'welder-welding-work',
  welding: 'welder-welding-work',
  cleaning: 'cleaner-maid',
  maid: 'cleaner-maid',
  'packers-movers': 'packers-movers-helper',
  'false-ceiling': 'false-ceiling-contractor',
  fabricator: 'aluminum-fabricator',
  wallpaper: 'wallpaper-panel-installer',
  'chota-hathi': 'goods-transport',
  transport: 'goods-transport',
  'key-maker': 'key-lock-maker',
  locksmith: 'key-lock-maker',
  interior: 'interior-designer',
  babysitter: 'babysitter-nurse',
  nurse: 'babysitter-nurse',
  'marriage-hall': 'event-decorator',
  'marriage-hall-decorator': 'event-decorator',
};

const SIZE_CLASSES: Record<string, string> = {
  xs: 'w-6 h-6',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

export const CategoryLogo: React.FC<CategoryLogoProps> = ({
  categoryId,
  className = '',
  size = 'md',
}) => {
  const containerSizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const hasExplicitDimensions = /\b(w-|h-)\S+/.test(className);
  const finalClasses = hasExplicitDimensions ? className : `${containerSizeClass} ${className}`;
  const wrapperClasses = `relative flex items-center justify-center shrink-0 transition-transform duration-200 select-none ${finalClasses}`;

  const normalizedId = (categoryId || '').toLowerCase().trim();
  const image = CATEGORY_IMAGES[CATEGORY_ALIASES[normalizedId] ?? normalizedId];

  if (image) {
    return (
      <div className={wrapperClasses} title={image.title}>
        <img
          src={`/categories/${image.file}.webp`}
          alt=""
          width={320}
          height={320}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
    );
  }

  if (normalizedId === 'glass-technician') {
    return (
      <div className={wrapperClasses} title="Glass Technician">
        <GlassTechnician3DIcon className="w-full h-full drop-shadow-2xs" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-600 rounded-full p-2 shadow-xs ${className || containerSizeClass}`}
    >
      <Wrench className="w-5 h-5 text-slate-500" />
    </div>
  );
};
