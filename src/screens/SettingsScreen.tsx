import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessCategory, Language } from '../types';
import {
  Settings,
  Store,
  Phone,
  CreditCard,
  Volume2,
  Share2,
  CheckCircle2,
  Save,
  HelpCircle
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    profile,
    updateProfile,
    voiceLanguage,
    setVoiceLanguage,
    isMuted,
    toggleMute,
    whatsApp,
    navigateTo,
    showToast
  } = useApp();

  const [name, setName] = useState(profile.name);
  const [category, setCategory] = useState<BusinessCategory>(profile.category);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [upiId, setUpiId] = useState(profile.upiId);
  const [defaultOffer, setDefaultOffer] = useState(profile.defaultOffer);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(profile.preferredLanguage);

  const categories: BusinessCategory[] = [
    'Clothing Store',
    'Restaurant',
    'Electronics',
    'Grocery',
    'Salon',
    'Hardware',
    'Pharmacy',
    'General Retail',
    'Services',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profile,
      name,
      category,
      phone,
      address,
      upiId,
      defaultOffer,
      preferredLanguage,
    });
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-slate-700" />
          <span>Business & App Settings</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure store profile, UPI ID, voice preferences and AI branding
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <Store className="w-4 h-4 text-blue-600" />
          <span>Business Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Business Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Business Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BusinessCategory)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Business Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Business UPI ID for Invoices</label>
            <input
              type="text"
              placeholder="e.g. babugarments@okaxis"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Store Address & Location</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Default Poster Offer Tagline</label>
          <input
            type="text"
            value={defaultOffer}
            onChange={(e) => setDefaultOffer(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Babu Voice & Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Babu AI Voice & Language Preferences</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Default Assistant Language</span>
              <span className="text-[11px] text-slate-500">Language spoken when answering verbally</span>
            </div>
            <div className="flex items-center space-x-2">
              {(['Bengali', 'Hindi', 'English'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setPreferredLanguage(l);
                    setVoiceLanguage(l);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    voiceLanguage === l
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {l === 'Bengali' ? 'বাংলা' : l === 'Hindi' ? 'हिन्दी' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">WhatsApp Integration</span>
            <span className="text-[11px] text-slate-500">
              {whatsApp.isConnected ? `Connected: ${whatsApp.businessName} (${whatsApp.phoneNumber})` : 'Not Connected'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('POSTER_STUDIO')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Manage in Poster Studio →
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};
