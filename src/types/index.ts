export type Language = 'Bengali' | 'Hindi' | 'English';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number; // > 0 means customer owes us money (due/receivable), < 0 means advance paid
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'RECEIVE_PAYMENT' | 'GIVE_CREDIT' | 'SALE' | 'EXPENSE';

export interface Transaction {
  id: string;
  customerId?: string;
  customerName?: string;
  type: TransactionType;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK' | 'CHEQUE';
  date: string;
  note?: string;
  invoiceId?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
  dueDate: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockAlert: number;
  unit: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  paymentMode: string;
  createdAt: string;
}

export type BusinessCategory = 
  | 'Restaurant' 
  | 'Clothing Store' 
  | 'Electronics' 
  | 'Grocery' 
  | 'Salon' 
  | 'Hardware' 
  | 'Pharmacy' 
  | 'General Retail' 
  | 'Services';

export interface BusinessProfile {
  name: string;
  category: BusinessCategory;
  phone: string;
  email: string;
  address: string;
  upiId: string;
  currency: string;
  brandColor: string;
  logoUrl?: string;
  preferredLanguage: Language;
  defaultOffer: string;
}

export type PosterType =
  | 'Daily Offer'
  | 'New Product'
  | 'Discount'
  | 'Festival Offer'
  | 'Product Promotion'
  | 'Service Promotion'
  | 'Payment Reminder'
  | 'Store Announcement'
  | 'Special Offer'
  | 'Customer Appreciation'
  | 'Weekend Offer'
  | 'Seasonal Promotion';

export type PosterStyle =
  | 'Modern'
  | 'Luxury'
  | 'Minimal'
  | 'Festival'
  | 'Bold'
  | 'Professional'
  | 'Retail'
  | 'Food'
  | 'Technology'
  | 'Local Business';

export interface AIPoster {
  id: string;
  title: string;
  tagline: string;
  offerDetails: string;
  type: PosterType;
  style: PosterStyle;
  timingSlot?: 'Morning' | 'Afternoon' | 'Evening' | 'Custom';
  bgGradient: string;
  accentColor: string;
  callToAction: string;
  contactDisplay: string;
  productName?: string;
  discountPercent?: string;
  validUntil?: string;
  status: 'Generated' | 'Scheduled' | 'Sent' | 'Failed';
  sharedStatus?: string;
  sentTimestamp?: string;
  failReason?: string;
  createdAt: string;
}

export interface PosterScheduleSettings {
  autoDailyEnabled: boolean;
  morningTime: string;
  morningEnabled: boolean;
  afternoonTime: string;
  afternoonEnabled: boolean;
  eveningTime: string;
  eveningEnabled: boolean;
  whatsappAutoShare: boolean;
  autoShareMorning: boolean;
  autoShareAfternoon: boolean;
  autoShareEvening: boolean;
}

export interface WhatsAppConnection {
  isConnected: boolean;
  phoneNumber: string;
  businessName: string;
  accountId: string;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  connectedAt?: string;
  authorizedScopes: string[];
}

export type SubscriptionTier = 'Starter' | 'Medium' | 'Gold';
export type SubscriptionStatus = 'Free Trial' | 'Active' | 'Expired' | 'Cancelled' | 'Payment Failed';

export interface Subscription {
  tier: SubscriptionTier;
  billingPeriod: 'monthly' | 'yearly';
  status: SubscriptionStatus;
  trialEndsAt: string;
  renewsAt: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

export interface ReferralHistoryItem {
  id: string;
  refereeName: string;
  date: string;
  status: 'SUCCESSFUL' | 'PENDING';
  rewardAmount: number;
}

export interface ReferralData {
  userReferralCode: string;
  referredBy?: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalRewardsEarned: number;
  history: ReferralHistoryItem[];
}

export interface BabuMessage {
  id: string;
  sender: 'user' | 'babu';
  text: string;
  timestamp: string;
  actionExecuted?: {
    type: string;
    details: string;
    success: boolean;
  };
  clarificationNeeded?: boolean;
}

export interface ProactiveAlert {
  id: string;
  title: string;
  message: string;
  type: 'PAYMENT_PENDING' | 'EXPENSE_ALERT' | 'LOW_STOCK' | 'SALES_SPIKE' | 'OVERDUE_PAYMENT' | 'SMART_POSTER_SUGGESTION';
  actionPrompt?: string;
  relatedId?: string;
  dismissed: boolean;
  timestamp: string;
}

export interface ActionExtractionResult {
  understood: boolean;
  actionType?: 
    | 'ADD_CUSTOMER'
    | 'EDIT_CUSTOMER'
    | 'SEARCH_CUSTOMER'
    | 'ADD_SALE'
    | 'ADD_EXPENSE'
    | 'RECEIVE_PAYMENT'
    | 'CREATE_INVOICE'
    | 'UPDATE_INVOICE'
    | 'CHECK_DUE'
    | 'PAYMENT_REMINDER'
    | 'CUSTOMER_FOLLOWUP'
    | 'INVENTORY_LOOKUP'
    | 'ADD_PRODUCT'
    | 'UPDATE_STOCK'
    | 'SALES_REPORT'
    | 'EXPENSE_REPORT'
    | 'PROFIT_REPORT'
    | 'DAILY_SUMMARY'
    | 'WEEKLY_SUMMARY'
    | 'MONTHLY_SUMMARY'
    | 'BUSINESS_INSIGHTS'
    | 'GENERATE_POSTER';
  extractedData?: {
    customerName?: string;
    amount?: number;
    productName?: string;
    quantity?: number;
    date?: string;
    category?: string;
    note?: string;
    dueDate?: string;
    paymentMode?: 'CASH' | 'UPI' | 'BANK' | 'CHEQUE';
    invoiceNumber?: string;
  };
  clarificationQuestion?: string;
  missingField?: string;
  babuSpeech: string;
  languageDetected?: 'Bengali' | 'Hindi' | 'English' | 'Mixed';
}
