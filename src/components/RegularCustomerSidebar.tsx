
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

  // Only run these hooks when customer?.id is available.
  const { getCustomerProjects } = useCustomerProjects();
  const { getCustomerInvoices } = useCustomerInvoices();

  // These are hooks that must be called unconditionally (React rule).
  const projectsQuery = customer?.id ? getCustomerProjects(customer.id) : { data: [], isLoading: false };
  const invoicesQuery = customer?.id ? getCustomerInvoices(customer.id) : { data: [], isLoading: false };

  const projects = projectsQuery?.data || [];
  const invoices = invoicesQuery?.data || [];

  const { products } = useSupabaseProducts();

  // Stats
  const totalSpent = invoices.reduce((sum: number, inv: any) => sum + (Number(inv.invoice?.total || 0)), 0);
  const dueAmount = invoices.reduce(
    (sum: number, inv: any) =>
      sum + (inv.invoice?.status === "paid" ? 0 : Number(inv.invoice?.total || 0)),
    0
  );

  useEffect(() => {
    setSidebarOpen(open);
  }, [open]);

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
          invoiceCount={invoices.length}
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
