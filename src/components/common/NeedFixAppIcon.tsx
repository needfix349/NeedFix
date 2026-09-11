import React, { useState } from 'react';

interface NeedFixAppIconProps {
  size?: number;
  className?: string;
  rounded?: string;
  alt?: string;
}

export const NeedFixAppIcon: React.FC<NeedFixAppIconProps> = ({
  size = 40,
  className = '',
  rounded = 'rounded-2xl',
  alt = 'NeedFix App Logo',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 select-none overflow-hidden aspect-square ${rounded} ${className}`}
    >
      {!hasError ? (
        <img
          src="/needfix-logo.png"
          alt={alt}
          width={size}
          height={size}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain aspect-square block select-none"
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 flex items-center justify-center text-white font-extrabold text-sm rounded-xl">
          N
        </div>
      )}
    </div>
  );
};
