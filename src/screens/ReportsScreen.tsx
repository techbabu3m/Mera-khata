import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Receipt,
  ArrowDownLeft,
  Sparkles,
  Calendar,
  Download
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { metrics, transactions, expenses, customers, openBabu, showToast } = useApp();

  const netProfit = metrics.totalReceived - metrics.totalExpense;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Business Intelligence & Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real profit/loss, daily collection summaries, and Babu analytics
          </p>
        </div>

        <button
          onClick={() => openBabu(undefined, 'আজকের business কেমন? বিস্তারিত রিপোর্ট দাও')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Babu for AI Analysis</span>
        </button>
      </div>

      {/* P&L Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
              Net Financial Standing
            </span>
            <h3 className="text-xs text-slate-300 mt-2 font-medium">Estimated Net Profit</h3>
            <div className={`text-3xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ₹{netProfit.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block">Total Revenue</span>
              <span className="font-bold text-white text-base">₹{metrics.totalReceived.toLocaleString()}</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block">Total Expenses</span>
              <span className="font-bold text-white text-base">₹{metrics.totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar comparison */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Operating Margin</span>
            <span className="text-emerald-400 font-bold">
              {metrics.totalReceived > 0 
                ? `${Math.round((netProfit / metrics.totalReceived) * 100)}% Profit Margin`
                : '0%'}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${Math.max(10, Math.min(100, (netProfit / (metrics.totalReceived || 1)) * 100))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Summary Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Today's Performance
          </span>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sales:</span>
              <span className="font-bold text-slate-900">₹{metrics.todaySales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Expenses:</span>
              <span className="font-bold text-red-600">₹{metrics.todayExpense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 font-bold">
              <span className="text-slate-700">Net Today:</span>
              <span className="text-emerald-600">₹{(metrics.todaySales - metrics.todayExpense).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Ledger Receivables
          </span>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Due:</span>
              <span className="font-black text-red-600">₹{metrics.totalDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pending Parties:</span>
              <span className="font-bold text-slate-900">{metrics.customersWithDue}</span>
            </div>
            <div className="flex justify-between py-1 font-bold">
              <span className="text-slate-700">Collection Rate:</span>
              <span className="text-indigo-600">
                {Math.round((metrics.totalReceived / (metrics.totalReceived + metrics.totalDue || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Customer Accounts
          </span>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Customers:</span>
              <span className="font-bold text-slate-900">{customers.length}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Active this month:</span>
              <span className="font-bold text-emerald-600">{customers.length}</span>
            </div>
            <div className="flex justify-between py-1 font-bold">
              <span className="text-slate-700">Average Due:</span>
              <span className="text-slate-900">
                ₹{Math.round(metrics.totalDue / (metrics.customersWithDue || 1)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
