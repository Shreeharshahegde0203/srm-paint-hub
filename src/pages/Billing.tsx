import React, { useState } from 'react';
import { Plus, Search, FileText, Download, Eye, Trash2 } from 'lucide-react';
import ProductSelector from '../components/ProductSelector';
import { Product, productsDatabase } from '../data/products';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  gstin?: string;
}

interface InvoiceItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
}

const Billing = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'SRM-2024-001',
      date: '2024-01-15',
      time: '10:30 AM',
      customer: {
        id: '1',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        address: '123 Main Street, Mumbai',
        email: 'rajesh@email.com',
        gstin: '27AABCU9603R1ZM'
      },
      items: [
        { 
          id: '1', 
          product: productsDatabase[0], 
          quantity: 2, 
          unitPrice: 1200, 
          total: 2400 
        }
      ],
      subtotal: 2400,
      discount: 120,
      tax: 410.4,
      total: 2690.4,
      status: 'paid'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const number = (invoices.length + 1).toString().padStart(3, '0');
    return `SRM-${year}-${number}`;
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    generateInvoicePDF(invoice);
  };

  const CreateInvoiceForm = ({ onClose }: { onClose: () => void }) => {
    const [customerData, setCustomerData] = useState<Partial<Customer>>({
      name: '',
      phone: '',
      address: '',
      email: '',
      gstin: ''
    });

    const [items, setItems] = useState<Partial<InvoiceItem>[]>([
      { product: undefined, quantity: 1, unitPrice: 0, total: 0 }
    ]);

    const [discount, setDiscount] = useState(0);

    const addItem = () => {
      setItems([...items, { product: undefined, quantity: 1, unitPrice: 0, total: 0 }]);
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? value : newItems[index].quantity || 0;
        const unitPrice = field === 'unitPrice' ? value : newItems[index].unitPrice || 0;
        newItems[index].total = quantity * unitPrice;
      }
      
      setItems(newItems);
    };

    const handleProductSelect = (index: number, product: Product) => {
      const newItems = [...items];
      newItems[index] = { 
        ...newItems[index], 
        product, 
        unitPrice: product.price,
        total: (newItems[index].quantity || 1) * product.price
      };
      setItems(newItems);
    };

    const removeItem = (index: number) => {
      if (items.length > 1) {
        setItems(items.filter((_, i) => i !== index));
      }
    };

    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.18; // 18% GST
    const total = taxableAmount + tax;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const now = new Date();
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: generateInvoiceNumber(),
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        customer: customerData as Customer,
        items: items.map(item => ({
          ...item,
          id: Date.now().toString() + Math.random()
        })) as InvoiceItem[],
        subtotal,
        discount: discountAmount,
        tax,
        total,
        status: 'pending'
      };

      setInvoices([...invoices, newInvoice]);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-screen overflow-y-auto">
          <h3 className="text-2xl font-bold mb-6">Create New Invoice</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4">Customer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="GSTIN (Optional)"
                  value={customerData.gstin}
                  onChange={(e) => setCustomerData({ ...customerData, gstin: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  className="w-full p-2 border rounded-lg md:col-span-2"
                  required
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Invoice Items</h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <ProductSelector
                          onProductSelect={(product) => handleProductSelect(index, product)}
                          selectedProduct={item.product}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full p-2 border rounded-lg"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Unit Price</label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border rounded-lg"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Total</label>
                        <div className="flex items-center p-2 bg-gray-100 rounded-lg h-10">
                          <span className="text-sm font-medium">₹{item.total?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg h-10"
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4">Invoice Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Create Invoice
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-3 h-8 w-8 text-green-600" />
                Professional Billing System
              </h1>
              <p className="text-gray-600 mt-1">Create GST compliant invoices with smart product lookup and professional PDF generation</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{invoice.invoiceNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Customer:</strong> {invoice.customer.name}</p>
                      <p><strong>Phone:</strong> {invoice.customer.phone}</p>
                      {invoice.customer.gstin && <p><strong>GSTIN:</strong> {invoice.customer.gstin}</p>}
                    </div>
                    <div>
                      <p><strong>Date:</strong> {invoice.date} at {invoice.time}</p>
                      <p><strong>Items:</strong> {invoice.items.length} product(s)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{invoice.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(invoice)}
                      className="text-green-600 hover:bg-green-50 p-2 rounded-lg"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">Create your first invoice to get started</p>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateForm && (
        <CreateInvoiceForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export default Billing;
