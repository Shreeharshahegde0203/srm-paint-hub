
import React from "react";

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-700 dark:text-gray-200 mb-4">{description}</p>
        <div className="flex gap-4">
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
          <button onClick={onCancel} className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-slate-600">Cancel</button>
        </div>
      </div>
    </div>
  );
}
