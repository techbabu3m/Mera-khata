import { AIPoster, BusinessProfile, PosterType, PosterStyle } from '../types';
import { db } from './db';

interface GeneratePosterOptions {
  type?: PosterType;
  style?: PosterStyle;
  timingSlot?: 'Morning' | 'Afternoon' | 'Evening' | 'Custom';
  customOffer?: string;
  customProduct?: string;
  discountPercent?: string;
}

// Category-specific templates and contextual smart copy
const categoryThemeMap: Record<string, {
  morning: { title: string; tagline: string; type: PosterType; style: PosterStyle; gradient: string; accent: string };
  afternoon: { title: string; tagline: string; type: PosterType; style: PosterStyle; gradient: string; accent: string };
  evening: { title: string; tagline: string; type: PosterType; style: PosterStyle; gradient: string; accent: string };
}> = {
  'Restaurant': {
    morning: {
      title: 'Fresh Morning Breakfast & Chai Special',
      tagline: 'Start your day energetic with hot delicacies',
      type: 'Daily Offer',
      style: 'Food',
      gradient: 'from-amber-600 via-orange-600 to-red-800',
      accent: '#f59e0b',
    },
    afternoon: {
      title: 'Executive Thali & Quick Lunch combos',
      tagline: 'Delicious authentic taste cooked fresh daily',
      type: 'Special Offer',
      style: 'Food',
      gradient: 'from-orange-700 via-red-600 to-amber-900',
      accent: '#ea580c',
    },
    evening: {
      title: 'Evening Snacks & Grand Dinner Feast',
      tagline: 'Relax with family & savor chef specials',
      type: 'Weekend Offer',
      style: 'Luxury',
      gradient: 'from-purple-950 via-red-900 to-amber-800',
      accent: '#f59e0b',
    },
  },
  'Clothing Store': {
    morning: {
      title: 'Fresh Festive Arrivals & Summer Styles',
      tagline: 'New handpicked fabrics and trendy shirts',
      type: 'New Product',
      style: 'Modern',
      gradient: 'from-blue-900 via-indigo-700 to-slate-900',
      accent: '#38bdf8',
    },
    afternoon: {
      title: 'Mid-Day Flash Discount: Flat 20% OFF',
      tagline: 'Premium Kurtis, Sarees & Denim Trousers',
      type: 'Discount',
      style: 'Retail',
      gradient: 'from-rose-800 via-pink-700 to-indigo-900',
      accent: '#f43f5e',
    },
    evening: {
      title: 'Trending Evening Glamour & Party Wear',
      tagline: 'Step out in confidence with our exclusive collection',
      type: 'Daily Offer',
      style: 'Luxury',
      gradient: 'from-violet-950 via-purple-900 to-fuchsia-900',
      accent: '#e879f9',
    },
  },
  'Electronics': {
    morning: {
      title: 'New Smart Gadgets & Mobile Accessories',
      tagline: 'Upgrade your tech with genuine guaranteed devices',
      type: 'New Product',
      style: 'Technology',
      gradient: 'from-cyan-900 via-blue-900 to-slate-950',
      accent: '#06b6d4',
    },
    afternoon: {
      title: 'Mega Exchange Offer & 0% EMI Schemes',
      tagline: 'Bring old appliances & walk away with brand new!',
      type: 'Discount',
      style: 'Bold',
      gradient: 'from-blue-800 via-indigo-900 to-neutral-900',
      accent: '#60a5fa',
    },
    evening: {
      title: 'Fast-Charging Powerbanks & Audio Deals',
      tagline: 'Limited stock daily specials for evening shoppers',
      type: 'Special Offer',
      style: 'Modern',
      gradient: 'from-slate-900 via-teal-900 to-slate-950',
      accent: '#2dd4bf',
    },
  },
  'Grocery': {
    morning: {
      title: 'Fresh Farm Vegetables, Fruits & Dairy',
      tagline: 'Arriving fresh 6 AM every morning at best wholesale rates',
      type: 'Daily Offer',
      style: 'Local Business',
      gradient: 'from-emerald-800 via-teal-800 to-green-950',
      accent: '#34d399',
    },
    afternoon: {
      title: 'Monthly Ration Super Saver Package',
      tagline: 'Save up to ₹1,500 on Dal, Rice, Oil & Spices',
      type: 'Discount',
      style: 'Retail',
      gradient: 'from-green-900 via-emerald-800 to-amber-950',
      accent: '#10b981',
    },
    evening: {
      title: 'Free Home Delivery On Evening Orders',
      tagline: 'Send your grocery list on WhatsApp & get it in 30 mins!',
      type: 'Service Promotion',
      style: 'Modern',
      gradient: 'from-teal-900 via-cyan-800 to-blue-950',
      accent: '#22d3ee',
    },
  },
};

export function generateAIPoster(options: GeneratePosterOptions = {}): AIPoster {
  const profile = db.getProfile();
  const products = db.getProducts();
  const category = profile.category || 'Clothing Store';
  const mapping = categoryThemeMap[category] || categoryThemeMap['Clothing Store'];

  const slot = options.timingSlot || (new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening');
  const slotData = slot === 'Morning' ? mapping.morning : slot === 'Afternoon' ? mapping.afternoon : mapping.evening;

  const type = options.type || slotData.type;
  const style = options.style || slotData.style;
  const randomProd = products.length > 0 ? products[Math.floor(Math.random() * products.length)] : null;
  const prodName = options.customProduct || (randomProd ? randomProd.name : 'Exclusive Collection');
  const discount = options.discountPercent || (type === 'Discount' ? '20%' : type === 'Daily Offer' ? '15%' : '10%');

  let title = slotData.title;
  let tagline = slotData.tagline;
  let offer = options.customOffer || `${discount} OFF on ${prodName} for our valued customers!`;

  if (type === 'Festival Offer') {
    title = `Grand Festive Celebration Sale`;
    tagline = `Pure joy and exclusive festive discounts for your family`;
    offer = `Special Festive Discount: Flat ${discount} OFF on all items!`;
  } else if (type === 'Payment Reminder') {
    title = `Friendly Khata Account Reminder`;
    tagline = `Clear dues smoothly via UPI or Cash`;
    offer = `Please settle your pending balance this week to continue seamless credit service.`;
  }

  const poster: AIPoster = {
    id: `poster-${Date.now()}`,
    title,
    tagline,
    offerDetails: offer,
    type,
    style,
    timingSlot: slot,
    bgGradient: slotData.gradient,
    accentColor: slotData.accent,
    callToAction: 'Order on WhatsApp or Visit Us Today!',
    contactDisplay: `${profile.phone} • ${profile.address}`,
    productName: prodName,
    discountPercent: discount,
    validUntil: 'Limited Period Offer',
    status: 'Generated',
    createdAt: new Date().toISOString(),
  };

  return poster;
}

// Client-side HTML Canvas renderer for real crisp PNG download
export async function downloadPosterAsImage(poster: AIPoster, profile: BusinessProfile): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350; // High-res Instagram/WhatsApp portrait 4:5 ratio
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Decorative border
  ctx.strokeStyle = poster.accentColor || '#38bdf8';
  ctx.lineWidth = 8;
  ctx.strokeRect(36, 36, 1080 - 72, 1350 - 72);

  // Brand Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(profile.name.toUpperCase(), 540, 130);

  // Category Badge
  ctx.fillStyle = poster.accentColor || '#38bdf8';
  ctx.font = '600 28px sans-serif';
  ctx.fillText(`★ ${profile.category.toUpperCase()} • ${poster.timingSlot?.toUpperCase() || 'SPECIAL'} EDITION ★`, 540, 185);

  // Divider Line
  ctx.beginPath();
  ctx.moveTo(200, 220);
  ctx.lineTo(880, 220);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Poster Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 58px sans-serif';
  // Wrap title if needed
  wrapText(ctx, poster.title, 540, 320, 920, 70);

  // Tagline
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'normal 34px sans-serif';
  wrapText(ctx, poster.tagline, 540, 480, 880, 48);

  // Center Feature Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, 120, 560, 840, 420, 28, true, true);
  ctx.strokeStyle = poster.accentColor || '#38bdf8';
  ctx.lineWidth = 3;
  roundRect(ctx, 120, 560, 840, 420, 28, false, true);

  // Discount Pill
  if (poster.discountPercent) {
    ctx.fillStyle = poster.accentColor || '#f59e0b';
    roundRect(ctx, 360, 600, 360, 70, 35, true, false);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${poster.discountPercent} DISCOUNT`, 540, 650);
  }

  // Offer Details
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px sans-serif';
  wrapText(ctx, poster.offerDetails, 540, 750, 760, 50);

  // Validity
  if (poster.validUntil) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 26px sans-serif';
    ctx.fillText(`⏰ ${poster.validUntil}`, 540, 920);
  }

  // Call to Action
  ctx.fillStyle = '#22c55e';
  roundRect(ctx, 160, 1030, 760, 84, 42, true, false);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(`📲 ${poster.callToAction}`, 540, 1084);

  // Contact Info
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'normal 26px sans-serif';
  ctx.fillText(profile.phone + '  •  ' + profile.address, 540, 1180);
  ctx.fillText('Powered by Mera Khata Babu AI Business Studio', 540, 1250);

  // Download Trigger
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${poster.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.png`;
  link.href = dataUrl;
  link.click();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
