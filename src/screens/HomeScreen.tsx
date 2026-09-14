import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Receipt,
  Sparkles,
  AlertCircle,
  Plus,
  Palette,
  CreditCard,
  Share2,
  ChevronRight,
  Search
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    metrics,
    customers,
    transactions,
    profile,
    subscription,
    alerts,
    dismissAlert,
    navigateTo,
    openBabu,
    setSelectedCustomer,
    receivePayment,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [quickPaymentModal, setQuickPaymentModal] = useState<{ open: boolean; customerName: string; amount: string }>({
    open: false,
    customerName: '',
    amount: '',
  });

  const activeAlerts = alerts.filter(a => !a.dismissed);

  const filteredTransactions = transactions.filter(t =>
    (t.customerName && t.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Top Business Hero Card */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-400/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full text-blue-100 border border-white/20">
                {profile.category}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                subscription.status === 'Active' 
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
              }`}>
                {subscription.tier} {subscription.status === 'Free Trial' ? '(Trial)' : 'Plan'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
              {profile.name}
            </h1>
            <p className="text-xs text-blue-100/80 mt-1">
              {profile.phone} • {profile.address}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => openBabu(undefined, 'আজকের business কেমন?')}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Ask Babu Summary</span>
            </button>
            <button
              onClick={() => navigateTo('POSTER_STUDIO')}
              className="bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/30 font-semibold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 transition"
            >
              <Palette className="w-4 h-4 text-amber-300" />
              <span>Poster Studio</span>
            </button>
          </div>
        </div>

        {/* Proactive Insights Banner */}
        {activeAlerts.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {activeAlerts[0].title}
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {activeAlerts[0].message}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {activeAlerts[0].actionPrompt && (
                  <button
                    onClick={() => openBabu(undefined, activeAlerts[0].actionPrompt)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-[11px] px-3 py-1 rounded-lg transition"
                  >
                    Act Now
                  </button>
                )}
                <button
                  onClick={() => dismissAlert(activeAlerts[0].id)}
                  className="text-white/60 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Sales</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 mt-2">
            ₹{metrics.todaySales.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            Real-time verified
          </span>
        </div>

        {/* Total Due / Receivable */}
        <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-600">Customer Dues (বাকি)</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-red-600 mt-2">
            ₹{metrics.totalDue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {metrics.customersWithDue} customers owe money
          </span>
        </div>

        {/* Total Received */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Total Received</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-700 mt-2">
            ₹{metrics.totalReceived.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Collected into cash & UPI
          </span>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 mt-2">
            ₹{metrics.totalExpense.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Net Profit: ₹{(metrics.totalReceived - metrics.totalExpense).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-slate-100/70 p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => navigateTo('CUSTOMERS')}
          className="flex-1 min-w-[130px] bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 p-3 rounded-xl border border-slate-200 shadow-2xs font-semibold text-xs flex items-center justify-center space-x-2 transition"
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Customers ({customers.length})</span>
        </button>

        <button
          onClick={() => setQuickPaymentModal({ open: true, customerName: customers[0]?.name || '', amount: '' })}
          className="flex-1 min-w-[130px] bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 p-3 rounded-xl border border-slate-200 shadow-2xs font-semibold text-xs flex items-center justify-center space-x-2 transition"
        >
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>Record Payment</span>
        </button>

        <button
          onClick={() => navigateTo('INVOICES')}
          className="flex-1 min-w-[130px] bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 p-3 rounded-xl border border-slate-200 shadow-2xs font-semibold text-xs flex items-center justify-center space-x-2 transition"
        >
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>Create Invoice</span>
        </button>

        <button
          onClick={() => navigateTo('REFERRALS')}
          className="flex-1 min-w-[130px] bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-700 p-3 rounded-xl border border-slate-200 shadow-2xs font-semibold text-xs flex items-center justify-center space-x-2 transition"
        >
          <Share2 className="w-4 h-4 text-purple-600" />
          <span>Refer & Earn (₹250)</span>
        </button>
      </div>

      {/* Outstanding Dues Priority List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              Pending Customer Dues (তাগাদা ও বাকি)
            </h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {metrics.customersWithDue}
            </span>
          </div>
          <button
            onClick={() => navigateTo('CUSTOMERS')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {customers.filter(c => c.balance > 0).slice(0, 4).map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-sm">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">Outstanding</span>
                  <span className="text-sm font-black text-red-600">₹{c.balance.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCustomer(c);
                    openBabu(c.name, `${c.name}-er jonno ekta reminder baniye dao`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition flex items-center space-x-1"
                >
                  <span>Remind</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            Recent Ledger Entries
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTransactions.slice(0, 6).map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  tx.type === 'RECEIVE_PAYMENT' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : tx.type === 'SALE'
                    ? 'bg-blue-100 text-blue-700'
                    : tx.type === 'GIVE_CREDIT'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {tx.type === 'RECEIVE_PAYMENT' ? '↓' : tx.type === 'GIVE_CREDIT' ? '↑' : '🛒'}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    {tx.customerName || 'General Expense'}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="capitalize">{tx.paymentMode}</span>
                    {tx.note && <span>• {tx.note}</span>}
                  </div>
                </div>
              </div>

              <div className={`text-right font-bold text-sm ${
                tx.type === 'RECEIVE_PAYMENT' || tx.type === 'SALE'
                  ? 'text-emerald-600'
                  : 'text-slate-900'
              }`}>
                {tx.type === 'RECEIVE_PAYMENT' || tx.type === 'SALE' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Record Payment Modal */}
      {quickPaymentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Record Payment</h3>
            <p className="text-xs text-slate-500 mt-0.5">Directly update customer balance</p>

            <div className="space-y-3 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Customer</label>
                <select
                  value={quickPaymentModal.customerName}
                  onChange={(e) => setQuickPaymentModal({ ...quickPaymentModal, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} (Due: ₹{c.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={quickPaymentModal.amount}
                  onChange={(e) => setQuickPaymentModal({ ...quickPaymentModal, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-5">
              <button
                onClick={() => setQuickPaymentModal({ open: false, customerName: '', amount: '' })}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amt = parseFloat(quickPaymentModal.amount);
                  if (amt > 0 && quickPaymentModal.customerName) {
                    receivePayment(quickPaymentModal.customerName, amt, 'CASH');
                    setQuickPaymentModal({ open: false, customerName: '', amount: '' });
                  }
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
