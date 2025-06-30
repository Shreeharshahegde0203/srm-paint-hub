
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CustomerSummary } from "./CustomerSummary";
import { InvoiceHistorySection } from "./InvoiceHistorySection";
import { ProjectsSection } from "./ProjectsSection";
import AddProjectDialog from "./AddProjectDialog";
import { useCustomerProjects } from "@/hooks/useCustomerProjects";
import { useCustomerInvoices } from "@/hooks/useCustomerInvoices";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { toast } from "@/hooks/use-toast";

interface Props {
  customer: any | null;
  open: boolean;
  onClose: () => void;
}

export default function RegularCustomerSidebar({ customer, open, onClose }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);

  // Always call hooks at the top level, never conditionally!
  const { getCustomerProjects, addProject } = useCustomerProjects();
  const { getCustomerInvoices } = useCustomerInvoices();

  // Call hook regardless, use "enabled" to suppress fetch if no ID
  const projectsQuery = getCustomerProjects(customer?.id ?? "UNSET_ID");
  const invoicesQuery = getCustomerInvoices(customer?.id ?? "UNSET_ID");

  // Defensive: always arrays, never undefined!
  let projects: any[] = [];
  if (Array.isArray(projectsQuery.data)) {
    projects = projectsQuery.data;
  }

  let invoices: any[] = [];
  if (Array.isArray(invoicesQuery.data)) {
    invoices = invoicesQuery.data;
  }

  const { products } = useSupabaseProducts();

  // Stats, safely treat as arrays
  const totalSpent = Array.isArray(invoices)
    ? invoices.reduce((sum: number, inv: any) => sum + (Number(inv?.invoice?.total || 0)), 0)
    : 0;
  const dueAmount = Array.isArray(invoices)
    ? invoices.reduce(
        (sum: number, inv: any) =>
          sum + (inv?.invoice?.status === "paid" ? 0 : Number(inv?.invoice?.total || 0)),
        0
      )
    : 0;

  useEffect(() => {
    setSidebarOpen(open);
  }, [open]);

  const handleAddProject = async (projectData: any) => {
    try {
      await addProject(projectData);
      toast({ title: "Project Added", description: "New project has been created successfully." });
      setShowAddProjectDialog(false);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to add project. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Don't render unless properly loaded and customer exists
  if (!sidebarOpen || !customer) return null;

  return (
    <>
      <div className="fixed top-0 right-0 w-full md:w-[540px] max-w-full h-full bg-white dark:bg-slate-900 shadow-2xl z-50 transition-all duration-300 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-900 z-10"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-8 py-12">
          <CustomerSummary
            customer={customer}
            invoiceCount={Array.isArray(invoices) ? invoices.length : 0}
            totalSpent={totalSpent}
            dueAmount={dueAmount}
          />
          <InvoiceHistorySection
            invoices={invoices}
            onEdit={(inv) => {/* show edit dialog, not implemented here */}}
            onView={(inv) => {/* show view dialog, not implemented here */}}
            onPrint={(inv) => window.print()}
          />
          <ProjectsSection
            projects={projects}
            onEditProject={(proj) => {/* open project edit modal */}}
            onAddProject={() => setShowAddProjectDialog(true)}
            onEditProduct={(projId, prod) => {/* open product edit modal */}}
            onAddProduct={(projId) => {/* open add product modal */}}
          />
        </div>
      </div>

      {/* Add Project Dialog */}
      <AddProjectDialog
        isOpen={showAddProjectDialog}
        onClose={() => setShowAddProjectDialog(false)}
        customerId={customer?.id || ""}
        onAddProject={handleAddProject}
      />
    </>
  );
}
