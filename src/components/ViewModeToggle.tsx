
import React from "react";
import { Grid3x3, Grid2x2, LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

// Default order: Large, Medium, Small, List
const MODES = [
  { key: "large",   icon: <Grid3x3 />,    label: "Large Grid" },
  { key: "medium",  icon: <LayoutGrid />, label: "Medium Grid" },
  { key: "small",   icon: <Grid2x2 />,    label: "Small Grid" },
  { key: "list",    icon: <LayoutList />, label: "List" }
] as const;

interface ViewModeToggleProps {
  value: string;
  onChange: (value: string) => void;
}
const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ value, onChange }) => (
  <div className="inline-flex gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-sm">
    {MODES.map(mode => (
      <button
        key={mode.key}
        type="button"
        className={cn(
          "px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium text-xs transition-all",
          value === mode.key
            ? "bg-blue-600 text-white shadow"
            : "bg-transparent text-slate-600 hover:bg-slate-200"
        )}
        aria-label={mode.label}
        title={mode.label}
        onClick={() => onChange(mode.key)}
      >
        {mode.icon}
        <span className="hidden md:inline">{mode.label}</span>
      </button>
    ))}
  </div>
);
export default ViewModeToggle;
