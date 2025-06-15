
import React from 'react';

const Logo = ({ className = "h-12 w-auto" }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center`}>
      <svg
        viewBox="0 0 100 70"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Three-color gradient for the oval border */}
          <linearGradient id="paintGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="33%" stopColor="#dc2626" />
            <stop offset="34%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#eab308" />
            <stop offset="67%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          
          {/* Paint drip gradient */}
          <linearGradient id="dripGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
          </linearGradient>
          
          <filter id="paintShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Custom upward oval shape (wider bottom, narrower top) */}
        <path
          d="M 50 15 
             C 35 15, 25 20, 25 30
             C 25 40, 30 50, 35 55
             C 40 60, 45 62, 50 62
             C 55 62, 60 60, 65 55
             C 70 50, 75 40, 75 30
             C 75 20, 65 15, 50 15 Z"
          fill="white"
          stroke="url(#paintGradient)"
          strokeWidth="5"
          filter="url(#paintShadow)"
        />
        
        {/* SRM Text with paint-themed styling */}
        <text
          x="50"
          y="42"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily="Impact, Arial Black, sans-serif"
          fill="#1f2937"
          letterSpacing="1px"
        >
          SRM
        </text>
        
        {/* Paint drips around the oval */}
        <ellipse cx="30" cy="58" rx="2" ry="4" fill="url(#dripGradient)">
          <animate attributeName="ry" values="4;6;4" dur="3s" repeatCount="indefinite" />
        </ellipse>
        
        <ellipse cx="70" cy="56" rx="1.5" ry="3" fill="#eab308" opacity="0.7">
          <animate attributeName="ry" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
        
        <ellipse cx="50" cy="60" rx="1.8" ry="3.5" fill="#2563eb" opacity="0.6">
          <animate attributeName="ry" values="3.5;5.5;3.5" dur="2.8s" repeatCount="indefinite" />
        </ellipse>
        
        {/* Paint brush stroke accent */}
        <path
          d="M 20 25 Q 25 20, 30 25"
          stroke="#dc2626"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        
        <path
          d="M 70 22 Q 75 18, 80 23"
          stroke="#eab308"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        
        {/* Small paint splashes */}
        <circle cx="22" cy="35" r="1.5" fill="#2563eb" opacity="0.4">
          <animate attributeName="r" values="1.5;2.5;1.5" dur="4s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="78" cy="40" r="1.2" fill="#dc2626" opacity="0.4">
          <animate attributeName="r" values="1.2;2;1.2" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default Logo;
