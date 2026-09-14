import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionTier } from '../types';
import {
  Check,
  Zap,
  Crown,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const PricingScreen: React.FC = () => {
  const { subscription, updateSubscription, showToast } = useApp();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: {
    tier: SubscriptionTier;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    features: string[];
    isPopular?: boolean;
    icon: any;
  }[] = [
    {
      tier: 'Starter',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      description: 'Essential ledger & AI assistant for local shops and traders',
      features: [
        'Unlimited Customers & Transactions',
        'Babu AI Assistant (Bengali/Hindi/English)',
        'Basic Payment Reminders via WhatsApp',
        'Standard Daily Sales Reports',
        '1 AI Business Poster per day',
      ],
      icon: Zap,
    },
    {
      tier: 'Medium',
      monthlyPrice: 249,
      yearlyPrice: 2490,
      description: 'Ideal for growing retail stores wanting automated marketing',
      features: [
        'Everything in Starter',
        'Automatic 3x Daily Poster Generation (Morning/Afternoon/Evening)',
        'Official WhatsApp Business Auto-Broadcast',
        'Detailed Profit & Loss Analytics',
        'Inventory Low-Stock Telemetry',
        'Multi-device Khata sync',
      ],
      isPopular: true,
      icon: Sparkles,
    },
    {
      tier: 'Gold',
      monthlyPrice: 399,
      yearlyPrice: 3990,
      description: 'Ultimate all-in-one smart business management powerhouse',
      features: [
        'Everything in Medium',
        'Priority Babu AI Deep Reasoning Engine',
        'Unlimited High-Res Studio Marketing Posters',
        'Custom Brand Logo & Custom Colors on Posters',
        'Automated Customer Follow-up Agent',
        'VIP Phone & WhatsApp Priority Support',
      ],
      icon: Crown,
    },
  ];

  const handleSelectPlan = (tier: SubscriptionTier) => {
    updateSubscription(tier, billingPeriod);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Current Subscription Status Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm md:text-base text-slate-900">
                Current Status: {subscription.status}
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {subscription.tier} Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {subscription.status === 'Free Trial' 
                ? '3-Day Full Access Free Trial active. No card required.' 
                : `Active subscription renewed on ${new Date(subscription.renewsAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Billing:</span>
          <span className="font-bold text-slate-800 capitalize">{subscription.billingPeriod}</span>
        </div>
      </div>

      {/* Header Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Transparent, Simple Business Plans
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
          Every plan comes with a 3-Day Free Trial. Upgrade anytime to unlock automated posters and Babu AI power.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl mt-3 border border-slate-200">
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              billingPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 ${
              billingPeriod === 'yearly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Yearly (Save 17%)</span>
            <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-black">
              2 MOS FREE
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = subscription.tier === plan.tier && subscription.status === 'Active';
          const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

          return (
            <div
              key={plan.tier}
              className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'border-2 border-blue-600 shadow-xl ring-4 ring-blue-50'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Most Popular for Merchants
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {plan.tier}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900">₹{price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 min-h-[36px] leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mt-6 pt-6 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    What's included
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => handleSelectPlan(plan.tier)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1.5 ${
                    isCurrent
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : plan.isPopular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{isCurrent ? 'Current Active Plan' : `Subscribe to ${plan.tier}`}</span>
                  {!isCurrent && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Guarantee Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center space-x-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          Instant activation via UPI, Debit/Credit Card or Netbanking. No forced automatic deductions without merchant confirmation.
        </span>
      </div>
    </div>
  );
};
