
import React, { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useAutocompleteCache } from "../hooks/useAutocompleteCache";

export function ProjectsSection({
  projects,
  onEditProject,
  onAddProject,
  onEditProduct,
  onAddProduct,
}: {
  projects: any[];
  onEditProject: (project: any) => void;
  onAddProject: () => void;
  onEditProduct: (projectId: string, product: any) => void;
  onAddProduct: (projectId: string) => void;
}) {
  return (
    <div className="mt-4">
      <details>
        <summary className="font-semibold cursor-pointer mb-2 text-lg flex items-center">
          Projects <span className="ml-2 text-xs text-gray-400">{projects.length > 0 && `(${projects.length})`}</span>
        </summary>
        <div className="flex flex-col gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative">
              <div className="flex justify-between">
                <div>
                  <span className="text-lg font-medium">{proj.project_name}</span>{" "}
                  <span className={
                    "ml-2 px-2 py-1 rounded text-xs " +
                    (proj.status === "completed"
                      ? "bg-green-300 text-green-900"
                      : "bg-orange-200 text-orange-800")
                  }>
                    {proj.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEditProject(proj)} className="hover:text-blue-700" title="Edit Project">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => onAddProduct(proj.id)} className="hover:text-green-700" title="Add Paint">
                    <Plus className="h-4 w-4" /> Add Paint
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
                <div><b>Site:</b> {proj.site_address || "—"}</div>
                <div>
                  <b>Dates:</b> {proj.created_at?.split("T")[0]} {proj.completion_date && <>– {proj.completion_date}</>}
                </div>
              </div>
              {/* Editable paints/products taken */}
              <div className="mt-2">
                <b>Products Used:</b>
                <div className="mt-1 space-y-1">
                  {(proj.products || []).map((pp: any, idx: number) => (
                    <div key={pp.id || idx} className="flex items-center gap-4 px-2 py-1 bg-white dark:bg-slate-800 rounded border dark:border-gray-700">
                      <div className="flex-1">
                        <span>{pp.brand}</span> • <span>{pp.name}</span> • <span>{pp.color}</span> • <span>{pp.quantity}L</span> 
                        {pp.delivery_date && <> • <span className="text-xs text-gray-500">Delivered: {pp.delivery_date}</span></>}
                      </div>
                      <button onClick={() => onEditProduct(proj.id, pp)} title="Edit" className="hover:text-orange-800"><Edit className="h-4 w-4" /></button>
                      <button title="Remove" className="hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => onAddProduct(proj.id)} className="mt-1 text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"><Plus className="h-4 w-4" /> Add Paint/Product</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={onAddProject} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg w-fit hover:bg-blue-700 mt-2 text-sm ml-auto">
            <Plus className="h-4 w-4" /> Add Project
          </button>
        </div>
      </details>
    </div>
  );
}
