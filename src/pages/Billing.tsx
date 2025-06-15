
import React, { useState } from 'react';
import { Plus, Search, FileText, Download, Eye } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
}

interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  date: string;
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
      id: 'INV-2024-001',
      date: '2024-01-15',
      customer: {
        id: '1',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        address: '123 Main Street, Mumbai',
        email: 'rajesh@email.com'
      },
      items: [
        { id: '1', productName: 'Asian Paints Wall Paint', quantity: 2, price: 1200, total: 2400 },
        { id: '2', productName: 'Berger Primer', quantity: 1, price: 800, total: 800 }
      ],
      subtotal: 3200,
      discount: 160,
      tax: 576,
      total: 3616,
      status: 'paid'
    },
    {
      id: 'INV-2024-002',
      date: '2024-01-16',
      customer: {
        id: '2',
        name: 'Priya Sharma',
        phone: '+91 87654 32109',
        address: '456 Garden Road, Delhi'
      },
      items: [
        { id: '1', productName: 'Dulux Weather Shield', quantity: 3, price: 1800, total: 5400 }
      ],
      subtotal: 5400,
      discount: 0,
      tax: 972,
      total: 6372,
      status: 'pending'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CreateInvoiceForm = ({ onClose }: { onClose: () => void }) => {
    const [customerData, setCustomerData] = useState<Partial<Customer>>({
      name: '',
      phone: '',
      address: '',
      email: ''
    });

    const [items, setItems] = useState<Partial<InvoiceItem>[]>([
      { productName: '', quantity: 1, price: 0, total: 0 }
    ]);

    const [discount, setDiscount] = useState(0);

    const addItem = () => {
      setItems([...items, { productName: '', quantity: 1, price: 0, total: 0 }]);
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'price') {
        const quantity = field === 'quantity' ? value : newItems[index].quantity || 0;
        const price = field === 'price' ? value : newItems[index].price || 0;
        newItems[index].total = quantity * price;
      }
      
      setItems(newItems);
    };

    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.18; // 18% GST
    const total = taxableAmount + tax;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newInvoice: Invoice = {
        id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        customer: customerData as Customer,
        items: items as InvoiceItem[],
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
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
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
                  placeholder="Address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Items */}
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
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded-lg">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={item.productName}
                      onChange={(e) => updateItem(index, 'productName', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                      min="0"
                      step="0.01"
                      required
                    />
                    <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                      <span className="text-sm font-medium">₹{item.total?.toFixed(2) || '0.00'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                      disabled={items.length === 1}
                    >
                      Remove
                    </button>
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
                    <span>Tax (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
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
                Billing & Invoices
              </h1>
              <p className="text-gray-600 mt-1">Create and manage customer invoices</p>
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
                    <h3 className="text-xl font-bold text-gray-900">{invoice.id}</h3>
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
                    </div>
                    <div>
                      <p><strong>Date:</strong> {invoice.date}</p>
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
                    <button className="text-green-600 hover:bg-green-50 p-2 rounded-lg">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
