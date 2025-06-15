
import React from 'react';

const Logo = ({ className = "h-12 w-auto" }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center`}>
      <svg
        viewBox="0 0 100 60"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="eggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="25%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="75%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        {/* Egg-shaped background with colorful border */}
        <ellipse
          cx="50"
          cy="32"
          rx="35"
          ry="25"
          fill="white"
          stroke="url(#eggGradient)"
          strokeWidth="4"
          filter="url(#shadow)"
        />
        
        {/* SRM Text */}
        <text
          x="50"
          y="38"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="#1f2937"
        >
          SRM
        </text>
        
        {/* Small decorative paint drops around the egg */}
        <circle cx="25" cy="15" r="2" fill="#dc2626" opacity="0.7">
          <animate attributeName="cy" values="15;18;15" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="20" r="1.5" fill="#16a34a" opacity="0.7">
          <animate attributeName="cy" values="20;23;20" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="50" r="1.8" fill="#2563eb" opacity="0.7">
          <animate attributeName="cy" values="50;53;50" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="45" r="1.6" fill="#ea580c" opacity="0.7">
          <animate attributeName="cy" values="45;48;45" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default Logo;
