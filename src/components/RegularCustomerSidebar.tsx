
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CustomerSummary } from "./CustomerSummary";
import { InvoiceHistorySection } from "./InvoiceHistorySection";
import { ProjectsSection } from "./ProjectsSection";
import { useCustomerProjects } from "@/hooks/useCustomerProjects";
import { useCustomerInvoices } from "@/hooks/useCustomerInvoices";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";

interface Props {
  customer: any | null;
  open: boolean;
  onClose: () => void;
}

export default function RegularCustomerSidebar({ customer, open, onClose }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Always call hooks at the top level, never conditionally!
  const { getCustomerProjects } = useCustomerProjects();
  const { getCustomerInvoices } = useCustomerInvoices();

  // Call hook regardless, use "enabled" to suppress fetch if no ID
  const projectsQuery = getCustomerProjects(customer?.id ?? "UNSET_ID");
  const invoicesQuery = getCustomerInvoices(customer?.id ?? "UNSET_ID");

  // Defensive: always arrays, never undefined!
  let projects: any[] = [];
  if (Array.isArray(projectsQuery.data)) {
    projects = projectsQuery.data;
  } else if (
    projectsQuery.data &&
    typeof projectsQuery.data === "object" &&
    "length" in projectsQuery.data
  ) {
    projects = projectsQuery.data;
  } else {
    projects = [];
  }

  let invoices: any[] = [];
  if (Array.isArray(invoicesQuery.data)) {
    invoices = invoicesQuery.data;
  } else if (
    invoicesQuery.data &&
    typeof invoicesQuery.data === "object" &&
    "length" in invoicesQuery.data
  ) {
    invoices = invoicesQuery.data;
  } else {
    invoices = [];
  }

  // DEBUG LOGGING to catch edge cases
  if (process.env.NODE_ENV !== "production") {
    if (!Array.isArray(projects)) {
      console.warn("projects variable is not an array", projectsQuery, projectsQuery?.data);
    }
    if (!Array.isArray(invoices)) {
      console.warn("invoices variable is not an array", invoicesQuery, invoicesQuery?.data);
    }
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

  // Don't render unless properly loaded and customer exists
  if (!sidebarOpen || !customer) return null;

  return (
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
          onAddProject={() => {/* open add project modal */}}
          onEditProduct={(projId, prod) => {/* open product edit modal */}}
          onAddProduct={(projId) => {/* open add product modal */}}
        />
      </div>
    </div>
  );
}
