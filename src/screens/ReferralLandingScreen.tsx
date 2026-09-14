import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles
} from 'lucide-react';

export const ReferralLandingScreen: React.FC = () => {
  const { currentScreen, screenParams, applyReferralCode, navigateTo, showToast } = useApp();

  const isInvalid = currentScreen === 'INVALID_REFERRAL';
  const referralCode = screenParams?.referralCode || 'MERAKHATA-AB12CD';

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Clothing Store');
  const [signedUp, setSignedUp] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim()) return;

    // Apply and save referral attribution in database
    const res = applyReferralCode(referralCode, businessName);
    setSignedUp(true);
    showToast(res.message);

    setTimeout(() => {
      navigateTo('HOME');
    }, 2000);
  };

  if (isInvalid) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900">
            Referral Link is Invalid or Expired
          </h2>

          <p className="text-xs text-slate-500 leading-relaxed">
            The referral code <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800">{screenParams?.invalidCode || 'UNKNOWN'}</code> could not be verified or has already expired. You can still use Mera Khata free for your business!
          </p>

          <button
            onClick={() => navigateTo('HOME')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>Proceed to Mera Khata App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
        {/* Welcome Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Gift className="w-6 h-6" />
          </div>
          <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ₹250 Welcome Reward Activated
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            You're Invited to Join Mera Khata!
          </h2>
          <p className="text-xs text-slate-500">
            Special merchant invitation applied: <strong className="font-mono text-blue-600 font-bold">{referralCode}</strong>
          </p>
        </div>

        {signedUp ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900">Account Created & Referral Verified!</h3>
            <p className="text-xs text-emerald-700">₹250 credit added. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Maa Tara Sweets"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Owner Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Subir Karmakar"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98300 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Business Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Clothing Store">Clothing Store</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Grocery">Grocery</option>
                <option value="Electronics">Electronics</option>
                <option value="Salon">Salon</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="General Retail">General Retail</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes 3-Day Full Free Trial with unlimited Babu AI.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Create Account & Claim ₹250</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
