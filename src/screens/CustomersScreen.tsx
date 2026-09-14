import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import {
  Users,
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  MessageSquare,
  Sparkles,
  Check,
  X
} from 'lucide-react';

export const CustomersScreen: React.FC = () => {
  const {
    customers,
    addCustomer,
    receivePayment,
    openBabu,
    setSelectedCustomer,
    selectedCustomer,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const [paymentModal, setPaymentModal] = useState<{ open: boolean; customer: Customer | null; amount: string }>({
    open: false,
    customer: null,
    amount: '',
  });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCustomer(newName, newPhone, parseFloat(newBalance) || 0, newAddress);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewBalance('');
    setNewAddress('');
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Customers & Khata Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer accounts, track credit & settle balances
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by customer name or mobile number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
        />
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No customers found matching "{search}".
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition ${
                selectedCustomer?.id === c.id ? 'bg-blue-50/40 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`w-11 h-11 rounded-2xl font-bold flex items-center justify-center text-sm ${
                  c.balance > 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                    {selectedCustomer?.id === c.id && (
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">
                        ACTIVE IN BABU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                    <span>{c.phone}</span>
                    {c.address && <span>• {c.address}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Balance</span>
                  <span className={`text-sm font-black ${c.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {c.balance > 0 ? `₹${c.balance.toLocaleString()} Due` : 'Settled'}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      setSelectedCustomer(c);
                      openBabu(c.name, `What is the due status for ${c.name}?`);
                    }}
                    title="Ask Babu about this customer"
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setPaymentModal({ open: true, customer: c, amount: '' })}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition"
                  >
                    Pay
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <form onSubmit={handleAddCustomer} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Add Customer to Khata</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Subhash Ghosh"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="+91 98300 12345"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Starting Balance / Old Due (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Address / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Sector 2, Salt Lake"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
              >
                Save Customer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModal.open && paymentModal.customer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Receive Payment</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              From <span className="font-semibold text-slate-800">{paymentModal.customer.name}</span> (Due: ₹{paymentModal.customer.balance})
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-600 block mb-1">Payment Amount (₹)</label>
              <input
                type="number"
                placeholder="Amount in Rupees"
                value={paymentModal.amount}
                onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 mt-5">
              <button
                onClick={() => setPaymentModal({ open: false, customer: null, amount: '' })}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amt = parseFloat(paymentModal.amount);
                  if (amt > 0 && paymentModal.customer) {
                    receivePayment(paymentModal.customer.name, amt, 'CASH');
                    setPaymentModal({ open: false, customer: null, amount: '' });
                  }
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
