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
} from '../types';

const STORAGE_KEYS = {
  CUSTOMERS: 'merakhata_customers_v1',
  TRANSACTIONS: 'merakhata_transactions_v1',
  INVOICES: 'merakhata_invoices_v1',
  PRODUCTS: 'merakhata_products_v1',
  EXPENSES: 'merakhata_expenses_v1',
  BUSINESS_PROFILE: 'merakhata_profile_v1',
  POSTERS: 'merakhata_posters_v1',
  POSTER_SCHEDULE: 'merakhata_poster_schedule_v1',
  WHATSAPP: 'merakhata_whatsapp_v1',
  SUBSCRIPTION: 'merakhata_subscription_v1',
  REFERRALS: 'merakhata_referrals_v1',
  ALERTS: 'merakhata_alerts_v1',
};

// Seed initial realistic data for Mera Khata
const initialProfile: BusinessProfile = {
  name: 'Babu Modern Garments & Fabrics',
  category: 'Clothing Store',
  phone: '+91 98301 23456',
  email: 'contact@babugarments.in',
  address: 'Shop 14, New Market, Kolkata, West Bengal',
  upiId: 'babugarments@okaxis',
  currency: '₹',
  brandColor: '#1354c4',
  preferredLanguage: 'Bengali',
  defaultOffer: 'Flat 15% OFF on Summer Festive Kurtis & Shirts',
};

const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Roy',
    phone: '+91 98310 99887',
    email: 'rahul.roy@example.com',
    address: 'Lake Gardens, Kolkata',
    balance: 2400, // owes us ₹2400
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Ananya Sharma',
    phone: '+91 98312 33445',
    email: 'ananya.s@example.com',
    address: 'Salt Lake Sector 1, Kolkata',
    balance: 850,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'cust-3',
    name: 'Kabir Das',
    phone: '+91 98744 55667',
    email: 'kabir.das@example.com',
    address: 'Bhowanipore, Kolkata',
    balance: 0,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'cust-4',
    name: 'Pooja Agarwal',
    phone: '+91 98234 11223',
    email: 'pooja.a@example.com',
    address: 'Park Street, Kolkata',
    balance: 4200,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Cotton Embroidered Kurti',
    category: 'Women Wear',
    sellingPrice: 850,
    costPrice: 520,
    stockQuantity: 18,
    minStockAlert: 5,
    unit: 'pcs',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Slim Fit Linen Shirt (Sky Blue)',
    category: 'Men Wear',
    sellingPrice: 1200,
    costPrice: 750,
    stockQuantity: 4, // low stock!
    minStockAlert: 8,
    unit: 'pcs',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Handloom Cotton Saree',
    category: 'Traditional',
    sellingPrice: 2200,
    costPrice: 1400,
    stockQuantity: 12,
    minStockAlert: 3,
    unit: 'pcs',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Denim Jeans Regular',
    category: 'Men Wear',
    sellingPrice: 1450,
    costPrice: 900,
    stockQuantity: 22,
    minStockAlert: 6,
    unit: 'pcs',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
];

const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    customerId: 'cust-1',
    customerName: 'Rahul Roy',
    type: 'SALE',
    amount: 1450,
    paymentMode: 'UPI',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    note: 'Denim Jeans purchase',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'tx-2',
    customerId: 'cust-2',
    customerName: 'Ananya Sharma',
    type: 'RECEIVE_PAYMENT',
    amount: 1000,
    paymentMode: 'CASH',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    note: 'Part payment cleared',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'tx-3',
    customerId: 'cust-4',
    customerName: 'Pooja Agarwal',
    type: 'GIVE_CREDIT',
    amount: 4200,
    paymentMode: 'CASH',
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    note: 'Saree & Kurtis on credit due in 10 days',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    category: 'Electricity',
    amount: 1850,
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    note: 'Showroom AC & display electricity bill',
    paymentMode: 'UPI',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'exp-2',
    category: 'Tea/Snacks',
    amount: 280,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    note: 'Staff tea & customer snacks',
    paymentMode: 'CASH',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-001',
    customerId: 'cust-1',
    customerName: 'Rahul Roy',
    items: [
      { id: 'i-1', productId: 'prod-4', name: 'Denim Jeans Regular', quantity: 1, unitPrice: 1450, total: 1450 },
      { id: 'i-2', productId: 'prod-2', name: 'Slim Fit Linen Shirt', quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    subtotal: 2650,
    discount: 250,
    tax: 0,
    totalAmount: 2400,
    paidAmount: 0,
    dueAmount: 2400,
    status: 'UNPAID',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const initialPosters: AIPoster[] = [
  {
    id: 'post-1',
    title: 'Summer Festive Collection 2026',
    tagline: 'Beat the heat in pure handloom elegance',
    offerDetails: 'Special Flat 15% OFF on all Embroidered Kurtis & Linen Shirts!',
    type: 'Daily Offer',
    style: 'Modern',
    timingSlot: 'Morning',
    bgGradient: 'from-amber-600 via-rose-600 to-indigo-900',
    accentColor: '#f59e0b',
    callToAction: 'Visit Our Store or WhatsApp Today!',
    contactDisplay: '+91 98301 23456 • New Market, Kolkata',
    productName: 'Handloom Kurtis & Shirts',
    discountPercent: '15%',
    validUntil: 'Valid this week only',
    status: 'Generated',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Weekend Flash Sale!',
    tagline: 'Premium Silk & Handloom Sarees',
    offerDetails: 'Buy Any 2 Sarees & Get an Extra ₹500 Instant Discount!',
    type: 'Weekend Offer',
    style: 'Festival',
    timingSlot: 'Evening',
    bgGradient: 'from-purple-900 via-pink-700 to-rose-500',
    accentColor: '#ec4899',
    callToAction: 'Limited Stocks Available • Shop Now',
    contactDisplay: '+91 98301 23456 • New Market, Kolkata',
    productName: 'Handloom Cotton Saree',
    discountPercent: '20%',
    validUntil: 'Saturday & Sunday',
    status: 'Generated',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

const initialPosterSchedule: PosterScheduleSettings = {
  autoDailyEnabled: true,
  morningTime: '09:00',
  morningEnabled: true,
  afternoonTime: '13:00',
  afternoonEnabled: true,
  eveningTime: '18:00',
  eveningEnabled: true,
  whatsappAutoShare: false,
  autoShareMorning: true,
  autoShareAfternoon: true,
  autoShareEvening: true,
};

const initialSubscription: Subscription = {
  tier: 'Starter',
  billingPeriod: 'monthly',
  status: 'Free Trial',
  trialEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(),
  renewsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  monthlyPrice: 149,
  yearlyPrice: 1490,
};

const initialReferralData: ReferralData = {
  userReferralCode: 'MERAKHATA-AB12CD',
  totalReferrals: 3,
  successfulReferrals: 2,
  pendingReferrals: 1,
  totalRewardsEarned: 500,
  history: [
    {
      id: 'ref-1',
      refereeName: 'Suman Enterprise',
      date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      status: 'SUCCESSFUL',
      rewardAmount: 250,
    },
    {
      id: 'ref-2',
      refereeName: 'Maa Tara Sweets',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      status: 'SUCCESSFUL',
      rewardAmount: 250,
    },
    {
      id: 'ref-3',
      refereeName: 'New Fashion Corner',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'PENDING',
      rewardAmount: 0,
    }
  ],
};

const initialAlerts: ProactiveAlert[] = [
  {
    id: 'alert-1',
    title: '3 Customers Have Outstanding Due',
    message: 'Rahul Roy, Ananya Sharma, and Pooja Agarwal have a combined pending balance of ₹7,450.',
    type: 'PAYMENT_PENDING',
    actionPrompt: 'Ask Babu to send friendly WhatsApp payment reminders',
    dismissed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    title: 'Low Stock Alert: Linen Shirts',
    message: 'Slim Fit Linen Shirt (Sky Blue) is down to 4 pcs (Threshold: 8 pcs). Restock soon!',
    type: 'LOW_STOCK',
    relatedId: 'prod-2',
    actionPrompt: 'Check inventory stock details',
    dismissed: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alert-3',
    title: 'AI Smart Poster Suggestion',
    message: 'Summer season is peaking! Would you like Babu to generate a "Summer Kurti Discount" poster for WhatsApp status?',
    type: 'SMART_POSTER_SUGGESTION',
    actionPrompt: 'Generate Summer Kurti Poster',
    dismissed: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  }
];

class DatabaseService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // Customers
  getCustomers(): Customer[] {
    return this.get(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  }

  saveCustomers(customers: Customer[]): void {
    this.set(STORAGE_KEYS.CUSTOMERS, customers);
  }

  findCustomer(query: string): Customer | undefined {
    const q = query.trim().toLowerCase();
    const list = this.getCustomers();
    return list.find(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }

  addCustomer(name: string, phone: string = '', balance: number = 0, address: string = ''): Customer {
    const customers = this.getCustomers();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
      balance,
      address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customers.unshift(newCust);
    this.saveCustomers(customers);
    return newCust;
  }

  // Transactions
  getTransactions(): Transaction[] {
    return this.get(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  }

  saveTransactions(transactions: Transaction[]): void {
    this.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  receivePayment(customerIdentifier: string, amount: number, paymentMode: 'CASH' | 'UPI' | 'BANK' | 'CHEQUE' = 'CASH', note: string = ''): { success: boolean; customer?: Customer; transaction?: Transaction; message: string } {
    let customer = this.findCustomer(customerIdentifier);
    const customers = this.getCustomers();
    
    if (!customer) {
      // Create customer automatically if not found
      customer = this.addCustomer(customerIdentifier, '', 0);
    }

    const updatedCustomers = customers.map(c => {
      if (c.id === customer!.id || c.name.toLowerCase() === customer!.name.toLowerCase()) {
        const newBal = Math.max(0, c.balance - amount);
        return { ...c, balance: newBal, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    this.saveCustomers(updatedCustomers);

    const transactions = this.getTransactions();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      type: 'RECEIVE_PAYMENT',
      amount,
      paymentMode,
      date: new Date().toISOString().split('T')[0],
      note: note || `Payment received from ${customer.name}`,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    this.saveTransactions(transactions);

    return {
      success: true,
      customer: { ...customer, balance: Math.max(0, customer.balance - amount) },
      transaction: newTx,
      message: `Received ₹${amount} from ${customer.name}. New balance: ₹${Math.max(0, customer.balance - amount)}`,
    };
  }

  addSale(customerIdentifier: string, amount: number, note: string = '', paymentMode: 'CASH' | 'UPI' | 'BANK' | 'CHEQUE' = 'CASH'): { success: boolean; customer: Customer; transaction: Transaction } {
    let customer = this.findCustomer(customerIdentifier);
    if (!customer) {
      customer = this.addCustomer(customerIdentifier, '', 0);
    }

    const transactions = this.getTransactions();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      type: 'SALE',
      amount,
      paymentMode,
      date: new Date().toISOString().split('T')[0],
      note: note || `Sale to ${customer.name}`,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    this.saveTransactions(transactions);

    return { success: true, customer, transaction: newTx };
  }

  giveCredit(customerIdentifier: string, amount: number, note: string = ''): { success: boolean; customer: Customer; transaction: Transaction } {
    let customer = this.findCustomer(customerIdentifier);
    if (!customer) {
      customer = this.addCustomer(customerIdentifier, '', amount);
    } else {
      const customers = this.getCustomers();
      const updated = customers.map(c => c.id === customer!.id ? { ...c, balance: c.balance + amount } : c);
      this.saveCustomers(updated);
      customer = { ...customer, balance: customer.balance + amount };
    }

    const transactions = this.getTransactions();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      type: 'GIVE_CREDIT',
      amount,
      paymentMode: 'CASH',
      date: new Date().toISOString().split('T')[0],
      note: note || `Credit given to ${customer.name}`,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    this.saveTransactions(transactions);

    return { success: true, customer, transaction: newTx };
  }

  // Products & Inventory
  getProducts(): Product[] {
    return this.get(STORAGE_KEYS.PRODUCTS, initialProducts);
  }

  saveProducts(products: Product[]): void {
    this.set(STORAGE_KEYS.PRODUCTS, products);
  }

  addProduct(name: string, category: string, sellingPrice: number, costPrice: number, stockQuantity: number, unit: string = 'pcs'): Product {
    const products = this.getProducts();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      category: category || 'General',
      sellingPrice,
      costPrice,
      stockQuantity,
      minStockAlert: 5,
      unit,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProd);
    this.saveProducts(products);
    return newProd;
  }

  updateStock(productNameOrId: string, quantityChange: number): { success: boolean; product?: Product; message: string } {
    const products = this.getProducts();
    const q = productNameOrId.toLowerCase();
    const prod = products.find(p => p.id === productNameOrId || p.name.toLowerCase().includes(q));
    if (!prod) {
      return { success: false, message: `Product "${productNameOrId}" not found in inventory.` };
    }
    prod.stockQuantity = Math.max(0, prod.stockQuantity + quantityChange);
    this.saveProducts(products);
    return { success: true, product: prod, message: `Updated stock of ${prod.name} to ${prod.stockQuantity} ${prod.unit}.` };
  }

  // Expenses
  getExpenses(): Expense[] {
    return this.get(STORAGE_KEYS.EXPENSES, initialExpenses);
  }

  saveExpenses(expenses: Expense[]): void {
    this.set(STORAGE_KEYS.EXPENSES, expenses);
  }

  addExpense(category: string, amount: number, note: string = '', paymentMode: string = 'CASH'): Expense {
    const expenses = this.getExpenses();
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category: category || 'Other',
      amount,
      date: new Date().toISOString().split('T')[0],
      note: note || `${category} expense`,
      paymentMode,
      createdAt: new Date().toISOString(),
    };
    expenses.unshift(newExp);
    this.saveExpenses(expenses);
    return newExp;
  }

  // Invoices
  getInvoices(): Invoice[] {
    return this.get(STORAGE_KEYS.INVOICES, initialInvoices);
  }

  saveInvoices(invoices: Invoice[]): void {
    this.set(STORAGE_KEYS.INVOICES, invoices);
  }

  createInvoice(customerName: string, items: { name: string; quantity: number; unitPrice: number }[], dueDate?: string): Invoice {
    let customer = this.findCustomer(customerName);
    if (!customer) {
      customer = this.addCustomer(customerName);
    }
    const invoices = this.getInvoices();
    const invoiceNumber = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const formattedItems = items.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      name: it.name,
      quantity: it.quantity || 1,
      unitPrice: it.unitPrice || 0,
      total: (it.quantity || 1) * (it.unitPrice || 0),
    }));

    const subtotal = formattedItems.reduce((acc, curr) => acc + curr.total, 0);
    const dueAmount = subtotal;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      customerId: customer.id,
      customerName: customer.name,
      items: formattedItems,
      subtotal,
      discount: 0,
      tax: 0,
      totalAmount: subtotal,
      paidAmount: 0,
      dueAmount,
      status: 'UNPAID',
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    invoices.unshift(newInv);
    this.saveInvoices(invoices);

    // Also update customer balance
    this.giveCredit(customer.name, dueAmount, `Invoice #${invoiceNumber}`);

    return newInv;
  }

  // Business Profile
  getProfile(): BusinessProfile {
    return this.get(STORAGE_KEYS.BUSINESS_PROFILE, initialProfile);
  }

  saveProfile(profile: BusinessProfile): void {
    this.set(STORAGE_KEYS.BUSINESS_PROFILE, profile);
  }

  // Posters
  getPosters(): AIPoster[] {
    return this.get(STORAGE_KEYS.POSTERS, initialPosters);
  }

  savePosters(posters: AIPoster[]): void {
    this.set(STORAGE_KEYS.POSTERS, posters);
  }

  addPoster(poster: Omit<AIPoster, 'id' | 'createdAt'>): AIPoster {
    const posters = this.getPosters();
    const newPoster: AIPoster = {
      ...poster,
      id: `poster-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    posters.unshift(newPoster);
    this.savePosters(posters);
    return newPoster;
  }

  deletePoster(id: string): void {
    const posters = this.getPosters().filter(p => p.id !== id);
    this.savePosters(posters);
  }

  updatePosterStatus(id: string, status: AIPoster['status'], sharedStatus?: string, failReason?: string): void {
    const posters = this.getPosters().map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          sharedStatus: sharedStatus || p.sharedStatus,
          failReason,
          sentTimestamp: status === 'Sent' ? new Date().toISOString() : p.sentTimestamp,
        };
      }
      return p;
    });
    this.savePosters(posters);
  }

  // Poster Schedule
  getPosterSchedule(): PosterScheduleSettings {
    return this.get(STORAGE_KEYS.POSTER_SCHEDULE, initialPosterSchedule);
  }

  savePosterSchedule(settings: PosterScheduleSettings): void {
    this.set(STORAGE_KEYS.POSTER_SCHEDULE, settings);
  }

  // WhatsApp
  getWhatsApp(): WhatsAppConnection {
    return this.get(STORAGE_KEYS.WHATSAPP, {
      isConnected: false,
      phoneNumber: '',
      businessName: '',
      accountId: '',
      status: 'DISCONNECTED',
      authorizedScopes: [],
    });
  }

  saveWhatsApp(conn: WhatsAppConnection): void {
    this.set(STORAGE_KEYS.WHATSAPP, conn);
  }

  // Subscription
  getSubscription(): Subscription {
    return this.get(STORAGE_KEYS.SUBSCRIPTION, initialSubscription);
  }

  saveSubscription(sub: Subscription): void {
    this.set(STORAGE_KEYS.SUBSCRIPTION, sub);
  }

  // Referral
  getReferralData(): ReferralData {
    return this.get(STORAGE_KEYS.REFERRALS, initialReferralData);
  }

  saveReferralData(data: ReferralData): void {
    this.set(STORAGE_KEYS.REFERRALS, data);
  }

  recordReferralAttribution(code: string, newUserName: string): { success: boolean; message: string } {
    const current = this.getReferralData();
    // Validate referral code structure: e.g. starts with MERAKHATA-
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode || (!normalizedCode.startsWith('MERAKHATA-') && normalizedCode.length < 6)) {
      return { success: false, message: 'Invalid or expired referral code' };
    }

    const newHistoryItem = {
      id: `ref-${Date.now()}`,
      refereeName: newUserName || 'New Business User',
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESSFUL' as const,
      rewardAmount: 250,
    };

    const updated: ReferralData = {
      ...current,
      totalReferrals: current.totalReferrals + 1,
      successfulReferrals: current.successfulReferrals + 1,
      totalRewardsEarned: current.totalRewardsEarned + 250,
      history: [newHistoryItem, ...current.history],
    };

    this.saveReferralData(updated);
    return { success: true, message: `Referral applied! ₹250 added to rewards balance.` };
  }

  // Alerts
  getAlerts(): ProactiveAlert[] {
    return this.get(STORAGE_KEYS.ALERTS, initialAlerts);
  }

  saveAlerts(alerts: ProactiveAlert[]): void {
    this.set(STORAGE_KEYS.ALERTS, alerts);
  }

  dismissAlert(id: string): void {
    const alerts = this.getAlerts().map(a => a.id === id ? { ...a, dismissed: true } : a);
    this.saveAlerts(alerts);
  }

  // Business Analytics & Calculation Helpers
  getBusinessMetrics() {
    const transactions = this.getTransactions();
    const customers = this.getCustomers();
    const expenses = this.getExpenses();

    const todayStr = new Date().toISOString().split('T')[0];
    
    // Total Received
    const totalReceived = transactions
      .filter(t => t.type === 'RECEIVE_PAYMENT' || t.type === 'SALE')
      .reduce((acc, t) => acc + t.amount, 0);

    // Today's Sales
    const todaySales = transactions
      .filter(t => t.date === todayStr && (t.type === 'SALE' || t.type === 'RECEIVE_PAYMENT'))
      .reduce((acc, t) => acc + t.amount, 0);

    // Total Outstanding Due (what customers owe us)
    const totalDue = customers.reduce((acc, c) => acc + Math.max(0, c.balance), 0);

    // Total Expenses
    const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
    const todayExpense = expenses.filter(e => e.date === todayStr).reduce((acc, e) => acc + e.amount, 0);

    // Estimated Net Profit
    const estimatedProfit = totalReceived - totalExpense;

    return {
      totalReceived,
      todaySales,
      totalDue,
      totalExpense,
      todayExpense,
      estimatedProfit,
      customerCount: customers.length,
      customersWithDue: customers.filter(c => c.balance > 0).length,
    };
  }
}

export const db = new DatabaseService();
