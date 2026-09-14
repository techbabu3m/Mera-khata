import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Share2,
  Copy,
  Check,
  Award,
  Users,
  ExternalLink,
  Gift,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ReferralsScreen: React.FC = () => {
  const { referrals, navigateTo, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  // Generate actual production URL based on current origin
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://merakhata.app';
  const cleanCode = referrals.userReferralCode.replace('MERAKHATA-', '');
  const referralUrl = `${origin}/ref/${cleanCode}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      showToast('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Join Mera Khata – Smart Business Manager with my exclusive link and get ₹250 instant reward balance for your business: ${referralUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Mera Khata with my Referral',
          text: 'Manage your business ledger, invoices, dues and marketing with Babu AI.',
          url: referralUrl,
        });
      } catch (e) {
        // ignore
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-purple-100 text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/25">
                REFERRAL PARTNER PROGRAM
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mt-2">
              Invite Businesses, Earn ₹250 Every Time
            </h2>
            <p className="text-xs text-purple-100/90 mt-1 max-w-md">
              Share your working referral link with merchant friends. When they create an account, you both get ₹250 rewards credit!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-xs text-purple-200 block font-medium">Total Rewards Earned</span>
            <div className="text-3xl font-black text-amber-300 mt-0.5">
              ₹{referrals.totalRewardsEarned.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-200 mt-1 block">
              Redeemable for plans & SMS
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-medium block">Total Referrals</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {referrals.totalReferrals}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-emerald-600 font-medium block">Successful</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">
            {referrals.successfulReferrals}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-amber-600 font-medium block">Pending</span>
          <span className="text-xl font-bold text-amber-600 mt-1 block">
            {referrals.pendingReferrals}
          </span>
        </div>
      </div>

      {/* Share Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Your Working Production Referral Link</h3>
        
        {/* Referral URL Input Box */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-700 break-all select-all">
            {referralUrl}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Unique Referral Code: <strong className="text-slate-800 font-mono">{referrals.userReferralCode}</strong></span>
          <button
            onClick={() => navigateTo('REFERRAL_LANDING', { referralCode: cleanCode })}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
          >
            <span>Test Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Referral Attribution History
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Saved & persisted in database
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {referrals.history.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No referrals recorded yet. Share your link above to get started!
            </div>
          ) : (
            referrals.history.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                    {item.refereeName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.refereeName}</h4>
                    <p className="text-[11px] text-slate-400">Signed up on {item.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'SUCCESSFUL'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status === 'SUCCESSFUL' ? `+₹${item.rewardAmount} Credited` : 'Verification Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
