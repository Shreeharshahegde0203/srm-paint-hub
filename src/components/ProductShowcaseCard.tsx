
import React from "react";
import { Sparkles, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import FeaturedProductImage from "./FeaturedProductImage";

interface ProductShowcaseCardProps {
  product: {
    id: string;
    name: string;
    image?: string;
    brand: string;
    type: string;
    color: string;
    description?: string; // <--- Make description optional
    stock: number;
    code: string;
    unit: string; // Added unit property
  };
  index?: number;
}

const brandColors: Record<string, string> = {
  Dulux: "from-blue-400 to-blue-600",
  Indigo: "from-indigo-400 to-indigo-600",
};

const ProductShowcaseCard: React.FC<ProductShowcaseCardProps> = ({ product, index = 0 }) => {
  // Get a gradient color for the brand or fallback
  const gradient = brandColors[product.brand] || "from-slate-300 to-slate-500";

  return (
    <div
      className={cn(
        "relative bg-gradient-to-br",
        gradient,
        "rounded-2xl shadow-xl overflow-hidden group transform-gpu hover:scale-105 transition-transform duration-300",
        "border-2 border-white/30",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
      tabIndex={0}
      aria-label={`${product.name} product card`}
    >
      <div className="overflow-hidden h-48 flex items-center justify-center bg-gradient-to-br from-white/40 via-white/90 to-white/40 relative">
        <FeaturedProductImage src={product.image} alt={product.name} />
        <MousePointerClick className="absolute right-3 bottom-3 text-blue-400 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all drop-shadow-lg animate-bounce" />
      </div>
      <div className="p-6 pb-4 flex flex-col">
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-white/70 text-black font-semibold border group-hover:bg-gradient-to-r group-hover:from-orange-200 group-hover:to-blue-200 transition-all">
            {product.brand}
          </span>
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            product.stock > 20
              ? "bg-green-200 text-green-800 group-hover:bg-green-300"
              : "bg-red-200 text-red-800 group-hover:bg-red-300"
          )}>
            Stock: {product.stock} {product.unit}
          </span>
        </div>
        <h3 className="text-lg font-extrabold mb-1 text-blue-900 group-hover:text-blue-700 transition-colors whitespace-nowrap text-ellipsis overflow-hidden">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-yellow-500 animate-spin-slow" />
            {product.name}
          </span>
        </h3>
        <div className="text-xs text-blue-600 group-hover:text-blue-900 transition-colors mb-1">
          {product.type} · {product.color}
        </div>
        <p className="text-xs text-blue-900 line-clamp-2 mb-0 opacity-70 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          {product.description || ""}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-[11px] text-blue-800/80 font-mono">Code: {product.code}</span>
          <span className="relative block w-4 h-4 animate-float">
            <span className="absolute inset-0 bg-gradient-to-br from-orange-300 to-blue-300 rounded-full blur-sm opacity-30"></span>
            <span className="absolute inset-1 bg-orange-200 rounded-full"></span>
          </span>
        </div>
      </div>
      {/* Animated overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 group-focus:opacity-40 transition-opacity pointer-events-none bg-gradient-to-br from-orange-100 to-pink-100"></div>
      {/* Animated border highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-transparent group-hover:border-blue-400 border-dashed transition-all duration-300"></div>
    </div>
  );
};

export default ProductShowcaseCard;
