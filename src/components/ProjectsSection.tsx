
import React from "react";
import { Plus, Edit, Calendar, MapPin, Building, CheckCircle, Clock } from "lucide-react";

interface ProjectsSectionProps {
  projects: any[];
  onEditProject: (project: any) => void;
  onAddProject: () => void;
  onEditProduct: (projectId: string, product: any) => void;
  onAddProduct: (projectId: string) => void;
}

export function ProjectsSection({ 
  projects, 
  onEditProject, 
  onAddProject, 
  onEditProduct, 
  onAddProduct 
}: ProjectsSectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Projects ({projects.length})
        </h3>
        <button
          onClick={onAddProject}
          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No projects yet</p>
          <button
            onClick={onAddProject}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {project.project_name}
                  </h4>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">
                      {project.status === "in_progress" ? "Ongoing" : project.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onEditProject(project)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {project.site_address && (
                  <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{project.site_address}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Started: {formatDate(project.start_date)}</span>
                </div>

                {project.estimated_quantity && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Est. Quantity:</strong> {project.estimated_quantity} L
                  </div>
                )}

                {project.completion_date && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Completed: {formatDate(project.completion_date)}</span>
                  </div>
                )}
              </div>

              {project.notes && (
                <div className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 p-2 rounded border">
                  <strong>Notes:</strong> {project.notes}
                </div>
              )}

              {/* Project Statistics */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Total Orders: 0</span>
                  <span>Amount Billed: ₹0</span>
                  <span>Last Purchase: N/A</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
