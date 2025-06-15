
import React from "react";
import { PaintBucket, PaintBucketOff } from "lucide-react";

interface StockLevelIconProps {
  stock: number;
}

const StockLevelIcon: React.FC<StockLevelIconProps> = ({ stock }) => {
  // Determine size and color by stock amount
  let iconSize = 42;
  let color = "";
  let label = "";
  let IconComponent: React.ElementType = PaintBucket;

  if (stock >= 40) {
    iconSize = 48;
    color = "text-green-600";
    label = "High stock";
  } else if (stock >= 20) {
    iconSize = 36;
    color = "text-yellow-500";
    label = "Medium stock";
  } else if (stock > 0) {
    iconSize = 28;
    color = "text-red-600";
    label = "Low stock";
  } else {
    IconComponent = PaintBucketOff;
    iconSize = 28;
    color = "text-gray-400";
    label = "Out of stock";
  }

  return (
    <div className="flex flex-col items-center" title={label}>
      <IconComponent className={color} size={iconSize} strokeWidth={2.3} />
      <span className="block text-xs mt-1 font-medium text-slate-500">{label}</span>
    </div>
  );
};

export default StockLevelIcon;
