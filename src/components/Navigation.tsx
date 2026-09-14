import React from 'react';
import { useApp, ScreenType } from '../context/AppContext';
import {
  Home,
  Users,
  CreditCard,
  Receipt,
  Package,
  Palette,
  BarChart3,
  Share2,
  Settings,
  Sparkles,
  Bot
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentScreen, navigateTo, profile, subscription, openBabu, isSpeaking } = useApp();

  const navItems: { id: ScreenType; label: string; icon: any }[] = [
    { id: 'HOME', label: 'Home', icon: Home },
    { id: 'CUSTOMERS', label: 'Khata', icon: Users },
    { id: 'TRANSACTIONS', label: 'Ledger', icon: CreditCard },
    { id: 'INVOICES', label: 'Bills', icon: Receipt },
    { id: 'POSTER_STUDIO', label: 'Poster AI', icon: Palette },
    { id: 'PRODUCTS', label: 'Stock', icon: Package },
    { id: 'REPORTS', label: 'Reports', icon: BarChart3 },
    { id: 'REFERRALS', label: 'Refer & Earn', icon: Share2 },
  ];

  // Do not show standard navigation on referral landing screens
  if (currentScreen === 'REFERRAL_LANDING' || currentScreen === 'INVALID_REFERRAL') {
    return null;
  }

  return (
    <>
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => navigateTo('HOME')}
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              MK
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm md:text-base text-slate-900 tracking-tight">
                  Mera Khata
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  SMART
                </span>
              </div>
              <span className="text-[11px] text-slate-500 truncate max-w-[140px] sm:max-w-[240px] block font-medium">
                {profile.name}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Subscription badge */}
            <button
              onClick={() => navigateTo('PRICING')}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{subscription.status === 'Free Trial' ? 'Free Trial' : subscription.tier}</span>
            </button>

            {/* Babu trigger from header */}
            <button
              onClick={() => openBabu()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Babu AI</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => navigateTo('SETTINGS')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Floating Navigation for Mobile & Desktop tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-1.5 px-2">
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                  isActive
                    ? 'text-blue-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
