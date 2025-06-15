
import React, { useState } from "react";
import { X, Edit } from "lucide-react";
import { useCustomerProjects } from "@/hooks/useCustomerProjects";
import { useCustomerPayments } from "@/hooks/useCustomerPayments";
import { useCustomerInvoices } from "@/hooks/useCustomerInvoices";
import { useSupabaseInvoices } from "@/hooks/useSupabaseInvoices";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import EditInvoiceForm from "./EditInvoiceForm";

interface CustomerDetailModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailModal = ({ customer, isOpen, onClose }: CustomerDetailModalProps) => {
  const { getCustomerProjects } = useCustomerProjects();
  const { getCustomerPayments } = useCustomerPayments();
  const { getCustomerInvoices } = useCustomerInvoices();
  const { editInvoice } = useSupabaseInvoices();
  const { products } = useSupabaseProducts();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  const projectsQuery = getCustomerProjects(customer?.id);
  const paymentsQuery = getCustomerPayments(customer?.id);
  const invoicesQuery = getCustomerInvoices(customer?.id);

  React.useEffect(() => {
    if (projectsQuery.data) setProjects(projectsQuery.data);
  }, [projectsQuery.data]);

  React.useEffect(() => {
    if (paymentsQuery.data) setPayments(paymentsQuery.data);
  }, [paymentsQuery.data]);

  React.useEffect(() => {
    if (invoicesQuery.data) setInvoices(invoicesQuery.data);
  }, [invoicesQuery.data]);

  if (!isOpen) return null;

  const handleEditInvoice = async (invoiceData: any) => {
    await editInvoice(editingInvoice.invoice.id, invoiceData);
    setEditingInvoice(null);
    // Refresh invoices
    invoicesQuery.refetch();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-40">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {customer.name} - Details
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Phone:</strong> {customer.phone || "N/A"}</div>
              <div><strong>Type:</strong> {customer.customer_type}</div>
              <div><strong>Address:</strong> {customer.address || "N/A"}</div>
              <div><strong>Notes:</strong> {customer.notes || "N/A"}</div>
            </div>
          </div>

          {/* Projects */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Projects</h3>
            {projectsQuery.isLoading ? (
              <div className="text-gray-500">Loading projects...</div>
            ) : projects.length > 0 ? (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                    <div className="font-medium">{project.project_name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Status: {project.status} | Site: {project.site_address || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No projects found</div>
            )}
          </div>

          {/* Invoices */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Invoices</h3>
            {invoicesQuery.isLoading ? (
              <div className="text-gray-500">Loading invoices...</div>
            ) : invoices.length > 0 ? (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">Invoice #{invoice.invoice?.id?.slice(0, 8)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Project: {invoice.project?.project_name || "N/A"} | 
                        Date: {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit Invoice"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No invoices found</div>
            )}
          </div>

          {/* Payments */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Payment History</h3>
            {paymentsQuery.isLoading ? (
              <div className="text-gray-500">Loading payments...</div>
            ) : payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">₹{payment.paid_amount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {payment.payment_method} | {new Date(payment.payment_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {payment.notes && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Notes: {payment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No payments found</div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <EditInvoiceForm
          invoice={editingInvoice.invoice}
          products={products || []}
          onSave={handleEditInvoice}
          onCancel={() => setEditingInvoice(null)}
        />
      )}
    </>
  );
};

export default CustomerDetailModal;
