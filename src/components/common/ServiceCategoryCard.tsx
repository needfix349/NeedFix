import React from 'react';
import { ServiceCategory } from '../../types';
import { CategoryLogo } from './CategoryLogo';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  index: number;
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
}

// 30 Category Accent Colors matching the reference image badges & underlines
const CATEGORY_ACCENT_COLORS: string[] = [
  '#0EA5E9', // 1. AC (Sky blue)
  '#EAB308', // 2. Electrician (Amber)
  '#8B5CF6', // 3. Plumber (Purple)
  '#22C55E', // 4. Home Appliance (Green)
  '#0284C7', // 5. CCTV (Blue)
  '#EC4899', // 6. Taxi (Pink)
  '#A855F7', // 7. Makeup (Purple)
  '#06B6D4', // 8. Mehndi (Cyan)
  '#F97316', // 9. Car Mechanic (Orange)
  '#22C55E', // 10. Carpenter (Green)
  '#0284C7', // 11. Painter (Blue)
  '#8B5CF6', // 12. RO (Purple)
  '#F97316', // 13. Bike Repair (Orange)
  '#06B6D4', // 14. Mobile Repair (Cyan)
  '#F43F5E', // 15. Mason (Coral)
  '#3B82F6', // 16. Tile (Blue)
  '#10B981', // 17. Water Tank (Emerald)
  '#8B5CF6', // 18. Inverter (Purple)
  '#F59E0B', // 19. Laptop (Amber)
  '#0284C7', // 20. Welder (Blue)
  '#06B6D4', // 21. Cleaner (Cyan)
  '#EC4899', // 22. Packers (Pink)
  '#7C3AED', // 23. False Ceiling (Purple)
  '#22C55E', // 24. Aluminum (Green)
  '#0EA5E9', // 25. Wallpaper (Sky)
  '#F97316', // 26. Goods Transport (Orange)
  '#8B5CF6', // 27. Key Maker (Purple)
  '#0D9488', // 28. Interior Designer (Teal)
  '#F43F5E', // 29. Babysitter (Rose)
  '#EF4444', // 30. Marriage/Event (Red)
];

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
  category,
  index,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const accentColor = CATEGORY_ACCENT_COLORS[index] || '#0284C7';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-2xl border text-center flex flex-col items-center justify-between p-2 pt-2.5 pb-2.5 transition-all duration-200 group cursor-pointer min-h-[120px] sm:min-h-[128px] ${
        isSelected
          ? 'bg-blue-50/90 text-blue-950 border-blue-500 ring-2 ring-blue-500/25 shadow-md scale-[1.02]'
          : 'bg-white text-slate-800 border-blue-100/70 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:shadow-md hover:bg-slate-50/40'
      } ${className}`}
      title={category.name}
    >
      {/* Small Numbered Circular Badge 1-30 in top-left matching reference image */}
      <span
        className="absolute top-2 left-2 w-5 h-5 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs select-none z-10"
        style={{ backgroundColor: accentColor }}
      >
        {index + 1}
      </span>

      {/* Large, Detailed & Professional Service Illustration with soft pastel circular background */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 mb-1">
        <CategoryLogo categoryId={category.id} size="lg" className="w-20 h-20 sm:w-24 sm:h-24" />
      </div>

      {/* Bold Dark-Blue Category Name */}
      <span className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 text-center text-[#0a2540] group-hover:text-blue-900 w-full min-h-[28px] flex items-center justify-center px-1">
        {category.name}
      </span>

      {/* Small Colored Horizontal Underline Below the Name */}
      <span
        className="w-7 h-1 rounded-full mt-1.5 shrink-0"
        style={{ backgroundColor: accentColor }}
      />
    </button>
  );
};
