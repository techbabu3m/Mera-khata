import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { BabuAssistantModal } from './components/BabuAssistantModal';
import { BabuFloatingTrigger } from './components/BabuFloatingTrigger';

import { HomeScreen } from './screens/HomeScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { InvoicesScreen } from './screens/InvoicesScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { PosterStudioScreen } from './screens/PosterStudioScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { ReferralsScreen } from './screens/ReferralsScreen';
import { ReferralLandingScreen } from './screens/ReferralLandingScreen';
import { PricingScreen } from './screens/PricingScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainContent: React.FC = () => {
  const { currentScreen, toastMessage } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen />;
      case 'CUSTOMERS':
        return <CustomersScreen />;
      case 'TRANSACTIONS':
        return <TransactionsScreen />;
      case 'INVOICES':
        return <InvoicesScreen />;
      case 'PRODUCTS':
        return <ProductsScreen />;
      case 'POSTER_STUDIO':
        return <PosterStudioScreen />;
      case 'REPORTS':
        return <ReportsScreen />;
      case 'REFERRALS':
        return <ReferralsScreen />;
      case 'REFERRAL_LANDING':
      case 'INVALID_REFERRAL':
        return <ReferralLandingScreen />;
      case 'PRICING':
        return <PricingScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {renderScreen()}
      </main>

      {/* Persistent Babu AI Trigger & Modal */}
      <BabuFloatingTrigger />
      <BabuAssistantModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 border border-white/10">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
