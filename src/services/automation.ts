import { db } from './db';
import { generateAIPoster } from './posterGenerator';
import { sendPosterViaWhatsApp } from './whatsapp';
import { ProactiveAlert } from '../types';

class AutomationService {
  private timer: any = null;
  private lastRunSlot: string = '';

  startScheduler(onNewAlert?: (alert: ProactiveAlert) => void, onNewPoster?: () => void) {
    if (this.timer) clearInterval(this.timer);

    // Run check immediately on start
    this.checkDailyPosterSchedule(onNewPoster);
    this.generateProactiveInsights(onNewAlert);

    // Schedule check every minute
    this.timer = setInterval(() => {
      this.checkDailyPosterSchedule(onNewPoster);
      this.generateProactiveInsights(onNewAlert);
    }, 60000);
  }

  stopScheduler() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Check if current time matches morning, afternoon or evening schedule
  checkDailyPosterSchedule(onNewPoster?: () => void) {
    const settings = db.getPosterSchedule();
    if (!settings.autoDailyEnabled) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;
    const todayDate = now.toISOString().split('T')[0];

    // Check Morning
    if (settings.morningEnabled && currentTimeStr === settings.morningTime) {
      const slotKey = `${todayDate}-Morning`;
      if (this.lastRunSlot !== slotKey) {
        this.lastRunSlot = slotKey;
        this.runPosterSlot('Morning', settings.whatsappAutoShare && settings.autoShareMorning, onNewPoster);
      }
    }

    // Check Afternoon
    if (settings.afternoonEnabled && currentTimeStr === settings.afternoonTime) {
      const slotKey = `${todayDate}-Afternoon`;
      if (this.lastRunSlot !== slotKey) {
        this.lastRunSlot = slotKey;
        this.runPosterSlot('Afternoon', settings.whatsappAutoShare && settings.autoShareAfternoon, onNewPoster);
      }
    }

    // Check Evening
    if (settings.eveningEnabled && currentTimeStr === settings.eveningTime) {
      const slotKey = `${todayDate}-Evening`;
      if (this.lastRunSlot !== slotKey) {
        this.lastRunSlot = slotKey;
        this.runPosterSlot('Evening', settings.whatsappAutoShare && settings.autoShareEvening, onNewPoster);
      }
    }
  }

  runPosterSlot(slot: 'Morning' | 'Afternoon' | 'Evening', autoSendWhatsApp: boolean, onNewPoster?: () => void) {
    const poster = generateAIPoster({ timingSlot: slot });
    const saved = db.addPoster(poster);

    if (autoSendWhatsApp && db.getWhatsApp().isConnected) {
      sendPosterViaWhatsApp(saved);
    }

    if (onNewPoster) {
      onNewPoster();
    }
  }

  // Generate real business alerts based on live data
  generateProactiveInsights(onNewAlert?: (alert: ProactiveAlert) => void) {
    const metrics = db.getBusinessMetrics();
    const customers = db.getCustomers();
    const products = db.getProducts();
    const existingAlerts = db.getAlerts();

    const pendingCustomers = customers.filter(c => c.balance > 0);
    const lowStockItems = products.filter(p => p.stockQuantity <= p.minStockAlert);

    // 1. Pending dues alert
    if (pendingCustomers.length >= 2 && !existingAlerts.some(a => a.type === 'PAYMENT_PENDING' && !a.dismissed)) {
      const alert: ProactiveAlert = {
        id: `alert-due-${Date.now()}`,
        title: `${pendingCustomers.length} Customers Have Pending Dues`,
        message: `Total uncollected balance is ₹${metrics.totalDue}. Click to review or send Babu payment reminders.`,
        type: 'PAYMENT_PENDING',
        actionPrompt: 'Ask Babu to follow up with pending customers',
        dismissed: false,
        timestamp: new Date().toISOString(),
      };
      db.saveAlerts([alert, ...existingAlerts]);
      if (onNewAlert) onNewAlert(alert);
    }

    // 2. Low stock alert
    if (lowStockItems.length > 0 && !existingAlerts.some(a => a.type === 'LOW_STOCK' && !a.dismissed)) {
      const item = lowStockItems[0];
      const alert: ProactiveAlert = {
        id: `alert-stock-${Date.now()}`,
        title: `Low Stock Alert: ${item.name}`,
        message: `Only ${item.stockQuantity} ${item.unit} remaining (minimum threshold: ${item.minStockAlert} ${item.unit}). Restock soon!`,
        type: 'LOW_STOCK',
        relatedId: item.id,
        actionPrompt: `Restock ${item.name}`,
        dismissed: false,
        timestamp: new Date().toISOString(),
      };
      db.saveAlerts([alert, ...existingAlerts]);
      if (onNewAlert) onNewAlert(alert);
    }
  }
}

export const automation = new AutomationService();
