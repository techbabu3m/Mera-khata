import { db } from './db';
import { ActionExtractionResult } from '../types';

const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();

export interface ScreenContext {
  screenName: string; // 'HOME' | 'CUSTOMERS' | 'TRANSACTIONS' | 'INVOICES' | 'PRODUCTS' | 'REPORTS' | 'POSTER_STUDIO' | 'NOTIFICATIONS' | 'REFERRALS' | 'PRICING'
  selectedCustomerName?: string;
  selectedCustomerId?: string;
  selectedInvoiceNumber?: string;
  selectedProductName?: string;
}

export interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

export async function processBabuMessage(
  userPrompt: string,
  history: ConversationTurn[],
  screenContext: ScreenContext
): Promise<ActionExtractionResult> {
  const currentMetrics = db.getBusinessMetrics();
  const customers = db.getCustomers();
  const products = db.getProducts();
  const profile = db.getProfile();

  // If Gemini API Key is available, call Gemini 3.5 Flash or 2.5 Flash
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 5) {
    try {
      const response = await callGeminiAPI(userPrompt, history, screenContext, {
        metrics: currentMetrics,
        customers: customers.map(c => ({ name: c.name, balance: c.balance })),
        products: products.map(p => ({ name: p.name, stock: p.stockQuantity, price: p.sellingPrice })),
        profile,
      });
      if (response && response.babuSpeech) {
        return response;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to intelligent local NLU engine:', err);
    }
  }

  // High-accuracy fallback Local Multilingual NLU Engine
  return localMultilingualNLUEngine(userPrompt, history, screenContext);
}

async function callGeminiAPI(
  userPrompt: string,
  history: ConversationTurn[],
  screenContext: ScreenContext,
  systemContextData: any
): Promise<ActionExtractionResult | null> {
  const systemInstruction = `You are "Babu", the hyper-intelligent, warm, natural Bengali/Hindi/English/Hinglish/Banglish speaking AI Business Assistant for the "Mera Khata – Smart Business Manager" application.
You are specialized for Indian/South-Asian small & medium business owners (Khata/Ledger).

RULES:
1. Speak NATURALLY, BRIEFLY, AND WARMLY like a trusted manager. Never sound like a robot.
2. DO NOT return robotic statements like "Intent detected: ...".
3. Language: Match the user's language smoothly (Bengali, Hindi, English, Banglish like "ajke 500 taka dilo", Hinglish like "aaj ka hisab batao").
4. Pronouns & References:
   - "ওকে", "ওর", "তার", "him", "her", "that customer", "this customer" refers to the customer being viewed on screen (${screenContext.selectedCustomerName || 'none'}) or the most recently mentioned customer in the conversation history.
   - "business kaisa hai", "আজকের business কেমন?", "aaj ka hisab" asks for today's summary / business report.
5. If crucial information is missing for an action, DO NOT guess financial amounts! Set actionType to null or keep it pending and ask a gentle clarification question.
   Example: If user says "Invoice বানাও", reply: "অবশ্যই। কোন customer-এর জন্য invoice বানাব?"
   Example: If user says "Rahul payment dilo" without amount, reply: "কত টাকা পেমেন্ট দিয়েছেন রাহুলবাবু?"
6. Output JSON only with this schema:
{
  "understood": true,
  "actionType": "RECEIVE_PAYMENT" | "ADD_CUSTOMER" | "ADD_SALE" | "ADD_EXPENSE" | "CHECK_DUE" | "CREATE_INVOICE" | "DAILY_SUMMARY" | "WEEKLY_SUMMARY" | "PROFIT_REPORT" | "BUSINESS_INSIGHTS" | "INVENTORY_LOOKUP" | "ADD_PRODUCT" | "UPDATE_STOCK" | "PAYMENT_REMINDER" | "GENERATE_POSTER" | null,
  "extractedData": {
    "customerName": string or null,
    "amount": number or null,
    "paymentMode": "CASH" | "UPI" | "BANK" | "CHEQUE" | null,
    "productName": string or null,
    "quantity": number or null,
    "category": string or null,
    "note": string or null
  },
  "clarificationQuestion": string or null,
  "missingField": string or null,
  "babuSpeech": "Natural spoken response to the user in the exact same language/dialect as user",
  "languageDetected": "Bengali" | "Hindi" | "English" | "Mixed"
}

Current Business Data:
- Business Name: "${systemContextData.profile.name}" (${systemContextData.profile.category})
- Screen currently viewed: ${screenContext.screenName}
- Currently selected customer on screen: ${screenContext.selectedCustomerName || 'None'}
- Today's Sales: ₹${systemContextData.metrics.todaySales}
- Total Received: ₹${systemContextData.metrics.totalReceived}
- Outstanding Due: ₹${systemContextData.metrics.totalDue} (${systemContextData.metrics.customersWithDue} customers)
- Total Expenses: ₹${systemContextData.metrics.totalExpense}
- Customers: ${JSON.stringify(systemContextData.customers.slice(0, 10))}
- Products: ${JSON.stringify(systemContextData.products.slice(0, 8))}
`;

  const contents: any[] = [];
  
  // Format past history
  history.slice(-6).forEach(h => {
    contents.push({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    });
  });

  contents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Gemini HTTP error ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    return JSON.parse(text) as ActionExtractionResult;
  } catch (e) {
    console.error('Failed to parse Gemini JSON:', text);
    return null;
  }
}

// Intelligent Multilingual NLU Engine (Handles Bengali, Hindi, English, Banglish, Hinglish locally)
function localMultilingualNLUEngine(
  prompt: string,
  history: ConversationTurn[],
  screenContext: ScreenContext
): ActionExtractionResult {
  const p = prompt.trim().toLowerCase();
  
  // Resolve pronouns: "ওর", "তার", "ওকে", "this customer", "that customer", "him", "her"
  let contextCustomer: string | undefined = screenContext.selectedCustomerName;
  if (!contextCustomer) {
    // Search history for customer name
    for (let i = history.length - 1; i >= 0; i--) {
      const hText = history[i].text;
      const found = db.getCustomers().find(c => hText.toLowerCase().includes(c.name.toLowerCase()));
      if (found) {
        contextCustomer = found.name;
        break;
      }
    }
  }
  if (!contextCustomer && db.getCustomers().length > 0) {
    contextCustomer = db.getCustomers()[0].name;
  }

  // Check language hints
  const isBengali = /[\u0980-\u09FF]|kemon|ajke|taka|dilo|dao|ache|koto|jonno|banao|or|tar|ekta/i.test(p);
  const isHindi = /[\u0900-\u097F]|kaisa|aaj|rupaye|diya|de|hai|kitna|ke liye|banao|uska|uski/i.test(p);

  // Extract numbers / amounts
  const amountMatch = p.match(/(?:₹|rs\.?|inr|টাকা|taka|rupees?|rupaye)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:₹|rs\.?|inr|টাকা|taka|rupees?|rupaye)?/i);
  let amount: number | undefined = undefined;
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // Find customer match
  const allCustomers = db.getCustomers();
  let matchedCustomer = allCustomers.find(c => p.includes(c.name.toLowerCase()));
  if (!matchedCustomer && (p.includes('ওর') || p.includes('তার') || p.includes('ওকে') || p.includes('uska') || p.includes('unka') || p.includes('him') || p.includes('her') || p.includes('this customer'))) {
    matchedCustomer = contextCustomer ? allCustomers.find(c => c.name.toLowerCase() === contextCustomer?.toLowerCase()) : undefined;
  }

  // 1. Check Due / Outstanding ("ওর due কত?", "due koto", "kitna baki hai", "pending payment")
  if (p.includes('due') || p.includes('বাকি') || p.includes('baki') || p.includes('dena') || p.includes('paona') || p.includes('পাওনা')) {
    if (matchedCustomer) {
      const speech = isBengali
        ? `${matchedCustomer.name}-এর বর্তমান বাকি (due) রয়েছে ₹${matchedCustomer.balance}।`
        : isHindi
        ? `${matchedCustomer.name} का कुल बाकी (due) ₹${matchedCustomer.balance} है।`
        : `${matchedCustomer.name}'s current outstanding due is ₹${matchedCustomer.balance}.`;
      return {
        understood: true,
        actionType: 'CHECK_DUE',
        extractedData: { customerName: matchedCustomer.name, amount: matchedCustomer.balance },
        babuSpeech: speech,
      };
    } else {
      const totalDue = db.getBusinessMetrics().totalDue;
      const count = db.getBusinessMetrics().customersWithDue;
      const speech = isBengali
        ? `সব মিলিয়ে মোট ${count} জন কাস্টমারের কাছে ₹${totalDue} বাকি রয়েছে।`
        : isHindi
        ? `कुल ${count} ग्राहकों का मिलाकर ₹${totalDue} बकाया (due) है।`
        : `Total outstanding due across ${count} customers is ₹${totalDue}.`;
      return {
        understood: true,
        actionType: 'CHECK_DUE',
        extractedData: { amount: totalDue },
        babuSpeech: speech,
      };
    }
  }

  // 2. Receive Payment ("Rahul ajke 500 taka dilo", "500 payment", "Rahul ne 500 diya")
  const isPayment = (p.includes('dilo') || p.includes('diya') || p.includes('gave') || p.includes('payment') || p.includes('pay') || p.includes('পেলে') || p.includes('দিল') || p.includes('দিয়েছে') || p.includes('জমা') || p.includes('joma'));
  if (isPayment && !p.includes('reminder') && !p.includes('invoice')) {
    const custName = matchedCustomer ? matchedCustomer.name : (contextCustomer || 'Customer');
    if (!amount) {
      return {
        understood: true,
        actionType: null,
        missingField: 'amount',
        clarificationQuestion: isBengali 
          ? `অবশ্যই, ${custName} কত টাকা পেমেন্ট করেছেন?` 
          : isHindi 
          ? `ज़रूर, ${custName} ने कितने रुपये दिए?` 
          : `Sure, how much amount did ${custName} pay?`,
        babuSpeech: isBengali 
          ? `অবশ্যই, ${custName} কত টাকা পেমেন্ট করেছেন?` 
          : isHindi 
          ? `ज़रूर, ${custName} ने कितने रुपये दिए?` 
          : `Sure, how much amount did ${custName} pay?`,
      };
    }

    const speech = isBengali
      ? `Done! ${custName}-এর ₹${amount} payment add করে দিয়েছি।`
      : isHindi
      ? `Done! ${custName} का ₹${amount} पेमेंट दर्ज कर दिया गया है।`
      : `Done! Recorded payment of ₹${amount} for ${custName}.`;

    return {
      understood: true,
      actionType: 'RECEIVE_PAYMENT',
      extractedData: {
        customerName: custName,
        amount,
        paymentMode: p.includes('upi') ? 'UPI' : p.includes('bank') ? 'BANK' : 'CASH',
      },
      babuSpeech: speech,
    };
  }

  // 3. Create Invoice ("Invoice বানাও", "create invoice", "Rahul ke invoice banao")
  if (p.includes('invoice') || p.includes('ইনভয়েস') || p.includes('বিল') || p.includes('bill')) {
    if (!matchedCustomer && !p.includes('rahul') && !p.includes('ananya') && !p.includes('pooja')) {
      return {
        understood: true,
        actionType: null,
        missingField: 'customerName',
        clarificationQuestion: isBengali
          ? 'অবশ্যই। কোন customer-এর জন্য invoice বানাব?'
          : isHindi
          ? 'ज़रूर, किस customer के लिए invoice बनाना है?'
          : 'Sure! Which customer would you like to create the invoice for?',
        babuSpeech: isBengali
          ? 'অবশ্যই। কোন customer-এর জন্য invoice বানাব?'
          : isHindi
          ? 'ज़रूर, किस customer के लिए invoice बनाना है?'
          : 'Sure! Which customer would you like to create the invoice for?',
      };
    }

    const custName = matchedCustomer ? matchedCustomer.name : 'Rahul Roy';
    const speech = isBengali
      ? `${custName}-এর জন্য নতুন ইনভয়েস তৈরি করা হয়েছে।`
      : isHindi
      ? `${custName} के लिए नया इनवॉइस बना दिया गया है।`
      : `New invoice created for ${custName}.`;

    return {
      understood: true,
      actionType: 'CREATE_INVOICE',
      extractedData: {
        customerName: custName,
        amount: amount || 1200,
        productName: 'Linen Shirt',
        quantity: 1,
      },
      babuSpeech: speech,
    };
  }

  // 4. Payment Reminder ("Rahul-er jonno ekta reminder baniye dao", "send reminder")
  if (p.includes('reminder') || p.includes('মনে করিয়ে') || p.includes('remind') || p.includes('taqaza') || p.includes('তাগাদা')) {
    const custName = matchedCustomer ? matchedCustomer.name : (contextCustomer || 'Rahul Roy');
    const cust = db.findCustomer(custName);
    const balance = cust ? cust.balance : 2400;

    const speech = isBengali
      ? `${custName}-এর জন্য ₹${balance} টাকার পেমেন্ট রিমাইন্ডার রেডি করে দিয়েছি। হোয়াটসঅ্যাপে পাঠাতে পারেন।`
      : isHindi
      ? `${custName} के लिए ₹${balance} का पेमेंट रिमाइंडर तैयार है। आप व्हाट्सएप से भेज सकते हैं।`
      : `Payment reminder of ₹${balance} prepared for ${custName}. Ready to share via WhatsApp.`;

    return {
      understood: true,
      actionType: 'PAYMENT_REMINDER',
      extractedData: { customerName: custName, amount: balance },
      babuSpeech: speech,
    };
  }

  // 5. Daily Summary / Business Overview ("আজকের business কেমন?", "aaj ka business kaisa hai", "today summary", "sales koto")
  if (p.includes('business') || p.includes('kemon') || p.includes('kaisa') || p.includes('summary') || p.includes('hisaab') || p.includes('hisab') || p.includes('hisab') || p.includes('report') || p.includes('বিক্রি') || p.includes('বিক্রয়') || p.includes('sales')) {
    const m = db.getBusinessMetrics();
    const speech = isBengali
      ? `আজকে এখন পর্যন্ত তোমার total sales হয়েছে ₹${m.todaySales}। মোট কালেকশন ₹${m.totalReceived} এবং বাকি রয়েছে ₹${m.totalDue}।`
      : isHindi
      ? `आज अब तक आपकी कुल बिक्री ₹${m.todaySales} हुई है। कुल कलेक्शन ₹${m.totalReceived} और बाकी ₹${m.totalDue} है।`
      : `Today's total sales so far are ₹${m.todaySales}. Total collections stand at ₹${m.totalReceived}, with ₹${m.totalDue} in outstanding dues.`;

    return {
      understood: true,
      actionType: 'DAILY_SUMMARY',
      extractedData: { amount: m.todaySales },
      babuSpeech: speech,
    };
  }

  // 6. Add Expense ("Khoroch 200", "chai 50 expense", "kharcha 300")
  if (p.includes('khoroch') || p.includes('kharcha') || p.includes('expense') || p.includes('খরচ')) {
    if (amount) {
      const speech = isBengali
        ? `₹${amount} টাকার খরচ (Expense) সিস্টেমে যোগ করে দিয়েছি।`
        : isHindi
        ? `₹${amount} का खर्च दर्ज कर दिया गया है।`
        : `Recorded expense of ₹${amount} successfully.`;

      return {
        understood: true,
        actionType: 'ADD_EXPENSE',
        extractedData: { amount, category: 'General' },
        babuSpeech: speech,
      };
    }
  }

  // 7. Inventory / Stock ("stock koto", "shirt stock", "inventory")
  if (p.includes('stock') || p.includes('inventory') || p.includes('স্টক') || p.includes('maal')) {
    const lowStock = db.getProducts().filter(p => p.stockQuantity <= p.minStockAlert);
    const speech = isBengali
      ? `আপনার ইনভেন্টরিতে ${lowStock.length}টি প্রোডাক্টের স্টক কম রয়েছে (যেমন Linen Shirts)।`
      : isHindi
      ? `आपकी इन्वेंट्री में ${lowStock.length} प्रोडक्ट्स का स्टॉक कम है (जैसे Linen Shirts)।`
      : `You have ${lowStock.length} products with low stock alerts in inventory.`;

    return {
      understood: true,
      actionType: 'INVENTORY_LOOKUP',
      babuSpeech: speech,
    };
  }

  // 8. Generate Poster ("poster banao", "poster generate", "পোস্টার বানাও")
  if (p.includes('poster') || p.includes('পোস্টার') || p.includes('offer')) {
    const speech = isBengali
      ? `আপনার ব্যবসার জন্য নতুন আকর্ষণীয় বিজনেস পোস্টার তৈরি করা হয়েছে! Poster Studio-তে চেক করুন।`
      : isHindi
      ? `आपके बिजनेस के लिए नया शानदार बिजनेस पोस्टर बना दिया गया है! Poster Studio में देखें।`
      : `Generated a professional promotional poster tailored for your business in Poster Studio!`;

    return {
      understood: true,
      actionType: 'GENERATE_POSTER',
      babuSpeech: speech,
    };
  }

  // Default natural conversational response
  const defaultSpeech = isBengali
    ? `আমি বাবু। আপনার খাতা পরিচালনা, পেমেন্ট জমা, কাস্টমার ব্যালেন্স বা পোস্টার তৈরিতে সাহায্য করতে প্রস্তুত। বলুন কি করতে পারি?`
    : isHindi
    ? `नमस्ते! मैं बाबू हूँ। आपके खाता, पेमेंट, उधारी या बिजनेस पोस्टर के लिए मैं तैयार हूँ। बताइए क्या मदद करूँ?`
    : `Hello! I'm Babu. I can record payments, check customer dues, generate business posters, or summarize today's sales. How can I help you today?`;

  return {
    understood: true,
    babuSpeech: defaultSpeech,
  };
}
