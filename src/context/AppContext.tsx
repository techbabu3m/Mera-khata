import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Customer,
  Transaction,
  Invoice,
  Product,
  Expense,
  BusinessProfile,
  AIPoster,
  PosterScheduleSettings,
  WhatsAppConnection,
  Subscription,
  ReferralData,
  ProactiveAlert,
  BabuMessage,
  VoiceLanguage,
} from '../types';
import { db } from '../services/db';
import { processBabuMessage, ScreenContext } from '../services/gemini';
import { speech } from '../services/speech';
import { automation } from '../services/automation';

export type ScreenType = 
  | 'HOME' 
  | 'CUSTOMERS' 
  | 'TRANSACTIONS' 
  | 'INVOICES' 
  | 'PRODUCTS' 
  | 'REPORTS' 
  | 'POSTER_STUDIO' 
  | 'NOTIFICATIONS' 
  | 'REFERRALS' 
  | 'PRICING' 
  | 'SETTINGS'
  | 'REFERRAL_LANDING'
  | 'INVALID_REFERRAL';

interface AppContextType {
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType, params?: any) => void;
  screenParams: any;

  // Data
  customers: Customer[];
  transactions: Transaction[];
  invoices: Invoice[];
  products: Product[];
  expenses: Expense[];
  profile: BusinessProfile;
  posters: AIPoster[];
  posterSchedule: PosterScheduleSettings;
  whatsApp: WhatsAppConnection;
  subscription: Subscription;
  referrals: ReferralData;
  alerts: ProactiveAlert[];
  metrics: ReturnType<typeof db.getBusinessMetrics>;

  // Selection Context
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (inv: Invoice | null) => void;

  // Actions
  refreshData: () => void;
  addCustomer: (name: string, phone: string, balance?: number, address?: string) => Customer;
  receivePayment: (customerIdentifier: string, amount: number, mode?: any, note?: string) => void;
  addSale: (customerIdentifier: string, amount: number, note?: string) => void;
  addExpense: (category: string, amount: number, note?: string) => void;
  createInvoice: (customerName: string, items: any[]) => Invoice;
  deletePoster: (id: string) => void;
  updateProfile: (profile: BusinessProfile) => void;
  updatePosterSchedule: (settings: PosterScheduleSettings) => void;
  updateSubscription: (tier: Subscription['tier'], period: Subscription['billingPeriod']) => void;
  applyReferralCode: (code: string, newUserName: string) => { success: boolean; message: string };
  dismissAlert: (id: string) => void;

  // Babu AI Assistant
  isBabuOpen: boolean;
  openBabu: (contextCustomerName?: string, initialQuery?: string) => void;
  closeBabu: () => void;
  babuMessages: BabuMessage[];
  isBabuThinking: boolean;
  sendBabuMessage: (text: string) => Promise<void>;
  isSpeaking: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  stopSpeaking: () => void;
  replayLastSpeech: () => void;
  voiceLanguage: VoiceLanguage;
  setVoiceLanguage: (lang: VoiceLanguage) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');
  const [screenParams, setScreenParams] = useState<any>({});

  // DB States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profile, setProfile] = useState<BusinessProfile>(db.getProfile());
  const [posters, setPosters] = useState<AIPoster[]>([]);
  const [posterSchedule, setPosterSchedule] = useState<PosterScheduleSettings>(db.getPosterSchedule());
  const [whatsApp, setWhatsApp] = useState<WhatsAppConnection>(db.getWhatsApp());
  const [subscription, setSubscription] = useState<Subscription>(db.getSubscription());
  const [referrals, setReferrals] = useState<ReferralData>(db.getReferralData());
  const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
  const [metrics, setMetrics] = useState(db.getBusinessMetrics());

  // Context Selection
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Babu Assistant States
  const [isBabuOpen, setIsBabuOpen] = useState(false);
  const [isBabuThinking, setIsBabuThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(speech.getMuted());
  const [voiceLanguage, setVoiceLangState] = useState<VoiceLanguage>(speech.getLanguage());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [babuMessages, setBabuMessages] = useState<BabuMessage[]>([
    {
      id: 'init-1',
      sender: 'babu',
      text: 'নমস্কার! আমি আপনার স্মার্ট বিজনেস অ্যাসিস্ট্যান্ট "বাবু"। আজকের সেলস চেক, পেমেন্ট জমা, কাস্টমার বাকি বা বিজনেস পোস্টার তৈরি—যে কোনো নির্দেশ আমাকে দিতে পারেন!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshData = () => {
    setCustomers(db.getCustomers());
    setTransactions(db.getTransactions());
    setInvoices(db.getInvoices());
    setProducts(db.getProducts());
    setExpenses(db.getExpenses());
    setProfile(db.getProfile());
    setPosters(db.getPosters());
    setPosterSchedule(db.getPosterSchedule());
    setWhatsApp(db.getWhatsApp());
    setSubscription(db.getSubscription());
    setReferrals(db.getReferralData());
    setAlerts(db.getAlerts());
    setMetrics(db.getBusinessMetrics());
  };

  // URL Path & Referral Checking on Mount & Route Changes
  useEffect(() => {
    refreshData();

    // Start background poster automation & alerts
    automation.startScheduler(
      (newAlert) => {
        setAlerts(db.getAlerts());
        showToast(`🔔 ${newAlert.title}`);
      },
      () => {
        setPosters(db.getPosters());
        showToast('🎨 Daily AI Business Poster generated!');
      }
    );

    const handlePath = () => {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Check /ref/:code or /referral/:code
      const refMatch = pathname.match(/^\/(?:ref|referral)\/([a-zA-Z0-9_-]+)/i);
      const queryRef = searchParams.get('ref') || searchParams.get('referral');

      const refCode = refMatch ? refMatch[1] : queryRef;

      if (refCode) {
        const normalized = refCode.toUpperCase();
        // Valid if matches user referral format or standard length
        if (normalized === 'MERAKHATA-AB12CD' || (normalized.startsWith('MERAKHATA-') && normalized.length >= 10) || normalized === 'AB12CD') {
          setCurrentScreen('REFERRAL_LANDING');
          setScreenParams({ referralCode: normalized });
        } else {
          setCurrentScreen('INVALID_REFERRAL');
          setScreenParams({ invalidCode: refCode });
        }
      }
    };

    handlePath();
    window.addEventListener('popstate', handlePath);

    return () => {
      automation.stopScheduler();
      window.removeEventListener('popstate', handlePath);
    };
  }, []);

  const navigateTo = (screen: ScreenType, params: any = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
    if (screen !== 'REFERRAL_LANDING' && screen !== 'INVALID_REFERRAL') {
      window.history.pushState({}, '', '/');
    }
  };

  // Action Executions
  const addCustomer = (name: string, phone: string, balance: number = 0, address: string = ''): Customer => {
    const cust = db.addCustomer(name, phone, balance, address);
    refreshData();
    showToast(`Customer ${cust.name} added!`);
    return cust;
  };

  const receivePayment = (customerIdentifier: string, amount: number, mode: any = 'CASH', note: string = '') => {
    const res = db.receivePayment(customerIdentifier, amount, mode, note);
    refreshData();
    showToast(res.message);
  };

  const addSale = (customerIdentifier: string, amount: number, note: string = '') => {
    db.addSale(customerIdentifier, amount, note);
    refreshData();
    showToast(`Sale of ₹${amount} recorded!`);
  };

  const addExpense = (category: string, amount: number, note: string = '') => {
    db.addExpense(category, amount, note);
    refreshData();
    showToast(`Expense of ₹${amount} recorded!`);
  };

  const createInvoice = (customerName: string, items: any[]): Invoice => {
    const inv = db.createInvoice(customerName, items);
    refreshData();
    showToast(`Invoice #${inv.invoiceNumber} created!`);
    return inv;
  };

  const deletePoster = (id: string) => {
    db.deletePoster(id);
    refreshData();
    showToast('Poster removed.');
  };

  const updateProfile = (p: BusinessProfile) => {
    db.saveProfile(p);
    setProfile(p);
    showToast('Business profile updated!');
  };

  const updatePosterSchedule = (s: PosterScheduleSettings) => {
    db.savePosterSchedule(s);
    setPosterSchedule(s);
    showToast('Daily poster schedule saved!');
  };

  const updateSubscription = (tier: Subscription['tier'], period: Subscription['billingPeriod']) => {
    const monthlyPrices = { Starter: 149, Medium: 249, Gold: 399 };
    const yearlyPrices = { Starter: 1490, Medium: 2490, Gold: 3990 };

    const updated: Subscription = {
      tier,
      billingPeriod: period,
      status: 'Active',
      trialEndsAt: subscription.trialEndsAt,
      renewsAt: new Date(Date.now() + (period === 'monthly' ? 30 : 365) * 86400000).toISOString(),
      monthlyPrice: monthlyPrices[tier],
      yearlyPrice: yearlyPrices[tier],
    };
    db.saveSubscription(updated);
    setSubscription(updated);
    showToast(`Subscribed to ${tier} Plan (${period}) successfully!`);
  };

  const applyReferralCode = (code: string, newUserName: string) => {
    const res = db.recordReferralAttribution(code, newUserName);
    refreshData();
    return res;
  };

  const dismissAlert = (id: string) => {
    db.dismissAlert(id);
    refreshData();
  };

  // Babu AI Controls
  const openBabu = (contextCustomerName?: string, initialQuery?: string) => {
    if (contextCustomerName) {
      const found = db.findCustomer(contextCustomerName);
      if (found) setSelectedCustomer(found);
    }
    setIsBabuOpen(true);
    if (initialQuery) {
      sendBabuMessage(initialQuery);
    }
  };

  const closeBabu = () => {
    setIsBabuOpen(false);
    speech.stop();
    setIsSpeaking(false);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    speech.setMuted(next);
    if (next) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    speech.stop();
    setIsSpeaking(false);
  };

  const replayLastSpeech = () => {
    speech.replay(
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const setVoiceLanguage = (lang: VoiceLanguage) => {
    setVoiceLangState(lang);
    speech.setLanguage(lang);
  };

  // Send Message to Babu & Execute Actions in Real Time
  const sendBabuMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: BabuMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBabuMessages(prev => [...prev, userMsg]);
    setIsBabuThinking(true);

    const screenContext: ScreenContext = {
      screenName: currentScreen,
      selectedCustomerName: selectedCustomer?.name,
      selectedCustomerId: selectedCustomer?.id,
      selectedInvoiceNumber: selectedInvoice?.invoiceNumber,
    };

    const historyForModel = babuMessages.slice(-6).map(m => ({
      role: m.sender === 'user' ? 'user' as const : 'model' as const,
      text: m.text,
    }));

    try {
      const result = await processBabuMessage(userText, historyForModel, screenContext);

      // Execute Real Database Action if matched
      let executedActionInfo: BabuMessage['actionExecuted'] = undefined;

      if (result.actionType === 'RECEIVE_PAYMENT' && result.extractedData?.amount) {
        const custName = result.extractedData.customerName || selectedCustomer?.name || 'Customer';
        const res = db.receivePayment(custName, result.extractedData.amount, result.extractedData.paymentMode || 'CASH');
        executedActionInfo = {
          type: 'RECEIVE_PAYMENT',
          details: `₹${result.extractedData.amount} received from ${res.customer?.name || custName}. New Due: ₹${res.customer?.balance ?? 0}`,
          success: true,
        };
        refreshData();
      } else if (result.actionType === 'ADD_SALE' && result.extractedData?.amount) {
        const custName = result.extractedData.customerName || selectedCustomer?.name || 'Customer';
        const res = db.addSale(custName, result.extractedData.amount, result.extractedData.note);
        executedActionInfo = {
          type: 'ADD_SALE',
          details: `Sale of ₹${result.extractedData.amount} recorded for ${res.customer.name}`,
          success: true,
        };
        refreshData();
      } else if (result.actionType === 'ADD_EXPENSE' && result.extractedData?.amount) {
        const exp = db.addExpense(result.extractedData.category || 'General', result.extractedData.amount, result.extractedData.note);
        executedActionInfo = {
          type: 'ADD_EXPENSE',
          details: `Expense of ₹${exp.amount} (${exp.category}) recorded`,
          success: true,
        };
        refreshData();
      } else if (result.actionType === 'CREATE_INVOICE') {
        const custName = result.extractedData?.customerName || selectedCustomer?.name || 'Rahul Roy';
        const inv = db.createInvoice(custName, [
          { name: result.extractedData?.productName || 'Handloom Apparel', quantity: 1, unitPrice: result.extractedData?.amount || 1200 }
        ]);
        executedActionInfo = {
          type: 'CREATE_INVOICE',
          details: `Invoice #${inv.invoiceNumber} created for ${custName} (Total: ₹${inv.totalAmount})`,
          success: true,
        };
        refreshData();
      } else if (result.actionType === 'GENERATE_POSTER') {
        navigateTo('POSTER_STUDIO');
      }

      const babuMsg: BabuMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'babu',
        text: result.babuSpeech,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionExecuted: executedActionInfo,
        clarificationNeeded: !!result.clarificationQuestion,
      };

      setBabuMessages(prev => [...prev, babuMsg]);

      // Speak response out loud using natural voice
      if (!isMuted) {
        speech.speak(
          result.babuSpeech,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch (e: any) {
      const errorMsg: BabuMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'babu',
        text: 'দুঃখিত, নির্দেশটি বুঝতে কিছুটা সমস্যা হয়েছে। অনুগ্রহ করে আবার বলুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setBabuMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsBabuThinking(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        screenParams,
        customers,
        transactions,
        invoices,
        products,
        expenses,
        profile,
        posters,
        posterSchedule,
        whatsApp,
        subscription,
        referrals,
        alerts,
        metrics,
        selectedCustomer,
        setSelectedCustomer,
        selectedInvoice,
        setSelectedInvoice,
        refreshData,
        addCustomer,
        receivePayment,
        addSale,
        addExpense,
        createInvoice,
        deletePoster,
        updateProfile,
        updatePosterSchedule,
        updateSubscription,
        applyReferralCode,
        dismissAlert,
        isBabuOpen,
        openBabu,
        closeBabu,
        babuMessages,
        isBabuThinking,
        sendBabuMessage,
        isSpeaking,
        isMuted,
        toggleMute,
        stopSpeaking,
        replayLastSpeech,
        voiceLanguage,
        setVoiceLanguage,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
