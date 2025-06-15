
import React, { useState } from "react";
import { useCustomerProjects } from "@/hooks/useCustomerProjects";
import { useCustomerPayments } from "@/hooks/useCustomerPayments";
import { useCustomerInvoices } from "@/hooks/useCustomerInvoices";
import { toast } from "@/hooks/use-toast";
import { X, Plus, Edit, DollarSign, Building, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Tables } from "@/integrations/supabase/types";

interface CustomerDetailModalProps {
  customer: Tables<"regular_customers">;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailModal = ({ customer, isOpen, onClose }: CustomerDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"projects" | "invoices" | "payments">("projects");
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  
  const { getCustomerProjects, addProject, updateProject } = useCustomerProjects();
  const { getCustomerPayments, addPayment, getCustomerDueAmount } = useCustomerPayments();
  const { getCustomerInvoices } = useCustomerInvoices();

  const projectsQuery = getCustomerProjects(customer.id);
  const paymentsQuery = getCustomerPayments(customer.id);
  const invoicesQuery = getCustomerInvoices(customer.id);

  const [projectForm, setProjectForm] = useState({
    project_name: "",
    status: "in_progress",
    estimated_quantity: 0,
    site_address: "",
    completion_date: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    paid_amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: "cash",
    notes: "",
  });

  const [dueAmount, setDueAmount] = useState<number | null>(null);

  React.useEffect(() => {
    if (customer.id && activeTab === "payments") {
      getCustomerDueAmount(customer.id).then(setDueAmount).catch(console.error);
    }
  }, [customer.id, activeTab]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject({
        regular_customer_id: customer.id,
        ...projectForm,
        estimated_quantity: projectForm.estimated_quantity || null,
        completion_date: projectForm.completion_date || null,
      });
      toast({ title: "Project added successfully" });
      setShowAddProject(false);
      setProjectForm({
        project_name: "",
        status: "in_progress",
        estimated_quantity: 0,
        site_address: "",
        completion_date: "",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPayment({
        regular_customer_id: customer.id,
        ...paymentForm,
      });
      toast({ title: "Payment recorded successfully" });
      setShowAddPayment(false);
      setPaymentForm({
        paid_amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: "cash",
        notes: "",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, status: string) => {
    try {
      await updateProject({
        id: projectId,
        project: { status, completion_date: status === "completed" ? new Date().toISOString().split('T')[0] : null },
      });
      toast({ title: "Project status updated" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {customer.phone} | {customer.address} | Type: {customer.customer_type}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: "projects", label: "Projects", icon: Building },
            { id: "invoices", label: "Purchase History", icon: Calendar },
            { id: "payments", label: "Payments & Due", icon: DollarSign },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center px-6 py-3 border-b-2 transition-colors ${
                activeTab === id
                  ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ongoing Projects</h3>
                <button
                  onClick={() => setShowAddProject(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </button>
              </div>

              {showAddProject && (
                <form onSubmit={handleAddProject} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={projectForm.project_name}
                      onChange={(e) => setProjectForm({ ...projectForm, project_name: e.target.value })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Site Address"
                      value={projectForm.site_address}
                      onChange={(e) => setProjectForm({ ...projectForm, site_address: e.target.value })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Estimated Quantity"
                      value={projectForm.estimated_quantity}
                      onChange={(e) => setProjectForm({ ...projectForm, estimated_quantity: Number(e.target.value) })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                    />
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Add Project
                    </button>
                    <button type="button" onClick={() => setShowAddProject(false)} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {projectsQuery.data?.map((project) => (
                  <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{project.project_name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Site: {project.site_address}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Est. Quantity: {project.estimated_quantity || "Not specified"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            project.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {project.status === "completed" ? "Completed" : "In Progress"}
                        </span>
                        {project.status === "in_progress" && (
                          <button
                            onClick={() => handleUpdateProjectStatus(project.id, "completed")}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Purchase History</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesQuery.data?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{new Date(invoice.created_at!).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.invoice?.id.slice(0, 8)}...</TableCell>
                      <TableCell>{invoice.project?.project_name || "No Project"}</TableCell>
                      <TableCell>₹{invoice.invoice?.total}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm ${
                          invoice.invoice?.status === "paid" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {invoice.invoice?.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payments & Due Amount</h3>
                  {dueAmount !== null && (
                    <p className={`text-lg font-bold ${dueAmount > 0 ? "text-red-600" : "text-green-600"}`}>
                      Due: ₹{dueAmount}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowAddPayment(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </button>
              </div>

              {showAddPayment && (
                <form onSubmit={handleAddPayment} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Payment Amount"
                      value={paymentForm.paid_amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paid_amount: Number(e.target.value) })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                      required
                    />
                    <input
                      type="date"
                      value={paymentForm.payment_date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                      required
                    />
                    <select
                      value={paymentForm.payment_method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      className="p-2 border rounded dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Record Payment
                    </button>
                    <button type="button" onClick={() => setShowAddPayment(false)} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsQuery.data?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-green-600 font-semibold">₹{payment.paid_amount}</TableCell>
                      <TableCell className="capitalize">{payment.payment_method}</TableCell>
                      <TableCell>{payment.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
