
import React, { useState } from "react";
import { X } from "lucide-react";
import { useRegularCustomers } from "@/hooks/useRegularCustomers";
import { useCustomerProjects } from "@/hooks/useCustomerProjects";

interface ProjectBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (billingData: any) => void;
}

const ProjectBillingModal: React.FC<ProjectBillingModalProps> = ({
  isOpen,
  onClose,
  onCreateInvoice,
}) => {
  const { customers } = useRegularCustomers();
  const { getCustomerProjects } = useCustomerProjects();
  
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [billingMode, setBillingMode] = useState("with_gst");
  const [customerType, setCustomerType] = useState("Regular");

  const [customerProjects, setCustomerProjects] = useState<any[]>([]);

  const handleCustomerChange = async (customerId: string) => {
    setSelectedCustomer(customerId);
    setSelectedProject("");
    
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      setCustomerType(customer?.customer_type || "Regular");
      
      if (customer?.customer_type === "Regular") {
        try {
          const projectsQuery = getCustomerProjects(customerId);
          if (projectsQuery.data) {
            setCustomerProjects(Array.isArray(projectsQuery.data) ? projectsQuery.data : []);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
          setCustomerProjects([]);
        }
      } else {
        setCustomerProjects([]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCustomerData = customers.find(c => c.id === selectedCustomer);
    const selectedProjectData = customerProjects.find(p => p.id === selectedProject);
    
    onCreateInvoice({
      customer: selectedCustomerData,
      project: selectedProjectData,
      billingMode,
      customerType,
    });
    
    // Reset form
    setSelectedCustomer("");
    setSelectedProject("");
    setBillingMode("with_gst");
    setCustomerType("Regular");
    setCustomerProjects([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create Project-Based Invoice
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Select Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Step 1: Select Customer *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white"
              value={selectedCustomer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.customer_type})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Project (only for Regular customers) */}
          {customerType === "Regular" && selectedCustomer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Step 2: Select Project *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required={customerType === "Regular"}
              >
                <option value="">Choose a project...</option>
                {customerProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name} - {project.status}
                  </option>
                ))}
              </select>
              {customerProjects.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No projects found. Add a project first.
                </p>
              )}
            </div>
          )}

          {/* Step 3: Billing Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Step 4: Choose Billing Mode *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white"
              value={billingMode}
              onChange={(e) => setBillingMode(e.target.value)}
            >
              <option value="with_gst">With GST</option>
              <option value="without_gst">Without GST</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              disabled={!selectedCustomer || (customerType === "Regular" && !selectedProject)}
            >
              Continue to Add Items
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectBillingModal;
