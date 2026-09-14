import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';
import {
  Receipt,
  Plus,
  Share2,
  Download,
  Calendar,
  User,
  X,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const InvoicesScreen: React.FC = () => {
  const { invoices, customers, createInvoice, profile, showToast } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(invoices[0] || null);

  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemPrice, setItemPrice] = useState('850');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !itemName.trim()) return;

    const inv = createInvoice(customerName, [
      { name: itemName, quantity: parseInt(itemQty) || 1, unitPrice: parseFloat(itemPrice) || 0 }
    ]);

    setViewInvoice(inv);
    setShowCreateModal(false);
    setItemName('');
    setItemQty('1');
    setItemPrice('850');
  };

  const handleShareWhatsApp = (inv: Invoice) => {
    const text = `Invoice #${inv.invoiceNumber} from ${profile.name}\nCustomer: ${inv.customerName}\nAmount Due: ₹${inv.dueAmount}\nDue Date: ${inv.dueDate}\nPay securely via UPI: ${profile.upiId}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <span>Smart Business Invoices</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue professional bills & invoices with WhatsApp payment reminders
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Invoices List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
          <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">All Invoices ({invoices.length})</span>
          </div>

          {invoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => setViewInvoice(inv)}
              className={`p-4 flex items-center justify-between cursor-pointer transition ${
                viewInvoice?.id === inv.id ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-slate-900">{inv.invoiceNumber}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{inv.customerName}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-slate-900 block">₹{inv.totalAmount.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Due: {inv.dueDate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice Preview Card */}
        <div className="lg:col-span-7">
          {viewInvoice ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    Tax Invoice
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">{profile.name}</h3>
                  <p className="text-xs text-slate-500">{profile.address}</p>
                  <p className="text-xs text-slate-500">Phone: {profile.phone}</p>
                </div>

                <div className="text-right">
                  <h4 className="text-base font-black text-slate-900">{viewInvoice.invoiceNumber}</h4>
                  <p className="text-xs text-slate-500">Date: {viewInvoice.createdAt.split('T')[0]}</p>
                  <p className="text-xs text-amber-600 font-semibold mt-1">Due Date: {viewInvoice.dueDate}</p>
                </div>
              </div>

              {/* Billed to */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To</span>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">{viewInvoice.customerName}</h4>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2 font-bold">Item Description</th>
                      <th className="py-2 text-center font-bold">Qty</th>
                      <th className="py-2 text-right font-bold">Rate (₹)</th>
                      <th className="py-2 text-right font-bold">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewInvoice.items.map(item => (
                      <tr key={item.id} className="text-slate-800">
                        <td className="py-2.5 font-semibold">{item.name}</td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right">₹{item.unitPrice.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-bold">₹{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-1 text-xs">
                <div className="flex justify-between w-48 text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{viewInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-48 text-slate-500">
                  <span>Discount:</span>
                  <span>- ₹{viewInvoice.discount}</span>
                </div>
                <div className="flex justify-between w-48 font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-indigo-600">₹{viewInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleShareWhatsApp(viewInvoice)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-12 text-center text-slate-400 text-xs">
              Select an invoice from the list to preview
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Create New Invoice</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Customer *</label>
              <select
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Product / Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cotton Embroidered Kurti"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
              >
                Generate Bill
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
