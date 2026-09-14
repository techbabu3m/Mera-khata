import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import {
  CreditCard,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Receipt,
  Search,
  X
} from 'lucide-react';

export const TransactionsScreen: React.FC = () => {
  const { transactions, customers, addSale, receivePayment, addExpense, showToast } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [txType, setTxType] = useState<TransactionType>('SALE');
  const [targetCustomer, setTargetCustomer] = useState(customers[0]?.name || '');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Stock');
  const [note, setNote] = useState('');

  const filtered = transactions.filter(t => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (t.customerName && t.customerName.toLowerCase().includes(q)) ||
             (t.note && t.note.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!numAmt || numAmt <= 0) return;

    if (txType === 'SALE') {
      addSale(targetCustomer || 'Walk-in Customer', numAmt, note);
    } else if (txType === 'RECEIVE_PAYMENT') {
      receivePayment(targetCustomer || 'Walk-in Customer', numAmt, 'CASH', note);
    } else if (txType === 'EXPENSE') {
      addExpense(category, numAmt, note);
    }

    setShowAddModal(false);
    setAmount('');
    setNote('');
  };

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Cash & Khata Transactions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log sales, customer payments, credits and daily business expenses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto no-scrollbar">
          {(['ALL', 'RECEIVE_PAYMENT', 'SALE', 'EXPENSE', 'GIVE_CREDIT'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterType === tab
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All Entries' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No transactions match the selected filter.
          </div>
        ) : (
          filtered.map(tx => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  tx.type === 'RECEIVE_PAYMENT' || tx.type === 'SALE'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {tx.type === 'RECEIVE_PAYMENT' ? '↓' : tx.type === 'SALE' ? '🛒' : '↑'}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {tx.customerName || 'General Expense'}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-600">{tx.type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="uppercase">{tx.paymentMode}</span>
                    {tx.note && <span>• {tx.note}</span>}
                  </div>
                </div>
              </div>

              <div className={`text-right font-black text-sm ${
                tx.type === 'RECEIVE_PAYMENT' || tx.type === 'SALE'
                  ? 'text-emerald-600'
                  : 'text-slate-900'
              }`}>
                {tx.type === 'RECEIVE_PAYMENT' || tx.type === 'SALE' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateTx} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Record Entry</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['SALE', 'RECEIVE_PAYMENT', 'EXPENSE'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTxType(t)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    txType === t
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t === 'SALE' ? 'Sale' : t === 'RECEIVE_PAYMENT' ? 'Payment In' : 'Expense'}
                </button>
              ))}
            </div>

            {txType !== 'EXPENSE' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Customer</label>
                <select
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Electricity">Electricity</option>
                  <option value="Rent">Rent</option>
                  <option value="Staff Salary">Staff Salary</option>
                  <option value="Tea/Snacks">Tea/Snacks</option>
                  <option value="Stock/Supplies">Stock/Supplies</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                placeholder="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Linen shirt sale via UPI"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
