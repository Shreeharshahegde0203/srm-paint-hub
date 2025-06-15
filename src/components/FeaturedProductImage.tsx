
import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";

// Generic placeholder from Unsplash for fallback
const PLACEHOLDER =
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=facearea&w=400&h=400&q=80&facepad=2";

// Show skeleton while image loads, fallback on error
const FeaturedProductImage: React.FC<{
  src?: string;
  alt: string;
}> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative bg-gradient-to-bl from-slate-100 to-slate-300 flex items-center justify-center h-48 w-full overflow-hidden">
      {!loaded && (
        <Skeleton className="absolute inset-0 h-full w-full z-0 rounded-none" />
      )}
      <img
        src={error ? PLACEHOLDER : src || PLACEHOLDER}
        alt={alt}
        loading="lazy"
        className={`object-cover w-full h-full transition-transform duration-500 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        draggable={false}
      />
    </div>
  );
};

export default FeaturedProductImage;
