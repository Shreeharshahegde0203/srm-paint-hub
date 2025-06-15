
import React from 'react';

const Logo = ({ className = "h-12 w-auto" }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center`}>
      <svg
        viewBox="0 0 140 50"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background with paint splash effect */}
        <defs>
          <linearGradient id="paintGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Paint bucket base */}
        <path
          d="M10 35 Q10 40 15 40 L25 40 Q30 40 30 35 L30 25 L10 25 Z"
          fill="#4b5563"
          filter="url(#dropshadow)"
        />
        
        {/* Paint splash behind letters */}
        <path
          d="M5 25 Q15 15 25 20 Q35 10 50 18 Q65 12 80 20 Q95 15 110 22 Q125 18 135 25 Q130 35 120 30 Q105 38 90 32 Q75 40 60 35 Q45 38 30 32 Q15 35 5 25 Z"
          fill="url(#paintGradient)"
          opacity="0.2"
        />
        
        {/* Paintbrush */}
        <g transform="translate(120, 10)">
          <rect x="0" y="0" width="2" height="15" fill="#8b4513" />
          <path d="M-2 15 L4 15 L3 25 L-1 25 Z" fill="#ffd700" />
          <path d="M-1 25 L3 25 Q3 30 1 30 Q-1 30 -1 25 Z" fill="#dc2626" />
        </g>
        
        {/* S Letter */}
        <g transform="translate(35, 15)">
          <path
            d="M0 8 Q0 4 4 4 L12 4 Q16 4 16 8 Q16 12 12 12 L8 12 Q4 12 4 16 Q4 20 8 20 L16 20 M16 16 L16 20"
            stroke="#1e40af"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="2" y="18" fill="#1e40af" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">S</text>
        </g>
        
        {/* R Letter */}
        <g transform="translate(55, 15)">
          <path
            d="M0 4 L0 20 M0 4 L12 4 Q16 4 16 8 Q16 12 12 12 L0 12 M8 12 L16 20"
            stroke="#dc2626"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="2" y="18" fill="#dc2626" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">R</text>
        </g>
        
        {/* M Letter */}
        <g transform="translate(75, 15)">
          <path
            d="M0 20 L0 4 L8 12 L16 4 L16 20"
            stroke="#059669"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="2" y="18" fill="#059669" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">M</text>
        </g>
        
        {/* Paint drops */}
        <circle cx="25" cy="40" r="2" fill="#dc2626" opacity="0.7">
          <animate attributeName="cy" values="40;45;40" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="45" cy="42" r="1.5" fill="#1e40af" opacity="0.7">
          <animate attributeName="cy" values="42;47;42" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="65" cy="41" r="1.8" fill="#059669" opacity="0.7">
          <animate attributeName="cy" values="41;46;41" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default Logo;
