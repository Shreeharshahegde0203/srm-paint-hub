
import React from 'react';

const Logo = ({ className = "h-12 w-auto" }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center`}>
      <svg
        viewBox="0 0 120 40"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background paint splash */}
        <path
          d="M8 20C8 12 14 6 22 6h76c8 0 14 6 14 14s-6 14-14 14H22c-8 0-14-6-14-14z"
          fill="url(#gradient)"
          opacity="0.1"
        />
        
        {/* S */}
        <path
          d="M20 12c-2 0-4 2-4 4s2 4 4 4h4c1 0 2 1 2 2s-1 2-2 2h-6v4h6c2 0 4-2 4-4s-2-4-4-4h-4c-1 0-2-1-2-2s1-2 2-2h6v-4h-6z"
          fill="#1e3a8a"
          className="font-bold"
        />
        
        {/* R */}
        <path
          d="M36 12v16h4v-6h4l3 6h4l-3-6c2-1 3-3 3-5s-2-5-4-5h-11zm4 4v-4h6c1 0 2 1 2 2s-1 2-2 2h-6z"
          fill="#1e3a8a"
        />
        
        {/* M */}
        <path
          d="M60 12v16h4v-12l4 8h2l4-8v12h4V12h-6l-3 6-3-6h-6z"
          fill="#1e3a8a"
        />
        
        {/* Paintbrush accent */}
        <path
          d="M84 14l8 8-2 2-8-8c-1-1-1-3 0-4s3-1 4 0l6 6"
          stroke="#dc2626"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Paint drop */}
        <circle cx="96" cy="24" r="3" fill="#dc2626" opacity="0.8" />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
