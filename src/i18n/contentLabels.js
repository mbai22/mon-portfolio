// Translated labels for the built-in estimator and booking content. Prices, ids,
// days and time slots always come from src/data/*.js, so they never drift apart.
import { estimator } from '../data/estimator';
import { booking } from '../data/booking';

const LABELS = {
  en: {
    intro: 'Answer 3 questions to get an indicative estimate, then send it to me on WhatsApp for a precise, free quote.',
    types: {
      vitrine: ['Showcase website', 'Present your business, services and contact details.'],
      ecommerce: ['Online store', 'Catalogue, cart, orders and payment.'],
      webapp: ['Web application', 'Custom platform: member area, dashboard, management.'],
      mobile: ['Mobile app', 'Android (and iOS) app with its admin interface.'],
      redesign: ['Website redesign', 'Modernise an existing site: design, speed, SEO.'],
      branding: ['Logo & visual identity', 'Logo, colours, fonts and basic materials.'],
      video: ['Video editing', 'Commercial, company presentation, social media content.'],
    },
    options: {
      mobilemoney: 'Mobile Money payment (Airtel Money, Moov Money)', multilingue: 'Multilingual site (French, Arabic, English)',
      redaction: 'Copywriting', logo: 'Logo design', seo: 'Advanced Google SEO', hebergement: 'Domain name + hosting (1 year)',
      formation: 'Training to manage the content', charte: 'Full brand guidelines', motion: 'Animations / motion design',
      'sous-titres': 'Subtitles and social media formats',
    },
    delays: { normal: 'Standard timeline', rapide: 'Urgent (timeline cut in half)' },
    bookingIntro: "A free, no-obligation 15-minute call to talk about your project. Pick a slot: I'll call you (or we chat on WhatsApp) at the scheduled time.",
    topics: ['Website', 'Web or mobile app', 'Website redesign', 'Graphic design', 'Video editing', 'Other'],
  },
  ar: {
    intro: 'أجب عن 3 أسئلة للحصول على تقدير تقريبي، ثم أرسله إليّ عبر واتساب لتحصل على عرض سعر دقيق ومجاني.',
    types: {
      vitrine: ['موقع تعريفي', 'تقديم نشاطك وخدماتك وبيانات التواصل.'],
      ecommerce: ['متجر إلكتروني', 'كتالوج، سلة، طلبات ودفع.'],
      webapp: ['تطبيق ويب', 'منصة مخصصة: مساحة أعضاء، لوحة تحكم، إدارة.'],
      mobile: ['تطبيق هاتف', 'تطبيق أندرويد (وiOS) مع واجهة الإدارة.'],
      redesign: ['إعادة تصميم موقع', 'تحديث موقع قائم: التصميم والسرعة والظهور في جوجل.'],
      branding: ['شعار وهوية بصرية', 'شعار وألوان وخطوط ومواد أساسية.'],
      video: ['مونتاج فيديو', 'إعلان، تقديم الشركة، محتوى للتواصل الاجتماعي.'],
    },
    options: {
      mobilemoney: 'الدفع عبر الهاتف (Airtel Money، Moov Money)', multilingue: 'موقع متعدد اللغات (فرنسي، عربي، إنجليزي)',
      redaction: 'كتابة النصوص', logo: 'تصميم الشعار', seo: 'تحسين متقدم للظهور في جوجل', hebergement: 'اسم نطاق + استضافة (سنة)',
      formation: 'تدريب على إدارة المحتوى', charte: 'دليل هوية بصرية كامل', motion: 'رسوم متحركة / موشن جرافيك',
      'sous-titres': 'ترجمة نصية وصيغ للتواصل الاجتماعي',
    },
    delays: { normal: 'مدة عادية', rapide: 'مستعجل (نصف المدة)' },
    bookingIntro: 'مكالمة مجانية لمدة 15 دقيقة ودون أي التزام للحديث عن مشروعك. اختر موعدًا: سأتصل بك (أو نتحدث عبر واتساب) في الوقت المحدد.',
    topics: ['موقع إنترنت', 'تطبيق ويب أو هاتف', 'إعادة تصميم موقع', 'تصميم جرافيكي', 'مونتاج فيديو', 'أخرى'],
  },
};

export function translatedEstimator(lang) {
  const L = LABELS[lang];
  if (!L) return null;
  return {
    ...estimator,
    intro: L.intro,
    projectTypes: estimator.projectTypes.map((t) => (L.types[t.id] ? { ...t, label: L.types[t.id][0], description: L.types[t.id][1] } : t)),
    options: estimator.options.map((o) => ({ ...o, label: L.options[o.id] || o.label })),
    delays: estimator.delays.map((d) => ({ ...d, label: L.delays[d.id] || d.label })),
  };
}

export function translatedBooking(lang) {
  const L = LABELS[lang];
  return L ? { ...booking, intro: L.bookingIntro, topics: L.topics } : null;
}
