import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIPoster, PosterType, PosterStyle } from '../types';
import { generateAIPoster, downloadPosterAsImage } from '../services/posterGenerator';
import { connectWhatsAppAccount, disconnectWhatsApp, sendPosterViaWhatsApp } from '../services/whatsapp';
import {
  Palette,
  Sparkles,
  Download,
  Share2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Settings,
  Send,
  Sliders,
  Calendar
} from 'lucide-react';

export const PosterStudioScreen: React.FC = () => {
  const {
    posters,
    posterSchedule,
    updatePosterSchedule,
    whatsApp,
    profile,
    deletePoster,
    refreshData,
    showToast,
  } = useApp();

  const [selectedPoster, setSelectedPoster] = useState<AIPoster | null>(posters[0] || null);
  const [selectedType, setSelectedType] = useState<PosterType>('Daily Offer');
  const [selectedStyle, setSelectedStyle] = useState<PosterStyle>('Modern');
  const [selectedSlot, setSelectedSlot] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Custom'>('Morning');
  const [customOffer, setCustomOffer] = useState('');
  const [discountPercent, setDiscountPercent] = useState('20%');

  // Schedule & WhatsApp modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [waPhone, setWaPhone] = useState(whatsApp.phoneNumber || '');
  const [waBusinessName, setWaBusinessName] = useState(whatsApp.businessName || profile.name);

  const posterTypes: PosterType[] = [
    'Daily Offer',
    'New Product',
    'Discount',
    'Festival Offer',
    'Product Promotion',
    'Service Promotion',
    'Payment Reminder',
    'Store Announcement',
    'Special Offer',
    'Customer Appreciation',
    'Weekend Offer',
    'Seasonal Promotion',
  ];

  const posterStyles: PosterStyle[] = [
    'Modern',
    'Luxury',
    'Minimal',
    'Festival',
    'Bold',
    'Professional',
    'Retail',
    'Food',
    'Technology',
    'Local Business',
  ];

  const handleGenerateNew = () => {
    const newPoster = generateAIPoster({
      type: selectedType,
      style: selectedStyle,
      timingSlot: selectedSlot,
      customOffer: customOffer || undefined,
      discountPercent: discountPercent || undefined,
    });
    const saved = useApp().addPoster ? (useApp() as any).addPoster(newPoster) : newPoster;
    // or add directly via context
    refreshData();
    setSelectedPoster(saved);
    showToast(`✨ Generated ${selectedType} poster!`);
  };

  const handleDownload = async (poster: AIPoster) => {
    showToast('Preparing high-res poster image...');
    await downloadPosterAsImage(poster, profile);
    showToast('Poster downloaded successfully!');
  };

  const handleShareWhatsApp = async (poster: AIPoster) => {
    if (!whatsApp.isConnected) {
      setShowWhatsAppModal(true);
      return;
    }
    showToast('Dispatching to WhatsApp Business...');
    const res = await sendPosterViaWhatsApp(poster);
    refreshData();
    showToast(res.message);
  };

  const handleConnectWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await connectWhatsAppAccount(waPhone, waBusinessName);
    refreshData();
    if (res.success) {
      setShowWhatsAppModal(false);
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Palette className="w-5 h-5 text-indigo-600" />
              <span>AI Poster Studio</span>
            </h2>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Pro Automation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generate & broadcast branded promotional marketing posters for {profile.name}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* WhatsApp Connection Status */}
          <button
            onClick={() => setShowWhatsAppModal(true)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition border ${
              whatsApp.isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${whatsApp.isConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            <span>{whatsApp.isConnected ? 'WhatsApp Connected' : 'Connect WhatsApp'}</span>
          </button>

          {/* Schedule Settings Button */}
          <button
            onClick={() => setShowScheduleModal(true)}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-2xs transition"
            title="Daily Poster Automation Settings"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Poster Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {selectedPoster ? (
            <div className="w-full max-w-md bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[520px] transition-all">
              {/* Subtle top badge */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-300/30">
                    ★ {profile.category} • {selectedPoster.timingSlot} Edition
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{selectedPoster.style}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black tracking-tight text-white/90">
                    {profile.name}
                  </span>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="my-auto py-6 space-y-4 text-center">
                <h3 className="text-2xl font-black leading-tight tracking-tight text-white">
                  {selectedPoster.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium px-4">
                  {selectedPoster.tagline}
                </p>

                {/* Offer Highlight Box */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner max-w-sm mx-auto space-y-2">
                  {selectedPoster.discountPercent && (
                    <span className="inline-block bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-xs">
                      {selectedPoster.discountPercent} OFF
                    </span>
                  )}
                  <p className="text-sm font-bold text-white leading-snug">
                    {selectedPoster.offerDetails}
                  </p>
                  {selectedPoster.validUntil && (
                    <span className="text-[10px] text-amber-200/90 font-medium block">
                      ⏰ {selectedPoster.validUntil}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Banner */}
              <div className="space-y-3 pt-3 border-t border-white/15 text-center">
                <div className="bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs py-2 px-4 rounded-xl shadow-md transition">
                  {selectedPoster.callToAction}
                </div>
                <div className="text-[10px] text-slate-400">
                  <span>{selectedPoster.contactDisplay}</span>
                  <span className="block text-[9px] text-slate-500 mt-0.5">
                    Generated with Babu AI Studio
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md h-[480px] bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 text-xs">
              No poster selected
            </div>
          )}

          {/* Action Toolbar for Selected Poster */}
          {selectedPoster && (
            <div className="mt-4 flex items-center space-x-2.5 w-full max-w-md justify-center">
              <button
                onClick={() => handleDownload(selectedPoster)}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center space-x-1.5 transition"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(selectedPoster)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>

              <button
                onClick={() => deletePoster(selectedPoster.id)}
                className="p-2.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-xl transition"
                title="Delete Poster"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Generation Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Smart Poster Generator</span>
            </h3>

            {/* Poster Type Dropdown */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Poster Campaign Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PosterType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {posterTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Visual Style Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Visual Art Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as PosterStyle)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {posterStyles.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Timing Slot */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Broadcast Timing Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Morning', 'Afternoon', 'Evening'] as const).map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      selectedSlot === slot
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Discount/Offer (Optional) */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Custom Offer / Discount (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Flat 25% OFF or Buy 2 Get 1 Free"
                value={customOffer}
                onChange={(e) => setCustomOffer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateNew}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Poster Now</span>
            </button>
          </div>

          {/* Poster Gallery / History */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
              Poster Gallery ({posters.length})
            </h4>
            <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {posters.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPoster(p)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    selectedPoster?.id === p.id
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-bold text-indigo-700">{p.timingSlot || 'Daily'}</span>
                    <span>{p.type}</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 truncate">{p.title}</h5>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className={`font-semibold ${p.status === 'Sent' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {p.status}
                    </span>
                    <span className="text-slate-400">{p.style}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Automated Daily Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Daily Poster Automation
                </h3>
                <p className="text-xs text-slate-500">
                  Automatic AI poster generation & WhatsApp scheduling
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Master Toggle */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-900 block">
                  Automatic Daily Generation
                </span>
                <span className="text-[11px] text-indigo-700/90">
                  Generate 3 fresh posters every day automatically
                </span>
              </div>
              <input
                type="checkbox"
                checked={posterSchedule.autoDailyEnabled}
                onChange={(e) => updatePosterSchedule({ ...posterSchedule, autoDailyEnabled: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>

            {/* 3 Slots */}
            <div className="space-y-3">
              {/* Morning Slot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Morning Slot</span>
                  <span className="text-[11px] text-slate-500">Breakfast / New Arrivals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={posterSchedule.morningTime}
                    onChange={(e) => updatePosterSchedule({ ...posterSchedule, morningTime: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                  />
                  <input
                    type="checkbox"
                    checked={posterSchedule.morningEnabled}
                    onChange={(e) => updatePosterSchedule({ ...posterSchedule, morningEnabled: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>

              {/* Afternoon Slot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Afternoon Slot</span>
                  <span className="text-[11px] text-slate-500">Lunch / Flash Discounts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={posterSchedule.afternoonTime}
                    onChange={(e) => updatePosterSchedule({ ...posterSchedule, afternoonTime: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                  />
                  <input
                    type="checkbox"
                    checked={posterSchedule.afternoonEnabled}
                    onChange={(e) => updatePosterSchedule({ ...posterSchedule, afternoonEnabled: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>

              {/* Evening Slot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Evening Slot</span>
                  <span className="text-[11px] text-slate-500">Dinner / Special Offers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={posterSchedule.eveningTime}
                    onChange={(e) => updatePosterSchedule({ ...posterSchedule, eveningTime: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                  />
                  <input
                    type="checkbox"
                    checked={posterSchedule.eveningEnabled}
                    onChange={(e) => updatePosterSchedule({ ...posterSchedule, eveningEnabled: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Auto Share Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Auto-Share to WhatsApp
                </span>
                <span className="text-[11px] text-slate-500">
                  {whatsApp.isConnected ? 'Requires authorized connection' : 'Connect WhatsApp first'}
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!whatsApp.isConnected}
                checked={posterSchedule.whatsappAutoShare}
                onChange={(e) => updatePosterSchedule({ ...posterSchedule, whatsappAutoShare: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>

            <button
              onClick={() => setShowScheduleModal(false)}
              className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Official Connect Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    WhatsApp Business Setup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connect official messaging account
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {whatsApp.isConnected ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      WhatsApp Connected & Authorized
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Account: {whatsApp.businessName} ({whatsApp.phoneNumber})
                    </p>
                    <p className="text-[11px] text-emerald-600 mt-1">
                      WABA ID: {whatsApp.accountId} • Messages & Post broadcast active
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    disconnectWhatsApp();
                    refreshData();
                    showToast('WhatsApp disconnected.');
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs py-2.5 rounded-xl border border-red-200 transition"
                >
                  Disconnect WhatsApp Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectWhatsApp} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    WhatsApp Business Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98300 00000"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Business Display Name
                  </label>
                  <input
                    type="text"
                    value={waBusinessName}
                    onChange={(e) => setWaBusinessName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                  🔒 Explicit business owner authorization required. WhatsApp messaging scopes will be enabled for promotional posters and customer payment reminders.
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition"
                >
                  Authorize & Connect Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
