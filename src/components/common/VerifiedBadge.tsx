import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div
      title="Verified Service Provider: Aadhaar ID & Background Verified by NeedFix Admin"
      className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300/80 shadow-xs ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-center justify-center text-emerald-600">
        <ShieldCheck size={iconSizes[size]} className="fill-emerald-100" />
      </div>
      {showText && (
        <span className="flex items-center gap-1">
          <span>Verified Provider</span>
          <CheckCircle2 size={iconSizes[size] - 2} className="text-emerald-600 fill-emerald-600 text-white" />
        </span>
      )}
    </div>
  );
};
